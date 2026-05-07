"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, isLoading = false, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 128)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || isLoading || disabled) return;
    onSend(trimmed);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t bg-card/50 backdrop-blur-sm p-4 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <form onSubmit={handleSubmit} className="relative z-10">
        <div className="flex items-end gap-3 max-w-3xl mx-auto">
          <div className="relative flex-1 group">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ceritakan apa yang kamu rasakan..."
              disabled={isLoading || disabled}
              className={cn(
                "min-h-[48px] max-h-32 resize-none rounded-2xl border-border/50 bg-background/50",
                "focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all duration-200 px-4 py-3",
                "placeholder:text-muted-foreground/50 text-sm leading-relaxed"
              )}
              rows={1}
            />
            <div className="absolute right-3 bottom-2.5 opacity-0 group-focus-within:opacity-100 transition-opacity">
              <Sparkles className="h-3.5 w-3.5 text-primary/40" />
            </div>
          </div>
          
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim() || isLoading || disabled}
            className={cn(
              "h-12 w-12 rounded-2xl shrink-0 shadow-lg shadow-primary/10 transition-all active:scale-95",
              message.trim() ? "bg-primary" : "bg-muted text-muted-foreground"
            )}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                >
                  <Loader2 className="h-5 w-5 animate-spin" />
                </motion.div>
              ) : (
                <motion.div
                  key="send"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <SendHorizontal className={cn("h-5 w-5", message.trim() && "animate-in fade-in zoom-in duration-300")} />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] text-muted-foreground/60 text-center mt-3 font-medium tracking-wide"
        >
          SjakCare AI dirancang untuk mendukungmu. <span className="text-primary/60">Privasi dan kenyamananmu adalah prioritas kami.</span>
        </motion.p>
      </form>
    </div>
  );
}
