"use client";

import { useReveal } from "@/lib/useReveal";

/** Wraps children; animates any [data-reveal] descendants in on scroll. */
export default function Reveal({
  children,
  className,
  y,
  stagger,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  stagger?: number;
  as?: "div" | "section" | "ul";
}) {
  const ref = useReveal<HTMLDivElement>({ y, stagger });
  // useReveal returns a ref typed for HTMLDivElement; the element tag is cosmetic
  const Component = Tag as "div";
  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}