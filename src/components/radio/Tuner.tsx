"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  useEffect,
  useEffectEvent,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type UIEvent,
} from "react";
import { useListened } from "@/components/ListenedProvider";
import { CATEGORIES } from "@/lib/types";
import { youtubeWatchUrl } from "@/lib/youtube";
import {
  CheckIcon,
  DialWindow,
  FileIcon,
  Grille,
  Knob,
  PlayIcon,
  PlusIcon,
  Readout,
  SeekButton,
  WarnIcon,
  atPx,
  cx,
  prefersReducedMotion,
  readPpm,
  useHydrated,
  useStaticLevel,
  type StaticAudio,
} from "./parts";
import styles from "./radio.module.css";
import {
  dialAt,
  formatFreq,
  freqAt,
  nearestStation,
  presetOf,
  receive,
  type OnAirBand,
  type Preset,
  type Reception,
} from "./stations";

type Scan = { at: number; target: number };
type Drag = { x: number; left: number; pointer: number; moved: boolean };

const KEYS = new Map<string, (at: number, last: number) => number>([
  ["ArrowRight", (at) => at + 1],
  ["ArrowUp", (at) => at + 1],
  ["ArrowLeft", (at) => at - 1],
  ["ArrowDown", (at) => at - 1],
  ["PageUp", (at) => at + 3],
  ["PageDown", (at) => at - 3],
  ["Home", () => 0],
  ["End", (_, last) => last],
]);

export function Tuner({ band, audio }: { band: OnAirBand; audio: StaticAudio | null }) {
  const { stations, dial, presets } = band;
  const last = stations.length - 1;
  const { heard } = useListened();
  const searchParams = useSearchParams();
  const tag = searchParams.get("tag") || null;
  const hydrated = useHydrated();

  const [freq, setFreq] = useState(stations[last].freq);
  const [scan, setScan] = useState<Scan | null>(null);
  const bodyRef = useRef<HTMLElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const ppm = useRef(64);
  const drag = useRef<Drag | null>(null);
  const wheelAt = useRef(0);

  const reception = receive(stations, dial, freq);
  const onAir = reception.kind === "locked" ? stations[reception.index] : null;
  const noise = 1 - reception.signal;
  const allHeard = stations.every((station) => heard.has(station.story.slug));
  useStaticLevel(audio, noise);

  function nearestNow() {
    const scale = scaleRef.current;
    const now = scale ? freqAt(dial, scale.scrollLeft / ppm.current) : freq;
    return nearestStation(stations, dial, now).index;
  }

  function tune(index: number) {
    const scale = scaleRef.current;
    if (!scale) return;
    const station = stations[Math.min(last, Math.max(0, index))];
    scale.scrollTo({
      left: dialAt(dial, station.freq) * ppm.current,
      behavior: prefersReducedMotion() ? "instant" : "smooth",
    });
  }

  const place = useEffectEvent(() => {
    const scale = scaleRef.current;
    if (!hydrated || !scale) return;
    ppm.current = readPpm(scale);
    scale.style.setProperty("--half", `${scale.clientWidth / 2}px`);
    scale.scrollLeft = dialAt(dial, freq) * ppm.current;
  });

  useLayoutEffect(() => {
    place();
  }, [hydrated]);

  useEffect(() => {
    const scale = scaleRef.current;
    if (!scale) return;
    const observer = new ResizeObserver(() => place());
    observer.observe(scale);
    return () => observer.disconnect();
  }, []);

  const onWheel = useEffectEvent((event: WheelEvent) => {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    event.preventDefault();
    if (event.timeStamp - wheelAt.current < 220) return;
    wheelAt.current = event.timeStamp;
    setScan(null);
    tune(nearestNow() + (event.deltaY > 0 ? 1 : -1));
  });

  useEffect(() => {
    const scale = scaleRef.current;
    if (!scale) return;
    // React ผูก wheel แบบ passive เลยกัน preventDefault ไม่ได้
    const listener = (event: WheelEvent) => onWheel(event);
    scale.addEventListener("wheel", listener, { passive: false });
    return () => scale.removeEventListener("wheel", listener);
  }, []);

  function hop({ at, target }: Scan) {
    const next = at + Math.sign(target - at);
    tune(next);
    setScan(next === target ? null : { at: next, target });
  }

  const hopLater = useEffectEvent(hop);

  useEffect(() => {
    if (!scan) return;
    const timer = window.setTimeout(() => hopLater(scan), prefersReducedMotion() ? 0 : 340);
    return () => window.clearTimeout(timer);
  }, [scan]);

  function startScan() {
    const from = nearestNow();
    const pool = stations.flatMap((station, index) =>
      index !== from && !heard.has(station.story.slug) ? [index] : [],
    );
    if (pool.length === 0) return;
    hop({ at: from, target: pool[Math.floor(Math.random() * pool.length)] });
  }

  function tunePreset(preset: Preset) {
    const target =
      preset.episodes.find((episode) => !heard.has(stations[episode.index].story.slug)) ??
      preset.episodes[0];
    setScan(null);
    tune(target.index);
  }

  function seek(step: -1 | 1) {
    setScan(null);
    tune((nearestNow() + step + stations.length) % stations.length);
  }

  function tuneFromGuide(index: number) {
    setScan(null);
    tune(index);
    bodyRef.current?.scrollIntoView({
      behavior: prefersReducedMotion() ? "instant" : "smooth",
      block: "start",
    });
  }

  function showTag(next: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set("tag", next);
    else params.delete("tag");
    const query = params.toString();
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }

  function onScroll(event: UIEvent<HTMLDivElement>) {
    setFreq(freqAt(dial, event.currentTarget.scrollLeft / ppm.current));
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    setScan(null);
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    drag.current = {
      x: event.clientX,
      left: event.currentTarget.scrollLeft,
      pointer: event.pointerId,
      moved: false,
    };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current) return;
    if ((event.buttons & 1) === 0) {
      drag.current = null;
      return;
    }
    const dx = event.clientX - current.x;
    if (!current.moved) {
      if (Math.abs(dx) <= 3) return;
      current.moved = true;
      event.currentTarget.setPointerCapture(current.pointer);
      event.currentTarget.dataset.dragging = "";
    }
    event.currentTarget.scrollLeft = current.left - dx;
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    drag.current = null;
    if (!current?.moved) return;
    delete event.currentTarget.dataset.dragging;
    tune(nearestNow());
  }

  function onClick(event: MouseEvent<HTMLDivElement>) {
    const mark = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-tune]") : null;
    if (!mark) return;
    setScan(null);
    tune(Number(mark.dataset.tune));
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const move = KEYS.get(event.key);
    if (!move) return;
    event.preventDefault();
    setScan(null);
    tune(move(nearestNow(), last));
  }

  const call = `${dial.label} ${formatFreq(dial, onAir ? onAir.freq : freq)}`;
  const valueText = onAir ? `${call} ${onAir.story.title}` : `${call} ยังจับคลื่นไม่ได้`;

  return (
    <>
      <section ref={bodyRef} className={styles.body} aria-label="วิทยุจูนหาเรื่อง">
        <Grille name={band.channel.name} />
        <div className={styles.main}>
          <DialWindow
            dial={dial}
            span={band.span}
            at={dialAt(dial, freq)}
            noise={noise}
            placed={hydrated}
            scale={{
              ref: scaleRef,
              role: "slider",
              tabIndex: 0,
              "aria-label": "จูนหาเรื่อง",
              "aria-valuemin": stations[0].freq,
              "aria-valuemax": stations[last].freq,
              "aria-valuenow": Number(formatFreq(dial, freq)),
              "aria-valuetext": valueText,
              onScroll,
              onPointerDown,
              onPointerMove,
              onPointerUp: endDrag,
              onPointerCancel: endDrag,
              onClick,
              onKeyDown,
            }}
          >
            {stations.map((station, index) => (
              <span
                key={station.story.slug}
                data-tune={index}
                className={cx(
                  styles.mark,
                  index === last && styles.newest,
                  heard.has(station.story.slug) && styles.heard,
                  tag !== null && station.story.tags.includes(tag) && styles.lit,
                )}
                style={{ left: atPx(dialAt(dial, station.freq), -22) }}
              >
                <b>{station.story.catalog.replace("HK-", "")}</b>
                <i />
              </span>
            ))}
          </DialWindow>
          <p className={styles.howto}>
            <span className={styles.pointer}>
              ลากแถบคลื่น หมุนล้อเมาส์ หรือกดลูกศรซ้ายขวา เพื่อจูนหาเรื่อง
            </span>
            <span className={styles.touch}>ปัดแถบคลื่นซ้ายขวาเพื่อจูนหาเรื่อง</span>
          </p>
          <div className={styles.controls}>
            <SeekButton step={-1} onClick={() => seek(-1)} />
            <Readout dial={dial} freq={freq} signal={reception.signal} />
            <SeekButton step={1} onClick={() => seek(1)} />
          </div>
          <div className={styles.presets} role="group" aria-label="ปุ่มจำคลื่น">
            {presets.map((preset) => (
              <button
                key={preset.number}
                type="button"
                className={styles.preset}
                onClick={() => tunePreset(preset)}
              >
                <b>{preset.number}</b>
                <span>{preset.title}</span>
              </button>
            ))}
            <button
              type="button"
              className={styles.preset}
              data-active={scan ? "" : undefined}
              disabled={allHeard}
              onClick={startScan}
            >
              <b>SCAN</b>
              <span>{allHeard ? "ฟังครบทุกคลื่นแล้ว" : "สุ่มคลื่นที่ยังไม่ฟัง"}</span>
            </button>
          </div>
        </div>
        <Knob at={dialAt(dial, freq)} />
      </section>

      <div className={styles.lower}>
        <NowPlaying band={band} reception={reception} tag={tag} onTag={(item) => showTag(tag === item ? null : item)} />
        <Guide
          band={band}
          onAir={reception.kind === "locked" ? reception.index : null}
          tag={tag}
          onTune={tuneFromGuide}
          onClearTag={() => showTag(null)}
        />
      </div>

      <p role="status" className="sr-only">
        {scan ? "กำลังสุ่มคลื่น" : valueText}
      </p>
    </>
  );
}

function NowPlaying({
  band,
  reception,
  tag,
  onTag,
}: {
  band: OnAirBand;
  reception: Reception;
  tag: string | null;
  onTag: (tag: string) => void;
}) {
  const { heard, ready, toggle } = useListened();
  const warningId = useId();

  if (reception.kind === "searching") {
    return (
      <section className={styles.now}>
        <div className={styles.lost}>
          <div className={styles.meta}>
            <span className={styles.call}>
              {band.dial.label} {formatFreq(band.dial, reception.freq)}
            </span>
          </div>
          <p className={styles.title}>ซ่า…</p>
          <p className={styles.who}>ยังจับคลื่นไม่ได้ หมุนต่ออีกนิด</p>
        </div>
      </section>
    );
  }

  const { index, signal } = reception;
  const { story, freq } = band.stations[index];
  const isHeard = heard.has(story.slug);
  const warned = story.warnings && story.warnings.length > 0 ? story.warnings : null;
  const series = presetOf(band.presets, index);

  return (
    <section className={styles.now}>
      <div
        style={
          signal < 1
            ? { filter: `blur(${((1 - signal) * 5).toFixed(2)}px)`, opacity: 0.35 + signal * 0.65 }
            : undefined
        }
      >
        <div className={styles.meta}>
          <span className={styles.call}>
            {band.dial.label} {formatFreq(band.dial, freq)}
          </span>
          <span>
            {story.catalog} · {CATEGORIES[story.category].label}
          </span>
          {index === band.stations.length - 1 ? <span className={styles.newChip}>เพิ่งเก็บ</span> : null}
          {isHeard ? <span className={styles.heardChip}>ฟังแล้ว</span> : null}
        </div>
        <h1 className={styles.title}>{story.title}</h1>
        <p className={styles.who}>
          {story.guest ?? story.channel} · {story.duration}
        </p>
        <p className={styles.excerpt}>{story.excerpt}</p>
        {warned ? (
          <p id={warningId} className={styles.warn}>
            <WarnIcon />
            <span>มีเนื้อหา {warned.join(", ")}</span>
          </p>
        ) : null}
        <div className={styles.actions}>
          <a
            className={styles.play}
            href={youtubeWatchUrl(story.youtubeId)}
            target="_blank"
            rel="noopener noreferrer"
            aria-describedby={warned ? warningId : undefined}
          >
            <PlayIcon />
            <span>ฟังคลื่นนี้ · {story.duration}</span>
            <span className="sr-only"> บน YouTube</span>
          </a>
          <button
            type="button"
            className={styles.pill}
            aria-pressed={isHeard}
            disabled={!ready}
            onClick={() => toggle(story.slug)}
          >
            {isHeard ? <CheckIcon /> : <PlusIcon />}
            <span>{isHeard ? "ฟังแล้ว" : "กดว่าฟังแล้ว"}</span>
          </button>
          <Link className={styles.file} href={`/stories/${story.slug}`}>
            <FileIcon />
            เปิดแฟ้ม
          </Link>
        </div>
        {series ? (
          <p className={styles.seriesLine}>
            ปุ่มจำคลื่น {series.preset.number} · ชุด{series.preset.title} ตอนที่ {series.order} จาก{" "}
            {series.preset.total}
          </p>
        ) : null}
        <div className={styles.tags}>
          {story.tags.map((item) => (
            <button key={item} type="button" aria-pressed={tag === item} onClick={() => onTag(item)}>
              #{item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Guide({
  band,
  onAir,
  tag,
  onTune,
  onClearTag,
}: {
  band: OnAirBand;
  onAir: number | null;
  tag: string | null;
  onTune: (index: number) => void;
  onClearTag: () => void;
}) {
  const { heard } = useListened();
  const headingId = useId();
  const rows = band.stations.flatMap((station, index) =>
    tag === null || station.story.tags.includes(tag) ? [{ station, index }] : [],
  );

  return (
    <section className={styles.guide} aria-labelledby={headingId}>
      <h2 id={headingId}>ผังรายการ</h2>
      <p className={styles.guideSub}>กดแถวไหนก็จูนไปคลื่นนั้น</p>
      <p className={styles.tagNote} role="status">
        {tag === null ? null : (
          <>
            กำลังดูแท็ก #{tag} · {rows.length} คลื่นเรืองแสงบนหน้าปัด
            <button type="button" onClick={onClearTag}>
              เลิกดู
            </button>
          </>
        )}
      </p>
      {rows.length > 0 ? (
        <ol className={styles.list}>
          {rows.map(({ station, index }) => {
            const { story } = station;
            const isOn = onAir === index;
            return (
              <li key={story.slug} className={isOn ? styles.on : undefined}>
                <button
                  type="button"
                  className={styles.row}
                  aria-current={isOn ? "true" : undefined}
                  onClick={() => onTune(index)}
                >
                  <span className={styles.rowFreq}>{formatFreq(band.dial, station.freq)}</span>
                  <span className={styles.rowTitle}>
                    {story.title}
                    <small>{story.guest ? `${story.catalog} · ${story.guest}` : story.catalog}</small>
                  </span>
                  <span className={styles.rowDur}>{story.duration}</span>
                  <span className={styles.rowHeard}>
                    {heard.has(story.slug) ? (
                      <>
                        <CheckIcon />
                        <span className="sr-only">ฟังแล้ว</span>
                      </>
                    ) : null}
                  </span>
                </button>
                <Link className={styles.rowFile} href={`/stories/${story.slug}`}>
                  <FileIcon />
                  <span className="sr-only">เปิดแฟ้ม {story.title}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className={styles.empty}>ยังไม่มีคลื่นไหนติดแท็กนี้</p>
      )}
    </section>
  );
}
