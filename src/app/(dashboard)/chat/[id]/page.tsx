"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatInput } from "@/components/chat/ChatInput";
import { DisclaimerModal } from "@/components/chat/DisclaimerModal";
import { toast } from "sonner";

export default function ChatSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  const prevSessionIdRef = useRef<string>(sessionId);
  
  const [currentSessionId, setCurrentSessionId] = useState(sessionId);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // Sync currentSessionId when URL params change (e.g. from sidebar clicks)
  useEffect(() => {
    setCurrentSessionId(sessionId);
  }, [sessionId]);

  // Efek untuk memuat data sesi
  useEffect(() => {
    // Reset jika pindah antar sesi yang berbeda (bukan transisi dari 'new')
    if (prevSessionIdRef.current !== sessionId) {
      if (prevSessionIdRef.current !== "new" || sessionId === "new") {
        setMessages([]);
      }
      prevSessionIdRef.current = sessionId;
    }

    const hasAcceptedDisclaimer = localStorage.getItem("sjakcare_disclaimer_accepted");
    if (!hasAcceptedDisclaimer) {
      setShowDisclaimer(true);
    }
    
    if (sessionId && sessionId !== "new" && messages.length === 0) {
      setIsLoading(true);
      fetch(`/api/chat/${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.messages && data.messages.length > 0) {
            setMessages(data.messages.map((m: any) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            })));
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [sessionId]);

  const handleAcceptDisclaimer = () => {
    localStorage.setItem("sjakcare_disclaimer_accepted", "true");
    setShowDisclaimer(false);
  };

  /**
   * Mengubah teks AI menjadi audio menggunakan ElevenLabs TTS
   */
  const convertToSpeech = async (text: string): Promise<string | null> => {
    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("TTS Error:", response.status, errorData?.error || "");
        return null;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      return audioUrl;
    } catch (err) {
      console.error("TTS Exception:", err);
      return null;
    }
  };

  const handleSendMessage = async (content: string, isVoice: boolean = false) => {
    if (!content.trim() || isLoading) return;

    const newUserMsg = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVoiceMessage: isVoice,
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      let activeSessionId = currentSessionId;
      let isFirstMessage = false;
      
      // 1. Jika sesi baru, buat dulu di database
      if (activeSessionId === "new") {
        isFirstMessage = true;
        const createRes = await fetch("/api/chat/new", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            title: content.substring(0, 30) + (content.length > 30 ? "..." : "") 
          })
        });
        const createData = await createRes.json();
        
        if (createData.id) {
          activeSessionId = createData.id;
          setCurrentSessionId(activeSessionId);
        } else {
          throw new Error("Gagal membuat sesi chat");
        }
      }

      // 2. Kirim pesan ke API AI
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
        const newAiMsg: any = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isVoiceMessage: isVoice,
        };
        
        setMessages(prev => [...prev, newAiMsg]);
        setIsLoading(false);

        // 3. Jika pesan dari voice, konversi jawaban AI menjadi audio
        if (isVoice) {
          const audioUrl = await convertToSpeech(data.response);
          if (audioUrl) {
            // Update pesan AI terakhir dengan audioUrl
            setMessages(prev => 
              prev.map(msg => 
                msg.id === newAiMsg.id 
                  ? { ...msg, audioUrl } 
                  : msg
              )
            );
          } else {
            // Fallback: Jika konversi suara gagal (misal kuota habis), tampilkan kembali teks jawaban AI
            setMessages(prev => 
              prev.map(msg => 
                msg.id === newAiMsg.id 
                  ? { ...msg, isVoiceMessage: false } 
                  : msg
              )
            );
            toast.error("Gagal memuat jawaban suara karena kuota ElevenLabs habis atau terjadi gangguan. Menampilkan respon teks saja.");
          }
        }

        // 4. Update URL ke ID sesi asli SETELAH pesan tampil di UI
        // Ini mencegah hilangnya state karena navigasi saat proses sedang berjalan
        if (isFirstMessage) {
          prevSessionIdRef.current = activeSessionId;
          window.history.replaceState(null, '', `/chat/${activeSessionId}`);
        }
      } else {
        throw new Error(data.error || "Gagal mendapatkan respon AI");
      }
    } catch(err) {
      console.error("Chat Error:", err);
      setMessages(prev => [...prev, {
        id: "error-" + Date.now(),
        role: "assistant",
        content: "Maaf, sepertinya ada gangguan teknis. Bisa tolong kirim ulang pesanmu?",
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 relative h-full">
      <ChatWindow messages={messages} isLoading={isLoading} />
      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      <DisclaimerModal open={showDisclaimer} onAccept={handleAcceptDisclaimer} />
    </div>
  );
}
