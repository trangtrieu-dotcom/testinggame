import { useCallback, useMemo } from 'react';
import { Tool } from '../types/game';

export const useSoundEffects = (volume: number = 0.5) => {
  // Pre-load audio files for better performance
  const audioFiles = useMemo(() => ({
    hammer: new Audio('public/asset/soundeffect/hammer.wav'),
    gun: new Audio('public/asset/soundeffect/gun.mp3'),
    flamethrower: new Audio('public/asset/soundeffect/flamethrower.mp3'),
    laser: new Audio('public/asset/soundeffect/laser.mp3'),
    bomb: new Audio('public/asset/soundeffect/bomb.mp3'),
    chainsaw: new Audio('public/asset/soundeffect/chainsaw.wav'),
  }), []);

  // Store currently playing audio for each tool
  const playingAudio = useMemo(() => new Map<Tool, HTMLAudioElement>(), []);

  const startSound = useCallback((tool: Tool) => {
    const audio = audioFiles[tool];
    
    if (audio) {
      // Stop any currently playing audio for this tool
      const currentlyPlaying = playingAudio.get(tool);
      if (currentlyPlaying) {
        currentlyPlaying.pause();
        currentlyPlaying.currentTime = 0;
      }

      // Create a new audio instance for continuous playback
      const newAudio = new Audio(audio.src);
      newAudio.volume = 0.5;
      newAudio.loop = true; // Enable looping for continuous playback
      
      // Store the playing audio
      playingAudio.set(tool, newAudio);
      
      // Play the sound
      newAudio.play().catch(error => {
        console.warn('Failed to play sound:', error);
      });
    }
  }, [audioFiles, playingAudio]);

  const stopSound = useCallback((tool: Tool) => {
    const audio = playingAudio.get(tool);
    
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.loop = false;
      playingAudio.delete(tool);
    }
  }, [playingAudio]);

  // Legacy function for backward compatibility (plays sound once)
  const playSound = useCallback((tool: Tool) => {
    const audio = audioFiles[tool];
    
    if (audio) {
      // Reset audio to beginning if it's already playing
      audio.currentTime = 0;
      
      // Set volume to a reasonable level
      audio.volume = 0.5;
      
      // Play the sound
      audio.play().catch(error => {
        console.warn('Failed to play sound:', error);
      });
    }
  }, [audioFiles]);

  return { startSound, stopSound, playSound };
};