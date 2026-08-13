import { youtubeEmbedUrl } from "@/lib/youtube";

export function YoutubeEmbed({
  youtubeId,
  title,
}: {
  youtubeId: string;
  title: string;
}) {
  return (
    <div className="bg-frame p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-2">
      <div className="aspect-video overflow-hidden bg-night">
        <iframe
          src={youtubeEmbedUrl(youtubeId)}
          title={`เล่นคลิป ${title} จาก YouTube`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
