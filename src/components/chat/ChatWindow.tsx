"use client";

import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatBubble } from "./ChatBubble";
import { Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/lib/auth/auth-client";
import Image from "next/image";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  audioUrl?: string;
  isVoiceMessage?: boolean;
}

interface ChatWindowProps {
  messages: Message[];
  isLoading?: boolean;
}

export function ChatWindow({ messages, isLoading = false }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  useEffect(() => {
    // Scroll to bottom when messages or loading state changes
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-radial-gradient h-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-sm space-y-4"
        >
          <div className="mx-auto h-20 w-20 rounded-3xl bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center shadow-inner overflow-hidden">
            <Image 
              src="/karakter-ai.png" 
              alt="SjakCare AI Logo" 
              width={64} 
              height={64} 
              className="object-contain animate-pulse"
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-2xl tracking-tight">Halo! Saya SjakCare AI 👋</h3>
            <p className="text-sm text-muted-foreground leading-relaxed px-4">
              Saya di sini untuk mendengarkan tanpa menghakimi. Ceritakan apa pun yang sedang membebani pikiranmu hari ini.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {["Saya merasa stres tugas", "Sulit tidur akhir-akhir ini", "Butuh teman bicara"].map((text) => (
              <span key={text} className="text-xs px-3 py-1.5 rounded-full border bg-background/50 text-muted-foreground cursor-default hover:bg-primary/5 hover:text-primary transition-colors">
                {text}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 relative h-full">
      <ScrollArea className="h-full w-full">
        <div className="space-y-6 max-w-3xl mx-auto px-4 py-8 pb-12">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
                timestamp={msg.timestamp}
                audioUrl={msg.audioUrl}
                isVoiceMessage={msg.isVoiceMessage}
                userImage={session?.user?.image || undefined}
              />
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex gap-3 mr-auto max-w-[85%]"
              >
                <div className="h-11 w-11 rounded-full border-2 border-emerald-500/20 flex items-center justify-center shrink-0 overflow-hidden bg-emerald-500/5">
                  <Image 
                    src="/karakter-ai.png" 
                    alt="SjakCare AI Avatar" 
                    width={44} 
                    height={44} 
                    className="object-cover h-full w-full"
                  />
                </div>
                <div className="bg-card border border-border/50 rounded-2xl rounded-tl-none px-5 py-3 shadow-sm flex items-center gap-2">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ 
                          duration: 0.6, 
                          repeat: Infinity, 
                          delay: i * 0.15 
                        }}
                        className="h-1.5 w-1.5 rounded-full bg-emerald-500/40"
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground/70 ml-1">SjakCare sedang berpikir...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} className="h-2" />
        </div>
      </ScrollArea>
    </div>
  );
}
