import sqlite3

class SQLiteDBHandler:
    def __init__(self, db_file='chat_history.db'):
        # Initialize the SQLite database connection
        self.conn = sqlite3.connect(db_file)
        self.create_tables()

    def create_tables(self):
        # Create the chat_history table if it doesn't exist
        with self.conn:
            self.conn.execute('''
                CREATE TABLE IF NOT EXISTS chat_history (
                    user_id TEXT,
                    course_id TEXT,
                    chat_id TEXT,
                    chat_history TEXT,
                    PRIMARY KEY (user_id, course_id, chat_id)
                )
            ''')

            self.conn.execute('''
            CREATE TABLE IF NOT EXISTS user (
                user_id TEXT PRIMARY KEY,
                api_key TEXT
            )
        ''')

    def insert_chat_history(self, user_id, course_id, chat_id, chat_history):
        try:
            with self.conn:
                # Delete old chat history if it exists
                self.conn.execute('DELETE FROM chat_history WHERE user_id = ? AND course_id = ? AND chat_id = ?',
                                  (user_id, course_id, chat_id))

                # Insert the new chat history
                self.conn.execute('''
                    INSERT INTO chat_history (user_id, course_id, chat_id, chat_history)
                    VALUES (?, ?, ?, ?)
                ''', (user_id, course_id, chat_id, chat_history))
                ##print(f"Inserted chat history for chat_id: {chat_id}")
        except Exception as e:
            print(f"Error during insertion: {e}")

    def retrieve_chat_history(self, user_id, course_id, chat_id):
        try:
            cursor = self.conn.cursor()
            cursor.execute('''
                SELECT chat_history FROM chat_history
                WHERE user_id = ? AND course_id = ? AND chat_id = ?
            ''', (user_id, course_id, chat_id))
            result = cursor.fetchone()
            if result:
                ##print(f"Retrieved chat history for chat_id: {chat_id}")
                return result[0]  # Return the chat_history string
            else:
                ##print(f"No chat history found for chat_id: {chat_id}")
                return None
        except Exception as e:
            print(f"Error during retrieval: {e}")
            return None
        
    ##retrieve all chat histories by user_id
    def retrieve_all_chat_histories(self, user_id):
        try:
            cursor = self.conn.cursor()
            cursor.execute('''
                SELECT chat_id, course_id, chat_history FROM chat_history
                WHERE user_id = ?
            ''', (user_id,))
            results = cursor.fetchall()
            if results:
                ##print(f"Retrieved all chat histories for user_id: {user_id}")
                return results  # Return the chat_history string
            else:
                ##print(f"No chat history found for user_id: {user_id}")
                return None
        except Exception as e:
            print(f"Error during retrieval: {e}")
            return

    def close(self):
        # Close the database connection
        if self.conn:
            self.conn.close()

# Example usage
if __name__ == "__main__":
    handler = SQLiteDBHandler()
    json_string = '{"messages": ["Hello", "How are you?"]}'  # Example chat not correct format

    # Insert chat history
    handler.insert_chat_history("1", "1", "1", json_string)

    # Retrieve chat history
    retrieved_history = handler.retrieve_chat_history("1", "2", "1")
    if retrieved_history:
        print("Chat History:", retrieved_history)

    handler.close()