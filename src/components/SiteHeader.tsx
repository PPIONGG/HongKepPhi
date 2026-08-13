"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RoomClock } from "./RoomClock";

const nav = [
  { href: "/", label: "ชั้นวาง", short: "ชั้นวาง" },
  { href: "/about", label: "เกี่ยวกับห้องนี้", short: "ห้องนี้" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-paper/10 bg-night/85 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2.5 sm:gap-4 sm:px-6 sm:py-3">
        <Link href="/" className="group flex min-h-11 min-w-0 items-center gap-2.5 sm:gap-3">
          <Image
            src="/logo.jpg"
            alt="ตราห้องเก็บผี"
            width={44}
            height={44}
            className="size-10 shrink-0 rounded-[3px] object-cover sm:size-11"
            priority
          />
          <span className="flex min-w-0 flex-col">
            <span className="font-display text-[1.35rem] leading-none text-paper transition-colors duration-200 group-hover:text-ember-soft sm:text-2xl">
              ห้องเก็บผี
            </span>
            <span className="hidden sm:inline">
              <RoomClock />
            </span>
          </span>
        </Link>
        <nav aria-label="หลัก" className="flex shrink-0 items-center">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-11 min-w-11 items-center justify-center px-2.5 text-sm transition-colors duration-200 sm:px-3 ${
                  active
                    ? "text-paper underline decoration-ember decoration-2 underline-offset-8"
                    : "text-dust hover:text-paper"
                }`}
              >
                <span className="sm:hidden">{item.short}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
