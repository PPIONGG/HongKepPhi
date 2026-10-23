"use client";

import { useListened } from "@/components/ListenedProvider";
import styles from "./dossier.module.css";

export function StampButton({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const { heard, ready, toggle } = useListened();
  const on = heard.has(slug);

  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      disabled={!ready}
      className={`${styles.stampButton} ${on ? styles.stampButtonOn : ""} ${className}`}
    >
      {on ? "ยกเลิกตราฟังแล้ว" : "ประทับตรา ฟังแล้ว"}
    </button>
  );
}

// ตราโผล่หลังอ่านสถานะจากเครื่องเสร็จ เลยขึ้นตามสถานะเดิมนิ่งๆ แล้วค่อยกระแทกเฉพาะตอนกดประทับ
export function PaperStamp({ slug }: { slug: string }) {
  const { heard, ready } = useListened();
  if (!ready) return null;

  return (
    <span
      aria-hidden
      className={`${styles.paperStamp} ${heard.has(slug) ? styles.paperStampOn : ""}`}
    >
      ฟังแล้ว
    </span>
  );
}
