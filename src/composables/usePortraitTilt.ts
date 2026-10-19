import { onBeforeUnmount, type Ref } from 'vue';

/** Pointer tilt for the about portrait. Honors reduced-motion and touch. */
export function usePortraitTilt(
  stageRef: Ref<HTMLElement | null>,
  portraitRef: Ref<HTMLImageElement | null>,
): void {
  if (typeof window === 'undefined') return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reset = (): void => {
    if (portraitRef.value) portraitRef.value.style.transform = '';
  };
  const onMove = (event: PointerEvent): void => {
    const stage = stageRef.value;
    const portrait = portraitRef.value;
    if (!stage || !portrait || reduced.matches || event.pointerType === 'touch') return;
    const r = stage.getBoundingClientRect();
    const x = (event.clientX - r.left) / r.width - 0.5;
    const y = (event.clientY - r.top) / r.height - 0.5;
    portrait.style.transform = `rotateX(${-y * 10}deg) rotateY(${x * 14}deg)`;
  };
  const stage = stageRef.value;
  // Listeners attach once the refs resolve (called from onMounted).
  queueMicrotask(() => {
    stageRef.value?.addEventListener('pointermove', onMove as EventListener);
    stageRef.value?.addEventListener('pointerleave', reset);
    reduced.addEventListener('change', reset);
  });
  onBeforeUnmount(() => {
    stage?.removeEventListener('pointermove', onMove as EventListener);
    stage?.removeEventListener('pointerleave', reset);
    reduced.removeEventListener('change', reset);
  });
}
