import { useEffect, useRef, useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMusic } from "@/context/MusicContext";

// Using memo to optimize renders
const MusicPlayer = memo(function MusicPlayer() {
  const { isPlaying, toggleMusic } = useMusic();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [visualizerActive, setVisualizerActive] = useState(false);

  useEffect(() => {
    // Get or create the audio element
    audioRef.current = document.getElementById("backgroundMusic") as HTMLAudioElement;
    
    if (audioRef.current) {
      // Optimize audio loading
      audioRef.current.preload = "metadata";
      
      // Set up event listeners
      const handleCanPlayThrough = () => setAudioLoaded(true);
      audioRef.current.addEventListener("canplaythrough", handleCanPlayThrough);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener("canplaythrough", handleCanPlayThrough);
        }
      };
    }
  }, []);

  useEffect(() => {
    if (audioRef.current && audioLoaded) {
      if (isPlaying) {
        // Optimize audio playback
        audioRef.current.volume = 0.7; // Start at lower volume
        
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Fade in volume
              let vol = 0.7;
              const interval = setInterval(() => {
                if (vol < 1) {
                  vol += 0.05;
                  if (audioRef.current) audioRef.current.volume = vol > 1 ? 1 : vol;
                } else {
                  clearInterval(interval);
                }
              }, 100);
              
              setVisualizerActive(true);
            })
            .catch((e) => {
              console.error("Failed to play audio:", e);
              // Most common error is autoplay policy - inform user
              if (e.name === "NotAllowedError") {
                console.info("Audio playback was prevented by browser. User interaction required.");
              }
            });
        }
      } else {
        // Fade out before pausing
        let vol = audioRef.current.volume;
        const interval = setInterval(() => {
          if (vol > 0.1) {
            vol -= 0.1;
            if (audioRef.current) audioRef.current.volume = vol;
          } else {
            clearInterval(interval);
            if (audioRef.current) audioRef.current.pause();
          }
        }, 50);
        
        setVisualizerActive(false);
      }
    }
  }, [isPlaying, audioLoaded]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-8 left-8 z-40 transform-gpu" // Using GPU acceleration
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMusic}
          className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg relative overflow-hidden"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {/* Visualizer effect when playing */}
          {visualizerActive && (
            <div className="absolute inset-0 flex items-center justify-center opacity-30 music-visualizer">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          
          <span className="relative z-10">
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
          </span>
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
});

export default MusicPlayer;
