// Pixelate transition: breaks an element into soft square blocks (or resolves
// it back from them) by animating an SVG filter. The filter blurs the page so
// each block takes the average colour of its area, samples one pixel per block,
// spreads it across the block, then softens the block edges.

const FILTER_ID = 'pixelate-transition';

/** Block size both sides of a page-to-page pixelate meet at, in px */
export const PIXEL_MAX = 40;
const SVG_NS = 'http://www.w3.org/2000/svg';

interface FilterParts {
	filter: SVGFilterElement;
	average: SVGFEGaussianBlurElement;
	flood: SVGFEFloodElement;
	tile: SVGFECompositeElement;
	dilate: SVGFEMorphologyElement;
	soften: SVGFEGaussianBlurElement;
}

// Blurs that repeat the edge colour, so the screen edges don't fade to the page behind
function makeBlur(result?: string) {
	const blur = document.createElementNS(SVG_NS, 'feGaussianBlur');
	blur.setAttribute('edgeMode', 'duplicate');
	if (result) blur.setAttribute('result', result);
	return blur;
}

let parts: FilterParts | null = null;

// The filter lives directly in <body>, outside the app, so it survives navigation
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
	const soften = makeBlur(); // soften the block edges

	filter.append(average, flood, tile, repeat, sample, dilate, soften);
	svg.append(filter);
	document.body.append(svg);

	parts = { filter, average, flood, tile, dilate, soften };
	return parts;
}

function setBlock(p: FilterParts, size: number, blur: number) {
	const half = size / 2;
	p.average.setAttribute('stdDeviation', String(size / 3));
	p.soften.setAttribute('stdDeviation', String(blur));
	p.flood.setAttribute('x', String(half));
	p.flood.setAttribute('y', String(half));
	p.tile.setAttribute('width', String(size));
	p.tile.setAttribute('height', String(size));
	p.dilate.setAttribute('radius', String(half));
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export interface PixelateOptions {
	from: number; // block size in px at the start (1 = sharp)
	to: number; // block size in px at the end
	blurFrom?: number; // blur in px at the start
	blurTo?: number; // blur in px at the end
	duration: number; // ms
	background?: string; // page colour behind the element, so edge blocks blend in
}

/**
 * Apply the pixelate filter at a fixed block size and blur (e.g. before revealing
 * a page). Blocks at the screen edge come out partly see-through, so the page
 * behind is coloured to match while pixelated, then reset once sharp again.
 */
export function setPixelated(el: HTMLElement, size: number, blur = 0, background?: string) {
	const p = ensureFilter();
	const root = document.documentElement;
	if (size <= 1.5) {
		el.style.filter = '';
		root.style.backgroundColor = '';
		return;
	}
	// Only the visible screen (plus one block either side, so edge blocks are
	// whole) is filtered, which keeps long pages cheap
	p.filter.setAttribute('x', String(-size));
	p.filter.setAttribute('y', String(-size));
	p.filter.setAttribute('width', String(window.innerWidth + 2 * size));
	p.filter.setAttribute('height', String(window.innerHeight + 2 * size));
	setBlock(p, size, blur);
	if (background) root.style.backgroundColor = background;
	el.style.filter = `url(#${FILTER_ID})`;
}

/** Animate an element's block size and blur; resolves when finished */
export function pixelate(el: HTMLElement, opts: PixelateOptions): Promise<void> {
	const { from, to, blurFrom = 0, blurTo = 0, duration, background } = opts;
	return new Promise((resolve) => {
		const start = performance.now();
		const frame = (now: number) => {
			const t = Math.min((now - start) / duration, 1);
			const e = easeInOut(t);
			setPixelated(el, Math.round(from + (to - from) * e), blurFrom + (blurTo - blurFrom) * e, background);
			if (t < 1) requestAnimationFrame(frame);
			else resolve();
		};
		requestAnimationFrame(frame);
	});
}
