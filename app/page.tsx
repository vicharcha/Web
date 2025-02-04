import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MainContent } from "@/components/main-content";

interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages");
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handlePost = async () => {
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newMessage,
          sender: "Current User", // Replace with actual user authentication
          timestamp: new Date().toISOString(),
        }),
      });
      if (response.ok) {
        setNewMessage("");
        fetchMessages();
      }
    } catch (error) {
      console.error("Failed to post message:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8 py-6 md:py-12">
        <MainContent />
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Messages</h2>
          <div className="mb-4">
            <Input
              placeholder="What's on your mind?"
              className="mb-2"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button className="w-full sm:w-auto" onClick={handlePost}>
              Post
            </Button>
          </div>
          <div>
            {messages.map((message) => (
              <div key={message.id} className="mb-4 p-4 border rounded">
                <p className="font-semibold">{message.sender}</p>
                <p>{message.content}</p>
                <p className="text-sm text-gray-500">{message.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
