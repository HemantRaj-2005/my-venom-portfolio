"use client";

import React, { useRef, useMemo, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshDistortMaterial,
  MeshTransmissionMaterial,
  Stars,
  Line as DreiLine,
} from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { useSymbioteScroll } from "@/hooks/useSymbioteScroll";

// BlendFunction enum values from postprocessing
const BlendFunction = { NORMAL: 27 as const, SCREEN: 35 as const } as const;

// ─── GLSL Shaders for Holographic Glitch Portal ──────────────────────────────────────────

const SIMPLEX_NOISE_GLSL = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

const HOLOGRAPHIC_VERTEX = /* glsl */ `
  ${SIMPLEX_NOISE_GLSL}
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vNoise;

  void main() {
    vNormal = normal;
    vPosition = position;
    
    // Wave deformation
    float noiseVal = snoise(position * 2.0 + vec3(0.0, uTime * 1.5, 0.0)) * 0.12;
    vNoise = noiseVal;
    
    // Add glitchy jitter
    float glitch = step(0.98, sin(uTime * 10.0)) * snoise(position * 20.0) * 0.08;
    vec3 displaced = position + normal * (noiseVal + glitch);
    
    // Attract slightly to mouse coordinates
    vec3 mouseTarget = vec3(uMouse.x * 1.5, uMouse.y * 1.5, 0.0);
    float dist = distance(displaced, mouseTarget);
    if (dist < 3.0) {
      displaced += normalize(mouseTarget - displaced) * (1.0 - dist / 3.0) * 0.25;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const HOLOGRAPHIC_FRAGMENT = /* glsl */ `
  uniform float uTime;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vNoise;

  void main() {
    vec3 normalNormalized = normalize(vNormal);
    
    // Dynamic scanlines
    float scanline = sin(vPosition.y * 35.0 - uTime * 8.0) * 0.5 + 0.5;
    
    // Glitch flash overlay
    float flash = step(0.95, sin(uTime * 15.0)) * 0.3;
    
    // Fresnel edge highlight for sci-fi HUD look
    float edge = 1.0 - max(dot(normalNormalized, vec3(0.0, 0.0, 1.0)), 0.0);
    edge = pow(edge, 3.0);

    // Mix Spider-Man Red (#E11D2E) and Electric Cyan (#00E5FF)
    vec3 colorRed = vec3(0.88, 0.11, 0.18);
    vec3 colorCyan = vec3(0.0, 0.9, 1.0);
    vec3 colorWhite = vec3(1.0, 1.0, 1.0);

    float colorMix = sin(vPosition.x * 3.0 + uTime * 3.0) * 0.5 + 0.5;
    vec3 baseColor = mix(colorRed, colorCyan, colorMix);
    
    // Blend components
    vec3 finalColor = baseColor * (0.4 + scanline * 0.4 + edge * 0.7);
    finalColor += colorWhite * flash; // add glitch white sparks

    gl_FragColor = vec4(finalColor, 0.7 + edge * 0.3);
  }
`;

// Swirling digital spark particles vertex shader
const SPARKS_VERTEX = /* glsl */ `
  ${SIMPLEX_NOISE_GLSL}
  uniform float uTime;
  attribute float aOffset;
  attribute float aSize;
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec3 pos = position;
    
    // Swirling motion
    float angle = uTime * 0.3 + aOffset;
    float dist = length(pos.xz);
    pos.x = cos(angle) * dist + snoise(vec3(pos.x * 0.2, uTime * 0.1, aOffset)) * 0.5;
    pos.z = sin(angle) * dist + snoise(vec3(aOffset, uTime * 0.1, pos.z * 0.2)) * 0.5;
    pos.y += mod(uTime * 0.3 + aOffset, 6.0) - 3.0;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;

    gl_PointSize = aSize * (350.0 / -mvPos.z);
    
    // Alternate colors: red or cyan
    if (mod(aOffset, 2.0) < 1.0) {
      vColor = vec3(0.88, 0.11, 0.18); // Red
    } else {
      vColor = vec3(0.0, 0.9, 1.0); // Cyan
    }

    // Fade near boundaries
    float yNorm = (pos.y + 3.0) / 6.0;
    vAlpha = smoothstep(0.0, 0.15, yNorm) * smoothstep(1.0, 0.8, yNorm) * 0.6;
  }
`;

const SPARKS_FRAGMENT = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    if (d > 0.5) discard;
    
    // Glowing radial soft circle
    float alpha = smoothstep(0.5, 0.05, d) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

// ─── Sub-components ──────────────────────────────────────────────────────────

/**
 * Cyberpunk NYC Skyscrapers
 * Renders metallic buildings with emissive grid lines in the background
 */
function CyberpunkSkyline() {
  const count = 26;
  const buildings = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const radius = 9.0 + Math.random() * 4.0;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const height = 3.0 + Math.random() * 8.0;
      const width = 0.8 + Math.random() * 1.5;
      const depth = 0.8 + Math.random() * 1.5;
      const emissionColor = Math.random() > 0.5 ? "#e11d2e" : "#00e5ff";
      return { x, z, height, width, depth, emissionColor };
    });
  }, []);

  return (
    <group position={[0, -5, -2]}>
      {buildings.map((b, i) => (
        <mesh key={i} position={[b.x, b.height / 2, b.z]}>
          <boxGeometry args={[b.width, b.height, b.depth]} />
          <meshStandardMaterial
            color="#050a15"
            roughness={0.2}
            metalness={0.9}
            emissive={new THREE.Color(b.emissionColor)}
            emissiveIntensity={0.25}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Holographic Stark-Tech Portal (Torus Knot Core)
 */
function HolographicPortal({ scrollRef }: { scrollRef: React.MutableRefObject<any> }) {
  const ref = useRef<THREE.Mesh>(null!);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  const { size } = useThree();

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / size.width) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / size.height) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [size]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const m = mouseRef.current;
    m.x += (m.targetX - m.x) * 0.05;
    m.y += (m.targetY - m.y) * 0.05;

    uniforms.uTime.value = t;
    uniforms.uMouse.value.set(m.x, m.y);

    if (ref.current) {
      ref.current.rotation.y = t * 0.15;
      ref.current.rotation.x = Math.sin(t * 0.1) * 0.2;
    }
  });

  return (
    <group>
      <mesh ref={ref}>
        {/* Stark tech geometric torus knot */}
        <torusKnotGeometry args={[1.5, 0.45, 120, 16]} />
        <shaderMaterial
          vertexShader={HOLOGRAPHIC_VERTEX}
          fragmentShader={HOLOGRAPHIC_FRAGMENT}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Dynamic central core glow */}
      <pointLight color="#00e5ff" intensity={8} distance={6} decay={1.5} />
      <mesh scale={0.7}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} wireframe />
      </mesh>
    </group>
  );
}

/**
 * Animated Web Strands (Laser/Neon curves connecting coordinates)
 */
function HolographicWebStrands({ scrollRef }: { scrollRef: React.MutableRefObject<any> }) {
  const points = useMemo(() => {
    // Generate anchor points in space to connect curves to
    const anchors = [
      new THREE.Vector3(-4, 3, -2),
      new THREE.Vector3(4, 2.5, -3),
      new THREE.Vector3(-3.5, -2, -1),
      new THREE.Vector3(3.8, -3, -2),
      new THREE.Vector3(1.5, 4, -4),
      new THREE.Vector3(-2, 4.5, -3),
    ];

    return anchors.map((anchor) => {
      // Create a nice smooth curve from portal center [0,0,0] to anchor
      const mid = new THREE.Vector3(
        anchor.x * 0.5 + (Math.random() - 0.5) * 1.5,
        anchor.y * 0.5 + (Math.random() - 0.5) * 1.5,
        anchor.z * 0.5 + (Math.random() - 0.5) * 1.5
      );
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        mid,
        anchor,
      ]);
      return curve.getPoints(30);
    });
  }, []);

  return (
    <group>
      {points.map((curvePoints, i) => {
        const isRed = i % 2 === 0;
        return (
          <DreiLine
            key={i}
            points={curvePoints}
            color={isRed ? "#e11d2e" : "#00e5ff"}
            lineWidth={1.2}
            transparent
            opacity={0.65}
          />
        );
      })}
    </group>
  );
}

/**
 * Floating Holographic Coding HUD Panels
 */
function FloatingHUDPanels() {
  return (
    <>
      {/* Left Float Panel */}
      <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.6}>
        <group position={[-3.2, 1.2, 0.5]} rotation={[0, 0.5, 0.1]}>
          <mesh>
            <planeGeometry args={[1.6, 1.0]} />
            <meshBasicMaterial color="#00e5ff" wireframe transparent opacity={0.25} />
          </mesh>
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[1.58, 0.98]} />
            <meshBasicMaterial color="#0a192f" transparent opacity={0.4} />
          </mesh>
        </group>
      </Float>

      {/* Right Float Panel */}
      <Float speed={2.2} rotationIntensity={0.4} floatIntensity={0.7}>
        <group position={[3.2, -1.0, 0.8]} rotation={[0, -0.4, -0.1]}>
          <mesh>
            <planeGeometry args={[1.4, 1.2]} />
            <meshBasicMaterial color="#e11d2e" wireframe transparent opacity={0.2} />
          </mesh>
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[1.38, 1.18]} />
            <meshBasicMaterial color="#0a192f" transparent opacity={0.4} />
          </mesh>
        </group>
      </Float>
    </>
  );
}

/**
 * Volumetric Neon Swirling Sparks
 */
function SwirlingSparks() {
  const COUNT = 1200;

  const [positions, offsets, sizes] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const off = new Float32Array(COUNT);
    const sz = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      // Distribute in a cylinder around the center
      const theta = Math.random() * Math.PI * 2;
      const r = 2.0 + Math.random() * 4.5;
      pos[i * 3]     = Math.cos(theta) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = Math.sin(theta) * r;

      off[i] = Math.random() * 100;
      sz[i]  = 0.2 + Math.random() * 0.8;
    }
    return [pos, off, sz];
  }, []);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} itemSize={3} count={COUNT} />
        <bufferAttribute attach="attributes-aOffset" array={offsets} itemSize={1} count={COUNT} />
        <bufferAttribute attach="attributes-aSize" array={sizes} itemSize={1} count={COUNT} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={SPARKS_VERTEX}
        fragmentShader={SPARKS_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Camera Rig to handle swing motions based on mouse interaction and scroll triggers
 */
function CameraRig({ scrollRef }: { scrollRef: React.MutableRefObject<any> }) {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    const targetZ = scrollRef.current.cameraZoom || 8;
    const scrollOffset = scrollRef.current.tendrilReach || 0; // scroll offset for city travel
    
    // Zoom in on scroll, and sweep camera slightly down-wards
    camera.position.z += (targetZ - camera.position.z) * 0.04;
    camera.position.y += ((mouseRef.current.y * 0.8 - scrollOffset * 0.6) - camera.position.y) * 0.03;
    camera.position.x += ((mouseRef.current.x * 1.2) - camera.position.x) * 0.03;
    
    camera.lookAt(0, -scrollOffset * 0.2, 0);
  });

  return null;
}

// ─── Main Scene Container ─────────────────────────────────────────────────────

function SpiderSceneInner() {
  const scrollRef = useSymbioteScroll();

  return (
    <>
      <CameraRig scrollRef={scrollRef} />
      
      {/* Multi-point Stark HUD lighting */}
      <ambientLight intensity={0.12} color="#0a192f" />
      
      {/* Key spotlight cool white */}
      <spotLight
        position={[-5, 8, 5]}
        angle={0.4}
        penumbra={0.9}
        intensity={25}
        color="#ffffff"
        castShadow
      />
      {/* Red accent fill from left */}
      <pointLight position={[-6, -2, 2]} intensity={18} color="#e11d2e" distance={10} decay={2} />
      {/* Electric cyan rim from right */}
      <pointLight position={[6, 3, -1]} intensity={22} color="#00e5ff" distance={10} decay={2} />
      
      <Environment preset="night" />

      {/* Futuristic digital starfield */}
      <Stars radius={60} depth={20} count={350} factor={1.5} saturation={0.5} fade speed={0.5} />

      {/* Cyberpunk NYC skyline background */}
      <CyberpunkSkyline />

      {/* Stark Tech Holographic Portal Core */}
      <Float speed={1.2} rotationIntensity={0.06} floatIntensity={0.2}>
        <HolographicPortal scrollRef={scrollRef} />
      </Float>

      {/* Laser web strands radiating from core */}
      <HolographicWebStrands scrollRef={scrollRef} />

      {/* Floating telemetry HUD displays */}
      <FloatingHUDPanels />

      {/* Volumetric digital swirls */}
      <SwirlingSparks />

      {/* Lens effects and cinematic blur postprocessing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.05}
          luminanceSmoothing={0.8}
          intensity={3.2}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.002, 0.002)}
          radialModulation={false}
          modulationOffset={0}
        />
        <Vignette
          offset={0.3}
          darkness={0.7}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  );
}

function SceneFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative flex flex-col items-center justify-center">
        {/* Pulsing Stark Core indicator */}
        <div className="w-24 h-24 rounded-full border border-cyan-500/20 animate-ping absolute" />
        <div className="w-16 h-16 rounded-full border-2 border-red-500/30 border-t-cyan-500 animate-spin" />
        <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest mt-8 whitespace-nowrap">
          Syncing Stark-Tech HUD...
        </div>
      </div>
    </div>
  );
}

export default function SpiderScene() {
  return (
    <div className="w-full h-full min-h-[420px] md:min-h-[560px] relative select-none cursor-grab active:cursor-grabbing">
      {/* Vented glow vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_50%,transparent_30%,#050a12_100%)] pointer-events-none z-10 opacity-70" />

      <Suspense fallback={<SceneFallback />}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 100 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
          style={{ background: "transparent" }}
        >
          <SpiderSceneInner />
        </Canvas>
      </Suspense>

      {/* Telemetry labels */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none select-none">
        <div className="text-[8px] font-mono text-cyan-500/60 uppercase tracking-widest">
          SYS STATUS: ONLINE · SCANNER RESOLUTION: NOMINAL
        </div>
      </div>
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none flex items-center gap-2 select-none">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <div className="text-[8px] font-mono text-cyan-500/60 uppercase tracking-widest">
          Spider-Sense Active
        </div>
      </div>
    </div>
  );
}
