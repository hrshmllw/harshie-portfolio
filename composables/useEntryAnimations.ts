import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * Entry animations (house style: top to bottom, staggered, overlapping).
 *
 * After the preloader:
 *   1. the hero grid draws itself in (canvas, via `gridDraw`),
 *   2. the nav (`[data-intro="nav"]`) and the hero copy come in together as
 *      the grid finishes: eyebrow, heading per letter, tags.
 *
 * Below the fold, each element animates as it reaches the trigger line:
 *   - `[data-reveal-heading]` per letter
 *   - `[data-reveal-text]`    line by line
 *   - `[data-reveal-item]`    the element itself, fading up as a group
 *   - `.rule-top` / `.rule-bottom` grid lines draw in from the left
 *
 * Initial states live in main.css under `:root.motion`, so there's no flash.
 * Text is split at play time (not up front), so line breaks always match
 * the current layout; splits are reverted once the animation ends.
 * Reduced motion: no `motion` class, nothing is hidden, nothing runs.
 */
const EASE = "power2.out";
const START = "top 85%";
const FROM = {
  heading: { opacity: 0, yPercent: 60 },
  text: { opacity: 0, y: 24 },
  item: { opacity: 0, y: 32 },
};
const TO = { opacity: 1, y: 0, yPercent: 0 };
const DURATION = { heading: 0.6, text: 0.8, item: 0.9 };
const STAGGER = { heading: 0.025, text: 0.07, item: 0.12 };
/** How far the next element in a batch starts after this one. */
const STEP = { heading: 0.2, text: 0.15, item: 0.12 };

type Kind = keyof typeof FROM;

const kindOf = (el: HTMLElement): Kind =>
  el.hasAttribute("data-reveal-heading")
    ? "heading"
    : el.hasAttribute("data-reveal-text")
      ? "text"
      : "item";

export function useEntryAnimations() {
  const { whenPreloaded, gridDraw, motionOn } = useSiteIntro();
  const splits = new Set<SplitText>();
  let ctx: gsap.Context | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let cancelled = false;
  let settleListener: (() => void) | null = null;

  /** Split (if text) and return the nodes to animate, already at their `from` state. */
  const prepare = (el: HTMLElement, kind: Kind) => {
    let targets: Element[] = [el];
    const made: SplitText[] = [];
    // A heading's blinking cursor (its opacity is CSS-animated) waits, hidden,
    // until the letters are in.
    const cursors = kind === "heading" ? [...el.querySelectorAll<HTMLElement>(".hero-cursor")] : [];
    if (cursors.length) gsap.set(cursors, { visibility: "hidden" });
    if (kind === "heading") {
      made.push(new SplitText(el, { type: "words,chars" }));
      targets = made[0].chars;
    } else if (kind === "text") {
      // Several paragraphs (rendered content): split each one in place, so
      // lines never become children of a spaced wrapper.
      const blocks = el.querySelectorAll<HTMLElement>("p, li, blockquote, h3, h4");
      (blocks.length ? [...blocks] : [el]).forEach((block) =>
        made.push(new SplitText(block, { type: "lines" })),
      );
      targets = made.flatMap((split) => split.lines);
    }
    made.forEach((split) => splits.add(split));
    if (!targets.length) targets = [el];
    gsap.set(targets, FROM[kind]);
    gsap.set(el, { visibility: "visible" });
    return { targets, made, cursors };
  };

  const cleanup = (el: HTMLElement, made: SplitText[], cursors: HTMLElement[]) => {
    if (cursors.length) gsap.set(cursors, { clearProps: "visibility" });
    made.forEach((split) => {
      split.revert();
      splits.delete(split);
    });
    gsap.set(el, { clearProps: "opacity,transform,visibility" });
  };

  /** One timeline for a batch, walking it in DOM order with overlapping starts. */
  const play = (els: HTMLElement[], tl = gsap.timeline(), offset = 0) => {
    let at = offset;
    els.forEach((el) => {
      if (el.dataset.revealed) return;
      el.dataset.revealed = "1";
      const kind = kindOf(el);
      const { targets, made, cursors } = prepare(el, kind);
      tl.to(
        targets,
        {
          ...TO,
          duration: DURATION[kind],
          ease: EASE,
          stagger: STAGGER[kind],
          onComplete: () => cleanup(el, made, cursors),
        },
        at,
      );
      at += STEP[kind];
    });
    return tl;
  };

  const drawRules = (rules: HTMLElement[]) => {
    const fresh = rules.filter((el) => !el.dataset.drawn);
    fresh.forEach((el) => (el.dataset.drawn = "1"));
    if (!fresh.length) return;
    gsap.fromTo(fresh, { "--rule": 0 }, {
      "--rule": 1,
      duration: 1.1,
      ease: "power2.inOut",
      stagger: 0.08,
      onComplete: () => gsap.set(fresh, { clearProps: "--rule" }),
    });
  };

  const heroIntro = () => {
    const tl = gsap.timeline();
    const grid = { v: 0 };
    tl.to(grid, {
      v: 1,
      duration: 1.6,
      ease: "none",
      onUpdate: () => (gridDraw.value = grid.v),
    });

    // Nav, in parallel with the hero copy, as the grid finishes.
    const nav = gsap.utils.toArray<HTMLElement>('[data-intro="nav"]');
    gsap.set(nav, { visibility: "visible", opacity: 0, y: -12 });
    nav.forEach((el) => (el.dataset.revealed = "1"));
    tl.to(nav, { opacity: 1, y: 0, duration: 0.6, ease: EASE, stagger: 0.06, clearProps: "opacity,transform,visibility" }, 1.1);

    // Hero copy: the reveal kinds, in DOM order, as one cascade.
    const copy = gsap.utils.toArray<HTMLElement>("[data-intro='hero'] [data-reveal-heading], [data-intro='hero'] [data-reveal-text], [data-intro='hero'] [data-reveal-item]");
    document.querySelectorAll<HTMLElement>("[data-intro='hero']").forEach((el) => (el.dataset.revealed = "1"));
    play(copy, tl, 1.2);
  };

  const scrollReveals = () => {
    const els = gsap.utils
      .toArray<HTMLElement>("[data-reveal-heading], [data-reveal-text], [data-reveal-item]")
      .filter((el) => !el.closest("[data-intro='hero']"));
    ScrollTrigger.batch(els, {
      start: START,
      once: true,
      onEnter: (batch) => play(batch as HTMLElement[]),
    });

    const rules = gsap.utils.toArray<HTMLElement>(".rule-top, .rule-bottom");
    ScrollTrigger.batch(rules, {
      start: "top 92%",
      once: true,
      onEnter: (batch) => drawRules(batch as HTMLElement[]),
    });

    // Anything already scrolled past (a #hash jump), or that can never reach
    // the trigger line at the very bottom of the page: play it now.
    const settle = () => {
      const line = window.innerHeight;
      play(els.filter((el) => !el.dataset.revealed && el.getBoundingClientRect().top < line));
      drawRules(rules.filter((el) => el.getBoundingClientRect().top < line));
    };
    settleListener = settle;
    ScrollTrigger.addEventListener("refresh", settle);
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => self.progress > 0.98 && settle(),
    });
    requestAnimationFrame(settle);

    // Layout changes (show-all projects, fonts) move trigger lines.
    let pending = 0;
    resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    resizeObserver.observe(document.body);
  };

  onMounted(async () => {
    if (!motionOn()) {
      gridDraw.value = 1;
      return;
    }
    gsap.registerPlugin(ScrollTrigger, SplitText);
    await Promise.all([whenPreloaded(), document.fonts?.ready]);
    if (cancelled) return;
    ctx = gsap.context(() => {
      heroIntro();
      scrollReveals();
    });
  });

  onBeforeUnmount(() => {
    cancelled = true;
    resizeObserver?.disconnect();
    if (settleListener) ScrollTrigger.removeEventListener("refresh", settleListener);
    splits.forEach((split) => split.revert());
    splits.clear();
    ctx?.revert();
  });
}
