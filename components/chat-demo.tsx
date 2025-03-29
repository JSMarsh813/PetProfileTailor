"use client";

import { useChat, type UseChatOptions } from "@ai-sdk/react";

import { Chat } from "@/components/ui/chat";
import { transcribeAudio } from "@/lib/audio";

type ChatDemoProps = {
  initialMessages?: UseChatOptions["initialMessages"];
};

export function ChatDemo(props: ChatDemoProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    stop,
    isLoading,
  } = useChat(props);

  return (
    <div className="flex min-h-[500px] w-full py-4">
      <Chat
        className="grow"
        messages={messages}
        handleSubmit={handleSubmit}
        input={input}
        handleInputChange={handleInputChange}
        isGenerating={isLoading}
        stop={stop}
        append={append}
        transcribeAudio={transcribeAudio}
        suggestions={[
          "What are 3 creative dog names with a star wars twist",
          "Give a description for an affection black cat who loves tunnels",
          "What are 3 names for a loveable cat thats kind of a jerk?",
        ]}
      />
    </div>
  );
}
