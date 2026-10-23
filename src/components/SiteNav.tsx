"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ROOMS = [
  { href: "/", label: "วิทยุ", isActive: (path: string) => path === "/" },
  { href: "/shelf", label: "ชั้นเทป", isActive: (path: string) => path.startsWith("/shelf") },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="มุมในห้อง" className="flex items-center">
      {ROOMS.map((room) => {
        const active = room.isActive(pathname);
        return (
          <Link
            key={room.href}
            href={room.href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-11 cursor-pointer items-center px-2 text-sm transition-colors duration-200 sm:px-3 ${
              active ? "text-paper" : "text-dust hover:text-paper"
            }`}
          >
            <span className={`border-b pb-0.5 ${active ? "border-ember" : "border-transparent"}`}>
              {room.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
