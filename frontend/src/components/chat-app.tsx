"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import {
  Send,
} from "lucide-react";
import { Message, TextContent } from "@/models/models";

export function ChatAppComponent() {
  const [gettingResponse, setGettingResponse] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (gettingResponse) return;
    setGettingResponse(true);


    if (input.trim()) {
      const newMessage: Message = {
        role: "user",
        content: [
          {
            type: "text",
            text: input,
          },
        ],
      };

      setInput("")

      messages.push(newMessage);

      const url = new URL("http://127.0.0.1:8000/chat");
      url.searchParams.append("collection", "test");
      url.searchParams.append("chat_id", "chat87");
      url.searchParams.append("user_id", "46456456");
      url.searchParams.append("message", input);

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.body) {
          throw new Error("Response body is null");
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let assistantMessage: Message = {
          role: "assistant",
          content: "",
        };
        messages.push(assistantMessage);


        // Read the stream
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          let stringChunk = decoder.decode(value, { stream: true });
          console.log("Received chunk:", stringChunk);
          (assistantMessage.content as String) += stringChunk;


          const updatedMessages = [...messages];

          updatedMessages[updatedMessages.length - 1] = assistantMessage;
          setMessages(updatedMessages);
        }
      } catch (error) {
        console.error("Error sending messages:", error);
      }
      console.log(messages);

      setGettingResponse(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-auto">
      <div className="flex-1 flex flex-col mr-[28px] ">
        
      {/* Header */}
      <header className="fixed top-0 bg-white pb-5 pt-1 pl-2 justify-left align-top w-full z-10">
        <h1 className="text-xl font-semibold">Canvas RAG Chat</h1>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col mx-0 sm:mx-0 md:mx-[5%] lg:mx-[20%]">
        <div className="flex-1 p-4 space-y-4 max-sm:mt-[25%] max-md:mt-[10%] max-lg:mt-[10%] mt-[10%]">
          {messages.map((message, index) => (
            <Card
              key={index}
              className={`p-4 max-w-[80%] ${
                message.role === "user" ? "ml-auto bg-blue-100" : "bg-white"
              }`}
            >
              <div className="flex items-start">
                {message.role === "assistant" && (
                  <Avatar className="mr-4">
                    <AvatarImage
                      src="/placeholder.svg?height=40&width=40"
                      alt="AI"
                    />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  {message.role === "user"
                    ? (message.content[0] as TextContent).text
                    : 
                    <ReactMarkdown>
                       {message.content as string}
                    </ReactMarkdown>
                   }
                </div>
              </div>
            </Card>
          ))}
        </div>
        {/*Input area **/}
        <div className="sticky bottom-0 left-0 right-0 p-4 border-t bg-white">
          <div className="flex space-x-2">
            <Input
              value={input}
              onInput={(e) => setInput((e.target as HTMLInputElement).value)}
              placeholder="Type your message here..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
