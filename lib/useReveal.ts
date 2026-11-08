"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Scroll reveal for any container's [data-reveal] children.
 *
 * Deliberately uses gsap.from(): elements are VISIBLE in CSS by default and the
 * animation starts from a hidden state. If JS never runs, nothing is invisible —
 * the opposite of the usual `opacity:0` + observer pattern, which fails closed.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: { y?: number; stagger?: number; start?: string } = {},
) {
  const ref = useRef<T>(null);
  const { y = 34, stagger = 0.1, start = "top 82%" } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const targets = el.querySelectorAll("[data-reveal]");
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 1.15,
        ease: "expo.out",
        stagger,
        scrollTrigger: { trigger: el, start, once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [y, stagger, start]);

  return ref;
}