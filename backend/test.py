from helpers.chat_engine import ChatEngine
from llama_index.core import SimpleDirectoryReader, PromptTemplate, VectorStoreIndex, StorageContext, load_index_from_storage, Settings
from llama_index.llms.groq import Groq
from llama_index.core.node_parser import SentenceSplitter
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
import chromadb
from llama_index.core.chat_engine import CondenseQuestionChatEngine
from llama_index.vector_stores.chroma import ChromaVectorStore
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
# collection_name = "mandelbrot"
# # ## testing if it will refuse response when context is irrelevant
# # query = "tell me about the moon"
# # print(make_query(query))
# # # QueryEngine.create_collection(collection_name, "data/mandelbrot")
# # print(QueryEngine.query_by_collection(make_query(query), collection_name))


# custom_prompt = PromptTemplate(
#     """\
# Given a conversation (between Human and Assistant) and a follow up message from Human, \
# rewrite the message to be a standalone question,only take into account the chat context is it serves the answer

# <Chat History>
# {chat_history}

# <Follow Up Message>
# {question}

# <Standalone question>
# """
# )


# collection = "test"
# chat_engine = ChatEngine()
# chat_engine.create_collection(collection, "data")
##chroma_collection = chat_engine.db.get_or_create_collection(collection)
# vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
# storage_context = StorageContext.from_defaults(vector_store=vector_store)
# ##load from existing store
# index = VectorStoreIndex.from_vector_store(
#     vector_store=vector_store,
#     storage_context=storage_context
#     )

# ##testing chat engine
# query_engine = index.as_query_engine()
# chat_engine = CondenseQuestionChatEngine.from_defaults(
#     query_engine=query_engine,
#     condense_question_prompt=custom_prompt,
#     verbose=True,
# )

# # response = chat_engine.stream_chat(
# #     "Explain in detail what a CLA(carry look ahead added) is?"
# # )
# # for token in response.response_gen:
# #     print(token, end="")


##
# while True:
#     val = input()
#     if val == "show":
#         print(chat_engine.chat_history)
#     response = chat_engine.stream_chat(val)
#     for token in response.response_gen:
#         print(token, end="")
#     print("")


# collection = "test"
# chat_id = "dfgdgdfg"
# user_id="35345454"


# chat_engine_instance = ChatEngine()
# # response = chat_engine_instance.chat_stream("author", "test", "chat4")

# while True:
#     message = input()
#     response = chat_engine_instance.chat_stream(
#         message=message,
#         collection=collection,
#         chat_id=chat_id, 
#         user_id=user_id)
#     for token in response:
#         print(token, end="")
#     print("")

##list files in test collection

chat_engine = ChatEngine()
coll = chat_engine.files_in_collection("test")
##list all attributes of coll.get()
stuff = coll.get()
##save to json
for x in range(len(stuff["ids"])):
    doc = stuff["metadatas"][x]
    print(doc['file_name'])