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
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const imgs = images.length ? images : [];

  return (
    <div>
      <div className="relative overflow-hidden bg-plaster" style={{ aspectRatio: ratios[imgs[active]] || 4 / 5 }}>
        {imgs[active] && (
          <Image
            key={imgs[active]}
            src={imgs[active]}
            alt={alt}
            fill
            priority
            quality={90}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain"
            onLoad={(event) => {
              const image = event.currentTarget;
              if (image.naturalWidth && image.naturalHeight) {
                const ratio = image.naturalWidth / image.naturalHeight;
                setRatios(previous => previous[imgs[active]] === ratio ? previous : { ...previous, [imgs[active]]: ratio });
              }
            }}
          />
        )}
        {badge && (
          <span className="absolute left-5 top-5 bg-espresso/90 px-3 py-1.5 text-[0.55rem] font-light uppercase tracking-wide2 text-porcelain">
            {badge}
          </span>
        )}
      </div>

      {imgs[active] && <a href={imgs[active]} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs text-cognac underline underline-offset-4">Ouvrir la photo en grand</a>}

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
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
