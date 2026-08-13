import Image from "next/image";
import Link from "next/link";
import { stories } from "@/data/stories";

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
            ไม่ใช่ช่องเล่าเรื่อง เป็นชั้นวางของคนฟัง มี {stories.length} เรื่องที่เก็บไว้ตอนนี้
            คลิปทั้งหมดเป็นของช่องต้นทางบน YouTube
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <Link href="/" className="min-h-11 cursor-pointer content-center hover:text-paper">
            ชั้นวาง
          </Link>
          <Link href="/about" className="min-h-11 cursor-pointer content-center hover:text-paper">
            เกี่ยวกับห้องนี้
          </Link>
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase">
            HK · ของใครของมัน
          </p>
        </div>
      </div>
    </footer>
  );
}
