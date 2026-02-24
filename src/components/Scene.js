'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTheme } from 'next-themes';
import { Sphere, Torus, Environment } from '@react-three/drei';
import { useRef, useMemo, useEffect, useState, Suspense, Component } from 'react';
import { Color, Vector3 } from 'three';

// Detect device capabilities for adaptive quality
const getDeviceQuality = () => {
  if (typeof window === 'undefined') return 'medium';

  // Check for mobile devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Check for performance indicators
  const hasGoodPerformance = navigator.hardwareConcurrency >= 4;
  const hasHighDPI = window.devicePixelRatio > 1.5;

  if (isMobile) return 'low';
  if (hasGoodPerformance && hasHighDPI) return 'high';
  return 'medium';
};

// Quality presets for geometry
const QUALITY_PRESETS = {
  low: {
    sphereSegments: [24, 24],
    orbitSphereSegments: [32, 32],
    torusSegments: [12, 64],
    dpr: 1,
    antialias: false,
  },
  medium: {
    sphereSegments: [32, 32],
    orbitSphereSegments: [48, 48],
    torusSegments: [16, 80],
    dpr: 1.5,
    antialias: false,
  },
  high: {
    sphereSegments: [48, 48],
    orbitSphereSegments: [64, 64],
    torusSegments: [16, 100],
    dpr: 2,
    antialias: true,
  },
};

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

// Basic Error Boundary for 3D content
class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Silently catch - we don't want to spam the console for asset loading failures
    // which are often network-related or extension-related.
  }

  render() {
    if (this.state.hasError) {
      return null; // Don't render anything if the 3D part fails
    }
    return this.props.children;
  }
}

// Main component containing the 3D scene logic
const SceneContent = ({ theme, quality }) => {
  const colors = useMemo(() => {
    const primary = new Color(getHslColorFromCSSVar('--p', 'hsl(210, 90%, 55%)'));
    const secondary = new Color(getHslColorFromCSSVar('--s', 'hsl(280, 80%, 60%)'));
    if (theme === 'dark') {
      primary.offsetHSL(0, -0.1, 0.2);
      secondary.offsetHSL(0, -0.1, 0.1);
    }
    return { primary, secondary };
  }, [theme]);

  // Check if scene is in viewport
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsInView(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <>
      <CustomLighting primaryColor={colors.primary} secondaryColor={colors.secondary} />
      <GlassSphere color={colors.primary} theme={theme} quality={quality} isActive={isInView} />
      <OrbitingSphere offset={3.5} color={colors.primary} speed={0.5} size={0.3} theme={theme} quality={quality} isActive={isInView} />
      <OrbitingSphere offset={4.5} color={colors.secondary} speed={0.3} size={0.2} theme={theme} quality={quality} isActive={isInView} />
      <AnimatedTorus color={colors.secondary} theme={theme} quality={quality} isActive={isInView} />
      {/* Only load environment for high quality devices to save bandwidth */}
      {quality === 'high' && (
        <SceneErrorBoundary>
          <Suspense fallback={null}>
            <Environment preset="city" blur={0.8} />
          </Suspense>
        </SceneErrorBoundary>
      )}
    </>
  );
};

// Glassy central sphere with mouse follow
const GlassSphere = ({ color, theme, quality, isActive }) => {
  const sphereRef = useRef();
  const { viewport } = useThree();
  const target = useMemo(() => new Vector3(), []);
  const lastUpdate = useRef(0);
  const frameCount = useRef(0);

  useFrame(({ mouse, clock }) => {
    if (!isActive || !sphereRef.current) return;

    // Improved throttling - only skip frames for low quality
    const now = clock.getElapsedTime();
    if (quality === 'low') {
      const updateInterval = 0.033; // 30fps for low quality
      if (now - lastUpdate.current < updateInterval) return;
      lastUpdate.current = now;
    }

    // Smooth mouse following with responsive lerp
    const x = (mouse.x * viewport.width) / 4;
    const y = (mouse.y * viewport.height) / 4;
    target.set(x, y, 0);
    sphereRef.current.position.lerp(target, 0.08); // Increased from 0.05 for more responsive feel

    // Subtle rotation for dynamic feel
    frameCount.current += 0.005;
    sphereRef.current.rotation.y = Math.sin(frameCount.current) * 0.1;
    sphereRef.current.rotation.x = Math.cos(frameCount.current * 0.5) * 0.1;
  });

  // Optimize: Memoize material props to prevent recreation on each render
  const materialProps = useMemo(() => {
    // Simplified material for low quality
    if (quality === 'low') {
      return {
        color: color,
        metalness: 0.3,
        roughness: 0.2,
        transparent: true,
        opacity: 0.8,
        emissive: color,
        emissiveIntensity: theme === 'dark' ? 0.1 : 0.05,
      };
    }

    const baseProps = {
      transmission: 1,
      opacity: 1,
      metalness: 0.05,
      roughness: 0.02,
      thickness: 0.2,
      envMapIntensity: theme === 'dark' ? 1.2 : 1.8,
      clearcoat: quality === 'high' ? 1 : 0.7,
      clearcoatRoughness: 0.1,
      iridescence: quality === 'high' ? 1 : 0.7,
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
  }, [color, theme, quality]);

  const segments = QUALITY_PRESETS[quality].sphereSegments;

  return (
    <Sphere
      ref={sphereRef}
      args={[1, ...segments]}
      scale={2.5}
    >
      <meshPhysicalMaterial {...materialProps} />
    </Sphere>
  );
};

// Orbiting spheres with iridescent material
const OrbitingSphere = ({ offset, color, speed, size = 0.3, theme, quality, isActive }) => {
  const sphereRef = useRef();
  const timeOffset = useRef(Math.random() * Math.PI * 2);
  const initialPosition = useRef(new Vector3());
  const lastUpdate = useRef(0);

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
    if (!sphereRef.current || !isActive) return;

    // Reduced throttling for smoother orbital motion
    const now = clock.getElapsedTime();
    if (quality === 'low') {
      const updateInterval = 0.033;
      if (now - lastUpdate.current < updateInterval) return;
      lastUpdate.current = now;
    }

    const time = now * speed;

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

  const materialProps = useMemo(() => {
    if (quality === 'low') {
      return {
        color: adjustedColor,
        roughness: 0.2,
        metalness: 0.3,
        transparent: true,
        opacity: theme === 'dark' ? 0.5 : 0.6,
        emissive: adjustedColor,
        emissiveIntensity: theme === 'dark' ? 0.05 : 0.03,
      };
    }

    return {
      color: adjustedColor,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.9,
      opacity: theme === 'dark' ? 0.6 : 0.7,
      transparent: true,
      emissive: adjustedColor,
      emissiveIntensity: theme === 'dark' ? 0.1 : 0.07,
      iridescence: quality === 'high' ? 1 : 0.6,
      iridescenceIOR: 1.6,
      iridescenceThicknessRange: [100, 800],
      clearcoat: quality === 'high' ? 0.8 : 0.5,
      clearcoatRoughness: 0.2,
    };
  }, [adjustedColor, theme, quality]);

  const segments = QUALITY_PRESETS[quality].orbitSphereSegments;

  return (
    <Sphere ref={sphereRef} args={[1, ...segments]} scale={size}>
      <meshPhysicalMaterial {...materialProps} />
    </Sphere>
  );
};

// Rotating torus with iridescent material
const AnimatedTorus = ({ color, theme, quality, isActive }) => {
  const torusRef = useRef();
  const lastUpdate = useRef(0);

  useFrame(({ clock }) => {
    if (!torusRef.current || !isActive) return;

    // Simplified throttling for torus rotation
    const now = clock.getElapsedTime();
    if (quality === 'low') {
      const updateInterval = 0.033;
      if (now - lastUpdate.current < updateInterval) return;
      lastUpdate.current = now;
    }

    torusRef.current.rotation.x += 0.002;
    torusRef.current.rotation.y += 0.003;
  });

  const materialProps = useMemo(() => {
    if (quality === 'low') {
      return {
        color: color,
        roughness: 0.3,
        metalness: 0.3,
        transparent: true,
        opacity: theme === 'dark' ? 0.2 : 0.3,
        emissive: color,
        emissiveIntensity: theme === 'dark' ? 0.01 : 0.02,
      };
    }

    return {
      color: color,
      roughness: 0.1,
      metalness: 0.5,
      transmission: 0.7,
      opacity: theme === 'dark' ? 0.3 : 0.4,
      transparent: true,
      emissive: color,
      emissiveIntensity: theme === 'dark' ? 0.02 : 0.04,
      iridescence: quality === 'high' ? (theme === 'dark' ? 0.6 : 0.8) : 0.4,
      iridescenceIOR: 1.5,
      iridescenceThicknessRange: [100, 800],
    };
  }, [color, theme, quality]);

  const segments = QUALITY_PRESETS[quality].torusSegments;

  return (
    <Torus ref={torusRef} args={[4, 0.05, ...segments]} rotation={[Math.PI / 2, 0, 0]}>
      <meshPhysicalMaterial {...materialProps} />
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
  const [quality, setQuality] = useState('medium');
  const canvasRef = useRef();

  // Performance optimization: Detect device quality
  useEffect(() => {
    setMounted(true);
    setQuality(getDeviceQuality());
  }, []);

  // Performance optimization: Skip unnecessary renders
  const memoizedScene = useMemo(() => (
    <Suspense fallback={null}>
      <SceneContent theme={resolvedTheme} quality={quality} />
    </Suspense>
  ), [resolvedTheme, quality]);

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
      className={`absolute inset-0 z-0 transition-opacity duration-700 ${resolvedTheme === 'dark' ? 'opacity-35' : 'opacity-30'
        }`}
      {...ariaProps}
    >
      <Canvas
        ref={canvasRef}
        key={`${resolvedTheme}-${quality}`}
        camera={{
          position: [0, 0, 10],
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: QUALITY_PRESETS[quality].antialias,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={Math.min(QUALITY_PRESETS[quality].dpr, typeof window !== 'undefined' ? window.devicePixelRatio : 1)}
        performance={{
          min: quality === 'low' ? 0.5 : 0.75,
          max: 1,
          debounce: quality === 'low' ? 200 : 100
        }}
        frameloop="always" // Critical: Enable continuous rendering for mouse interactions
        onCreated={({ gl, performance }) => {
          gl.setClearColor(0x000000, 0);
          gl.setPixelRatio(Math.min(QUALITY_PRESETS[quality].dpr, window.devicePixelRatio));

          // Adaptive performance monitoring
          performance.regress();
        }}
        onPointerMissed={() => { }} // Enable pointer event handling
        style={{ touchAction: 'none' }} // Improve touch responsiveness
      >
        <color attach="background" args={resolvedTheme === 'dark' ? ['#0a0a0a'] : ['#f8fafc']} />
        {memoizedScene}
      </Canvas>
    </div>
  );
};

export default Scene;
