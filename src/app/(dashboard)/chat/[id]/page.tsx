"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatInput } from "@/components/chat/ChatInput";
import { DisclaimerModal } from "@/components/chat/DisclaimerModal";
import { MessageSquare } from "lucide-react";

export default function ChatSessionPage() {
  const params = useParams();
  const sessionId = params.id as string;
  
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    const hasAcceptedDisclaimer = localStorage.getItem("sjakcare_disclaimer_accepted");
    if (!hasAcceptedDisclaimer) {
      setShowDisclaimer(true);
    }
    
    if (sessionId !== "new") {
      // Fetch real messages
      fetch(`/api/chat/${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.messages) {
            setMessages(data.messages.map((m: any) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            })));
          }
        })
        .catch(console.error);
    }
  }, [sessionId]);

  const handleAcceptDisclaimer = () => {
    localStorage.setItem("sjakcare_disclaimer_accepted", "true");
    setShowDisclaimer(false);
  };

  const handleSendMessage = async (content: string) => {
    const newUserMsg = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      let activeSessionId = sessionId;
      
      // Jika sesi baru, buat dulu di database
      if (activeSessionId === "new") {
        const createRes = await fetch("/api/chat/new", {
          method: "POST",
          body: JSON.stringify({ title: content.substring(0, 30) + "..." })
        });
        const createData = await createRes.json();
        
        if (createData.id) {
          activeSessionId = createData.id;
          // Update URL tanpa reload
          window.history.replaceState(null, "", `/chat/${activeSessionId}`);
        }
      }

      // Kirim pesan ke API OpenRouter via backend kita
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultationId: activeSessionId,
          userMessage: content
        })
      });
      
      const data = await response.json();

      if (data.response) {
        const newAiMsg = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newAiMsg]);
      }
    } catch(err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header session */}
      <div className="h-14 border-b bg-background/95 flex items-center px-4 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Sesi: {sessionId === "new" ? "Sesi Baru" : "Konsultasi Berjalan"}</h3>
            <p className="text-[10px] text-muted-foreground">SjakCare AI siap mendengarkan</p>
          </div>
        </div>
      </div>

      <ChatWindow messages={messages} isLoading={isLoading} />
      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      
      <DisclaimerModal open={showDisclaimer} onAccept={handleAcceptDisclaimer} />
    </>
  );
}
