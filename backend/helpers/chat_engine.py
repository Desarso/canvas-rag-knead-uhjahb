from llama_index.core import (
    SimpleDirectoryReader,
    PromptTemplate,
    VectorStoreIndex,
    StorageContext,
    load_index_from_storage,
    Settings,
)
from llama_index.core.base.llms.types import ChatMessage
from llama_index.llms.groq import Groq
from llama_index.core.node_parser import SentenceSplitter
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
import chromadb
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.core.storage.chat_store import SimpleChatStore
from llama_index.core.memory import ChatMemoryBuffer
from llama_index.core.chat_engine import CondenseQuestionChatEngine
import os
from helpers.canvas import CanvasHelper
from dotenv import load_dotenv

if __name__ != "__main__":
    from helpers.sqlite_handler import SQLiteDBHandler

load_dotenv()

# LLM Setup
llm = Groq(model="llama-3.1-70b-versatile", api_key=os.environ.get("GROQ_API_KEY"))

# Configure service context
Settings.llm = llm
Settings.embed_model = HuggingFaceEmbedding(
    model_name="BAAI/bge-small-en-v1.5"
)
Settings.node_parser = SentenceSplitter(chunk_size=1000, chunk_overlap=20)

# Configure settings
Settings.num_output = 512
Settings.context_window = 3900

custom_prompt = PromptTemplate(
    """\
Given a conversation (between Human and Assistant) and a follow-up message from Human, \
rewrite the message to be a standalone question. Only take into account the chat context as it serves the answer.

<Chat History>
{chat_history}

<Follow Up Message>
{question}

<Standalone question>
"""
)

class ChatEngine:
    def __init__(self):
        self.db = chromadb.PersistentClient(path="./chroma_db")

    def create_collection(self, name: str, dir_path: str):
        documents = SimpleDirectoryReader(dir_path).load_data()
        chroma_collection = self.db.get_or_create_collection(name)
        vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
        storage_context = StorageContext.from_defaults(vector_store=vector_store)
        VectorStoreIndex.from_documents(
            documents=documents,
            storage_context=storage_context
        )
        print("Collection created")


    def create_collection_from_course_id(self, course_id: str):
        ##first we check if folder exists
        base_directory = './data'
        course_directory = os.path.join(base_directory, course_id)
        if not os.path.exists(course_directory):
            print("Folder does not exist")
            ##we download the files using the canvas helper
            CanvasHelper.download_files_from_course(course_id)
            ##then check if the folder exists
            if os.path.exists(course_directory):
                print("Folder created")
                self.create_collection(course_id, course_directory)
            else:
                print("Folder not created")
            return
        else:
            print("Folder exists")
            ##check if collection exists
            if self.does_collection_exist(course_id):
                print("Collection exists")
                return
            ##if folder is empty, download files
            if not os.listdir(course_directory):
                print("Folder is empty")
               ##add txt file with message of empty folder
                with open(os.path.join(course_directory, "empty.txt"), "w") as f:
                    f.write("This collection is empty. Please upload files to this folder.")
                self.create_collection(course_id, course_directory)
                return
            self.create_collection(course_id, course_directory)
            return
        

    def does_collection_exist(self, name: str):
        print(self.db.list_collections())
        return name in self.db.list_collections()

    def files_in_collection(self, name: str):
        chroma_collection = self.db.get_or_create_collection(name)
        return chroma_collection

    def chat_stream(self, message: str, collection: str, chat_id: str, user_id: str = "user1"):
        chroma_collection = self.db.get_or_create_collection(collection)
        vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
        storage_context = StorageContext.from_defaults(vector_store=vector_store)
        ##load from existing store
        index = VectorStoreIndex.from_vector_store(
            vector_store=vector_store,
            storage_context=storage_context
            )

        handler = SQLiteDBHandler()
        chat_history = handler.retrieve_chat_history(user_id, collection, chat_id)
        if chat_history:
            loaded_chat_store = SimpleChatStore.from_json(chat_history)
            chat_memory = ChatMemoryBuffer.from_defaults(
                chat_store=loaded_chat_store,
                chat_store_key=chat_id,
            )
            query_engine = index.as_query_engine(
                response_mode="compact",
                verbose=True,
            )
            chat_engine = CondenseQuestionChatEngine.from_defaults(
                query_engine=query_engine,
                condense_question_prompt=custom_prompt,
                verbose=True,
                memory=chat_memory
            )
            response = chat_engine.stream_chat(message)
            for response_token in response.response_gen:
                yield response_token
            chat_history_json = loaded_chat_store.json()
            #print(chat_history_json)
            handler.insert_chat_history(user_id, collection, chat_id, chat_history_json)
            handler.close()
        else:
            chat_store = SimpleChatStore()
            chat_memory = ChatMemoryBuffer.from_defaults(
                chat_store=chat_store,
                chat_store_key=chat_id,
            )
            ##add system message
            system_message = ChatMessage(
                role="system",
                content="Please include citation of the sources you used to answer the question."
            )
            chat_store.add_message(
                key=chat_id,
                message=system_message)
            query_engine = index.as_query_engine(
                response_mode="compact",
                verbose=True,
            )
            chat_engine = CondenseQuestionChatEngine.from_defaults(
                query_engine=query_engine,
                condense_question_prompt=custom_prompt,
                verbose=True,
                memory=chat_memory
            )
            response = chat_engine.stream_chat(message)
            for response_token in response.response_gen:
                yield response_token
            chat_history_json = chat_store.json()
            # print(chat_history_json)
            handler.insert_chat_history(user_id, collection, chat_id, chat_history_json)
            handler.close()


