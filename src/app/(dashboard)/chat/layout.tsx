import { ChatSidebar } from "@/components/chat/ChatSidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-[500px] bg-background/50 border lg:border lg:rounded-2xl overflow-hidden shadow-2xl shadow-primary/5 transition-all relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(16,185,129,0.05),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

      <ChatSidebar />
      
      <div className="flex-1 flex flex-col min-w-0 bg-background/40 backdrop-blur-[2px] relative z-10 overflow-hidden">
        {/* ChatHeader dihapus sesuai permintaan untuk tampilan full room chat */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
