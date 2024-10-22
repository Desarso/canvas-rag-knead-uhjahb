from llama_index.core import SimpleDirectoryReader, VectorStoreIndex, StorageContext, load_index_from_storage, Settings
from llama_index.llms.groq import Groq
from llama_index.core.node_parser import SentenceSplitter
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
import chromadb
from llama_index.vector_stores.chroma import ChromaVectorStore
import os
from dotenv import load_dotenv
load_dotenv()


##set up groq
llm = Groq(model="llama-3.1-70b-versatile", api_key=os.environ.get("GROQ_API_KEY"))

##configure service context
Settings.llm = llm
Settings.embed_model = HuggingFaceEmbedding(
    model_name="BAAI/bge-small-en-v1.5"
)
Settings.node_parser = SentenceSplitter(chunk_size=1000, chunk_overlap=20)
##I just got this from the docs, can change 
Settings.num_output = 512
Settings.context_window = 3900



##load documents from data dir only needed initially
##documents = SimpleDirectoryReader("data").load_data()


# using chromadb to store vectors
db = chromadb.PersistentClient(path="./chroma_db")

# create collection
chroma_collection = db.get_or_create_collection("test")

# assign chroma as the vector_store to the context
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
storage_context = StorageContext.from_defaults(vector_store=vector_store)


##load from existing store
index = VectorStoreIndex.from_vector_store(
    vector_store=vector_store,
    storage_context=storage_context
    )

##we can insert documents to index using insert, gotta figure it out

query_engine = index.as_query_engine()
# response = query_engine.query("What is a CLA?")
# print(response)


##create a loop of questions and answers
while True:
    query = input("Input:")
    response = query_engine.query(query)
    print(response)
