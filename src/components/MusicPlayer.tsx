import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

type Track = "intro" | "celebration";

export function useMusicPlayer(track: Track) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const url = track === "intro" ? "/audio/track1.mp3" : "/audio/track2.mp3";
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.45;
    } else {
      const wasPlaying = !audioRef.current.paused;
      audioRef.current.src = url;
      audioRef.current.load();
      if (wasPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
    setReady(true);
  }, [track]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      a.pause();
      setIsPlaying(false);
    }
  };

  const forcePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    a.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  return { isPlaying, toggle, forcePlay, ready };
}

export function MusicToggle({
  isPlaying,
  toggle,
}: {
  isPlaying: boolean;
  toggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
      className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-lilac shadow-lg shadow-lilac/20 ring-1 ring-lilac/20 backdrop-blur-md transition-transform active:scale-95"
    >
      {isPlaying ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
    </button>
  );
}
