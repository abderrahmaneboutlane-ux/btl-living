"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({
  images,
  alt,
  badge,
}: {
  images: string[];
  alt: string;
  badge?: string;
}) {
  const [active, setActive] = useState(0);
  const imgs = images.length ? images : [];

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden bg-plaster">
        {imgs[active] && (
          <Image
            key={imgs[active]}
            src={imgs[active]}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        )}
        {badge && (
          <span className="absolute left-5 top-5 bg-espresso/90 px-3 py-1.5 text-[0.55rem] font-light uppercase tracking-wide2 text-porcelain">
            {badge}
          </span>
        )}
      </div>

      {imgs.length > 1 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {imgs.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Photo ${i + 1}`}
              aria-current={active === i}
              className={`relative aspect-[4/5] overflow-hidden bg-plaster ring-1 transition-all duration-300 ${
                active === i
                  ? "ring-2 ring-cognac"
                  : "ring-espresso/10 hover:ring-espresso/30"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="140px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}