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

      // 1. Create Oscillators for low drone
      this.osc1 = ctx.createOscillator();
      this.osc1.type = "sawtooth";
      this.osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1 note (bass)

      this.osc2 = ctx.createOscillator();
      this.osc2.type = "triangle";
      this.osc2.frequency.setValueAtTime(110.5, ctx.currentTime); // A2 note detuned

      // 2. Lowpass filter to make it a deep, rumbling atmosphere
      this.filter = ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.frequency.setValueAtTime(150, ctx.currentTime);
      this.filter.Q.setValueAtTime(3, ctx.currentTime);

      // 3. LFO to modulate filter cutoff (creates organic, breathing texture)
      this.lfo = ctx.createOscillator();
      this.lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // 0.12 Hz (very slow pulse)
      this.lfoGain = ctx.createGain();
      this.lfoGain.gain.setValueAtTime(70, ctx.currentTime); // sweep filter +-70Hz

      // 4. Master Volume
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0, ctx.currentTime); // Start silent for fade-in

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

      // Fade-in ambient drone
      this.masterGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 3); // 3 seconds fade-in

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
    this.masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);

    setTimeout(() => {
      try {
        this.osc1?.stop();
        this.osc2?.stop();
        this.lfo?.stop();
        this.ctx?.close();
      } catch (err) {}
      this.active = false;
    }, 550);
  }

  // Play synthetic quick high-frequency cybernetic click on hover
  playHoverClick() {
    if (!this.active || !this.ctx) return;
    const ctx = this.ctx;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(800, ctx.currentTime);

    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  }

  // Play deep bass thud on click
  playBtnClick() {
    if (!this.active || !this.ctx) return;
    const ctx = this.ctx;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(90, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.26);
  }
}

export default function SoundToggle() {
  const [muted, setMuted] = useState(true);
  const synthRef = useRef<CyberneticSynth | null>(null);

  useEffect(() => {
    // Instantiate the synth
    const synth = new CyberneticSynth();
    synthRef.current = synth;

    // Attach global sound handlers so other components can invoke synth sounds
    (window as any).playHoverSound = () => {
      if (!muted) synth.playHoverClick();
    };
    (window as any).playClickSound = () => {
      if (!muted) synth.playBtnClick();
    };

    return () => {
      synth.stop();
      delete (window as any).playHoverSound;
      delete (window as any).playClickSound;
    };
  }, [muted]);

  const toggleSound = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    
    if (synthRef.current) {
      if (!nextMuted) {
        synthRef.current.start();
      } else {
        synthRef.current.stop();
      }
    }
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
