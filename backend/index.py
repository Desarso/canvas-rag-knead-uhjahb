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
def post_messages(messages: List[message]):
    ##return as a stream
    return StreamingResponse(stream_response(messages), media_type="text/event-stream")





if __name__ == "__main__":
    uvicorn.run(app)
    print("Shutting down server...")
