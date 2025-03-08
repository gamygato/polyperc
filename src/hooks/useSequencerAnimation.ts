
import { useRef, useEffect } from 'react';
import { TrackData } from '@/types/sequencer';

interface UseSequencerAnimationProps {
  tracks: TrackData[];
  setTracks: React.Dispatch<React.SetStateAction<TrackData[]>>;
  isPlaying: boolean;
  setRecentlyTriggered: React.Dispatch<React.SetStateAction<number[]>>;
  playSound: (sampleName: any, duration: number, volume: number) => void;
}

export const useSequencerAnimation = ({
  tracks,
  setTracks,
  isPlaying,
  setRecentlyTriggered,
  playSound
}: UseSequencerAnimationProps) => {
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const lastPositionsRef = useRef<{[key: number]: number}>({});
  
  // Animation loop for all tracks
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }
    
    // Initialize last positions on first run
    if (Object.keys(lastPositionsRef.current).length === 0) {
      tracks.forEach(track => {
        lastPositionsRef.current[track.id] = track.position;
      });
    }
    
    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastFrameTimeRef.current;
      lastFrameTimeRef.current = timestamp;
      
      // Skip first frame to get a proper deltaTime
      if (deltaTime === timestamp) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // Smooth delta time to avoid stuttering
      const smoothDeltaTime = Math.min(deltaTime, 50); // Cap at 50ms (20fps minimum)
      
      // Normalized time factor (60fps equivalent)
      const timeFactor = smoothDeltaTime / 16.67;
      
      // Only process tracks that are oscillating
      const activeIds: number[] = [];
      const triggered: number[] = [];
      
      // Muted/soloed tracking
      const hasSoloedTracks = tracks.some(t => t.soloed);
      
      setTracks(prevTracks => 
        prevTracks.map(track => {
          if (!track.oscillating) return track;
          
          // Track is oscillating, calculate new position
          const { id, direction, speed, amplitude } = track;
          
          // Calculate new position based on smooth time and oscillation speed
          // Maps to a smooth sinusoidal motion
          const frequencyFactor = 0.005 * speed * timeFactor;
          const newPosition = 
            direction === 'left-to-right' 
              ? Math.sin(Date.now() * frequencyFactor) * amplitude
              : -Math.sin(Date.now() * frequencyFactor) * amplitude;
          
          // Get the last known position for this track
          const lastPosition = lastPositionsRef.current[id] || 0;
          
          // Detect zero crossing for sound trigger - compare with last position
          // This prevents false triggers when starting/stopping
          const crossedZero = 
            (lastPosition <= 0 && newPosition > 0) || 
            (lastPosition >= 0 && newPosition < 0);
          
          // Update last position reference
          lastPositionsRef.current[id] = newPosition;
          
          // Track the active ids for visual feedback
          activeIds.push(id);
          
          // Trigger sound if crossing the center and not muted
          // Consider solo state for all tracks
          const shouldPlaySound = 
            crossedZero && 
            !track.muted && 
            (!hasSoloedTracks || track.soloed);
          
          if (shouldPlaySound) {
            triggered.push(id);
            
            // Only play if we have the playSound function
            if (playSound) {
              // Play the appropriate sound with attack/decay
              playSound(
                track.sample, 
                track.decay, 
                track.volume
              );
            }
            
            // Update last trigger time
            return {
              ...track,
              position: newPosition,
              lastTriggerTime: Date.now()
            };
          }
          
          // Just update position
          return {
            ...track,
            position: newPosition
          };
        })
      );
      
      // Update the recently triggered tracks for visual feedback
      if (triggered.length > 0) {
        setRecentlyTriggered(triggered);
        
        // Clear triggered state after visual feedback duration
        setTimeout(() => {
          setRecentlyTriggered(prevTriggered => 
            prevTriggered.filter(id => !triggered.includes(id))
          );
        }, 150);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation loop
    animationRef.current = requestAnimationFrame(animate);
    
    // Clean up
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, tracks, setTracks, setRecentlyTriggered, playSound]);
  
  return { animationRef };
};
