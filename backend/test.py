from helpers.query_engine import QueryEngine
import openai
import os
import ell
import json
from dotenv import load_dotenv
load_dotenv()

client = openai.Client(
    api_key=os.getenv("GROQ_API_KEY"), base_url="https://api.groq.com/openai/v1"
)


@ell.simple(model="llama3-70b-8192", client=client)
def make_query(text: str):
    """Extract the essential content from the user message and return only the optimized query for vector search. Do not include any explanations, padding, or additional text, only the query nothing else.
    """
    return f"User message : {text}"


##create collection and query it
collection_name = "mandelbrot"
query = "tell me about mandelbrot set rendering"
print(make_query(query))
# QueryEngine.create_collection(collection_name, "data/mandelbrot")
print(QueryEngine.query_by_collection(make_query(query), collection_name))