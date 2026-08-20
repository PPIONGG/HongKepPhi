import Image from "next/image";
import { stories } from "@/data/stories";
import { SITE_AUTHOR, siteBuildLabel } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-8 border-t border-paper/10 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 text-sm text-dust sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:px-6 sm:py-10">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt=""
              width={36}
              height={36}
              className="size-9 rounded-[3px] object-cover"
            />
            <p className="font-display text-2xl text-paper">ห้องเก็บผี</p>
          </div>
          <p className="mt-2 max-w-md leading-relaxed">
            ปองไม่ได้เล่าเอง นั่งฟังแล้วเลือกมาให้เพื่อนพี่น้อง มี {stories.length}{" "}
            เรื่องในตู้ คลิปเป็นของช่องต้นทางบน YouTube
          </p>
        </div>
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase">
            ทักปอง
          </p>
          <p className="text-paper">{SITE_AUTHOR.name}</p>
          <a
            href={SITE_AUTHOR.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 cursor-pointer items-center hover:text-paper"
          >
            GitHub
          </a>
          {SITE_AUTHOR.facebook ? (
            <a
              href={SITE_AUTHOR.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 cursor-pointer items-center hover:text-paper"
            >
              Facebook
            </a>
          ) : null}
          {SITE_AUTHOR.line ? (
            <a
              href={SITE_AUTHOR.line}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 cursor-pointer items-center hover:text-paper"
            >
              LINE
            </a>
          ) : null}
          {SITE_AUTHOR.instagram ? (
            <a
              href={SITE_AUTHOR.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 cursor-pointer items-center hover:text-paper"
            >
              Instagram
            </a>
          ) : null}
          <p className="mt-2 font-mono text-[11px] tracking-[0.18em] uppercase">
            HK · {siteBuildLabel()}
          </p>
        </div>
      </div>
    </footer>
  );
}
