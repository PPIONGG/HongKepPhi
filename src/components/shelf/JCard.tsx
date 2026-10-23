"use client";

import { ArrowRight, Check, Play, Plus, TriangleAlert, X } from "lucide-react";
import Link from "next/link";
import { useId, useLayoutEffect, useRef, type CSSProperties } from "react";
import { useListened } from "@/components/ListenedProvider";
import { getSeriesForStory } from "@/data/series";
import { CATEGORIES } from "@/lib/types";
import { formatListenedAt, youtubeWatchUrl } from "@/lib/youtube";
import styles from "./shelf.module.css";
import type { GlowQuery, Tape } from "./tapes";

type JCardProps = {
  id: string;
  tape: Tape;
  glow: GlowQuery;
  onClose: () => void;
  onOpenTape: (slug: string) => void;
  onGlowTag: (tag: string) => void;
};

export function JCard({ id, tape, glow, onClose, onOpenTape, onGlowTag }: JCardProps) {
  const { heard, ready, toggle } = useListened();
  const cardRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const warningId = useId();
  const { story, palette } = tape;
  const series = getSeriesForStory(story.slug)?.series;
  const warnings = story.warnings ?? [];
  const isHeard = ready && heard.has(story.slug);

  // อยู่ใน top layer จึงลอยเหนือหัวเว็บได้เหมือนต้นแบบ เบราว์เซอร์ที่ไม่มี popover ก็แค่แสดงตามตำแหน่ง fixed
  useLayoutEffect(() => {
    const card = cardRef.current;
    const popover = typeof card?.showPopover === "function";
    if (popover) card.showPopover();
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      if (popover && card.matches(":popover-open")) card.hidePopover();
    };
  }, []);

  function episodeStatus(slug: string | undefined) {
    if (!slug) return "ยังไม่ได้เก็บ";
    if (slug === story.slug) return "ม้วนนี้";
    return ready && heard.has(slug) ? "ฟังแล้ว" : "อยู่บนชั้น";
  }

  return (
    <div
      ref={cardRef}
      id={id}
      popover="manual"
      role="dialog"
      aria-labelledby={titleId}
      className={styles.jcard}
      style={{ "--label": palette.label, "--stripe": palette.stripe } as CSSProperties}
    >
      <div className={styles.j}>
        <div className={styles.jSpine} aria-hidden>
          <b>{tape.spineNumber}</b>
          <span>{story.title}</span>
        </div>
        <div className={styles.jMain}>
          <div className={styles.jHead}>
            <span>SIDE A · {story.catalog}</span>
            <button
              ref={closeRef}
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="ปิดปกเทป"
            >
              <X size={16} strokeWidth={2.2} aria-hidden />
            </button>
          </div>
          <h2 id={titleId}>{story.title}</h2>
          <p className={styles.jWho}>
            เล่าโดย {story.guest ?? "-"} · {story.channel}
          </p>
          <ol className={styles.jTrack}>
            <li>
              <span>A1</span>
              <span className={styles.jDots}>{story.title}</span>
              <span>{story.duration}</span>
            </li>
          </ol>
          <p className={styles.jNotes}>{story.excerpt}</p>
          {warnings.length > 0 ? (
            <p id={warningId} className={styles.jWarn}>
              <b>
                <TriangleAlert size={15} aria-hidden />
                คำเตือนก่อนฟัง
              </b>
              {warnings.join(" · ")}
            </p>
          ) : null}
          <div className={styles.jActions}>
            <a
              className={styles.play}
              href={youtubeWatchUrl(story.youtubeId)}
              target="_blank"
              rel="noopener noreferrer"
              aria-describedby={warnings.length > 0 ? warningId : undefined}
            >
              <Play size={16} fill="currentColor" aria-hidden />
              <span>ฟังม้วนนี้ · {story.duration}</span>
              <span className="sr-only"> บน YouTube</span>
            </a>
            <button
              type="button"
              className={styles.heardToggle}
              aria-pressed={isHeard}
              disabled={!ready}
              onClick={() => toggle(story.slug)}
            >
              {isHeard ? (
                <Check size={16} strokeWidth={2.6} aria-hidden />
              ) : (
                <Plus size={16} strokeWidth={2.2} aria-hidden />
              )}
              <span>{isHeard ? "ฟังแล้ว" : "ติดสติกเกอร์ ฟังแล้ว"}</span>
            </button>
            <Link href={`/stories/${story.slug}`} className={styles.fileLink}>
              เปิดแฟ้ม
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <p className={styles.jPong}>โน้ตจากปอง · {story.note}</p>
          {series ? (
            <div className={styles.jSeries}>
              <b>ม้วนในชุด {series.title}</b>
              <ol>
                {series.episodes
                  .toSorted((a, b) => a.order - b.order)
                  .map(({ order, title, slug }) => (
                    <li key={order}>
                      {slug && slug !== story.slug ? (
                        <button type="button" onClick={() => onOpenTape(slug)}>
                          {order}. {title}
                        </button>
                      ) : (
                        <span>
                          {order}. {title}
                        </span>
                      )}
                      <em>{episodeStatus(slug)}</em>
                    </li>
                  ))}
              </ol>
            </div>
          ) : null}
          <div className={styles.jTags}>
            <b>แท็ก</b> แตะแล้วเทปที่มีแท็กเดียวกันจะเรืองแสง
            <div>
              {story.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={glow.kind === "tag" && glow.tag === tag}
                  onClick={() => onGlowTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <p className={styles.jFoot}>
            เก็บเข้าตู้ {formatListenedAt(story.listenedAt)} · หมวด
            {CATEGORIES[story.category].label}
          </p>
        </div>
      </div>
    </div>
  );
}
