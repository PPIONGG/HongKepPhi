"use client";

import { useEffect, useRef, useSyncExternalStore, type ComponentProps, type ReactNode } from "react";
import styles from "./radio.module.css";
import { formatFreq, scaleLabels, type Dial } from "./stations";

export type StaticAudio = { context: AudioContext; gain: GainNode };

export function cx(...names: (string | false | null | undefined)[]) {
  return names.filter(Boolean).join(" ");
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** ระยะบนสเกลเป็น px ต่อหนึ่งช่อง ตั้งไว้ใน CSS เพราะเปลี่ยนตามขนาดจอ */
export function readPpm(element: Element) {
  return Number(getComputedStyle(element).getPropertyValue("--ppm")) || 64;
}

export function atPx(at: number, shift = 0) {
  return `calc(${at.toFixed(2)} * var(--ppm) * 1px + ${shift}px)`;
}

const subscribeNothing = () => () => {};

/** false ตอน SSR และตอน hydrate จากนั้นเป็น true ตลอด */
export function useHydrated() {
  return useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
}

export function openStaticAudio(): StaticAudio {
  const context = new AudioContext();
  const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let i = 0; i < samples.length; i += 1) samples[i] = Math.random() * 2 - 1;
  const source = new AudioBufferSourceNode(context, { buffer, loop: true });
  const band = new BiquadFilterNode(context, { type: "bandpass", frequency: 2200, Q: 0.7 });
  const gain = new GainNode(context, { gain: 0 });
  source.connect(band).connect(gain).connect(context.destination);
  source.start();
  return { context, gain };
}

export function useStaticLevel(audio: StaticAudio | null, noise: number) {
  useEffect(() => {
    if (!audio) return;
    audio.gain.gain.setTargetAtTime(noise * 0.14 + 0.003, audio.context.currentTime, 0.04);
  }, [audio, noise]);
}

function StaticCanvas({ noise }: { noise: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const noisy = noise > 0.02;

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const pixels = context.createImageData(canvas.width, canvas.height);
    const draw = () => {
      const data = pixels.data;
      for (let i = 0; i < data.length; i += 4) {
        const value = (Math.random() * 255) | 0;
        data[i] = value;
        data[i + 1] = (value * 0.78) | 0;
        data[i + 2] = (value * 0.5) | 0;
        data[i + 3] = 255;
      }
      context.putImageData(pixels, 0, 0);
    };
    draw();
    if (!noisy) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let onScreen = true;
    const loop = () => {
      draw();
      frame = requestAnimationFrame(loop);
    };
    const sync = () => {
      const run = onScreen && !document.hidden && !motion.matches;
      if (run && !frame) frame = requestAnimationFrame(loop);
      if (!run && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
    const observer = new IntersectionObserver((entries) => {
      onScreen = entries.some((entry) => entry.isIntersecting);
      sync();
    });
    observer.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    sync();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
    };
  }, [noisy]);

  return (
    <canvas
      ref={ref}
      className={styles.static}
      width={240}
      height={64}
      aria-hidden
      style={{ opacity: 0.06 + noise * 0.85 }}
    />
  );
}

/**
 * placed = แถบคลื่นถูกเลื่อนด้วย scrollLeft แล้ว
 * ก่อนหน้านั้น (HTML จาก server หรือคลื่นที่ยังเงียบ) ใช้ translate ให้เข็มชี้ที่ at ตั้งแต่เฟรมแรก
 */
export function DialWindow({
  dial,
  span,
  at,
  noise,
  placed,
  scale,
  children,
}: {
  dial: Dial;
  span: number;
  at: number;
  noise: number;
  placed: boolean;
  scale?: ComponentProps<"div">;
  children?: ReactNode;
}) {
  return (
    <div className={styles.window}>
      <div {...scale} className={styles.scale} data-still={scale ? undefined : ""}>
        <div
          className={styles.band}
          style={placed ? undefined : { translate: `calc(${at.toFixed(2)} * var(--ppm) * -1px) 0` }}
        >
          <div className={styles.rail} style={{ width: atPx(span) }}>
            {scaleLabels(dial, span).map((label) => (
              <span key={label.text} className={styles.mhz} style={{ left: atPx(label.at, -20) }}>
                {label.text}
              </span>
            ))}
            {children}
          </div>
        </div>
      </div>
      <StaticCanvas noise={noise} />
      <div className={styles.needle} aria-hidden />
      <div className={styles.glass} aria-hidden />
    </div>
  );
}

export function Grille({ name }: { name: string }) {
  const words = name.split(" ");
  const last = words.pop();
  return (
    <div className={styles.grille} aria-hidden>
      <span>
        {words.length > 0 ? (
          <>
            {words.join(" ")}
            <br />
          </>
        ) : null}
        {last}
      </span>
    </div>
  );
}

export function Readout({ dial, freq, signal }: { dial: Dial; freq: number; signal: number }) {
  const lit = Math.round(signal * 5);
  return (
    <div className={styles.readout} aria-hidden>
      <span className={styles.freq}>{formatFreq(dial, freq)}</span>
      <span className={styles.fm}>{dial.label}</span>
      <span className={styles.bars}>
        {[0, 1, 2, 3, 4].map((bar) => (
          <i key={bar} data-on={bar < lit ? "" : undefined} />
        ))}
      </span>
    </div>
  );
}

export function Knob({ at }: { at: number }) {
  return (
    <div className={styles.knobWrap} aria-hidden>
      <div className={styles.knob} style={{ rotate: `${(at * 24).toFixed(1)}deg` }} />
      <span>TUNING</span>
    </div>
  );
}

export function SeekButton({
  step,
  onClick,
}: {
  step: -1 | 1;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={styles.seek}
      onClick={onClick}
      disabled={!onClick}
      aria-label={step < 0 ? "คลื่นก่อนหน้า" : "คลื่นถัดไป"}
    >
      {step < 0 ? <PrevIcon /> : <NextIcon />}
    </button>
  );
}

export function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 4.5v15l13-7.5z" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function WarnIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3l10 18H2z" />
      <path d="M12 10v5M12 18h.01" />
    </svg>
  );
}

export function SpeakerIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 9h4l5-4v14l-5-4H4z" />
      <path d="M17 9c1.3 1.6 1.3 4.4 0 6" />
    </svg>
  );
}

export function FileIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    </svg>
  );
}

function PrevIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 5h2v14H6zM20 5v14L9 12z" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16 5h2v14h-2zM4 5v14l11-7z" />
    </svg>
  );
}
