// A field of faint dots, like light on a water surface.
// Dots twinkle slowly on their own; each light source (an app, the mouse)
// brightens and tints nearby dots and pushes them into ripples.

export interface LightSource {
	x: number;
	y: number;
	radius: number; // how far the light and ripples reach, in px
	strength: number; // 0..1 brightness
	ripple: number; // 0..1 ripple amplitude
	rgb: [number, number, number];
}

const DOT_SPACING = 22;
const BASE_RGB: [number, number, number] = [225, 222, 218];
const BASE_ALPHA = 0.09;
const TWINKLE = 0.06;
const RIPPLE_PX = 6;
const RIPPLE_WAVELENGTH = 0.05; // radians per px
const RIPPLE_SPEED = 2; // radians per second

// Stable pseudo-random value per grid point, so twinkles don't jump between frames
function hash(x: number, y: number) {
	const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
	return s - Math.floor(s);
}

export function hexToRgb(hex: string): [number, number, number] {
	const n = parseInt(hex.replace('#', ''), 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function drawShimmer(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	t: number,
	sources: LightSource[]
) {
	ctx.clearRect(0, 0, width, height);

	const cols = Math.ceil(width / DOT_SPACING) + 1;
	const rows = Math.ceil(height / DOT_SPACING) + 1;
	const offsetX = (width - (cols - 1) * DOT_SPACING) / 2;
	const offsetY = (height - (rows - 1) * DOT_SPACING) / 2;

	for (let gy = 0; gy < rows; gy++) {
		for (let gx = 0; gx < cols; gx++) {
			const x0 = offsetX + gx * DOT_SPACING;
			const y0 = offsetY + gy * DOT_SPACING;
			const h = hash(gx, gy);

			let alpha = BASE_ALPHA + TWINKLE * Math.sin(t * (0.4 + h * 0.8) + h * 6.283);
			let dx = 0;
			let dy = 0;
			let glow = 0;
			let tr = 0;
			let tg = 0;
			let tb = 0;

			for (const s of sources) {
				const ox = x0 - s.x;
				const oy = y0 - s.y;
				const d = Math.hypot(ox, oy);
				if (d >= s.radius || d === 0) continue;

				const f = 1 - d / s.radius;
				const light = f * Math.sqrt(f) * s.strength;
				glow += light;
				tr += s.rgb[0] * light;
				tg += s.rgb[1] * light;
				tb += s.rgb[2] * light;

				const wave = Math.sin(d * RIPPLE_WAVELENGTH - t * RIPPLE_SPEED) * RIPPLE_PX * f * s.ripple;
				dx += (ox / d) * wave;
				dy += (oy / d) * wave;
			}

			let r = BASE_RGB[0];
			let g = BASE_RGB[1];
			let b = BASE_RGB[2];
			if (glow > 0) {
				const mix = Math.min(glow * 2, 1);
				r += (tr / glow - r) * mix;
				g += (tg / glow - g) * mix;
				b += (tb / glow - b) * mix;
			}

			alpha = Math.min(alpha + glow * 1.1, 0.9);
			const size = 1.1 + Math.min(glow, 1) * 2.2;

			ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${alpha})`;
			ctx.beginPath();
			ctx.arc(x0 + dx, y0 + dy, size, 0, 6.283);
			ctx.fill();
		}
	}
}
