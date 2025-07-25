import { writable } from 'svelte/store';
import { browser } from '$app/environment';

interface TooltipPosition {
  x: number;
  y: number;
}

interface CopyTextState {
  copied: boolean;
  tooltipPosition: TooltipPosition;
}

function createCopyTextStore() {
  const { subscribe, set, update } = writable<CopyTextState>({
    copied: false,
    tooltipPosition: { x: 0, y: 0 }
  });

  let mouseMoveHandler: ((event: MouseEvent) => void) | null = null;
  let timeoutId: number | null = null;

  const updateTooltipPosition = (event: MouseEvent) => {
    update(state => ({
      ...state,
      tooltipPosition: { x: event.clientX, y: event.clientY }
    }));
  };

  const startMouseTracking = () => {
    if (!browser) return;
    
    mouseMoveHandler = updateTooltipPosition;
    window.addEventListener('mousemove', mouseMoveHandler);
  };

  const stopMouseTracking = () => {
    if (!browser || !mouseMoveHandler) return;
    
    window.removeEventListener('mousemove', mouseMoveHandler);
    mouseMoveHandler = null;
  };

  const copyToClipboard = async (email: string, duration: number = 5000) => {
    if (!browser) return;

    try {
      await navigator.clipboard.writeText(email);
      
      // Start tracking mouse and show tooltip
      startMouseTracking();
      update(state => ({ ...state, copied: true }));

      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Hide tooltip after duration
      timeoutId = window.setTimeout(() => {
        stopMouseTracking();
        update(state => ({ ...state, copied: false }));
        timeoutId = null;
      }, duration);

    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const cleanup = () => {
    stopMouseTracking();
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return {
    subscribe,
    copyToClipboard,
    cleanup
  };
}

export const copyTextStore = createCopyTextStore();