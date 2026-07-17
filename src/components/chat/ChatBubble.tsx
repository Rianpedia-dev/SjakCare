"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User, Mic, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { VoicePlayer } from "./VoicePlayer";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  audioUrl?: string;
  isVoiceMessage?: boolean;
  userImage?: string;
}

export function ChatBubble({ role, content, timestamp, audioUrl, isVoiceMessage, userImage }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex gap-3 max-w-[85%] group",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      <Avatar
        className={cn(
          "h-11 w-11 shrink-0 border-2 transition-transform group-hover:scale-105",
          isUser 
            ? "border-primary/20 bg-primary/5" 
            : "border-emerald-500/20 bg-emerald-500/5"
        )}
      >
        {isUser ? (
          userImage && <AvatarImage src={userImage} className="object-cover" />
        ) : (
          <AvatarImage src="/karakter-ai.png" className="object-cover" />
        )}
        <AvatarFallback 
          className={cn(
            "text-xs font-semibold",
            isUser ? "text-primary" : "text-emerald-600"
          )}
        >
          {isUser ? <User className="h-4.5 w-4.5" /> : <Bot className="h-4.5 w-4.5" />}
        </AvatarFallback>
      </Avatar>

      <div className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
        {!isUser && isVoiceMessage ? (
          // Mode pesan suara asisten (Teks disembunyikan)
          audioUrl ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <VoicePlayer audioUrl={audioUrl} autoPlay={true} />
            </motion.div>
          ) : (
            // Indikator memuat suara (TTS sedang diproses)
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2.5 px-4 py-3 rounded-2xl rounded-tl-none bg-card border border-border/50 shadow-sm text-xs font-medium text-muted-foreground"
            >
              <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
              <span>Mempersiapkan jawaban suara...</span>
            </motion.div>
          )
        ) : (
          // Mode pesan teks normal
          <>
            <div
              className={cn(
                "relative rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm transition-all",
                isUser
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : "bg-card border border-border/50 rounded-tl-none hover:border-border"
              )}
            >
              {/* Voice message indicator for user messages */}
              {isUser && isVoiceMessage && (
                <div className={cn(
                  "flex items-center gap-1.5 mb-1 text-[11px] font-medium",
                  "text-primary-foreground/70"
                )}>
                  <Mic className="h-3 w-3" />
                  <span>Pesan Suara</span>
                </div>
              )}

              <div className={cn(
                "prose prose-sm max-w-none dark:prose-invert",
                isUser ? "prose-p:text-primary-foreground" : "prose-p:text-foreground"
              )}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </div>
            </div>

            {/* Voice player for assistant messages with audio (hanya jika teks normal tapi memiliki audio) */}
            {!isUser && audioUrl && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <VoicePlayer audioUrl={audioUrl} />
              </motion.div>
            )}
          </>
        )}
        
        {timestamp && (
          <span className={cn(
            "text-[10px] font-medium text-muted-foreground/60 px-1 opacity-0 group-hover:opacity-100 transition-opacity",
            isUser && "text-right"
          )}>
            {timestamp}
          </span>
        )}
      </div>
    </motion.div>
  );
}
