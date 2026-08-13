"use client";

/**
 * Vendored from React Bits (TextAnimations/ShinyText, ts-tailwind variant).
 * https://reactbits.dev
 *
 * ตัวนี้ใช้ background-clip: text บน span เดียว ไม่ตัดข้อความทีละตัวอักษร
 * จึงใช้กับภาษาไทยได้ (ต่างจาก SplitText / DecryptedText)
 *
 * แก้จากต้นฉบับ:
 * - ตัดโหมด yoyo / direction / pauseOnHover ที่เว็บนี้ไม่ใช้ออก
 * - หยุด animation เมื่อผู้ใช้เปิด prefers-reduced-motion
 */

import React from "react";
import { motion, useMotionValue, useAnimationFrame, useTransform, useReducedMotion } from "motion/react";

type ShinyTextProps = {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  color?: string;
  shineColor?: string;
  spread?: number;
};

export function ShinyText({
  text,
  speed = 2,
  delay = 0,
  className = "",
  color = "#f3e6d0",
  shineColor = "#e8894a",
  spread = 120,
}: ShinyTextProps) {
  const progress = useMotionValue(0);
  const elapsed = React.useRef(0);
  const lastTime = React.useRef<number | null>(null);
  const still = useReducedMotion();

  const animationDuration = speed * 1000;
  const delayDuration = delay * 1000;

  useAnimationFrame((time) => {
    if (still) {
      lastTime.current = null;
      return;
    }
    if (lastTime.current === null) {
      lastTime.current = time;
      return;
    }

    elapsed.current += time - lastTime.current;
    lastTime.current = time;

    const cycleDuration = animationDuration + delayDuration;
    const cycleTime = elapsed.current % cycleDuration;
    progress.set(cycleTime < animationDuration ? (cycleTime / animationDuration) * 100 : 100);
  });

  const backgroundPosition = useTransform(progress, (p) => `${150 - p * 2}% center`);

  if (still) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className={`inline-block ${className}`}
      style={{
        backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundPosition,
      }}
    >
      {text}
    </motion.span>
  );
}

export default ShinyText;
