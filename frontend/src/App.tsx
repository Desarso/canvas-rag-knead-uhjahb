import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

interface TextContent {
  type: "text";
  text: string;
}

//we are just gonna use base64 encoding
interface ImageContent {
  type: "image_url";
  image_url: string;
}

interface Message {
  role: string;
  content: (TextContent | ImageContent)[];
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  const [typingMessage, setTypingMessage] = useState<string>("");
  const [gettingResponse, setGettingResponse] = useState<boolean>(false);
  const scrollableDivRef = useRef<HTMLDivElement>(null);
  const [modelName, setModelName] = useState<string>("gpt-4o-mini");
  const url = "http://127.0.0.1:8000/send";

  async function sendMessage() {
    if (gettingResponse) return;
    setGettingResponse(true);

    //clear input field
    const inputfield = document.querySelector("input");
    (inputfield as HTMLInputElement).value = "";



    const newMessage: Message = {
      role: "user",
      content: [
        {
          type: "text",
          text: typingMessage,
        },
      ],
    };
    messages.push(newMessage);

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
        content: [
          {
            type: "text",
            text: "",
          },
        ],
      };
      messages.push(assistantMessage);

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        let stringChunk = decoder.decode(value, { stream: true });
        console.log("Received chunk:", decoder.decode(value, { stream: true }));
        (assistantMessage.content[0] as TextContent).text += stringChunk;

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

  //input with enter key
  useEffect(() => {
    const enterPressed = (e: any) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    };

    window.addEventListener("keydown", enterPressed);
    return () => {
      window.removeEventListener("keydown", enterPressed);
    };
  }, [typingMessage]);

  // Scroll to the bottom when messages are updated
  useEffect(() => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop =
        scrollableDivRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="App h-screen">
      <section className="chat-box h-full bg-slate-300 flex flex-col">
        <h1 className="text-4xl font-bold text-center text-black-500 p-5">
          Interview GPT
        </h1>
        {/*Messages section */}
        <div
          className="
          flex flex-col grow bg-white p-5 ml-5 mr-5 rounded-lg overflow-y-auto
          [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:bg-gray-300
          "
          ref={scrollableDivRef}
        >
          {messages.map((message) =>
            message.role == "user" ? (
              <div
                key={generateUUID()}
                className="bg-slate-200 h-fit w-fit m-1 p-3 rounded-sm self-end"
              >
                {/*Display the user message content */}
                {message.content.map((item) =>
                  item.type == "text" ? (
                    <div key={generateUUID()}>{item.text}</div>
                  ) : (
                    <div key={generateUUID()}>Image holder</div>
                  )
                )}
              </div>
            ) : (
              <div
                className="bg-transparent h-fit w-fit m-1 p-3 rounded-sm"
                key={generateUUID()}
              >
                <h2 className="font-bold mb-2">{modelName}:</h2>
                <ReactMarkdown
                  className={"markdown"}
                >{(message.content[0] as TextContent).text}</ReactMarkdown>
              </div>
            )
          )}

          {/* <div className="bg-slate-200 h-fit w-fit m-1 p-3 rounded-sm self-end">
            hello there
          </div>
          <div className="bg-transparent h-fit w-fit m-1 p-3 rounded-sm">
            <h2 className="font-bold mb-2">gpt-4o</h2>
            hello there
          </div> */}
        </div>
        {/*Input section */}
        <div className="m-5 rounded-lg bg-slate-500 flex">
          <input
            onInput={(e) => {
              setTypingMessage((e.target as HTMLInputElement).value);
              console.log(typingMessage);
            }}
            className="flex-grow h-full p-3 rounded-l-lg"
            type="text"
          />
          <button
            disabled={gettingResponse}
            className={`p-3 ${
              gettingResponse ? "disabled" : "hover:bg-gray-400"
            } rounded-r-lg duration-300`}
            onClick={() => {
              sendMessage();
            }}
          >
            <UpArrow />
          </button>
        </div>
      </section>
    </div>
  );
}

function UpArrow(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={
        `icon icon-tabler icons-tabler-outline icon-tabler-arrow-up` +
        props.className
      }
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 5l0 14" />
      <path d="M18 11l-6 -6" />
      <path d="M6 11l6 -6" />
    </svg>
  );
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default App;
