"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VoicePlayerProps {
  audioUrl: string;
  className?: string;
  autoPlay?: boolean;
}

export function VoicePlayer({ audioUrl, className, autoPlay = false }: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      const currentProgress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress);

      if (!audioRef.current.paused) {
        animationRef.current = requestAnimationFrame(updateProgress);
      }
    }
  }, []);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
      setIsLoaded(true);
      if (autoPlay) {
        audio.play()
          .then(() => {
            setIsPlaying(true);
            animationRef.current = requestAnimationFrame(updateProgress);
          })
          .catch((err) => {
            console.warn("Autoplay diblokir oleh browser:", err);
          });
      }
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setProgress(0);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    });

    audio.addEventListener("error", () => {
      console.error("Audio load error");
      setIsLoaded(false);
    });

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    };
  }, [audioUrl, autoPlay, updateProgress]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !isLoaded) return;

    if (isPlaying) {
      audioRef.current.pause();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    } else {
      audioRef.current.play();
      animationRef.current = requestAnimationFrame(updateProgress);
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, isLoaded, updateProgress]);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!audioRef.current || !isLoaded) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    },
    [isLoaded]
  );

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/15 min-w-[200px] max-w-[280px]",
        className
      )}
    >
      {/* Play/Pause button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 rounded-full shrink-0 transition-all",
          isPlaying
            ? "bg-emerald-500 text-white hover:bg-emerald-600"
            : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
        )}
        onClick={togglePlay}
        disabled={!isLoaded}
      >
        {isPlaying ? (
          <Pause className="h-3.5 w-3.5 fill-current" />
        ) : (
          <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
        )}
      </Button>

      {/* Waveform / Progress area */}
      <div className="flex-1 flex flex-col gap-1">
        {/* Progress bar with waveform style */}
        <div
          className="relative h-6 flex items-center gap-[2px] cursor-pointer"
          onClick={handleProgressClick}
        >
          {Array.from({ length: 28 }).map((_, i) => {
            const barProgress = (i / 28) * 100;
            const isActive = barProgress <= progress;
            // Create a pseudo-random height pattern for waveform look
            const heights = [6, 10, 14, 8, 16, 12, 10, 18, 8, 14, 6, 12, 16, 10, 8, 14, 18, 6, 12, 10, 14, 8, 16, 12, 10, 6, 14, 8];
            const height = heights[i % heights.length];

            return (
              <motion.div
                key={i}
                className={cn(
                  "w-[3px] rounded-full transition-colors duration-150",
                  isActive ? "bg-emerald-500" : "bg-emerald-500/20"
                )}
                style={{ height }}
                animate={
                  isPlaying && isActive
                    ? {
                        scaleY: [1, 1.2, 0.8, 1],
                      }
                    : { scaleY: 1 }
                }
                transition={{
                  duration: 0.5,
                  repeat: isPlaying ? Infinity : 0,
                  delay: i * 0.02,
                }}
              />
            );
          })}
        </div>

        {/* Duration */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-muted-foreground/70 tabular-nums">
            {isPlaying
              ? formatTime(audioRef.current?.currentTime || 0)
              : "0:00"}
          </span>
          <div className="flex items-center gap-1">
            <Volume2 className="h-2.5 w-2.5 text-emerald-500/50" />
            <span className="text-[10px] font-mono text-muted-foreground/70 tabular-nums">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
