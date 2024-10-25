import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

export default function LandingPage() {
    const [input, setInput] = useState<string>("")

    const navigate = useNavigate()

    return(
        <div className="flex flex-col items-center justify-center h-screen w-fit m-auto text-center">
            <h1 className="font-semibold text-5xl mb-5">Canvas RAG Chat</h1>
            <h1 className="font-semibold text-xl mb-20">Chat with your Canvas courses!</h1>
            <h2 className="font-semibold text-l mb-3">Please enter your Canvas API key</h2>
            <Input
                className="mb-10"
              value={input}
              onInput={(e) => setInput((e.target as HTMLInputElement).value)}
              placeholder="Type your API key here..."
              onKeyDown={(e) => e.key === "Enter" && navigate("/chat")}
            />
            <Button><Link to="/chat">Continue</Link></Button>
        </div>
    )
}