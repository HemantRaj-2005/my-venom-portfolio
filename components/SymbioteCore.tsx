"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function SymbioteCore() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Create Scene, Camera, and WebGL Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 2. Custom GLSL Shader Material for Symbiote
    // Vertex Shader: applies 3D Simplex noise for fluid morphing
    const vertexShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uHover;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vNoise;

      // Description : Array and textureless GLSL 2D/3D/4D simplex 
      //               noise functions.
      //      Author : Ian McEwan, Ashima Arts.
      //  Maintainer : stegu
      //     Lastmod : 20110822 (ijm)
      //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
      //               Distributed under the MIT License. See LICENSE file.
      //               https://github.com/ashima/webgl-noise
      
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      
      float snoise(vec3 v) { 
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      
        // First corner
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 =   v - i + dot(i, C.xxx) ;
      
        // Other corners
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );
      
        //   x0 = x0 - 0.0 + 0.0 * C.xxx;
        //   x1 = x0 - i1  + 1.0 * C.xxx;
        //   x2 = x0 - i2  + 2.0 * C.xxx;
        //   x3 = x0 - 1.0 + 3.0 * C.xxx;
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
        vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5
      
        // Permutations
        i = mod289(i); 
        vec4 p = permute( permute( permute( 
                   i.z + vec4(0.0, i1.z, i2.z, 1.0) )
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0) ) 
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0) );
      
        // Gradients: 7x7 points over a square, mapped onto an octahedron.
        // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
        float n_ = 0.142857142857; // 1.0/7.0
        vec3  ns = n_ * D.wyz - D.xzx;
      
        vec4 j = p - 49.0 * floor(p * ns.z);  //  mod(p,7*7)
      
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
      
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
      
        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );
      
        //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
        //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
      
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
      
        //Normalise gradients
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
      
        // Mix final noise value
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                      dot(p2,x2), dot(p3,x3) ) );
      }

      void main() {
        vNormal = normal;
        vPosition = position;

        // Animate noise over space and time for morphing sphere
        float timeScale = uTime * 0.6;
        float noise = snoise(position * 1.2 + vec3(0.0, 0.0, timeScale));
        vNoise = noise;

        // Morph vertices: push outward along normals based on noise
        vec3 newPosition = position + normal * noise * 0.35;

        // Attract shape toward mouse position
        vec3 mouseDirection = vec3(uMouse.x * 2.5, uMouse.y * 2.5, 0.0);
        float mouseDistance = distance(newPosition, mouseDirection);
        float attractionRadius = 3.5;

        if (mouseDistance < attractionRadius) {
          float force = (1.0 - (mouseDistance / attractionRadius)) * 0.55 * uHover;
          // Deform towards the mouse to simulate tendrils reaching out
          newPosition += normalize(mouseDirection - newPosition) * force;
        }

        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `;

    // Fragment Shader: Renders obsidian-black wet/metallic skin with highlights
    const fragmentShader = `
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vNoise;

      void main() {
        // Normalize custom normal
        vec3 normal = normalize(vNormal);

        // Standard point light direction (top-right-front)
        vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));
        
        // Compute diffuse shading
        float diffuse = max(dot(normal, lightDirection), 0.0);

        // Specular highlight (wet/glossy effect)
        vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
        vec3 halfDir = normalize(lightDirection + viewDir);
        float specAngle = max(dot(normal, halfDir), 0.0);
        float specular = pow(specAngle, 128.0) * 1.5; // High power = sharp highlight

        // Edge rim glow to define structure of dark mesh
        float rim = 1.0 - max(dot(normal, viewDir), 0.0);
        rim = pow(rim, 4.0);

        // Colors: Black, Dark Obsidian, and Toxic green highlights in noise crevices
        vec3 baseColor = vec3(0.02, 0.02, 0.02); // Obsidian base
        vec3 rimColor = vec3(1.0, 1.0, 1.0);     // Silver rim highlight
        vec3 greenGlow = vec3(0.0, 1.0, 0.4);    // Venom Toxic green
        
        // Mix glow into deeper recesses of the noise
        vec3 finalColor = mix(baseColor, greenGlow * 0.05, clamp(-vNoise * 2.0, 0.0, 1.0));
        
        // Add lighting, reflection highlights, and rim reflections
        finalColor += (diffuse * 0.05) + (specular * vec3(1.0)) + (rim * rimColor * 0.4);

        gl_FragColor = vec4(finalColor, 0.95);
      }
    `;

    // 3. Create Mesh
    const geometry = new THREE.SphereGeometry(2.0, 128, 128);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uHover: { value: 0 },
      },
      transparent: true,
    });

    const symbiote = new THREE.Mesh(geometry, material);
    scene.add(symbiote);

    // 4. Subtle ambient floating dust particles around core
    const particlesCount = 100;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      // Random coordinates in space around core
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }

    particlesGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
    });

    const particles = new THREE.Points(particlesGeo, particlesMaterial);
    scene.add(particles);

    // 5. Track Mouse Movement and Hover States
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let isHovered = 0;
    let targetHovered = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize coordinate: -1 to +1
      const rect = container.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.targetY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Since cursor is on canvas container, activate hover stretching
      targetHovered = 1.0;
    };

    const handleMouseLeave = () => {
      targetHovered = 0.0;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    // 6. Animation loop
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Lerp mouse coordinates and hover force for smooth inertia
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;
      isHovered += (targetHovered - isHovered) * 0.06;

      // Update uniforms
      material.uniforms.uTime.value = elapsedTime;
      material.uniforms.uMouse.value.set(mouse.x, mouse.y);
      material.uniforms.uHover.value = isHovered;

      // Subtle rotations
      symbiote.rotation.y = elapsedTime * 0.05;
      symbiote.rotation.x = elapsedTime * 0.02;
      particles.rotation.y = -elapsedTime * 0.01;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // 7. Handle Resize
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // 8. Cleanup resources to avoid memory leaks
    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      particlesGeo.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[350px] md:min-h-[500px] cursor-grab active:cursor-grabbing relative select-none"
    >
      <div className="absolute bottom-4 left-4 text-[9px] font-mono tracking-widest text-zinc-600 pointer-events-none uppercase">
        WebGL Core: Morphing Vertex Noise Active
      </div>
    </div>
  );
}
