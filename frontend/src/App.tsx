import { useEffect, useState } from "react";
import { ChatAppComponent } from "./components/chat-app";
import { Layout } from "./components/sidebar/layout";

import { v4 as uuidv4 } from "uuid";

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatHistory {
  store: Record<string, ChatMessage[]>;
  class_name: string;
}

export interface Chat {
  chat_id: string;
  collection: string;
  chat_history: ChatHistory;
}

function App() {
  const [userId, setUserId] = useState<string>("");
  const [selectedChat, setSelectedChat] = useState<string>("");
  const [chats, setChats] = useState<Chat[]>([
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user_id is already set in local storage
    const storedUserId = localStorage.getItem("user_id");

    // If user_id is not set, generate a new one and set it in local storage
    if (!storedUserId) {
      const newUserId = uuidv4(); // Generate a new UUID
      localStorage.setItem("user_id", newUserId);
      setUserId(newUserId); // Set the generated user ID to the state
      console.log("user_id set:", newUserId);
    } else {
      setUserId(storedUserId); // Load the existing user ID into the state
      console.log("user_id already exists:", storedUserId);
    }

  }, []);

  useEffect(() => {
    async function fetchChats(userId: string) {
      if(userId === "") return;
      try {
        const url = new URL("http://127.0.0.1:8000/chats");
        url.searchParams.append("user_id", userId);
        console.log(url);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching chats: ${response.statusText}`);
        }

        const data = await response.json();
        setChats(data);
        console.log("chats:", data);
        //select a random chat 
        setSelectedChat(data[0].chat_id);


      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchChats(userId);
  }, [userId]);

  //we change the loaded messages for chat depending on selectecd chat

  return (
    <div className="flex">
      <div>
        <Layout 
        userId={userId} 
        setUserId={setUserId}
        chats={chats}
        setSelectedChat={setSelectedChat}
        setChats={setChats}
        />
      </div>
      <ChatAppComponent 
      userId={userId} 
      chats={chats}
      selectedChat={selectedChat}
      />
    </div>
  );
}

export default App;
