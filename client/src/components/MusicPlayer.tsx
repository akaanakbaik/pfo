import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Get audio element
    audioRef.current = document.getElementById('background-music') as HTMLAudioElement;
    
    if (audioRef.current) {
      // Set up event listeners
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('ended', handleEnded);
      audioRef.current.volume = volume;
      
      // Create canvas for visualizer
      const container = document.getElementById('music-container');
      if (container) {
        const canvas = document.createElement('canvas');
        canvas.id = 'audio-visualizer';
        canvas.className = 'hidden md:block';
        canvas.width = 120;
        canvas.height = 30;
        canvas.style.margin = '0 auto';
        container.appendChild(canvas);
        canvasRef.current = canvas;
      }
    }
    
    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      const container = document.getElementById('music-container');
      const canvas = document.getElementById('audio-visualizer');
      if (container && canvas) {
        container.removeChild(canvas);
      }
    };
  }, []);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoaded(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    stopVisualization();
  };

  const toggleMusic = () => {
    if (!audioRef.current || !isLoaded) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      stopVisualization();
    } else {
      audioRef.current.play().then(() => {
        initializeAudioContext();
        startVisualization();
      }).catch(error => {
        console.error('Error playing audio:', error);
      });
    }
    
    setIsPlaying(!isPlaying);
  };

  const initializeAudioContext = () => {
    if (!audioContextRef.current && audioRef.current) {
      // Create audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      // Create analyser
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      // Connect audio element to analyser
      const source = audioContextRef.current.createMediaElementSource(audioRef.current);
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
  };

  const startVisualization = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      if (!analyserRef.current || !ctx) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw visualizer
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
        
        // Gold gradient based on frequency
        const hue = (i / bufferLength) * 25 + 45; // Range around gold (45-70)
        ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
        
        ctx.beginPath();
        ctx.roundRect(x, canvas.height - barHeight, barWidth - 1, barHeight, 2);
        ctx.fill();
        
        x += barWidth + 1;
        if (x > canvas.width) break;
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
  };

  const stopVisualization = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div id="music-container" className="group relative flex flex-col items-center space-y-2 rounded-lg p-2 transition-all duration-300">
      <div className="flex items-center justify-center space-x-3">
        <motion.button 
          className="relative w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-colors duration-300 z-10"
          onClick={toggleMusic}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setShowVolumeControl(true)}
          title={isPlaying ? "Pause music" : "Play music"}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/5"
            animate={{ 
              scale: isPlaying ? [1, 1.2, 1] : 1, 
              opacity: isPlaying ? [0.5, 0, 0.5] : 0.5 
            }}
            transition={{ 
              repeat: isPlaying ? Infinity : 0, 
              duration: 2
            }}
          />
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.i 
                key="volume-up"
                className="fas fa-volume-up text-primary"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 45 }}
                transition={{ type: "spring", damping: 10, stiffness: 200 }}
              />
            ) : (
              <motion.i 
                key="volume-mute"
                className="fas fa-volume-mute text-primary"
                initial={{ scale: 0, rotate: 45 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -45 }}
                transition={{ type: "spring", damping: 10, stiffness: 200 }}
              />
            )}
          </AnimatePresence>
        </motion.button>
        
        {/* Volume slider - appears on hover */}
        <AnimatePresence>
          {showVolumeControl && (
            <motion.div 
              className="absolute top-0 left-full pt-2 pl-2 z-20"
              initial={{ opacity: 0, x: -10, width: 0 }}
              animate={{ opacity: 1, x: 0, width: "auto" }}
              exit={{ opacity: 0, x: -10, width: 0 }}
              transition={{ duration: 0.2 }}
              onMouseLeave={() => setShowVolumeControl(false)}
            >
              <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-border rounded-full shadow-lg px-3 py-2">
                <i className="fas fa-volume-down text-xs text-muted-foreground"></i>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05" 
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-primary h-1 rounded-full"
                />
                <i className="fas fa-volume-up text-xs text-muted-foreground"></i>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isPlaying && (
          <motion.div 
            className="text-xs text-muted-foreground hidden md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </motion.div>
        )}
      </div>
      
      {/* Canvas will be inserted here by useEffect */}
      <motion.div 
        className="w-full h-8 flex items-center justify-center"
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isPlaying ? 1 : 0,
          height: isPlaying ? 30 : 0
        }}
        transition={{ duration: 0.3 }}
      />
      
      {isPlaying && (
        <motion.div 
          className="text-xs text-primary/60 text-center mt-1 hidden md:block"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <span className="italic">♪ Now Playing: Aka's Theme ♪</span>
        </motion.div>
      )}
    </div>
  );
};

export default MusicPlayer;
