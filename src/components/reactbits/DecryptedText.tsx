"use client";

/**
 * Vendored from React Bits (TextAnimations/DecryptedText, ts-tailwind variant).
 * https://reactbits.dev
 *
 * ⚠️ ตัวนี้ตัดข้อความทีละตัวอักษร ห้ามใช้กับภาษาไทย
 * สระบน-ล่างและวรรณยุกต์จะหลุดจากพยัญชนะ ใช้กับ Latin/ตัวเลขเท่านั้น
 * ในเว็บนี้ใช้กับรหัสแฟ้ม (HK-011) และความยาวคลิป (43:02)
 *
 * แก้จากต้นฉบับ:
 * - ตัดโหมด reverse / click / toggle ที่เว็บนี้ไม่ใช้ออก เหลือ view กับ hover
 * - แก้บั๊ก a11y: ต้นฉบับใส่ displayText (ข้อความที่ถูกสลับ) ลงใน .sr-only
 *   ทำให้ screen reader อ่านตัวอักษรมั่ว เปลี่ยนเป็นข้อความจริง
 * - ข้ามแอนิเมชันเมื่อผู้ใช้เปิด prefers-reduced-motion
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-";

type DecryptedTextProps = {
  text: string;
  speed?: number;
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  parentClassName?: string;
  animateOn?: "view" | "hover";
};

export function DecryptedText({
  text,
  speed = 45,
  characters = DEFAULT_CHARS,
  className = "",
  encryptedClassName = "",
  parentClassName = "",
  animateOn = "view",
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [revealed, setRevealed] = useState<number>(text.length);
  const [running, setRunning] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const still = useReducedMotion();

  const scramble = useCallback(
    (revealedCount: number) => {
      const pool = characters.split("");
      return text
        .split("")
        .map((char, i) =>
          i < revealedCount || char === " "
            ? char
            : pool[Math.floor(Math.random() * pool.length)]
        )
        .join("");
    },
    [characters, text]
  );

  const start = useCallback(() => {
    if (still || running) return;
    setRevealed(0);
    setDisplayText(scramble(0));
    setRunning(true);
  }, [still, running, scramble]);

  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setRevealed((prev) => {
        const next = prev + 1;
        if (next > text.length) {
          clearInterval(id);
          setRunning(false);
          setDisplayText(text);
          return text.length;
        }
        setDisplayText(scramble(next));
        return next;
      });
    }, speed);

    return () => clearInterval(id);
  }, [running, speed, text, scramble]);

  useEffect(() => {
    if (animateOn !== "view" || still) return;
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            start();
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [animateOn, still, start]);

  const hoverProps =
    animateOn === "hover" ? { onMouseEnter: start } : {};

  return (
    <span
      ref={containerRef}
      className={`inline-block whitespace-pre-wrap ${parentClassName}`}
      {...hoverProps}
    >
      {/* ข้อความจริงเสมอ ไม่ใช่ตัวที่ถูกสลับ — ต้นฉบับพลาดตรงนี้ */}
      <span className="sr-only">{text}</span>

      <span aria-hidden="true">
        {displayText.split("").map((char, index) => (
          <span
            key={index}
            className={index < revealed ? className : encryptedClassName}
          >
            {char}
          </span>
        ))}
      </span>
    </span>
  );
}

export default DecryptedText;
