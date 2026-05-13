"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone } from "lucide-react";

interface DisclaimerModalProps {
  open: boolean;
  onAccept: () => void;
}

export function DisclaimerModal({ open, onAccept }: DisclaimerModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <DialogTitle className="text-lg">Pemberitahuan Penting</DialogTitle>
          <div className="text-left space-y-3 pt-2 text-sm text-muted-foreground">
            <p>
              Layanan chatbot AI ini bersifat sebagai{" "}
              <strong className="text-foreground">PENDUKUNG AWAL</strong> dan{" "}
              <strong className="text-foreground">
                BUKAN PENGGANTI
              </strong>{" "}
              konsultasi dengan tenaga kesehatan mental profesional (psikolog/psikiater).
            </p>

            <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-3">
              <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4 text-destructive" />
                Jika Anda dalam kondisi darurat:
              </p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>📞 Into The Light Indonesia: <strong className="text-foreground">119 ext 8</strong></li>
                <li>📞 LSM Jangan Bunuh Diri: <strong className="text-foreground">021-9696-9293</strong></li>
                <li>📞 Yayasan Pulih: <strong className="text-foreground">021-788-42580</strong></li>
              </ul>
            </div>

            <p className="text-xs">
              Dengan melanjutkan, Anda memahami dan menyetujui bahwa layanan ini bersifat pendukung awal.
            </p>
          </div>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button onClick={onAccept} className="w-full sm:w-auto gap-2 font-semibold">
            Saya Memahami & Melanjutkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
