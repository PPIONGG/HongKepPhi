import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col justify-center px-4 py-20 text-center">
      <p className="font-mono text-[11px] tracking-[0.28em] text-ember uppercase">
        HK-000
      </p>
      <h1 className="mt-3 font-serif text-3xl text-pretty text-paper sm:text-5xl">ใบจดนี้ไม่มีในตู้</h1>
      <p className="mt-4 text-dust">
        ลิงก์นี้อาจพิมพ์ผิด หรือเรื่องนั้นยังไม่ถูกเก็บเข้าห้อง
      </p>
      <Link
        href="/"
        className="mx-auto mt-8 inline-flex min-h-12 w-full max-w-xs cursor-pointer items-center justify-center bg-ember px-5 text-sm font-medium text-night hover:bg-ember-soft"
      >
        กลับไปชั้นวาง
      </Link>
    </div>
  );
}
