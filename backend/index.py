from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import os
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Union
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import uvicorn
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

client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.environ.get("GROQ_API_KEY")

)


def stream_response(messages: List[message]):
    print(messages[0].__dict__)
    stream = client.chat.completions.create(
    model="llama-3.1-70b-versatile",
    messages=messages,
    stream=True,
    )

    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            print(chunk.choices)
            yield chunk.choices[0].delta.content


@app.post("/send")
def post_messages(messages: List[message], collection: str):
    ##return as a stream
    ## what needs to actually happen here
    ## we need to append context data to each message if there is not given context, llm should simple say `I don't know``
    ## we let the llm know that it will receive context data for each message and that it should only respond based on context
    ## all chat stream should be associated with a chroma_db collection




    return StreamingResponse(stream_response(messages), media_type="text/event-stream")



##creating collections, each course from canvas will get it's own collection
##we should create this collections on user sign-up, for right now easiest solution is hard download every course to a dir in data
##then create a collection of the same name, we can alternatively give the user the option to create a collection for certain classes
##ideally we create the collection dynamically when the user first opens a chat with a cetain course ex. CSC-X

@app.post("/collection")
def create_collection(course_id: str):
    ##we only create a collection if the course exists and has files in it\
    return "testing"



##when user signs-up we create a user object, we add the canvas api key
##we don't store the list of active courses, instead, we query active courses, when the users clicks dropdown we query current active courses
##we then can create the collection by course-id using the canvas api


if __name__ == "__main__":
    uvicorn.run(app)
    print("Shutting down server...")
