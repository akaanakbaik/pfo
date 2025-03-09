import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface MusicContextType {
  isPlaying: boolean;
  toggleMusic: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);

  useEffect(() => {
    // Check if user previously enabled music
    const musicEnabled = localStorage.getItem("musicEnabled") === "true";
    setIsPlaying(musicEnabled);

    if (musicEnabled) {
      // We won't auto-play because browsers typically block autoplay
      // User needs to interact with the page first
      setAudioInitialized(true);
    }

    // Initialize audio - this needs user interaction to work properly
    const handleUserInteraction = () => {
      if (!audioInitialized) {
        setAudioInitialized(true);
        document.removeEventListener("click", handleUserInteraction);
      }
    };

    document.addEventListener("click", handleUserInteraction);
    return () => {
      document.removeEventListener("click", handleUserInteraction);
    };
  }, []);

  const toggleMusic = () => {
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    localStorage.setItem("musicEnabled", newPlayingState.toString());
  };

  return (
    <MusicContext.Provider value={{ isPlaying, toggleMusic }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic(): MusicContextType {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}
