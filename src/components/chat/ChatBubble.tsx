"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export function ChatBubble({ role, content, timestamp }: ChatBubbleProps) {
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
          "h-9 w-9 shrink-0 border-2 transition-transform group-hover:scale-105",
          isUser 
            ? "border-primary/20 bg-primary/5" 
            : "border-emerald-500/20 bg-emerald-500/5"
        )}
      >
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
        <div
          className={cn(
            "relative rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm transition-all",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-none"
              : "bg-card border border-border/50 rounded-tl-none hover:border-border"
          )}
        >
          <div className={cn(
            "prose prose-sm max-w-none dark:prose-invert",
            isUser ? "prose-p:text-primary-foreground" : "prose-p:text-foreground"
          )}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        </div>
        
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
