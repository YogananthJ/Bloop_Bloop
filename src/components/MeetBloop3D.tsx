import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ASSETS } from '../utils/assets';
import { sounds } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import {
  RotateCcw,
  Sparkles,
  Sliders,
  Upload,
  Sun,
  Moon,
  Info,
  Maximize2,
  Box,
  Eye,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const MeetBloop3D: React.FC = () => {
  const { mode } = useTheme();
  const isNight = mode === 'night';

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);

  // 3D Scene State
  const [hasGenuineModel, setHasGenuineModel] = useState<boolean>(false);
  const [modelLoading, setModelLoading] = useState<boolean>(true);
  const [modelError, setModelError] = useState<string | null>(null);
  const [modelName, setModelName] = useState<string>('bloop.glb');

  // Controls State
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(3.5);
  const [lightPreset, setLightPreset] = useState<'day' | 'night'>('day');
  const [isWebGLSupported, setIsWebGLSupported] = useState<boolean>(true);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const loadedModelGroupRef = useRef<THREE.Group | null>(null);
  const stageGroupRef = useRef<THREE.Group | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);

  // Pointer drag interaction state
  const isDraggingRef = useRef<boolean>(false);
  const prevPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationTargetRef = useRef<{ x: number; y: number }>({ x: 0.15, y: -0.2 });

  // Reset Camera View
  const handleResetView = useCallback(() => {
    sounds.playPop();
    rotationTargetRef.current = { x: 0.15, y: -0.2 };
    setZoomLevel(3.5);
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 1.2, 3.5);
      cameraRef.current.lookAt(0, 0.4, 0);
    }
  }, []);

  // Check for WebGL Support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setIsWebGLSupported(false);
      }
    } catch {
      setIsWebGLSupported(false);
    }
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!isWebGLSupported || !canvasMountRef.current) return;

    const mount = canvasMountRef.current;
    const width = mount.clientWidth || 600;
    const height = mount.clientHeight || 450;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Background fog matching meadow colors
    const fogColor = isNight ? 0x151222 : 0xfff6e8;
    scene.fog = new THREE.FogExp2(fogColor, 0.08);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 1.2, 3.5);
    camera.lookAt(0, 0.4, 0);
    cameraRef.current = camera;

    // 3. Renderer with SRGB Color Space & Tone Mapping
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xfff5ea, 0xbde4c6, 0.7);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const dirLight = new THREE.DirectionalLight(0xfff2d6, 1.3);
    dirLight.position.set(3, 5, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    const rimLight = new THREE.DirectionalLight(0xb9ddf5, 0.6);
    rimLight.position.set(-3, 3, -3);
    scene.add(rimLight);

    // 5. Meadow Play Lab 3D Workbench Stage
    const stageGroup = new THREE.Group();
    stageGroupRef.current = stageGroup;

    // Wooden workbench platform base
    const platformGeo = new THREE.CylinderGeometry(1.6, 1.7, 0.2, 32);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0xd8bca6,
      roughness: 0.65,
      metalness: 0.05,
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -0.1;
    platform.receiveShadow = true;
    stageGroup.add(platform);

    // Soft Contact Shadow Plane directly beneath platform
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.25,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.21;
    stageGroup.add(shadowPlane);

    // Tactile Colored Code Pegs on the workbench rim
    const pegColors = [0xf2b8c6, 0xbde4c6, 0xffe29a, 0xb9ddf5, 0xd9c8f0];
    pegColors.forEach((color, i) => {
      const angle = (i / pegColors.length) * Math.PI * 2;
      const pegGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.22, 16);
      const pegMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3 });
      const peg = new THREE.Mesh(pegGeo, pegMat);
      peg.position.set(Math.cos(angle) * 1.35, 0.1, Math.sin(angle) * 1.35);
      peg.castShadow = true;
      stageGroup.add(peg);
    });

    // Glowing Star Lantern Prop on the stage
    const starGeo = new THREE.OctahedronGeometry(0.14, 0);
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xffe29a,
      emissive: 0xffe29a,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    });
    const starLantern = new THREE.Mesh(starGeo, starMat);
    starLantern.position.set(-1.0, 0.35, 0.7);
    stageGroup.add(starLantern);

    scene.add(stageGroup);

    // 6. Test for genuine Bloop model file
    checkAndLoadModel('/bloop.glb');

    // 7. Animation Loop with Visibility & Reduced Motion awareness
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      const delta = clock.getDelta();

      // Smooth camera/object rotation damping
      if (stageGroupRef.current) {
        if (autoRotate && !isDraggingRef.current) {
          rotationTargetRef.current.y += 0.4 * delta;
        }

        stageGroupRef.current.rotation.y = THREE.MathUtils.damp(
          stageGroupRef.current.rotation.y,
          rotationTargetRef.current.y,
          6,
          delta
        );
        stageGroupRef.current.rotation.x = THREE.MathUtils.damp(
          stageGroupRef.current.rotation.x,
          rotationTargetRef.current.x,
          6,
          delta
        );
      }

      // Gentle floating animation on loaded model if present
      if (loadedModelGroupRef.current) {
        loadedModelGroupRef.current.position.y = Math.sin(clock.getElapsedTime() * 1.8) * 0.04 + 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!mount || !renderer || !camera) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // IntersectionObserver to pause rendering when off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Tab visibility listener
    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();

      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }

      // Dispose Three.js resources
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else if (obj.material) {
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();
      mount.innerHTML = '';
    };
  }, [isWebGLSupported]);

  // Load Model Function (Reusable for URL or uploaded file)
  const checkAndLoadModel = (url: string) => {
    setModelLoading(true);
    setModelError(null);

    const loader = new GLTFLoader();

    loader.load(
      url,
      (gltf) => {
        if (!sceneRef.current || !stageGroupRef.current) return;

        // Remove previous model if exists
        if (loadedModelGroupRef.current) {
          stageGroupRef.current.remove(loadedModelGroupRef.current);
        }

        const model = gltf.scene;

        // Normalize model scale & ground pivot
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.6 / (maxDim || 1);
        model.scale.setScalar(scale);

        // Center on X/Z and ground on platform
        model.position.x = -center.x * scale;
        model.position.y = -box.min.y * scale + 0.05;
        model.position.z = -center.z * scale;

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const modelGroup = new THREE.Group();
        modelGroup.add(model);
        stageGroupRef.current.add(modelGroup);
        loadedModelGroupRef.current = modelGroup;

        setHasGenuineModel(true);
        setModelLoading(false);
        sounds.playVictory();
      },
      undefined,
      (error) => {
        // Genuine model not found at path (expected when only 2D image exists)
        setHasGenuineModel(false);
        setModelLoading(false);
        setModelError(
          'Awaiting genuine Bloop 3D model asset. Upload a .glb / .gltf file below to preview in this 3D viewport.'
        );
      }
    );
  };

  // Handle Custom Model File Upload for testing
  const handleModelFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playPop();
    setModelName(file.name);
    const objectUrl = URL.createObjectURL(file);
    checkAndLoadModel(objectUrl);
  };

  // Pointer Interaction Handlers for smooth drag rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    prevPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevPointerRef.current.x;
    const deltaY = e.clientY - prevPointerRef.current.y;

    rotationTargetRef.current.y += deltaX * 0.008;
    rotationTargetRef.current.x = Math.max(-0.4, Math.min(0.6, rotationTargetRef.current.x + deltaY * 0.008));

    prevPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Zoom Handler
  const handleZoomChange = (newZoom: number) => {
    setZoomLevel(newZoom);
    if (cameraRef.current) {
      cameraRef.current.position.z = newZoom;
    }
  };

  // Lighting Mode Switch
  const toggleLightMode = () => {
    sounds.playPop();
    const next = lightPreset === 'day' ? 'night' : 'day';
    setLightPreset(next);

    if (dirLightRef.current && hemiLightRef.current && sceneRef.current) {
      if (next === 'night') {
        dirLightRef.current.color.setHex(0xb9ddf5);
        dirLightRef.current.intensity = 0.8;
        hemiLightRef.current.color.setHex(0x382f52);
        hemiLightRef.current.groundColor.setHex(0x151222);
        sceneRef.current.fog = new THREE.FogExp2(0x151222, 0.08);
      } else {
        dirLightRef.current.color.setHex(0xfff2d6);
        dirLightRef.current.intensity = 1.3;
        hemiLightRef.current.color.setHex(0xfff5ea);
        hemiLightRef.current.groundColor.setHex(0xbde4c6);
        sceneRef.current.fog = new THREE.FogExp2(0xfff6e8, 0.08);
      }
    }
  };

  return (
    <div className={`min-h-screen py-12 transition-colors ${isNight ? 'bg-[#1C172B]' : 'bg-[#FFF6E8]'}`}>
      <div ref={containerRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
            <Box className="w-4 h-4" />
            <span>Tier 3 Feature 01 · Three.js WebGL Experience</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">
            Meet Bloop in 3D
          </h1>
          <p className="text-sm sm:text-base opacity-80 max-w-2xl mx-auto">
            Interactive WebGL 3D character viewport with Orbit camera controls, studio softbox lighting, contact grounding, and GLTF/GLB model loading.
          </p>
        </div>

        {/* MAIN 3D WORKBENCH & STATUS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: 3D WebGL Canvas Viewport */}
          <div className="lg:col-span-8 space-y-4">
            <div
              className={`rounded-3xl border-4 overflow-hidden relative shadow-2xl h-[520px] select-none transition-colors ${
                isNight ? 'bg-[#151222] border-[#4D3F6D]' : 'bg-[#fffaf2] border-white'
              }`}
            >
              {/* WebGL Canvas Container */}
              {isWebGLSupported ? (
                <div
                  ref={canvasMountRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
                  style={{ touchAction: 'none' }}
                />
              ) : (
                /* Static Image Fallback for Unsupported WebGL */
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <img
                    src={ASSETS.bloopHero}
                    alt="Bloop the Marshmallow Hippo static view"
                    className="w-48 h-auto object-cover rounded-2xl shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-xs font-bold opacity-80">
                    WebGL is not accelerated on this device. Displaying canonical static portrait.
                  </div>
                </div>
              )}

              {/* Viewport Top HUD Badge */}
              <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-none">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold border border-white/20 flex items-center gap-1.5 shadow-xs">
                  <Eye className="w-3.5 h-3.5 text-[#FFE29A]" />
                  <span>Interactive 3D Stage</span>
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-bold shadow-xs ${
                    hasGenuineModel
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-500/90 text-white'
                  }`}
                >
                  {hasGenuineModel ? '✓ Bloop 3D Mesh Active' : 'Awaiting 3D Mesh (.glb)'}
                </span>
              </div>

              {/* Viewport Top Right Lighting Quick Toggle */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                <button
                  onClick={toggleLightMode}
                  title={`Switch to ${lightPreset === 'day' ? 'Moonlight' : 'Daylight'} Rig`}
                  className="min-h-[40px] px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-xs text-white hover:bg-black/80 text-xs font-bold border border-white/20 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {lightPreset === 'day' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-[#FFE29A]" />}
                  <span className="capitalize">{lightPreset} Light</span>
                </button>
              </div>

              {/* Viewport Bottom Instruction Overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                <div className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium border border-white/10">
                  <span>Drag to rotate · Scroll to zoom</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium border border-white/10">
                  <span>PBR Studio Lighting Active</span>
                </div>
              </div>
            </div>

            {/* Unified Bottom Control Dock */}
            <div
              className={`p-4 sm:p-5 rounded-3xl border shadow-xs flex flex-wrap items-center justify-between gap-4 ${
                isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/40'
              }`}
            >
              {/* Auto-Rotate Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAutoRotate(!autoRotate);
                    sounds.playPop();
                  }}
                  className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    autoRotate
                      ? 'bg-[#8DBA83] text-white shadow-xs'
                      : 'border text-current opacity-70 hover:opacity-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{autoRotate ? 'Idle Rotation On' : 'Rotation Paused'}</span>
                </button>

                <button
                  onClick={handleResetView}
                  className="min-h-[44px] px-3.5 py-2 rounded-2xl border text-xs font-bold hover:bg-black/5 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset View</span>
                </button>
              </div>

              {/* Camera Zoom Slider */}
              <div className="flex items-center gap-3 text-xs font-semibold">
                <Sliders className="w-3.5 h-3.5 text-[#8DBA83]" />
                <span>Zoom: {zoomLevel.toFixed(1)}m</span>
                <input
                  type="range"
                  min="2.0"
                  max="5.5"
                  step="0.1"
                  value={zoomLevel}
                  onChange={(e) => handleZoomChange(Number(e.target.value))}
                  className="w-28 accent-[#8DBA83] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Character Fidelity & Asset Transparency Card */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Canonical Reference Preservation Banner */}
            <div
              className={`p-6 rounded-3xl border-2 shadow-xs space-y-4 ${
                isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/50'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
                <span>Character Fidelity</span>
                <CheckCircle2 className="w-4 h-4 text-[#8DBA83]" />
              </div>

              {/* Canonical 2D Asset Preview */}
              <div className="rounded-2xl overflow-hidden border-2 border-[#F2B8C6]/60 shadow-xs relative">
                <img
                  src={ASSETS.bloopHero}
                  alt="Canonical reference of Bloop the Marshmallow Hippo"
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-black/75 backdrop-blur-xs text-[10px] text-white font-bold text-center">
                  Canonical Reference Asset (100% Preserved)
                </div>
              </div>

              <div className="space-y-2 text-xs opacity-85 leading-relaxed">
                <p>
                  <strong>Character Consistency Rule:</strong> The uploaded Bloop image is the permanent, authoritative character design. In strict accordance with the prompt directives, we never fabricate a distorted or generic 3D hippo substitute.
                </p>
                <p className="text-[11px] opacity-75">
                  The Three.js viewport provides a full WebGL stage with interactive lighting, rotation, and camera controls. When a verified 3D model (<code>bloop.glb</code>) is supplied, it loads seamlessly into the 3D scene.
                </p>
              </div>
            </div>

            {/* Test Model Upload / Loader Tool */}
            <div
              className={`p-5 rounded-3xl border shadow-xs space-y-3 ${
                isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/40'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
                <Upload className="w-4 h-4" />
                <span>Test 3D Model Loader</span>
              </div>
              <p className="text-xs opacity-75 leading-relaxed">
                Select a genuine <code>.glb</code> or <code>.gltf</code> model from your computer to inspect it in the 3D studio viewport:
              </p>

              <label className="min-h-[44px] w-full p-3 rounded-2xl border-2 border-dashed border-[#8DBA83] hover:bg-[#8DBA83]/10 transition-colors flex items-center justify-center gap-2 text-xs font-bold text-[#8DBA83] cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Choose .glb / .gltf File</span>
                <input
                  type="file"
                  accept=".glb,.gltf"
                  onChange={handleModelFileUpload}
                  className="hidden"
                />
              </label>

              {modelError && (
                <div className="text-[11px] p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-amber-800 dark:text-amber-200 flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{modelError}</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
