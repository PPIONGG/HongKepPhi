import Image from "next/image";
import Link from "next/link";
import { CabinetCode } from "./CabinetCode";
import { RoomClock } from "./RoomClock";
import { SiteNav } from "./SiteNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-frame/25 bg-night pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:gap-6 sm:px-6 sm:py-3">
        <Link
          href="/"
          className="group flex min-h-11 min-w-0 cursor-pointer items-center gap-2.5 sm:gap-3"
        >
          <span className="shrink-0 bg-frame p-[3px]">
            <Image
              src="/logo.jpg"
              alt="ตราห้องเก็บผี"
              width={44}
              height={44}
              className="size-9 object-cover sm:size-10"
              priority
            />
          </span>
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="font-display text-[1.35rem] leading-none text-paper transition-colors duration-200 group-hover:text-ember-soft sm:text-2xl">
              ห้องเก็บผี
            </span>
            <RoomClock />
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <SiteNav />
          <CabinetCode />
        </div>
      </div>
    </header>
  );
}
