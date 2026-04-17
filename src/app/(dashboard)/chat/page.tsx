import { Bot } from "lucide-react";

export default function ChatIndexPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-accent/5">
      <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-sm">
        <Bot className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-xl font-bold mb-2">Konsultasi AI SjakCare</h2>
      <p className="text-center text-muted-foreground max-w-sm mb-6">
        Pilih sesi di sidebar untuk melanjutkan percakapan, atau mulai sesi baru untuk membicarakan topik yang berbeda.
      </p>
    </div>
  );
}
