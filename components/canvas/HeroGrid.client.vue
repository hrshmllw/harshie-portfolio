<script setup lang="ts">
import type { CanvasDrawContext } from "~/composables/useCanvasLoop";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const { morph, corePos, setGlowAvailable } = useGlowMorph();

const SPRING = 12;
/** Larger sigma = softer, less circular light falloff */
const LIGHT_SIGMA = 300;
const BUCKET_COUNT = 18;
const CORE_RADIUS_START = 70;
const CORE_RADIUS_END = 3;

// Scroll parallax: the grid drifts down against the scroll, so it moves
// slower than the page.
const PARALLAX_SHIFT = 0.32; // px of grid lag per px scrolled
const SCROLL_SMOOTHING = 12;

const NEUTRAL = { r: 244, g: 241, b: 236 };
const MAROON_SOFT = { r: 139, g: 42, b: 50 };
const MAROON_BRIGHT = { r: 196, g: 69, b: 74 };
const FILL = "rgba(60, 0, 7, 0.92)";

type FilledCell = { target: number; current: number };

const filled = new Map<string, FilledCell>();
let lastFrameTime = 0;
let lastCell = 36;
let lastCols = 0;
let lastRows = 0;
let smoothScroll = 0;
let scrollReady = false;
/** Vertical parallax offset currently applied to the grid. */
let gridOffsetY = 0;

/** Maps a canvas-local screen point into grid space (undoes the parallax). */
const screenToGrid = (x: number, y: number) => ({ x, y: y - gridOffsetY });

let screenX = new Float32Array(0);
let screenY = new Float32Array(0);

const cellKey = (col: number, row: number) => `${col},${row}`;

const ensureBuffers = (count: number) => {
	if (screenX.length === count) return;
	screenX = new Float32Array(count);
	screenY = new Float32Array(count);
};

const vertIndex = (col: number, row: number, cols: number) =>
	row * (cols + 1) + col;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const easeInCubic = (t: number) => t * t * t;

const mixRgb = (
	a: { r: number; g: number; b: number },
	b: { r: number; g: number; b: number },
	t: number,
) => ({
	r: Math.round(lerp(a.r, b.r, t)),
	g: Math.round(lerp(a.g, b.g, t)),
	b: Math.round(lerp(a.b, b.b, t)),
});

const distToSegment = (
	px: number,
	py: number,
	ax: number,
	ay: number,
	bx: number,
	by: number,
) => {
	const dx = bx - ax;
	const dy = by - ay;
	const len2 = dx * dx + dy * dy;
	if (len2 === 0) return Math.hypot(px - ax, py - ay);
	let t = ((px - ax) * dx + (py - ay) * dy) / len2;
	t = Math.max(0, Math.min(1, t));
	return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
};

const updateSprings = (dt: number, reduced: boolean) => {
	for (const cell of filled.values()) {
		if (reduced) {
			cell.current = cell.target;
			continue;
		}
		cell.current += (cell.target - cell.current) * Math.min(1, SPRING * dt);
		if (Math.abs(cell.target - cell.current) < 0.001) {
			cell.current = cell.target;
		}
	}
	for (const [key, cell] of filled) {
		if (cell.target === 0 && cell.current === 0) filled.delete(key);
	}
};

const onTap = (point: { x: number; y: number }) => {
	if (lastCell === 0) return;

	const grid = screenToGrid(point.x, point.y);
	const col = Math.floor(grid.x / lastCell);
	const row = Math.floor(grid.y / lastCell);
	if (col < 0 || row < 0 || col >= lastCols || row >= lastRows) return;

	const key = cellKey(col, row);
	const existing = filled.get(key);
	if (existing) {
		existing.target = existing.target > 0.5 ? 0 : 1;
	} else {
		filled.set(key, { target: 1, current: 0 });
	}
};

const draw = ({
	ctx,
	width,
	height,
	time,
	pointer,
	reducedMotion,
	canHover,
}: CanvasDrawContext) => {
	ctx.clearRect(0, 0, width, height);

	const rawDt = time - lastFrameTime;
	const dt = lastFrameTime === 0 || rawDt <= 0 ? 1 / 60 : Math.min(0.05, rawDt);
	lastFrameTime = time;
	updateSprings(dt, reducedMotion);

	// Scroll parallax (skipped for reduced motion)
	const scrollTarget =
		reducedMotion || !import.meta.client ? 0 : Math.max(0, window.scrollY);
	if (!scrollReady || rawDt > 0.25 || reducedMotion) {
		smoothScroll = scrollTarget;
		scrollReady = true;
	} else {
		smoothScroll +=
			(scrollTarget - smoothScroll) * Math.min(1, SCROLL_SMOOTHING * dt);
	}
	gridOffsetY = smoothScroll * PARALLAX_SHIFT;
	ctx.save();
	ctx.translate(0, gridOffsetY);

	const morphValue = morph.value;
	const e = easeInCubic(morphValue);
	const glowAvailableNow = canHover && pointer.isInside;
	setGlowAvailable(glowAvailableNow);

	const cell = width < 640 ? 48 : width < 1024 ? 40 : 36;
	const cols = Math.ceil(width / cell) + 1;
	const rows = Math.ceil(height / cell) + 1;
	lastCell = cell;
	lastCols = cols;
	lastRows = rows;

	const vertsX = cols + 1;
	const vertsY = rows + 1;
	ensureBuffers(vertsX * vertsY);

	// Full hover light while morph < 1; condensed as morph rises.
	// At morph === 1 the DOM dot owns the visual.
	const allowHover = glowAvailableNow && morphValue < 1;
	const sigmaScale = lerp(1, 0.04, e);
	// Light follows corePos during morph so collapse/bloom stay under the cursor
	// even when the pointer has already left the canvas for the nav.
	const canvas = canvasRef.value;
	const canvasRect = canvas?.getBoundingClientRect();
	let px = pointer.x;
	let py = pointer.y;
	if (morphValue > 0.001 && canvasRect) {
		px = corePos.value.x - canvasRect.left;
		py = corePos.value.y - canvasRect.top;
	}
	// Light sits under the cursor on screen, so map it into grid space
	const gridPoint = screenToGrid(px, py);
	px = gridPoint.x;
	py = gridPoint.y;

	for (let row = 0; row < vertsY; row++) {
		for (let col = 0; col < vertsX; col++) {
			const i = vertIndex(col, row, cols);
			screenX[i] = col * cell;
			screenY[i] = row * cell;
		}
	}

	// Clicked cells — flat maroon fill under the lines
	for (const [key, cellState] of filled) {
		if (cellState.current < 0.01) continue;
		const [cs, rs] = key.split(",");
		const col = Number(cs);
		const row = Number(rs);
		if (col < 0 || row < 0 || col >= cols || row >= rows) continue;

		const i00 = vertIndex(col, row, cols);
		const i10 = vertIndex(col + 1, row, cols);
		const i11 = vertIndex(col + 1, row + 1, cols);
		const i01 = vertIndex(col, row + 1, cols);

		ctx.beginPath();
		ctx.moveTo(screenX[i00], screenY[i00]);
		ctx.lineTo(screenX[i10], screenY[i10]);
		ctx.lineTo(screenX[i11], screenY[i11]);
		ctx.lineTo(screenX[i01], screenY[i01]);
		ctx.closePath();
		ctx.globalAlpha = cellState.current;
		ctx.fillStyle = FILL;
		ctx.fill();
		ctx.globalAlpha = 1;
	}

	const lightSigma = LIGHT_SIGMA * sigmaScale;
	const invTwoSigma2 = 1 / (2 * lightSigma * lightSigma);
	const peakAlpha = lerp(0.42, 0.85, e);

	type Seg = {
		ax: number;
		ay: number;
		bx: number;
		by: number;
		intensity: number;
	};

	const allSegs: Seg[] = [];
	const lightBuckets: Seg[][] = Array.from({ length: BUCKET_COUNT }, () => []);

	const pushSeg = (ia: number, ib: number) => {
		const ax = screenX[ia];
		const ay = screenY[ia];
		const bx = screenX[ib];
		const by = screenY[ib];

		let intensity = 0;
		if (allowHover) {
			const dist = distToSegment(px, py, ax, ay, bx, by);
			intensity = Math.exp(-(dist * dist) * invTwoSigma2);
			if (intensity < 0.008) intensity = 0;
		}

		const seg = { ax, ay, bx, by, intensity };
		allSegs.push(seg);

		if (intensity > 0) {
			const bi = Math.min(
				BUCKET_COUNT - 1,
				Math.floor(intensity * (BUCKET_COUNT - 1)),
			);
			lightBuckets[bi].push(seg);
		}
	};

	for (let row = 0; row < vertsY; row++) {
		for (let col = 0; col < cols; col++) {
			pushSeg(vertIndex(col, row, cols), vertIndex(col + 1, row, cols));
		}
	}
	for (let col = 0; col < vertsX; col++) {
		for (let row = 0; row < rows; row++) {
			pushSeg(vertIndex(col, row, cols), vertIndex(col, row + 1, cols));
		}
	}

	// Base grid — always neutral (never swapped for maroon)
	ctx.lineCap = "round";
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	for (const s of allSegs) {
		ctx.moveTo(s.ax, s.ay);
		ctx.lineTo(s.bx, s.by);
	}
	ctx.strokeStyle = `rgba(${NEUTRAL.r}, ${NEUTRAL.g}, ${NEUTRAL.b}, 0.035)`;
	ctx.stroke();

	ctx.lineWidth = 1;
	ctx.lineCap = "butt";
	ctx.beginPath();
	for (const s of allSegs) {
		ctx.moveTo(s.ax, s.ay);
		ctx.lineTo(s.bx, s.by);
	}
	ctx.strokeStyle = `rgba(${NEUTRAL.r}, ${NEUTRAL.g}, ${NEUTRAL.b}, 0.1)`;
	ctx.stroke();

	// Soft maroon light overstroke — condenses as morph rises (sigma shrinks,
	// peak brightens) so it reads as shrinking into a point, not fading out.
	if (allowHover) {
		// Crossfade with DOM dot near the end of the collapse
		const lineFade = morphValue >= 0.85 ? 1 - (morphValue - 0.85) / 0.15 : 1;

		ctx.lineCap = "round";
		for (let bi = 0; bi < BUCKET_COUNT; bi++) {
			const segs = lightBuckets[bi];
			if (!segs.length) continue;

			const intensity = (bi + 0.5) / BUCKET_COUNT;
			const light = Math.pow(intensity, 0.7);
			const alpha = light * peakAlpha * lineFade;
			if (alpha < 0.02) continue;

			const color = mixRgb(MAROON_SOFT, MAROON_BRIGHT, light);
			ctx.lineWidth = 1.15 + light * 0.4;
			ctx.beginPath();
			for (const s of segs) {
				ctx.moveTo(s.ax, s.ay);
				ctx.lineTo(s.bx, s.by);
			}
			ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
			ctx.stroke();
		}

		// Bright core orb that tightens into a point as morph rises
		if (morphValue > 0.02 && morphValue < 1 && canvasRect) {
			const radius = lerp(CORE_RADIUS_START, CORE_RADIUS_END, e);
			// Rise then hold, fade into the DOM-dot handoff after 0.85
			const sinEnvelope = Math.sin(
				(Math.PI * Math.min(morphValue, 0.85)) / 0.85,
			);
			const hold = morphValue >= 0.5 ? 1 : sinEnvelope;
			const coreFade = morphValue >= 0.85 ? 1 - (morphValue - 0.85) / 0.15 : 1;
			const coreAlpha = 0.55 * Math.max(sinEnvelope, hold * 0.85) * coreFade;

			if (coreAlpha > 0.02 && radius > 0.5) {
				const gradient = ctx.createRadialGradient(px, py, 0, px, py, radius);
				gradient.addColorStop(
					0,
					`rgba(${MAROON_BRIGHT.r}, ${MAROON_BRIGHT.g}, ${MAROON_BRIGHT.b}, ${coreAlpha})`,
				);
				gradient.addColorStop(
					0.45,
					`rgba(${MAROON_SOFT.r}, ${MAROON_SOFT.g}, ${MAROON_SOFT.b}, ${coreAlpha * 0.45})`,
				);
				gradient.addColorStop(
					1,
					`rgba(${MAROON_SOFT.r}, ${MAROON_SOFT.g}, ${MAROON_SOFT.b}, 0)`,
				);
				ctx.beginPath();
				ctx.fillStyle = gradient;
				ctx.arc(px, py, radius, 0, Math.PI * 2);
				ctx.fill();
			}
		}
	}

	ctx.restore();
};

useCanvasLoop({ canvasRef, draw, onTap });
</script>

<template>
	<canvas
		ref="canvasRef"
		class="pointer-events-none absolute inset-0 h-full w-full"
		aria-hidden="true"
	/>
</template>

