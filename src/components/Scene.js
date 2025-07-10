'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTheme } from 'next-themes';
import { Sphere, Torus, Environment } from '@react-three/drei';
import { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Color, Vector3 } from 'three';

// Helper to read CSS variables safely on the client and format for Three.js
const getHslColorFromCSSVar = (variable, fallback) => {
  if (typeof window === 'undefined') return fallback;
  const style = getComputedStyle(document.documentElement);
  const rawValue = style.getPropertyValue(variable).trim();
  
  if (!rawValue) return fallback;
  
  // CSS variables return values like "210 100% 56%", but Three.js needs "hsl(210, 100%, 56%)"
  if (rawValue.includes('%') && !rawValue.startsWith('hsl(')) {
    return `hsl(${rawValue.replace(/\s+/g, ', ')})`;
  }
  
  return rawValue || fallback;
};

// Main component containing the 3D scene logic
const SceneContent = ({ theme }) => {
  const colors = useMemo(() => {
    const primary = new Color(getHslColorFromCSSVar('--p', 'hsl(210, 90%, 55%)'));
    const secondary = new Color(getHslColorFromCSSVar('--s', 'hsl(280, 80%, 60%)'));
    if (theme === 'dark') {
      primary.offsetHSL(0, -0.1, 0.2);
      secondary.offsetHSL(0, -0.1, 0.1);
    }
    return { primary, secondary };
  }, [theme]);

  return (
    <>
      <CustomLighting primaryColor={colors.primary} secondaryColor={colors.secondary} />
      <GlassSphere color={colors.primary} theme={theme} />
      <OrbitingSphere offset={3.5} color={colors.primary} speed={0.5} size={0.3} theme={theme} />
      <OrbitingSphere offset={4.5} color={colors.secondary} speed={0.3} size={0.2} theme={theme} />
      <AnimatedTorus color={colors.secondary} theme={theme} />
      <Suspense fallback={null}>
        <Environment preset="city" blur={0.8} />
      </Suspense>
    </>
  );
};

// Glassy central sphere with mouse follow
const GlassSphere = ({ color, theme }) => {
  const sphereRef = useRef();
  const { viewport } = useThree();
  const target = useMemo(() => new Vector3(), []);
  const lastUpdate = useRef(0);
  const frameCount = useRef(0);

  useFrame(({ mouse, clock }) => {
    // Throttle updates for better performance
    const now = clock.getElapsedTime();
    if (now - lastUpdate.current < 0.016) return; // ~60fps
    lastUpdate.current = now;

    const x = (mouse.x * viewport.width) / 4;
    const y = (mouse.y * viewport.height) / 4;
    target.set(x, y, 0);
    sphereRef.current.position.lerp(target, 0.05);
    
    // Subtle rotation for dynamic feel
    frameCount.current += 0.005;
    sphereRef.current.rotation.y = Math.sin(frameCount.current) * 0.1;
    sphereRef.current.rotation.x = Math.cos(frameCount.current * 0.5) * 0.1;
  });

  // Optimize: Memoize material props to prevent recreation on each render
  const materialProps = useMemo(() => {
    const baseProps = {
      transmission: 1,
      opacity: 1,
      metalness: 0.05,
      roughness: 0.02,
      thickness: 0.2,
      envMapIntensity: theme === 'dark' ? 1.2 : 1.8,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      iridescence: 1,
      iridescenceIOR: 1.7,
      iridescenceThicknessRange: [100, 600],
      color: color,
    };

    if (theme === 'dark') {
      return {
        ...baseProps,
        emissive: color,
        emissiveIntensity: 0.25,
        attenuationColor: color,
        attenuationDistance: 4.5,
      };
    }

    return {
      ...baseProps,
      emissive: color,
      emissiveIntensity: 0.1,
      ior: 1.333,
      specularIntensity: 0.8,
      specularColor: new Color('#FFFFFF'),
    };
  }, [color, theme]);


  return (
    <Sphere 
      ref={sphereRef} 
      args={[1, 48, 48]} // Reduced geometry for better performance
      scale={2.5}
    >
      <meshPhysicalMaterial {...materialProps} />
    </Sphere>
  );
};

// Orbiting spheres with iridescent material
const OrbitingSphere = ({ offset, color, speed, size = 0.3, theme }) => {
  const sphereRef = useRef();
  const timeOffset = useRef(Math.random() * Math.PI * 2);
  const initialPosition = useRef(new Vector3());
  
  // Initialize position once on mount
  useEffect(() => {
    const angle = Math.random() * Math.PI * 2;
    initialPosition.current.set(
      Math.cos(angle) * offset,
      Math.sin(angle * 0.7) * offset,
      Math.sin(angle * 0.5) * (offset * 0.5)
    );
  }, [offset]);

  useFrame(({ clock }) => {
    if (!sphereRef.current) return;
    
    const time = clock.getElapsedTime() * speed;
    
    // Smooth, consistent movement using initial position as base
    sphereRef.current.position.x = initialPosition.current.x + Math.cos(time) * 0.1;
    sphereRef.current.position.y = initialPosition.current.y + Math.sin(time * 0.7) * 0.1;
    sphereRef.current.position.z = initialPosition.current.z + Math.sin(time * 0.5) * 0.1;
  });

  // Only adjust visual properties, not movement
  const adjustedColor = useMemo(() => {
    const c = color.clone();
    if (theme === 'dark') {
      c.offsetHSL(0, 0, 0.15);
    }
    return c;
  }, [color, theme]);

  return (
    <Sphere ref={sphereRef} args={[1, 64, 64]} scale={size}>
      <meshPhysicalMaterial
        color={adjustedColor}
        roughness={0.05}
        metalness={0.1}
        transmission={0.9}
        opacity={theme === 'dark' ? 0.6 : 0.7}
        transparent={true}
        emissive={adjustedColor}
        emissiveIntensity={theme === 'dark' ? 0.1 : 0.07}
        iridescence={1}
        iridescenceIOR={1.6}
        iridescenceThicknessRange={[100, 800]}
        clearcoat={0.8}
        clearcoatRoughness={0.2}
      />
    </Sphere>
  );
};

// Rotating torus with iridescent material
const AnimatedTorus = ({ color, theme }) => {
  const torusRef = useRef();

  useFrame(() => {
    torusRef.current.rotation.x += 0.002;
    torusRef.current.rotation.y += 0.003;
  });

  return (
    <Torus ref={torusRef} args={[4, 0.05, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
      <meshPhysicalMaterial
        color={color}
        roughness={0.1}
        metalness={0.5}
        transmission={0.7}
        opacity={theme === 'dark' ? 0.3 : 0.4}
        transparent={true}
        emissive={color}
        emissiveIntensity={theme === 'dark' ? 0.02 : 0.04}
        iridescence={theme === 'dark' ? 0.6 : 0.8}
        iridescenceIOR={1.5}
        iridescenceThicknessRange={[100, 800]}
      />
    </Torus>
  );
};

// Custom lighting setup
const CustomLighting = ({ primaryColor, secondaryColor }) => {
  // Memoize light props to prevent recreation on each render
  const lightProps = useMemo(() => ({
    ambient: { intensity: 0.5, color: '#ffffff' },
    point1: { 
      position: [10, 10, 10],
      intensity: 1.0,
      color: primaryColor,
      distance: 20,
      decay: 1.5
    },
    point2: {
      position: [-10, -10, 5],
      intensity: 0.5,
      color: secondaryColor,
      distance: 15,
      decay: 1.5
    },
    directional: {
      position: [5, 10, 5],
      intensity: 1.0,
      color: '#ffffff',
      castShadow: false // Disable shadows for better performance
    },
    hemisphere: {
      skyColor: '#ffffff',
      groundColor: '#000000',
      intensity: 0.5
    }
  }), [primaryColor, secondaryColor]);

  return (
    <>
      <ambientLight {...lightProps.ambient} />
      <pointLight {...lightProps.point1} />
      <pointLight {...lightProps.point2} />
      <directionalLight {...lightProps.directional} />
      <hemisphereLight 
        args={[lightProps.hemisphere.skyColor, lightProps.hemisphere.groundColor, lightProps.hemisphere.intensity]} 
      />
    </>
  );
};

// Wrapper component to handle theme changes and prevent hydration issues
const Scene = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef();

  // Performance optimization: Debounce theme changes
  useEffect(() => {
    setMounted(true);
    
    // Cleanup on unmount
    return () => {
      if (canvasRef.current) {
        const gl = canvasRef.current.getContext('webgl');
        if (gl) {
          // Force garbage collection
          gl.getExtension('WEBGL_lose_context')?.loseContext();
          gl.getExtension('WEBKIT_WEBGL_lose_context')?.loseContext();
        }
      }
    };
  }, []);

  // Performance optimization: Skip unnecessary renders
  const memoizedScene = useMemo(() => (
    <Suspense fallback={null}>
      <SceneContent theme={resolvedTheme} />
    </Suspense>
  ), [resolvedTheme]);

  // Add ARIA attributes for accessibility
  const ariaProps = {
    'aria-hidden': 'true',
    'role': 'presentation',
    'aria-label': 'Decorative 3D bubble effect',
    'data-theme': resolvedTheme
  };

  if (!mounted) return null;

  return (
    <div 
      className={`absolute inset-0 z-0 transition-opacity duration-700 ${
        resolvedTheme === 'dark' ? 'opacity-35' : 'opacity-30'
      }`}
      {...ariaProps}
    >
      <Canvas 
        ref={canvasRef}
        key={resolvedTheme}
        camera={{ 
          position: [0, 0, 10], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          antialias: false // Disabled for better performance
        }}
        dpr={Math.min(1.5, typeof window !== 'undefined' ? window.devicePixelRatio : 1)}
        performance={{ 
          min: 0.5,
          max: 1,
          debounce: 200
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
        }}
      >
        <color attach="background" args={resolvedTheme === 'dark' ? ['#0a0a0a'] : ['#f8fafc']} />
        {memoizedScene}
      </Canvas>
    </div>
  );
};

export default Scene;
