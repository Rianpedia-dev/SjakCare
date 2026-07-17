"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, Square, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface VoiceRecorderProps {
  stream: MediaStream;
  onTranscription: (text: string) => void;
  onCancel: () => void;
  disabled?: boolean;
}

export function VoiceRecorder({
  stream,
  onTranscription,
  onCancel,
  disabled = false,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(true);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      streamRef.current = stream;

      let selectedMimeType = "";
      const mimeTypesToCheck = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/ogg",
        "audio/mp4",
        "audio/aac",
      ];

      for (const mimeType of mimeTypesToCheck) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }

      const recorderOptions: MediaRecorderOptions = {};
      if (selectedMimeType) {
        recorderOptions.mimeType = selectedMimeType;
      }

      const mediaRecorder = new MediaRecorder(stream, recorderOptions);

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        const audioBlob = new Blob(chunksRef.current, { type: selectedMimeType || "audio/webm" });

        if (audioBlob.size < 500) {
          setError("Rekaman terlalu pendek. Coba lagi.");
          setIsRecording(false);
          return;
        }

        // Send to STT API
        setIsTranscribing(true);
        try {
          const formData = new FormData();
          formData.append("audio", audioBlob, "recording.webm");

          const response = await fetch("/api/speech-to-text", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || `HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          if (data.text && data.text.trim()) {
            onTranscription(data.text.trim());
          } else {
            throw new Error("Tidak dapat mendeteksi suara. Coba bicara lebih jelas.");
          }
        } catch (err: any) {
          console.error("STT Error:", err);
          setError(err.message || "Gagal memproses suara. Silakan coba lagi.");
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(250); // Collect data every 250ms
      setIsRecording(true);
      setDuration(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Mic Error:", err);
      setError(
        "Tidak dapat mengakses mikrofon. Pastikan izin mikrofon sudah diberikan."
      );
      setIsRecording(false);
    }
  }, [stream, onTranscription]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  const cancelRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      // Remove onstop handler to prevent transcription
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsRecording(false);
    setDuration(0);
    onCancel();
  }, [onCancel]);

  // Start recording once on mount
  useEffect(() => {
    startRecording();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup timer & media recorder on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.onstop = null; // Buang handler agar tidak memicu transkripsi ganda saat unmount
        if (mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
        }
      }
    };
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Transcribing state
  if (isTranscribing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl bg-primary/5 border border-primary/20"
      >
        <Loader2 className="h-5 w-5 text-primary animate-spin" />
        <span className="text-sm font-medium text-primary">
          Mengubah suara menjadi teks...
        </span>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-between gap-3 w-full px-4 py-3 rounded-2xl bg-destructive/5 border border-destructive/20"
      >
        <span className="text-sm text-destructive">{error}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full shrink-0"
          onClick={() => {
            setError(null);
            onCancel();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </motion.div>
    );
  }

  // Recording state
  if (isRecording) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 w-full"
      >
        {/* Cancel button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full shrink-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
          onClick={cancelRecording}
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Recording indicator */}
        <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-destructive/5 border border-destructive/20">
          {/* Pulsing red dot */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="h-3 w-3 rounded-full bg-red-500 shrink-0"
          />

          {/* Waveform animation */}
          <div className="flex items-center gap-[3px] flex-1">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: [4, Math.random() * 16 + 8, 4],
                }}
                transition={{
                  duration: 0.6 + Math.random() * 0.4,
                  repeat: Infinity,
                  delay: i * 0.05,
                }}
                className="w-[3px] rounded-full bg-red-400/60"
                style={{ minHeight: 4 }}
              />
            ))}
          </div>

          {/* Duration */}
          <span className="text-sm font-mono font-medium text-destructive tabular-nums shrink-0">
            {formatDuration(duration)}
          </span>
        </div>

        {/* Stop button */}
        <Button
          size="icon"
          className="h-12 w-12 rounded-2xl shrink-0 bg-destructive hover:bg-destructive/90 shadow-lg shadow-destructive/20 active:scale-95 transition-all"
          onClick={stopRecording}
        >
          <Square className="h-5 w-5 fill-current" />
        </Button>
      </motion.div>
    );
  }

  // Default: mic button (not recording)
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={disabled}
      className={cn(
        "h-12 w-12 rounded-2xl shrink-0 text-muted-foreground",
        "hover:text-primary hover:bg-primary/10 transition-all active:scale-95"
      )}
      onClick={startRecording}
    >
      <Mic className="h-5 w-5" />
    </Button>
  );
}
