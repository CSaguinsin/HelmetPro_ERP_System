"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useChat } from "ai/react";
import { X, Send } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Typing animation component
const TypingAnimation = () => (
  <div className="flex space-x-1.5 items-center">
    <div className="h-2.5 w-2.5 bg-gray-400 rounded-full animate-bounce" />
    <div className="h-2.5 w-2.5 bg-gray-400 rounded-full animate-bounce delay-100" />
    <div className="h-2.5 w-2.5 bg-gray-400 rounded-full animate-bounce delay-200" />
  </div>
);

interface AIChatWidgetProps {
  position?: "bottom-right" | "bottom-left";
  initiallyOpen?: boolean;
  primaryColor?: string;
  welcomeMessage?: string;
  logoUrl?: string;
  disableAnimations?: boolean;
  onChatOpen?: () => void;
  onChatClose?: () => void;
}

export function AIChatWidget({
  position = "bottom-right",
  initiallyOpen = false,
  primaryColor = "#3b82f6",
  welcomeMessage = "Hi, I'm your HelmetPro assistant! How can I help you today?",
  logoUrl = "/helmetpro/logo.jpeg",
  disableAnimations = false,
  onChatOpen,
  onChatClose,
}: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome-message",
        role: "assistant",
        content: welcomeMessage,
      },
    ],
    onError: (err) => {
      console.error("Full error from useChat:", err);
    },
  });

  useEffect(() => {
    if (error) {
      console.error("Chat error details:", error);
    }
  }, [error]);

  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      const { scrollTop, scrollHeight, clientHeight } = messagesEndRef.current.parentElement!;
      const isAtBottom = scrollHeight - (scrollTop + clientHeight) < 50;
      if (isAtBottom) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages, isOpen]);

  const styles: Record<string, string> = {
    ['--primary-color']: primaryColor,
  };

  const toggleChat = (open: boolean) => {
    setIsOpen(open);
    if (open && onChatOpen) onChatOpen();
    if (!open && onChatClose) onChatClose();
  };

  return (
    <div
      className={cn(
        "fixed z-50",
        position === "bottom-right" ? "right-4 sm:right-6 md:right-8" : "left-4 sm:left-6 md:left-8",
        "bottom-4 sm:bottom-6 md:bottom-8"
      )}
      style={styles}
    >
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: disableAnimations ? 0 : 0.3 }}
            className="w-full"
          >
            <Card className="w-full sm:w-[500px] md:w-[550px] shadow-2xl border-0 rounded-2xl flex flex-col h-[600px] sm:h-[700px] md:h-[800px] max-h-[90vh]">
              <CardHeader className="p-6 border-b flex flex-col gap-2 bg-[var(--primary-color)] rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-white p-1 shadow-lg">
                      <Image
                        src={logoUrl}
                        alt="HelmetPro Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl text-white">HelmetPro Support</h3>
                      <p className="text-sm text-gray-100">We&apos;re here to help 24/7</p>
                    </div>
                  </div>
                  <Button
                    aria-label="Close chat"
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleChat(false)}
                    className="text-white hover:bg-white/10 rounded-full h-10 w-10"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 flex-grow overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn("flex gap-4", message.role === "user" ? "justify-end" : "justify-start")}
                    >
                      {message.role === "assistant" && (
                        <div className="relative h-10 w-10 flex-shrink-0 rounded-full overflow-hidden mt-1">
                          <Image
                            src={logoUrl}
                            alt="AI Avatar"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl p-5 text-base transition-all",
                          message.role === "user"
                            ? "bg-[var(--primary-color)] text-white rounded-br-none ml-16"
                            : "bg-white text-gray-800 shadow-md rounded-bl-none mr-16"
                        )}
                      >
                        {message.content}
                      </div>
                      {message.role === "user" && (
                        <div className="relative h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 mt-1 flex items-center justify-center shadow-sm">
                          <span className="text-sm font-medium text-gray-600">YP</span>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex items-center gap-4">
                      <div className="relative h-10 w-10 flex-shrink-0 rounded-full overflow-hidden">
                        <Image
                          src={logoUrl}
                          alt="AI Avatar"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="bg-white shadow-md rounded-2xl rounded-bl-none px-5 py-4">
                        <TypingAnimation />
                      </div>
                    </div>
                  )}
                  
                  {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg flex flex-col gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <X className="h-5 w-5" />
                        <span>{error.message || "An unexpected error occurred"}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.reload()}
                        className="mt-2"
                      >
                        Retry
                      </Button>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              <CardFooter className="p-6 bg-white border-t">
                <form
                  onSubmit={handleSubmit}
                  className="flex w-full items-center gap-3"
                >
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="flex-grow rounded-full py-6 shadow-lg hover:shadow-xl transition-shadow border-gray-200 text-base"
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    className="rounded-full h-12 w-12 bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 shadow-xl"
                  >
                    <Send className="h-6 w-6" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: disableAnimations ? 0 : 0.3 }}
          >
            <Button
              onClick={() => toggleChat(true)}
              className="bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white rounded-full py-6 px-8 shadow-2xl flex items-center gap-4"
            >
              <div className="relative h-10 w-10 rounded-full overflow-hidden shadow-sm">
                <Image
                  src={logoUrl}
                  alt="HelmetPro Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-medium text-base whitespace-nowrap">
                Chat with Us
              </span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}