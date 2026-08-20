import { Play } from "lucide-react";
import { youtubeWatchUrl } from "@/lib/youtube";

type YoutubeButtonProps = {
  youtubeId: string;
  title: string;
  size?: "md" | "lg";
  full?: boolean | "mobile";
  label?: string;
};

export function YoutubeButton({
  youtubeId,
  title,
  size = "md",
  full = false,
  label = "ฟังเลย",
}: YoutubeButtonProps) {
  const large = size === "lg";

  return (
    <a
      href={youtubeWatchUrl(youtubeId)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`เปิดฟัง ${title} บน YouTube`}
      className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 bg-ember text-night shadow-[0_0_24px_rgba(210,101,42,0.28)] transition duration-200 hover:bg-ember-soft hover:shadow-[0_0_32px_rgba(232,137,74,0.4)] active:scale-[0.98] ${
        large ? "px-5 py-3 text-base font-medium" : "px-4 py-2 text-sm font-medium"
      } ${full === true ? "w-full" : full === "mobile" ? "w-full sm:w-auto" : ""}`}
    >
      <Play className={large ? "size-4 fill-current" : "size-3.5 fill-current"} aria-hidden />
      {label}
    </a>
  );
}
