"use client";

import Image from "next/image";
import { useState } from "react";
import { youtubeThumb } from "@/lib/youtube";

type StoryThumbProps = {
  youtubeId: string;
  alt: string;
  preload?: boolean;
  sizes: string;
  className?: string;
};

export function StoryThumb({
  youtubeId,
  alt,
  preload = false,
  sizes,
  className,
}: StoryThumbProps) {
  const [src, setSrc] = useState(youtubeThumb(youtubeId, "max"));

  return (
    <div className="relative size-full">
      <Image
        src={src}
        alt={alt}
        fill
        preload={preload}
        sizes={sizes}
        className={className}
        onLoad={(event) => {
          if (event.currentTarget.naturalWidth < 200) {
            setSrc(youtubeThumb(youtubeId, "hq"));
          }
        }}
        onError={() => setSrc(youtubeThumb(youtubeId, "hq"))}
      />
    </div>
  );
}
