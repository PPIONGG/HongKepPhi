"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useId, useState, type CSSProperties } from "react";
import { useListened } from "@/components/ListenedProvider";
import { stories } from "@/data/stories";
import { hand } from "./fonts";
import styles from "./shelf.module.css";
import {
  NO_GLOW,
  buildCabinets,
  glowFromSearch,
  tapeMatches,
  type GlowQuery,
  type Tape,
} from "./tapes";

const CABINETS = buildCabinets(stories);
const TAPES = CABINETS.flatMap((cabinet) => cabinet.tapes);

function cx(...names: Array<string | false | null | undefined>) {
  return names.filter(Boolean).join(" ");
}

function glowNote(glow: GlowQuery, count: number) {
  if (glow.kind === "none") return "";
  const found = count > 0 ? `เทป ${count} ม้วนเรืองแสงอยู่บนชั้น` : "ไม่เจอเทปที่ตรงกัน";
  return glow.kind === "tag" ? `${found} · แท็ก ${glow.tag}` : found;
}

function tapeLabel(tape: Tape, heard: boolean, glowing: boolean) {
  const { title, guest, duration } = tape.story;
  return [
    title,
    guest ? `เล่าโดย ${guest}` : null,
    `ยาว ${duration}`,
    tape.newest ? "ม้วนใหม่" : null,
    heard ? "ฟังแล้ว" : null,
    glowing ? "เรืองแสง" : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

function tapeStyle({ width, height, palette }: Tape) {
  return {
    "--w": `${width}px`,
    "--h": `${height}px`,
    "--body": palette.body,
    "--label": palette.label,
    "--stripe": palette.stripe,
  } as CSSProperties;
}

function TapeFace({ tape }: { tape: Tape }) {
  return (
    <>
      <span className={styles.spineNumber}>{tape.spineNumber}</span>
      <span className={styles.label}>
        <span className={styles.title}>{tape.story.title}</span>
      </span>
      <span className={styles.duration}>{tape.story.duration}</span>
      {tape.seriesBand ? (
        <span
          className={styles.band}
          style={{ "--band": tape.seriesBand } as CSSProperties}
        />
      ) : null}
      {tape.newest ? <span className={styles.newSticker}>ใหม่</span> : null}
      <span className={styles.tick}>
        <Check size={16} strokeWidth={2.6} aria-hidden />
      </span>
    </>
  );
}

export function TapeRoom({ initialGlow }: { initialGlow: GlowQuery }) {
  const [glow, setGlow] = useState(initialGlow);
  const { heard, ready } = useListened();
  const searchId = useId();
  const glowCount = TAPES.filter((tape) => tapeMatches(tape, glow)).length;

  return (
    <div className={cx(styles.room, hand.variable)}>
      <div className={styles.wrap}>
        <header className={styles.top}>
          <h1 className={styles.heading}>ชั้นเทป</h1>
        </header>

        <label className={styles.find} htmlFor={searchId}>
          <span>หาเทป</span>
          <input
            id={searchId}
            type="search"
            value={glow.kind === "text" ? glow.text : ""}
            onChange={(event) => setGlow(glowFromSearch(event.target.value))}
            placeholder="ชื่อเรื่อง คนเล่า หรือแท็ก"
            autoComplete="off"
          />
        </label>
        <p className={styles.glowNote}>
          <span role="status">{glowNote(glow, glowCount)}</span>
          {glow.kind === "none" ? null : (
            <button type="button" onClick={() => setGlow(NO_GLOW)}>
              เลิก
            </button>
          )}
        </p>

        {CABINETS.map(({ channel, tapes }) => (
          <section key={channel.slug} className={styles.cabinet} aria-label={`ตู้ ${channel.name}`}>
            <h2 className={styles.cabinetLabel}>
              ตู้ {channel.name}{" "}
              <span>
                {tapes.length > 0
                  ? `${tapes.length} ม้วน · ม้วนซ้ายสุดเพิ่งเก็บ`
                  : "ยังไม่มีม้วน"}
              </span>
            </h2>
            {tapes.length > 0 ? (
              <ul className={styles.shelf}>
                {tapes.map((tape) => {
                  const glowing = tapeMatches(tape, glow);
                  const isHeard = ready && heard.has(tape.story.slug);
                  return (
                    <li key={tape.story.slug} className={styles.slot}>
                      <Link
                        href={`/stories/${tape.story.slug}`}
                        data-tape={tape.story.slug}
                        aria-label={tapeLabel(tape, isHeard, glowing)}
                        className={cx(
                          styles.tape,
                          glowing && styles.glow,
                          glow.kind !== "none" && !glowing && styles.dim,
                          isHeard && styles.heard,
                        )}
                        style={tapeStyle(tape)}
                      >
                        <TapeFace tape={tape} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className={cx(styles.shelf, styles.shelfEmpty)}>
                <p>{channel.blurb}</p>
              </div>
            )}
          </section>
        ))}

        <p className={styles.legend}>
          ม้วนหนา คือคลิปยาว · แถบสีบนหัวม้วน คือเรื่องในชุดเดียวกัน · สติกเกอร์เขียว คือฟังแล้ว
        </p>
      </div>
    </div>
  );
}
