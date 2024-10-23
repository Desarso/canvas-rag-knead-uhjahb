"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  PlusCircle,
  Send,
} from "lucide-react";
import { Message, TextContent } from "@/models/models";

export function ChatAppComponent() {
  const [gettingResponse, setGettingResponse] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

      const url = "http://127.0.0.1:8000/send";
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messages),
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen w-full bg-white">
      {/* Sidebar */}
      {/* <div
        className={`bg-gray-900 text-white transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-0"
        }`}
      >
        <div className="p-4">
          <Button variant="outline" className="w-full mb-4">
            <PlusCircle className="mr-2 h-4 w-4" />
            New chat
          </Button>
          <div className="space-y-2">
            {["Chat 1", "Chat 2", "Chat 3"].map((chat, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start"
              >
                {chat}
              </Button>
            ))}
          </div>
        </div>
      </div> */}
      <div className="flex-1 flex flex-col mr-[28px]">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col mx-0 sm:mx-0 md:mx-[5%] lg:mx-[20%]">
      {/* <div className="flex-1 flex flex-col ml-0 mr-[28px] sm:ml-0 mr-[28px] md:ml-[5%] mr-[5% + 28px] lg:ml-[20%] mr-[20% + 28px]"> */}


        {/* Header */}
        <header className="bg-white p-4 flex items-center justify-between">
          {/* <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
          </Button> */}
          {/* <h1 className="text-xl font-semibold">ChatGPT Clone</h1> */}
          <div className="w-6" /> {/* Placeholder for symmetry */}
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
        <div className="p-4 border-t">
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
