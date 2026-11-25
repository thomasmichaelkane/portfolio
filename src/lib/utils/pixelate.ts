// Pixel-dissolve transition between pages.
//
// At full strength the page is broken into small soft pixels (an SVG filter
// that averages each block's colour), blurred, and speckled all over with
// flickering random soft colours (a canvas laid over everything). One side of
// a page change builds up to full strength, the other starts there and clears.
// Both the filter and the speckle canvas live directly in <body>, outside the
// app, so they carry on through the navigation.

const FILTER_ID = 'pixelate-transition';
const SVG_NS = 'http://www.w3.org/2000/svg';

// Tuning
const BLOCK = 4; // page pixel size at full strength, in px
const BLUR = 9; // blur at full strength, in px
const SPECKLE_BLOCK = 3; // speckle size, in px
const SPECKLE_DENSITY = 0.3; // share of speckle cells filled at full strength
const SPECKLE_ALPHA = 0.35; // maximum speckle opacity
const SPECKLE_SATURATION = [0.12, 0.28]; // muted, so they sit in the grey
const SPECKLE_LIGHTNESS = [0.42, 0.6];
const SPECKLE_RAMP = 2; // >1 makes speckles build up slowly, then come in at the end
const SPECKLE_FPS = 24; // how often the speckles re-scatter

// ---- Pixelate filter --------------------------------------------------------

interface FilterParts {
	filter: SVGFilterElement;
	average: SVGFEGaussianBlurElement;
	flood: SVGFEFloodElement;
	tile: SVGFECompositeElement;
	dilate: SVGFEMorphologyElement;
	soften: SVGFEGaussianBlurElement;
}

let parts: FilterParts | null = null;

// Blurs that repeat the edge colour, so the screen edges don't fade to the page behind
function makeBlur(result?: string) {
	const blur = document.createElementNS(SVG_NS, 'feGaussianBlur');
	blur.setAttribute('edgeMode', 'duplicate');
	if (result) blur.setAttribute('result', result);
	return blur;
}

function ensureFilter(): FilterParts {
	if (parts && document.body.contains(parts.filter)) return parts;

	const svg = document.createElementNS(SVG_NS, 'svg');
	svg.setAttribute('aria-hidden', 'true');
	svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';

	const filter = document.createElementNS(SVG_NS, 'filter');
	filter.id = FILTER_ID;
	filter.setAttribute('filterUnits', 'userSpaceOnUse');
	filter.setAttribute('color-interpolation-filters', 'sRGB');

	const average = makeBlur('averaged'); // so a block's sample is its area's average colour
	average.setAttribute('in', 'SourceGraphic');
	const flood = document.createElementNS(SVG_NS, 'feFlood'); // one sample point per block
	flood.setAttribute('width', '1');
	flood.setAttribute('height', '1');
	const tile = document.createElementNS(SVG_NS, 'feComposite'); // the size of one block
	const repeat = document.createElementNS(SVG_NS, 'feTile'); // repeat it across the area
	repeat.setAttribute('result', 'grid');
	const sample = document.createElementNS(SVG_NS, 'feComposite'); // keep only the sampled pixels
	sample.setAttribute('in', 'averaged');
	sample.setAttribute('in2', 'grid');
	sample.setAttribute('operator', 'in');
	const dilate = document.createElementNS(SVG_NS, 'feMorphology'); // grow each into a block
	dilate.setAttribute('operator', 'dilate');
	const soften = makeBlur(); // the overall blur

	filter.append(average, flood, tile, repeat, sample, dilate, soften);
	svg.append(filter);
	document.body.append(svg);

	parts = { filter, average, flood, tile, dilate, soften };
	return parts;
}

// ---- Speckle overlay --------------------------------------------------------

let speckleCanvas: HTMLCanvasElement | null = null;
let speckleStrength = 0;
let speckleFrame = 0;
let lastScatter = 0;

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
	const a = s * Math.min(l, 1 - l);
	const f = (n: number) => {
		const k = (n + h / 30) % 12;
		return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
	};
	return [f(0) * 255, f(8) * 255, f(4) * 255];
}

function scatter() {
	const canvas = speckleCanvas!;
	// One canvas pixel per speckle, stretched to the screen
	const w = Math.ceil(window.innerWidth / SPECKLE_BLOCK);
	const h = Math.ceil(window.innerHeight / SPECKLE_BLOCK);
	if (canvas.width !== w || canvas.height !== h) {
		canvas.width = w;
		canvas.height = h;
	}
	const ctx = canvas.getContext('2d')!;
	const img = ctx.createImageData(w, h);
	const strength = speckleStrength ** SPECKLE_RAMP;
	const density = SPECKLE_DENSITY * strength;
	const [sMin, sMax] = SPECKLE_SATURATION;
	const [lMin, lMax] = SPECKLE_LIGHTNESS;
	for (let i = 0; i < w * h; i++) {
		if (Math.random() >= density) continue;
		// Soft colours: any hue, muted and mid-toned
		const [r, g, b] = hslToRgb(
			Math.random() * 360,
			sMin + Math.random() * (sMax - sMin),
			lMin + Math.random() * (lMax - lMin)
		);
		const o = i * 4;
		img.data[o] = r;
		img.data[o + 1] = g;
		img.data[o + 2] = b;
		img.data[o + 3] = (0.3 + 0.7 * Math.random()) * SPECKLE_ALPHA * strength * 255;
	}
	ctx.putImageData(img, 0, 0);
}

function speckleLoop(now: number) {
	if (speckleStrength <= 0.001) {
		speckleCanvas?.remove();
		speckleCanvas = null;
		speckleFrame = 0;
		return;
	}
	if (now - lastScatter > 1000 / SPECKLE_FPS) {
		lastScatter = now;
		scatter();
	}
	speckleFrame = requestAnimationFrame(speckleLoop);
}

function setSpeckle(strength: number) {
	speckleStrength = strength;
	if (strength <= 0.001 && !speckleCanvas) return;
	if (!speckleCanvas) {
		speckleCanvas = document.createElement('canvas');
		speckleCanvas.setAttribute('aria-hidden', 'true');
		speckleCanvas.style.cssText = [
			'position:fixed',
			'inset:0',
			'width:100vw',
			'height:100vh',
			'pointer-events:none',
			'z-index:2147483647',
			'image-rendering:pixelated',
			'filter:blur(0.6px)'
		].join(';');
		document.body.append(speckleCanvas);
		scatter();
	}
	if (!speckleFrame) speckleFrame = requestAnimationFrame(speckleLoop);
}

// ---- Public API -------------------------------------------------------------

/**
 * Set the dissolve to a given strength: 0 = normal page, 1 = fully dissolved.
 * Blocks at the screen edge come out partly see-through, so the page behind is
 * coloured to match (`background`) while dissolved, then reset.
 */
export function setDissolve(el: HTMLElement, strength: number, background?: string) {
	const root = document.documentElement;
	setSpeckle(strength);

	if (strength <= 0.001) {
		el.style.filter = '';
		root.style.backgroundColor = '';
		return;
	}

	const p = ensureFilter();
	// Pixels reach full size early, so the pixelation stays small throughout
	const size = Math.max(2, Math.round(1 + (BLOCK - 1) * Math.min(strength * 2, 1)));
	const half = size / 2;
	// Only the visible screen (plus one block either side, so edge blocks are whole)
	// is filtered, which keeps long pages cheap
	p.filter.setAttribute('x', String(-size));
	p.filter.setAttribute('y', String(-size));
	p.filter.setAttribute('width', String(window.innerWidth + 2 * size));
	p.filter.setAttribute('height', String(window.innerHeight + 2 * size));
	p.average.setAttribute('stdDeviation', String(size / 3));
	p.flood.setAttribute('x', String(half));
	p.flood.setAttribute('y', String(half));
	p.tile.setAttribute('width', String(size));
	p.tile.setAttribute('height', String(size));
	p.dilate.setAttribute('radius', String(half));
	p.soften.setAttribute('stdDeviation', String(BLUR * strength));

	if (background) root.style.backgroundColor = background;
	el.style.filter = `url(#${FILTER_ID})`;
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/** Animate the dissolve between two strengths; resolves when finished */
export function dissolve(
	el: HTMLElement,
	opts: { from: number; to: number; duration: number; background?: string }
): Promise<void> {
	const { from, to, duration, background } = opts;
	return new Promise((resolve) => {
		const start = performance.now();
		const frame = (now: number) => {
			const t = Math.min((now - start) / duration, 1);
			setDissolve(el, from + (to - from) * easeInOut(t), background);
			if (t < 1) requestAnimationFrame(frame);
			else resolve();
		};
		requestAnimationFrame(frame);
	});
}
