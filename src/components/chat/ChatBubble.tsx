import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export function ChatBubble({ role, content, timestamp }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex gap-3 max-w-[85%]", isUser ? "ml-auto flex-row-reverse" : "mr-auto")}>
      <Avatar className={cn("h-8 w-8 shrink-0 border-2", isUser ? "border-primary/30" : "border-emerald-500/30")}>
        <AvatarFallback className={cn("text-xs font-semibold", isUser ? "bg-primary/10 text-primary" : "bg-emerald-500/10 text-emerald-600")}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div className={cn("space-y-1", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-md"
              : "bg-card border rounded-tl-md"
          )}
        >
          {/* Render content with line breaks */}
          {content.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i < content.split("\n").length - 1 && <br />}
            </span>
          ))}
        </div>
        {timestamp && (
          <p className={cn("text-[10px] text-muted-foreground px-1", isUser && "text-right")}>
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
}
