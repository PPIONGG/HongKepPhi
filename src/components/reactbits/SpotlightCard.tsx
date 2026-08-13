"use client";

/**
 * Vendored from React Bits (Components/SpotlightCard, ts-tailwind variant).
 * https://reactbits.dev
 *
 * แก้จากต้นฉบับ:
 * - เพิ่ม prop `as` เพื่อให้ render เป็น <article> ได้ ไม่เสีย semantic เดิม
 * - ถอด class ตกแต่งที่ hardcode ไว้ (rounded-3xl / border-neutral-800 /
 *   bg-neutral-900 / p-8) ออก ให้ผู้เรียกกำหนดเอง จะได้ไม่ตีกับธีมห้องเก็บของ
 * - เพิ่ม guard สำหรับ prefers-reduced-motion และ pointer: fine
 *   (ต้นฉบับไม่มีให้ ระบุไว้ในเอกสารของ React Bits เอง)
 */

import React, { useEffect, useRef, useState } from "react";

type Position = { x: number; y: number };

type SpotlightCardProps = React.PropsWithChildren<{
  className?: string;
  style?: React.CSSProperties;
  spotlightColor?: string;
  as?: React.ElementType;
}>;

function useSpotlightEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(fine.matches && !still.matches);

    sync();
    fine.addEventListener("change", sync);
    still.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      still.removeEventListener("change", sync);
    };
  }, []);

  return enabled;
}

export function SpotlightCard({
  children,
  className = "",
  style,
  spotlightColor = "rgba(210, 101, 42, 0.14)",
  as: Tag = "div",
}: SpotlightCardProps) {
  const ref = useRef<HTMLElement>(null);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const enabled = useSpotlightEnabled();

  const handleMouseMove: React.MouseEventHandler = (event) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => enabled && setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative ${className}`}
      style={style}
    >
      {enabled && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-500 ease-out"
          style={{
            opacity,
            background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
          }}
        />
      )}
      {children}
    </Tag>
  );
}

export default SpotlightCard;
