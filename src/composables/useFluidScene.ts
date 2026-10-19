import * as THREE from 'three';
import { onBeforeUnmount, ref, type Ref } from 'vue';
import { streamline } from '../three/vortexModel';

export interface FluidScene {
  paused: Ref<boolean>;
  failed: Ref<boolean>;
  toggle: () => void;
  reset: () => void;
  init: () => void;
}

/** Interactive Navier–Stokes vortex field (Burgers vortex streamlines). Ported from the legacy fluid module to the npm `three` package. */
export function useFluidScene(
  canvasRef: Ref<HTMLCanvasElement | null>,
  hostRef: Ref<HTMLElement | null>,
): FluidScene {
  const paused = ref(false);
  const failed = ref(false);
  let renderer: THREE.WebGLRenderer | null = null;
  let sceneRef: THREE.Scene | null = null;
  let cameraRef: THREE.PerspectiveCamera | null = null;
  let vortex: THREE.Group | null = null;
  let frame = 0;
  let last = 0;
  let visible = true;
  let drag: { x: number; y: number } | null = null;
  let cleanup: (() => void) | null = null;

  const reduced =
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  paused.value = reduced?.matches ?? false;

  function draw(): void {
    if (renderer && sceneRef && cameraRef) renderer.render(sceneRef, cameraRef);
  }

  function tick(now: number): void {
    frame = 0;
    if (paused.value || !visible || document.hidden || !vortex) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!drag) vortex.rotation.y += dt * 0.1;
    draw();
    frame = requestAnimationFrame(tick);
  }

  function resume(): void {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    last = performance.now();
    if (!paused.value && visible && !document.hidden) frame = requestAnimationFrame(tick);
    else draw();
  }

  function toggle(): void {
    paused.value = !paused.value;
    resume();
  }

  function reset(): void {
    vortex?.rotation.set(0.07, -0.3, -0.08);
    draw();
  }

  function init(): void {
    const canvas = canvasRef.value;
    const host = hostRef.value;
    if (!canvas || !host) return;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
      camera.position.set(0, 0.35, 9.3);
      camera.lookAt(0, 0, 0);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x30415e, 2.2));
      const light = new THREE.DirectionalLight(0xffffff, 3);
      light.position.set(3, 5, 6);
      scene.add(light);
      const fill = new THREE.DirectionalLight(0x80cfff, 2);
      fill.position.set(-4, 0, -2);
      scene.add(fill);
      vortex = new THREE.Group();
      sceneRef = scene;
      cameraRef = camera;
      scene.add(vortex);
      vortex.rotation.set(0.07, -0.3, -0.08);
      const material = new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 0.42, roughness: 0.3 });
      for (const side of [-1, 1]) {
        for (let s = 0; s < 32; s++) {
          const angle = (s / 32) * Math.PI * 2 + (side === 1 ? 0.1 : 0);
          const radius = 1.5 + (s % 5) * 0.11;
          const y = side * (0.045 + (s % 7) * 0.008);
          const points = streamline([Math.cos(angle) * radius, y, Math.sin(angle) * radius]).map(
            (p) => new THREE.Vector3(...p),
          );
          const curve = new THREE.CatmullRomCurve3(points);
          const segments = 140;
          const radial = 5;
          const frames = curve.computeFrenetFrames(segments, false);
          const positions: number[] = [];
          const normals: number[] = [];
          const colors: number[] = [];
          const indices: number[] = [];
          for (let i = 0; i <= segments; i++) {
            const f = i / segments;
            const p = curve.getPointAt(f);
            const r = Math.hypot(p.x, p.z);
            const color = new THREE.Color(r > 0.85 ? 0x39d6d8 : r > 0.5 ? 0x4b91ed : 0xf4ad64);
            const thickness = (0.006 + (s % 4) * 0.0025) * Math.pow(Math.sin(Math.PI * f), 0.42) + 0.0005;
            for (let j = 0; j <= radial; j++) {
              const a = (j / radial) * Math.PI * 2;
              const normal = frames.normals[i]
                .clone()
                .multiplyScalar(Math.cos(a))
                .addScaledVector(frames.binormals[i], Math.sin(a));
              positions.push(p.x + normal.x * thickness, p.y + normal.y * thickness, p.z + normal.z * thickness);
              normals.push(normal.x, normal.y, normal.z);
              colors.push(color.r, color.g, color.b);
            }
          }
          for (let i = 0; i < segments; i++) {
            for (let j = 0; j < radial; j++) {
              const a = i * (radial + 1) + j;
              const b = a + radial + 1;
              indices.push(a, b, a + 1, b, b + 1, a + 1);
            }
          }
          const g = new THREE.BufferGeometry();
          g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
          g.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
          g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
          g.setIndex(indices);
          vortex.add(new THREE.Mesh(g, material));
        }
      }
      const axis = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -2.7, 0), new THREE.Vector3(0, 2.7, 0)]),
        new THREE.LineBasicMaterial({ color: 0x8d9bac, transparent: true, opacity: 0.35 }),
      );
      vortex.add(axis);

      const resize = new ResizeObserver(() => {
        if (!renderer || !host) return;
        renderer.setSize(host.clientWidth, host.clientHeight, false);
        camera.aspect = host.clientWidth / host.clientHeight;
        camera.updateProjectionMatrix();
        draw();
      });
      resize.observe(host);
      const visibility = new IntersectionObserver((e) => {
        visible = e[0].isIntersecting;
        resume();
      });
      visibility.observe(canvas);
      const onPointerDown = (e: PointerEvent): void => {
        if (e.pointerType === 'touch') return;
        drag = { x: e.clientX, y: e.clientY };
        canvas.setPointerCapture(e.pointerId);
      };
      const onPointerMove = (e: PointerEvent): void => {
        if (!drag || !vortex) return;
        vortex.rotation.y += (e.clientX - drag.x) * 0.008;
        vortex.rotation.x = Math.max(-0.6, Math.min(0.6, vortex.rotation.x + (e.clientY - drag.y) * 0.004));
        drag = { x: e.clientX, y: e.clientY };
        draw();
      };
      const release = (): void => {
        drag = null;
      };
      const onReduced = (): void => {
        paused.value = reduced?.matches ?? false;
        resume();
      };
      const onVisibility = (): void => resume();
      const onTheme = (): void => draw();
      const onLost = (e: Event): void => {
        e.preventDefault();
        if (frame) cancelAnimationFrame(frame);
        host.classList.add('vortex-unavailable');
      };
      const onRestored = (): void => {
        host.classList.remove('vortex-unavailable');
        resume();
      };
      canvas.addEventListener('pointerdown', onPointerDown);
      canvas.addEventListener('pointermove', onPointerMove);
      canvas.addEventListener('pointerup', release);
      canvas.addEventListener('pointercancel', release);
      reduced?.addEventListener('change', onReduced);
      document.addEventListener('visibilitychange', onVisibility);
      window.addEventListener('portfolio:themechange', onTheme);
      canvas.addEventListener('webglcontextlost', onLost);
      canvas.addEventListener('webglcontextrestored', onRestored);
      cleanup = () => {
        resize.disconnect();
        visibility.disconnect();
        canvas.removeEventListener('pointerdown', onPointerDown);
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('pointerup', release);
        canvas.removeEventListener('pointercancel', release);
        reduced?.removeEventListener('change', onReduced);
        document.removeEventListener('visibilitychange', onVisibility);
        window.removeEventListener('portfolio:themechange', onTheme);
        canvas.removeEventListener('webglcontextlost', onLost);
        canvas.removeEventListener('webglcontextrestored', onRestored);
        if (frame) cancelAnimationFrame(frame);
        renderer?.dispose();
      };
      resume();
    } catch {
      failed.value = true;
    }
  }

  onBeforeUnmount(() => cleanup?.());

  return { paused, failed, toggle, reset, init };
}
