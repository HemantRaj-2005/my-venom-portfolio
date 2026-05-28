"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SymbioteScrollState {
  tendrilReach: number;   // 0 → 1.5 as user scrolls
  cameraZoom: number;     // 8 → 5 as user scrolls
  opacity: number;        // 1 → 0.4 as user scrolls past hero
}

/**
 * Tracks page scroll position and returns normalized animation values
 * for the Venom 3D scene to react to.
 */
export function useSymbioteScroll() {
  const stateRef = useRef<SymbioteScrollState>({
    tendrilReach: 0,
    cameraZoom: 8,
    opacity: 1,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const proxy = { progress: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "30% top",
        scrub: 1.5,
      },
    });

    tl.to(proxy, {
      progress: 1,
      onUpdate: () => {
        const p = proxy.progress;
        stateRef.current.tendrilReach = p * 1.5;
        stateRef.current.cameraZoom = 8 - p * 3;
        stateRef.current.opacity = 1 - p * 0.6;
      },
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return stateRef;
}
