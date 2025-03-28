"use client";

import { useChat } from "@ai-sdk/react";
//import import { useChat } from "ai/react" was having an error/couldn't find module. switched to import { useChat } from "@ai-sdk/react" https://github.com/vercel/ai/discussions/4249
import { Input } from "./Input";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col w-full max-w-3xl p-4 mx-auto stretch  bg-darkPurple  ">
      {messages.map((m) => (
        <div
          key={m.id}
          className="whitespace-pre-wrap"
        >
          <span className="font-bold">
            {" "}
            {m.role === "user" ? "User: " : "Byte: "}{" "}
          </span>

          {m.content}
        </div>
      ))}

      <form
        onSubmit={handleSubmit}
        className=" text-center my-4"
      >
        <label
          htmlFor="question"
          className="font-bold"
        >
          {" "}
          Type what you want to ask Byte:
        </label>
        <Input
          className="p-2 mb-8 border border-gray-300 rounded shadow-xl bg-white"
          placeholder="Say Something..."
          name="question"
          value={input}
          onChange={handleInputChange}
        />
        <span> Button placeholder</span>
      </form>
    </div>
  );
}
