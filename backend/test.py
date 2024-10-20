from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index import ServiceContext

documents = SimpleDirectoryReader("data").load_data()
index = VectorStoreIndex.from_documents(documents)
index.storage_context.persist()
query_engine = index.as_query_engine()
response = query_engine.query("What is this textbook about?")
print(response)