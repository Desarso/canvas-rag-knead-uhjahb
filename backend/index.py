from fastapi import FastAPI, Cookie
from fastapi.responses import StreamingResponse
import os
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Union
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import uvicorn
from helpers.chat_engine import ChatEngine
from helpers.sqlite_handler import SQLiteDBHandler
import logging
from helpers.canvas import CanvasHelper
import json
from llama_index.core.storage.chat_store import SimpleChatStore
load_dotenv()


class TextContent(BaseModel):
    type: str = "text"
    text: str

class ImageContent(BaseModel):
    type: str = "image_url"
    image_url: str 

class message(BaseModel):
    role: str
    content: List[Union[TextContent, ImageContent]] | str

app = FastAPI(title="Interview GPT", version="1.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow your frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# client = OpenAI(
#     base_url="https://api.groq.com/openai/v1",
#     api_key=os.environ.get("GROQ_API_KEY")

# )


# def stream_response(messages: List[message]):
#     print(messages[0].__dict__)
#     stream = client.chat.completions.create(
#     model="llama-3.1-70b-versatile",
#     messages=messages,
#     stream=True,
#     )

#     for chunk in stream:
#         if chunk.choices[0].delta.content is not None:
#             print(chunk.choices)
#             yield chunk.choices[0].delta.content


def chat_stream(collection: str, chat_id: str, user_id: str, message: str):
   chat_engine_instance = ChatEngine()
   response = chat_engine_instance.chat_stream(
        message=message,
        collection=collection,
        chat_id=chat_id, 
        user_id=user_id)
   for resp in response:
        print(resp)
        yield resp


# @app.post("/send")
# def post_messages(messages: List[message], collection: str):
#     ##return as a stream
#     ## what needs to actually happen here
#     ## we need to append context data to each message if there is not given context, llm should simple say `I don't know``
#     ## we let the llm know that it will receive context data for each message and that it should only respond based on context
#     ## all chat stream should be associated with a chroma_db collection
#     return StreamingResponse(stream_response(messages), media_type="text/event-stream")



@app.post("/chat")
def chat(collection: str, chat_id: str, message: str,  user_id: str):
    # print(collection, chat_id, message, user_id)
    return StreamingResponse(chat_stream(collection, chat_id, user_id, message), media_type="text/event-stream")

@app.get("/chats")
def get_chats(user_id: str):
    print(user_id)
    handler = SQLiteDBHandler()
    raw_chat_histories = handler.retrieve_all_chat_histories(user_id)
    # print(raw_chat_histories)
    
    #print("here",raw_chat_histories)
    parsed_chat_histories = []

    if not raw_chat_histories:
        return parsed_chat_histories    

    for chat in raw_chat_histories:
        chat_id = chat[0]
        collection = chat[1]
        chat_history_json = chat[2]  
        
        # Ensure chat_history_json is not empty or invalid
        if not chat_history_json or chat_history_json.strip() == "":
            logging.error(f"Empty or invalid JSON for {chat_id}. Skipping.")
            continue
        
        try:
            # Parse the chat history JSON string into a Python dictionary
            chat_history_data = json.loads(chat_history_json)
        except json.JSONDecodeError as e:
            logging.error(f"Failed to decode JSON for {chat_id}: {e}")
            continue
        
        # Append parsed data to the result list
        parsed_chat_histories.append({
            "chat_id": chat_id,
            "collection": collection,
            "chat_history": chat_history_data
        })
    
    # Return parsed data
    return parsed_chat_histories


@app.delete("/chat")
def delete_chat(user_id: str, chat_id: str):
    handler = SQLiteDBHandler()
    handler.delete_chat(user_id, chat_id)
    ##don't delete collection, we can keep the collection for future reference
    return "Chat deleted successfully"



@app.post("/add_api_key")
def add_api_key(user_id: str, api_key: str):
    ##this is completely unsafe code, gotta fix later
    handler = SQLiteDBHandler()
    handler.insert_api_key(user_id, api_key)
    return "API Key added successfully"
     


@app.get("/create_chat")
def create_chat(user_id: str, chat_id: str, course_id: str):
    ##first thing is check if the collection name exists, if not we create it, by downloading all files from the course
    ##then we create an empty chat history
    chat_engine = ChatEngine()
    chat_store = SimpleChatStore()
    if chat_engine.does_collection_exist(course_id):

        ##collection exists
        handler = SQLiteDBHandler()
        handler.insert_chat_history(
            user_id=user_id, 
            chat_id=chat_id, 
            collection=course_id,
            chat_history= chat_store.json())
    else:
        ##collection does not exist
        chat_engine.create_collection_from_course_id(course_id)
        handler = SQLiteDBHandler()
        handler.insert_chat_history(
            user_id=user_id, 
            chat_id=chat_id, 
            collection=course_id,
            chat_history= chat_store.json())

    return "Chat created successfully"



@app.get("/get_courses")
def get_courses(user_id: str):
    handler = SQLiteDBHandler()
    # api_key = handler.retrieve_api_key(user_id)
    # if not api_key:
    #     return "No API Key found for user"
    ##get courses from canvas
    return CanvasHelper.get_courses_for_frontend()

##creating collections, each course from canvas will get it's own collection
##we should create this collections on user sign-up, for right now easiest solution is hard download every course to a dir in data
##then create a collection of the same name, we can alternatively give the user the option to create a collection for certain classes
##ideally we create the collection dynamically when the user first opens a chat with a cetain course ex. CSC-X



##when user signs-up we create a user object, we add the canvas api key
##we don't store the list of active courses, instead, we query active courses, when the users clicks dropdown we query current active courses
##we then can create the collection by course-id using the canvas api


if __name__ == "__main__":
    uvicorn.run(app)
    print("Shutting down server...")
