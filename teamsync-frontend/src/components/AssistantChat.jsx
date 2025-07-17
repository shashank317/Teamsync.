// src/components/AssistantChat.jsx
import { useState } from "react";

export default function AssistantChat() {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const token = localStorage.getItem("access_token");

  const sendChat = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    const res = await fetch("/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    setMessages([
      ...newMessages,
      {
        role: "assistant",
        content: res.ok ? data.reply : "Error: " + data.detail,
      },
    ]);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setVisible(!visible)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full shadow-lg"
        >
          🤖 AI Help
        </button>
      </div>

      {visible && (
        <div className="fixed bottom-20 right-6 w-80 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b dark:border-gray-600 font-semibold flex justify-between items-center">
            AI Assistant
            <button
              onClick={() => setVisible(false)}
              className="text-gray-500 dark:text-gray-300 hover:text-red-500"
            >
              ✖️
            </button>
          </div>
          <div className="p-3 h-60 overflow-y-auto text-sm space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded ${
                  msg.role === "user"
                    ? "bg-indigo-100 dark:bg-indigo-900 self-end"
                    : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                {msg.role === "user" ? "🧑" : "🤖"}: {msg.content}
              </div>
            ))}
          </div>
          <div className="p-3 border-t dark:border-gray-600 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-2 py-1 border dark:border-gray-700 rounded dark:bg-gray-700 text-black dark:text-white"
            />
            <button
              onClick={sendChat}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
