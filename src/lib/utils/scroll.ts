export function smoothScrollTo(targetId: string, duration = 1000) {
	const target = document.getElementById(targetId);
	if (!target) return;

	// Scroll snapping would fight each step of the animation, so pause it meanwhile
	const root = document.documentElement;
	const snap = root.style.scrollSnapType;
	root.style.scrollSnapType = 'none';

	const start = window.scrollY;
	const end = target.getBoundingClientRect().top + start;
	const distance = end - start;
	const startTime = performance.now();

	function animate(currentTime: number) {
		const elapsed = currentTime - startTime;
		const progress = Math.min(elapsed / duration, 1);
		const ease = 0.5 * (1 - Math.cos(Math.PI * progress)); // easeInOut

		// 'instant' so the page's CSS smooth scrolling doesn't fight each animation step
		window.scrollTo({ top: start + distance * ease, behavior: 'instant' });
		if (elapsed < duration) requestAnimationFrame(animate);
		else root.style.scrollSnapType = snap;
	}

	requestAnimationFrame(animate);
}
