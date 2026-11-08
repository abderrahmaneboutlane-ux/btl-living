"use client";

import { useEffect, useState } from "react";

/** Pure-CSS branded intro. Auto-removes after the animation; also self-destructs
 *  on a timer so it can never linger. */
export default function Curtain() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 2200);
    return () => clearTimeout(t);
  }, []);
  if (gone) return null;
  return (
    <div className="curtain" aria-hidden="true">
      <span className="curtain__mark">BTL&nbsp;LIVING</span>
      <span className="curtain__bar" />
    </div>
  );
}