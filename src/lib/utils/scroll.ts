export function smoothScrollTo(targetId: string, duration = 1000) {
  const target = document.getElementById(targetId);
  if (!target) return;

  const start = window.scrollY;
  const end = target.getBoundingClientRect().top + start;
  const distance = end - start;
  const startTime = performance.now();

  function animate(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 0.5 * (1 - Math.cos(Math.PI * progress)); // easeInOut

    window.scrollTo(0, start + distance * ease);
    if (elapsed < duration) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
