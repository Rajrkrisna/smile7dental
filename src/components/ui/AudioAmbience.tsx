import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

export const AudioAmbience: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  const startAmbience = () => {
    if (audioCtxRef.current) {
      audioCtxRef.current.resume();
      if (masterGainRef.current) {
        masterGainRef.current.gain.linearRampToValueAtTime(0.08, audioCtxRef.current.currentTime + 2);
      }
      setIsPlaying(true);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // Soothing binaural harmonic frequencies (C Major 9 chord: C3, G3, B3, E4, G4)
      const freqs = [130.81, 196.00, 246.94, 329.63, 392.00];

      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Low-pass filter for warmth
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start();
        oscillatorsRef.current.push(osc);
      });

      setIsPlaying(true);
    } catch (e) {
      console.warn("Web Audio API not supported or blocked", e);
    }
  };

  const stopAmbience = () => {
    if (audioCtxRef.current && masterGainRef.current) {
      masterGainRef.current.gain.linearRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 1.5);
      setTimeout(() => {
        audioCtxRef.current?.suspend();
        setIsPlaying(false);
      }, 1500);
    }
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopAmbience();
    } else {
      startAmbience();
    }
  };

  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach((osc) => {
        try { osc.stop(); } catch {}
      });
      audioCtxRef.current?.close();
    };
  }, []);

  return (
    <button
      onClick={toggleSound}
      className={`group fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-2.5 rounded-full border text-xs font-medium tracking-wider uppercase transition-all duration-300 backdrop-blur-md ${
        isPlaying
          ? 'bg-teal-500/20 border-teal-400/50 text-teal-300 shadow-[0_0_20px_rgba(91,188,214,0.3)]'
          : 'bg-navy-900/70 border-slate-700/60 text-slate-300 hover:border-teal-400/40 hover:text-white'
      }`}
      aria-label="Toggle soothing audio landscape"
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-4 h-4 text-teal-300 animate-pulse" />
          <span>Serene Sound: On</span>
          <span className="flex gap-1 items-end h-3 ml-1">
            <span className="w-0.5 h-3 bg-teal-400 animate-[bounce_1s_infinite_100ms]" />
            <span className="w-0.5 h-2 bg-teal-400 animate-[bounce_1s_infinite_300ms]" />
            <span className="w-0.5 h-3.5 bg-teal-400 animate-[bounce_1s_infinite_200ms]" />
          </span>
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4 text-slate-400 group-hover:text-teal-300" />
          <span>Calming Audio: Off</span>
          <Sparkles className="w-3 h-3 text-slate-400 group-hover:text-teal-300" />
        </>
      )}
    </button>
  );
};
