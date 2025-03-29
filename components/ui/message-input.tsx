import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  Info,
  Loader2,
  Mic,
  Paperclip,
  Square,
  X,
} from "lucide-react";
import { omit } from "remeda";

import { cn } from "@/lib/utils";
import { useAutosizeTextArea } from "@/hooks/use-autosize-textarea";
import { Button } from "@/components/ui/button";

interface MessageInputBaseProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  submitOnEnter?: boolean;
  stop?: () => void;
  isGenerating: boolean;
  enableInterrupt?: boolean;
}

interface MessageInputWithoutAttachmentProps extends MessageInputBaseProps {
  allowAttachments?: false;
}

type MessageInputProps = MessageInputWithoutAttachmentProps;

export function MessageInput({
  placeholder = "Ask Byte the AI dog...",
  className,
  onKeyDown: onKeyDownProp,
  submitOnEnter = true,
  stop,
  isGenerating,
  enableInterrupt = true,

  ...props
}: MessageInputProps) {
  const [showInterruptPrompt, setShowInterruptPrompt] = useState(false);

  useEffect(() => {
    if (!isGenerating) {
      setShowInterruptPrompt(false);
    }
  }, [isGenerating]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (submitOnEnter && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      event.currentTarget.form?.requestSubmit();
    }

    onKeyDownProp?.(event);
  };

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [textAreaHeight, setTextAreaHeight] = useState<number>(0);

  useEffect(() => {
    if (textAreaRef.current) {
      setTextAreaHeight(textAreaRef.current.offsetHeight);
    }
  }, [props.value]);

  useAutosizeTextArea({
    ref: textAreaRef,
    maxHeight: 240,
    borderWidth: 1,
    dependencies: [props.value],
  });

  return (
    <div className="relative flex w-full items-center space-x-2">
      <div className="relative flex-1">
        <textarea
          aria-label="Write your prompt here"
          placeholder={placeholder}
          ref={textAreaRef}
          onKeyDown={onKeyDown}
          className={cn(
            "z-10 w-full grow  rounded-xl border border-input bg-background p-3 pr-24 text-sm ring-offset-background transition-[border] placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            "pb-16",
            className,
          )}
          {...omit(props, ["allowAttachments"])}
        />
      </div>

      <div className="absolute right-3  z-20 flex gap-2">
        <Button
          type="submit"
          size="icon"
          className="h-8 w-24 transition-opacity"
          aria-label="Send message"
          disabled={props.value === "" || isGenerating}
        >
          <span> Submit </span>
          <ArrowUp className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
MessageInput.displayName = "MessageInput";
