from llama_index.core import SimpleDirectoryReader, VectorStoreIndex, StorageContext, load_index_from_storage, Settings
from llama_index.llms.groq import Groq
from llama_index.core.node_parser import SentenceSplitter
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
import chromadb
from llama_index.vector_stores.chroma import ChromaVectorStore
import os
from dotenv import load_dotenv
load_dotenv()


##llm set up
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


class QueryEngine:
    ##this is basically the core of the rag system
    ##gonna just make it static classes
    ##we must be able to query by collection name
    ##add documents by directory path
    ## that's it pretty much
    db = chromadb.PersistentClient(path="./chroma_db")


    ## take in a collection name and a query, and returns a response
    @staticmethod
    def query_by_collection(query: str, collection: str): 
        chroma_collection = QueryEngine.db.get_or_create_collection(collection)
        vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
        storage_context = StorageContext.from_defaults(vector_store=vector_store)
        ##load from existing store
        index = VectorStoreIndex.from_vector_store(
            vector_store=vector_store,
            storage_context=storage_context
            )
        query_engine = index.as_query_engine()
        return query_engine.query(query)
        

    ##create a chroma collection and inserts all documents in given directory
    @staticmethod
    def create_collection(name: str, dir_path: str):
        documents = SimpleDirectoryReader(dir_path).load_data()
        chroma_collection = QueryEngine.db.get_or_create_collection(name)
        vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
        storage_context = StorageContext.from_defaults(vector_store=vector_store)
        VectorStoreIndex.from_documents(
            documents=documents,
            storage_context=storage_context
            )
