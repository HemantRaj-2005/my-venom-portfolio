"use client";

import { useEffect, useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

// Web Audio API Synthesizer Drone Manager
class CyberneticSynth {
  private ctx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private active = false;

  start() {
    if (this.active) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = this.ctx;

      // 1. Create Oscillators for high-tech system hum
      this.osc1 = ctx.createOscillator();
      this.osc1.type = "sine";
      this.osc1.frequency.setValueAtTime(110, ctx.currentTime); // A2 base hum

      this.osc2 = ctx.createOscillator();
      this.osc2.type = "triangle";
      this.osc2.frequency.setValueAtTime(220.5, ctx.currentTime); // A3 octave detuned hum

      // 2. High-tech lowpass filter
      this.filter = ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.frequency.setValueAtTime(320, ctx.currentTime);
      this.filter.Q.setValueAtTime(1.5, ctx.currentTime);

      // 3. Slow pulse LFO for modular scanline breathing texture
      this.lfo = ctx.createOscillator();
      this.lfo.frequency.setValueAtTime(0.2, ctx.currentTime); // 0.2 Hz
      this.lfoGain = ctx.createGain();
      this.lfoGain.gain.setValueAtTime(80, ctx.currentTime); // sweep filter +-80Hz

      // 4. Master Volume
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0, ctx.currentTime); // Start silent

      // 5. Connect node chain
      this.lfo.connect(this.lfoGain);
      if (this.lfoGain && this.filter) {
        this.lfoGain.connect(this.filter.frequency);
      }

      if (this.osc1 && this.osc2 && this.filter && this.masterGain) {
        this.osc1.connect(this.filter);
        this.osc2.connect(this.filter);
        this.filter.connect(this.masterGain);
        this.masterGain.connect(ctx.destination);
      }

      // 6. Start nodes
      this.osc1.start();
      this.osc2.start();
      this.lfo.start();

      // Fade-in ambient drone (set to 0.0 to remain silent in favor of song.mp3)
      this.masterGain.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 3); // 3 seconds fade-in

      this.active = true;
    } catch (e) {
      console.warn("Web Audio API is not supported or blocked by browser policy.", e);
    }
  }

  stop() {
    if (!this.active || !this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    
    // Fade-out ambient drone
    this.masterGain.gain.cancelScheduledValues(ctx.currentTime);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);

    setTimeout(() => {
      try {
        this.osc1?.stop();
        this.osc2?.stop();
        this.lfo?.stop();
        this.ctx?.close();
      } catch (err) {}
      this.active = false;
    }, 450);
  }

  // Play synthetic quick high-frequency cybernetic click on hover
  playHoverClick() {
    if (!this.active || !this.ctx) return;
    const ctx = this.ctx;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.06);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1600, ctx.currentTime);

    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  }

  // Play quick pitch-sliding upward frequency sweep mimicking a "web-shoot" sound
  playBtnClick() {
    if (!this.active || !this.ctx) return;
    const ctx = this.ctx;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2600, ctx.currentTime + 0.11);

    gain.gain.setValueAtTime(0.07, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.13);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.14);
  }
}

export default function SoundToggle() {
  const [muted, setMuted] = useState(true);
  const synthRef = useRef<CyberneticSynth | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize synth and audio once on mount
  useEffect(() => {
    const synth = new CyberneticSynth();
    synthRef.current = synth;

    const audio = new Audio("/song.mp3");
    audio.loop = true;
    audio.volume = 0.35; // 35% volume for ambient background
    audioRef.current = audio;

    return () => {
      synth.stop();
      audio.pause();
    };
  }, []);

  // Update handlers and playback when muted changes
  useEffect(() => {
    const synth = synthRef.current;
    const audio = audioRef.current;
    if (!synth || !audio) return;

    // Set up global sound handlers
    (window as any).playHoverSound = () => {
      if (!muted) synth.playHoverClick();
    };
    (window as any).playClickSound = () => {
      if (!muted) synth.playBtnClick();
    };

    if (!muted) {
      synth.start();
      audio.play().catch((err) => {
        console.warn("Failed to play background audio:", err);
      });
    } else {
      synth.stop();
      audio.pause();
    }

    return () => {
      delete (window as any).playHoverSound;
      delete (window as any).playClickSound;
    };
  }, [muted]);

  const toggleSound = () => {
    setMuted((prev) => !prev);
  };

  return (
    <button
      onClick={toggleSound}
      className="fixed bottom-6 right-6 z-[999] flex items-center justify-center w-12 h-12 rounded-full border border-zinc-800 bg-black/80 text-white backdrop-blur shadow-lg shadow-black/50 transition-all hover:scale-110 hover:border-emerald-500/50 hover:shadow-emerald-500/10 cursor-pointer active:scale-95"
      title={muted ? "Unmute Ambient Theme" : "Mute Ambient Theme"}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {muted ? (
          <VolumeX className="w-5 h-5 text-zinc-500 transition-colors" />
        ) : (
          <>
            <Volume2 className="w-5 h-5 text-emerald-400 transition-colors" />
            <span className="absolute -inset-1 rounded-full border border-emerald-500/30 animate-ping opacity-60 pointer-events-none" />
          </>
        )}
      </div>
    </button>
  );
}
