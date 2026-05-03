import { goto, prefetch } from '$app/navigation';

// Navega usando SvelteKit's goto function
export function navigate(path) {
  goto(path);
}

// Reemplaza la URL actual sin crear nueva entrada de historial.
export function replace(path) {
  goto(path, { replaceState: true });
}

// Vuelve a la ruta anterior.
export function back() {
  window.history.back();
}

// Prefetch a route for better performance
export { prefetch };
