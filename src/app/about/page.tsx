import type { Metadata } from "next";
import Link from "next/link";
import { stories } from "@/data/stories";

export const metadata: Metadata = {
  title: "เกี่ยวกับห้องนี้",
  description: "ห้องเก็บผีคือชั้นวางเรื่องผีจาก YouTube ที่เจ้าของห้องฟังแล้วเก็บไว้",
};

const reasons = [
  {
    catalog: "01",
    title: "ฟังก่อน แล้วค่อยเก็บ",
    body: "ไม่ได้กวาดทุกคลิปมาใส่ตู้ เก็บเฉพาะเรื่องที่ฟังจบแล้วยังวนอยู่ในหัวตอนเช้า",
  },
  {
    catalog: "02",
    title: "มีใบจด ไม่ใช่แค่ลิงก์",
    body: "แต่ละเรื่องมีบันทึกสั้นๆ ว่าทำไมถึงเก็บ เผื่อใครเข้ามาแล้วอยากรู้ว่าควรเปิดเรื่องไหน",
  },
  {
    catalog: "03",
    title: "กดแล้วไปคลิปต้นฉบับ",
    body: "ห้องนี้ไม่แย่งช่องผู้เล่า แค่ชี้ทางกลับไปฟังบน YouTube ให้ถึงคลิปนั้นๆ",
  },
];

export default function AboutPage() {
  return (
    <article className="mx-auto w-full max-w-4xl px-4 pt-8 pb-16 sm:px-6 sm:pt-12">
      <p className="font-mono text-[11px] tracking-[0.28em] text-ember uppercase">
        เกี่ยวกับห้องนี้
      </p>
      <h1 className="mt-3 font-serif text-3xl leading-tight font-semibold text-pretty text-paper sm:text-6xl">
        ไม่ได้สะสมคลิป
        <br />
        สะสมเรื่องที่ยังวน
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-pretty text-paper/85 sm:mt-6 sm:text-lg">
        ห้องเก็บผีเกิดจากนิสัยฟังเรื่องผีบน YouTube ตอนดึก แล้วตื่นมาจำได้แค่เรื่องเดียว
        เลยทำเป็นชั้นวางส่วนตัว ไม่จัดอันดับ และไม่พยายามครอบคลุมทุกช่อง
      </p>

      <ol className="mt-8 grid gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4">
        {reasons.map((item) => (
          <li key={item.catalog} className="border border-paper/10 bg-cabinet px-4 py-5 sm:px-5 sm:py-6">
            <p className="font-mono text-[11px] tracking-[0.2em] text-ember">
              {item.catalog}
            </p>
            <h2 className="mt-3 font-serif text-xl text-paper sm:text-2xl">{item.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-dust">{item.body}</p>
          </li>
        ))}
      </ol>

      <p className="mt-8 text-base leading-relaxed text-dust sm:mt-10">
        ตอนนี้มี {stories.length} เรื่องในตู้ ถ้าเข้ามาแล้วอยากฟังต่อ
        เริ่มจากชั้นวางด้านหน้า หรือเปิดเรื่องที่เพิ่งเก็บก่อน
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-12 w-full cursor-pointer items-center justify-center bg-ember px-5 text-sm font-medium text-night hover:bg-ember-soft sm:mt-8 sm:w-auto"
      >
        เข้าชั้นวาง
      </Link>
    </article>
  );
}
