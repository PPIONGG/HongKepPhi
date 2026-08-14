"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import { StoryThumb } from "@/components/StoryThumb";
import { youtubeEmbedUrl } from "@/lib/youtube";

export function YoutubeEmbed({
  youtubeId,
  title,
}: {
  youtubeId: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="bg-frame p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-2">
      <div className="relative aspect-video overflow-hidden bg-night">
        {playing ? (
          <iframe
            src={youtubeEmbedUrl(youtubeId, true)}
            title={`เล่นคลิป ${title} จาก YouTube`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`เล่นคลิป ${title}`}
            className="group h-full w-full cursor-pointer"
          >
            <StoryThumb
              youtubeId={youtubeId}
              alt=""
              priority
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.02]"
            />
            <span className="absolute inset-0 bg-night/35 transition duration-300 group-hover:bg-night/20" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-ember text-night shadow-[0_0_32px_rgba(210,101,42,0.45)] transition duration-200 group-hover:bg-ember-soft group-hover:shadow-[0_0_44px_rgba(232,137,74,0.55)] group-active:scale-95 sm:size-20">
                <Play className="size-6 translate-x-0.5 fill-current sm:size-7" aria-hidden />
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
