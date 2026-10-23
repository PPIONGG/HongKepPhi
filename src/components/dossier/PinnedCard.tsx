import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { CATEGORIES, type CategoryId, type Story } from "@/lib/types";
import { WhenHeard } from "./WhenHeard";
import styles from "./dossier.module.css";

const PIN_COLORS: Partial<Record<CategoryId, string>> = {
  home: "#d64541",
  temple: "#e0a526",
  hospital: "#3f8f6b",
};
const OTHER_PIN = "#5b6fd6";

// มุมเอียงคำนวณจาก slug ให้เซิร์ฟเวอร์กับเบราว์เซอร์ได้ค่าเดียวกัน ห้ามสุ่ม
function hash(text: string) {
  let value = 0;
  for (const char of text) value = (value * 31 + char.charCodeAt(0)) % 10007;
  return value;
}

export function PinnedCard({ story, postit }: { story: Story; postit?: ReactNode }) {
  const seed = hash(story.slug);
  const placement = {
    "--tilt": `${(((seed % 9) - 4) * 0.7).toFixed(1)}deg`,
    "--drop": `${(seed % 5) * 5}px`,
    "--pin": PIN_COLORS[story.category] ?? OTHER_PIN,
  } as CSSProperties;

  return (
    <Link href={`/stories/${story.slug}`} className={styles.card} style={placement}>
      {postit && <span className={styles.postit}>{postit}</span>}
      <span className={styles.pin} aria-hidden />
      <span className={styles.caseNumber}>{story.catalog}</span>
      <span className={styles.cardTitle}>{story.title}</span>
      <span className={styles.cardWho}>{story.guest ?? story.channel}</span>
      <span className={styles.cardFoot}>
        <span>{CATEGORIES[story.category].label}</span>
        <span className={styles.cardDuration}>{story.duration}</span>
      </span>
      {story.warnings && story.warnings.length > 0 && (
        <span className={styles.flag}>
          <TriangleAlert aria-hidden className={styles.flagIcon} />
          เนื้อหาหนัก
        </span>
      )}
      <WhenHeard slug={story.slug}>
        <span className={styles.cardStamp}>ฟังแล้ว</span>
      </WhenHeard>
    </Link>
  );
}
