"use client";
import { useState } from "react";
import { sendStatus } from "@/lib/hardwareApi";

export default function SendStatus() {
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSend = async () => {
    try {
      const res = await sendStatus(Number(code), description);
      if (res.error) {
        setMessage(res.error);
      } else {
        setMessage("Status sent successfully");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to send status");
    }
  };

  return (
    <div>
      <input
        type="number"
        placeholder="Status Code"
        value={code}
        onChange={e => setCode(e.target.value)}
        className="border p-2 mr-2"
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="border p-2 mr-2"
      />
      <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded">
        Send Status
      </button>
      {message && <div className="mt-2 text-sm">{message}</div>}
    </div>
  );
} 