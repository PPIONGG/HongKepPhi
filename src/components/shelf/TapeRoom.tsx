"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
} from "react";
import { useListened } from "@/components/ListenedProvider";
import { stories } from "@/data/stories";
import { hand } from "./fonts";
import { JCard } from "./JCard";
import { prefersReducedMotion, switchLights, useRoomLights } from "./lights";
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
const NEWEST_SLUG = TAPES.find((tape) => tape.newest)?.story.slug;

const FLICKER: Keyframe[] = [
  { opacity: 1, easing: "steps(1, end)" },
  { opacity: 0.25, offset: 0.1, easing: "steps(1, end)" },
  { opacity: 0.95, offset: 0.18, easing: "steps(1, end)" },
  { opacity: 0.1, offset: 0.3, easing: "steps(1, end)" },
  { opacity: 0.7, offset: 0.42, easing: "steps(1, end)" },
  { opacity: 0, offset: 0.55 },
];

type Beam = { x: number; y: number; radius: number };

type Mote = {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  phase: number;
};

function cx(...names: Array<string | false | null | undefined>) {
  return names.filter(Boolean).join(" ");
}

function findTape(root: HTMLElement | null, slug: string | null | undefined) {
  if (!root || !slug) return null;
  return root.querySelector<HTMLElement>(`[data-tape="${CSS.escape(slug)}"]`);
}

function shine(dark: HTMLElement | null, beam: Beam, x: number, y: number) {
  beam.x = x;
  beam.y = y;
  dark?.style.setProperty("--lx", `${x}px`);
  dark?.style.setProperty("--ly", `${y}px`);
}

function aim(dark: HTMLElement | null, beam: Beam, target: Element) {
  const rect = target.getBoundingClientRect();
  shine(dark, beam, rect.left + rect.width / 2, rect.top + rect.height * 0.45);
}

function scatterMotes(width: number, height: number): Mote[] {
  return Array.from({ length: width < 640 ? 36 : 70 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: 0.6 + Math.random() * 1.6,
    vx: (Math.random() - 0.5) * 0.15,
    vy: -0.05 - Math.random() * 0.18,
    alpha: 0.25 + Math.random() * 0.55,
    phase: Math.random() * Math.PI * 2,
  }));
}

function driftMote(mote: Mote, width: number, height: number) {
  mote.phase += 0.01;
  mote.x += mote.vx + Math.sin(mote.phase) * 0.08;
  mote.y += mote.vy;
  if (mote.y < -5) {
    mote.y = height + 5;
    mote.x = Math.random() * width;
  }
  if (mote.x < -5) mote.x = width + 5;
  else if (mote.x > width + 5) mote.x = -5;
}

function runDust(canvas: HTMLCanvasElement, beam: Beam) {
  const context = canvas.getContext("2d");
  if (!context) return () => {};
  const motes = scatterMotes(window.innerWidth, window.innerHeight);
  let width = 0;
  let height = 0;
  let frame = 0;

  const resize = () => {
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };
  const draw = () => {
    frame = requestAnimationFrame(draw);
    context.clearRect(0, 0, width, height);
    for (const mote of motes) {
      driftMote(mote, width, height);
      const light = 1 - Math.hypot(mote.x - beam.x, mote.y - beam.y) / beam.radius;
      if (light <= 0) continue;
      context.fillStyle = `rgba(255, 236, 205, ${(mote.alpha * light).toFixed(3)})`;
      context.beginPath();
      context.arc(mote.x, mote.y, mote.size, 0, Math.PI * 2);
      context.fill();
    }
  };
  const start = () => {
    if (frame === 0 && document.visibilityState === "visible") {
      frame = requestAnimationFrame(draw);
    }
  };
  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
  };
  const onVisibility = () => (document.visibilityState === "visible" ? start() : stop());

  resize();
  start();
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", onVisibility);
  return () => {
    stop();
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", onVisibility);
    context.clearRect(0, 0, width, height);
  };
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
  const lights = useRoomLights();
  const live = lights !== "pending";
  const [glow, setGlow] = useState(initialGlow);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const { heard, ready } = useListened();
  const searchId = useId();
  const cardId = useId();
  const roomRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLCanvasElement>(null);
  const beamRef = useRef<Beam>({ x: 0, y: 0, radius: 230 });
  const glowCount = TAPES.filter((tape) => tapeMatches(tape, glow)).length;
  const openTape = TAPES.find((tape) => tape.story.slug === openSlug);

  useEffect(() => {
    const dark = darkRef.current;
    const beam = beamRef.current;
    const fitBeam = () => {
      beam.radius = window.innerWidth < 640 ? 150 : 230;
      dark?.style.setProperty("--beam", `${beam.radius}px`);
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse" || event.buttons) {
        shine(dark, beam, event.clientX, event.clientY);
      }
    };
    const onDown = (event: PointerEvent) => shine(dark, beam, event.clientX, event.clientY);

    fitBeam();
    const newest = findTape(roomRef.current, NEWEST_SLUG);
    const rect = newest?.getBoundingClientRect();
    if (newest && rect && rect.bottom > 0 && rect.top < window.innerHeight) {
      aim(dark, beam, newest);
    } else {
      shine(dark, beam, window.innerWidth / 2, window.innerHeight * 0.55);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("resize", fitBeam);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", fitBeam);
    };
  }, []);

  useEffect(() => {
    const canvas = dustRef.current;
    if (lights !== "off" || !canvas || prefersReducedMotion()) return;
    return runDust(canvas, beamRef.current);
  }, [lights]);

  function closeCard() {
    setOpenSlug(null);
    findTape(roomRef.current, openSlug)?.focus({ preventScroll: true });
  }

  const onEscape = useEffectEvent(() => closeCard());

  useEffect(() => {
    if (!openSlug) return;
    const tape = findTape(roomRef.current, openSlug);
    const frame = tape
      ? requestAnimationFrame(() => aim(darkRef.current, beamRef.current, tape))
      : 0;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onEscape();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
    };
  }, [openSlug]);

  function glowTag(tag: string) {
    setGlow((current) =>
      current.kind === "tag" && current.tag === tag ? NO_GLOW : { kind: "tag", tag },
    );
  }

  function flipLights() {
    const dark = darkRef.current;
    const next = lights === "off" ? "on" : "off";
    for (const animation of dark?.getAnimations() ?? []) animation.cancel();
    switchLights(next);
    if (next === "on" && !prefersReducedMotion()) dark?.animate(FLICKER, 800);
  }

  function aimAtTape(event: FocusEvent<HTMLElement>) {
    aim(darkRef.current, beamRef.current, event.currentTarget);
  }

  return (
    <div ref={roomRef} className={cx(styles.room, hand.variable)} data-lights={lights}>
      <div className={styles.wrap}>
        <header className={styles.top}>
          <h1 className={styles.heading}>ชั้นเทป</h1>
          <button
            type="button"
            className={styles.switch}
            aria-pressed={lights !== "off"}
            disabled={!live}
            onClick={flipLights}
          >
            <span className={styles.plate} aria-hidden>
              <span className={styles.lever} />
            </span>
            <span>ไฟในห้อง</span>
            <b aria-hidden>{lights === "off" ? "ปิด" : "เปิด"}</b>
          </button>
        </header>
        <p className={styles.hint}>
          {lights === "off" ? (
            <>
              <span className={styles.forMouse}>
                ห้องนี้ปิดไฟอยู่ ขยับเมาส์เพื่อส่องไฟฉาย หรือกดสวิตช์เพื่อเปิดไฟ
              </span>
              <span className={styles.forTouch}>
                ห้องนี้ปิดไฟอยู่ แตะตรงไหนก็ได้เพื่อส่องไฟฉาย หรือกดสวิตช์เพื่อเปิดไฟ
              </span>
            </>
          ) : (
            "เปิดไฟแล้ว อ่านง่ายขึ้น กดสวิตช์อีกครั้งถ้าอยากกลับไปส่องไฟฉาย"
          )}
        </p>

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
          {live && glow.kind !== "none" ? (
            <button type="button" onClick={() => setGlow(NO_GLOW)}>
              เลิก
            </button>
          ) : null}
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
                  const { slug } = tape.story;
                  const glowing = tapeMatches(tape, glow);
                  const isHeard = ready && heard.has(slug);
                  const isOpen = slug === openSlug;
                  const shared = {
                    "data-tape": slug,
                    "aria-label": tapeLabel(tape, isHeard, glowing),
                    className: cx(
                      styles.tape,
                      glowing && styles.glow,
                      glow.kind !== "none" && !glowing && styles.dim,
                      isHeard && styles.heard,
                      isOpen && styles.selected,
                    ),
                    style: tapeStyle(tape),
                    onFocus: aimAtTape,
                  };
                  return (
                    <li key={slug} className={styles.slot}>
                      {live ? (
                        <button
                          type="button"
                          {...shared}
                          aria-haspopup="dialog"
                          aria-expanded={isOpen}
                          aria-controls={isOpen ? cardId : undefined}
                          onClick={() => setOpenSlug(slug)}
                        >
                          <TapeFace tape={tape} />
                        </button>
                      ) : (
                        <Link href={`/stories/${slug}`} {...shared}>
                          <TapeFace tape={tape} />
                        </Link>
                      )}
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
      <div ref={darkRef} className={styles.dark} aria-hidden />
      <canvas ref={dustRef} className={styles.dust} aria-hidden />
      {openTape ? (
        <JCard
          key={openTape.story.slug}
          id={cardId}
          tape={openTape}
          glow={glow}
          onClose={closeCard}
          onOpenTape={setOpenSlug}
          onGlowTag={glowTag}
        />
      ) : null}
    </div>
  );
}
