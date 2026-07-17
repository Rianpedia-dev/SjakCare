import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { chatService } from "@/lib/services/ChatService";
import { redirect } from "next/navigation";
import { DeleteSessionButton } from "@/components/history/DeleteSessionButton";
import { DeleteAllSessionsButton } from "@/components/history/DeleteAllSessionsButton";

export default async function HistoryPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
    redirect("/login");
  }

  const history = await chatService.getSessions(session.user.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold">Riwayat Konsultasi</h1>
          <p className="text-muted-foreground">Lihat kembali percakapan sebelumnya dengan SjakCare AI.</p>
        </div>
        {history.length > 0 && <DeleteAllSessionsButton />}
      </div>

      <div className="space-y-4 pt-2">
        {history.map((session) => (
          <Link key={session.id} href={`/chat/${session.id}`} className="block block-out">
            <Card className="hover:border-primary/50 hover:bg-accent/30 transition-all duration-200">
              <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between sm:justify-start gap-3">
                    <h3 className="font-semibold text-lg text-primary">{session.title}</h3>
                    <Badge variant="secondary" className="font-normal text-[10px] uppercase tracking-wider">
                      Konsultasi AI
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {new Date(session.updatedAt).toLocaleDateString("id-ID")}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="h-3 w-3" />
                      {new Date(session.updatedAt).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DeleteSessionButton sessionId={session.id} />
                  <div className="hidden sm:flex h-10 w-10 rounded-full bg-primary/10 items-center justify-center shrink-0">
                    <ChevronRight className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {history.length === 0 && (
          <div className="text-center p-12 border rounded-xl border-dashed">
            <MessageSquare className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-muted-foreground">Belum ada riwayat konsultasi</h3>
            <p className="text-sm text-muted-foreground mt-1">Mulai sesi konsultasi pertamamu sekarang.</p>
          </div>
        )}
      </div>
    </div>
  );
}
