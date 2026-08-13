"use client";

/**
 * เผยเนื้อหาทั้งบล็อกตอนเลื่อนถึง
 *
 * ใช้แทน ScrollReveal ของ React Bits ด้วยสองเหตุผล: ScrollReveal ต้องใช้ gsap
 * และมันตัดข้อความทีละคำ ซึ่งภาษาไทยไม่เว้นวรรคระหว่างคำ
 * ตัวนี้ขยับทั้งบล็อก ไม่แตะโครงสร้างตัวอักษร
 *
 * `motion` เคารพ prefers-reduced-motion ให้เองผ่าน useReducedMotion
 */

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function RevealOnScroll({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const still = useReducedMotion();

  if (still) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
