"use client";

import { useChat, type UseChatOptions } from "@ai-sdk/react";

import { Chat } from "@/components/ui/chat";

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
    <div className="flex min-h-[500px] w-95vw  py-4 ">
      <Chat
        className="grow"
        messages={messages}
        handleSubmit={handleSubmit}
        input={input}
        handleInputChange={handleInputChange}
        isGenerating={isLoading}
        stop={stop}
        append={append}
        suggestions={[
          "What are 3 creative dog names with a star wars twist",
          "Give a description for an affectionate black cat that likes to run through cat tunnels",
          "What are 3 names for a loveable bird thats also kind of a jerk?",
        ]}
      />
    </div>
  );
}
