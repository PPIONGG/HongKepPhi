import { useSyncExternalStore } from "react";

export type Lights = "on" | "off";

/** pending คือยังไม่ได้อ่านค่าจากเครื่อง ใช้ตอนเรนเดอร์บนเซิร์ฟเวอร์และตอน hydrate */
export type RoomLights = Lights | "pending";

const STORAGE_KEY = "hong-kep-phi:lights";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const listeners = new Set<() => void>();

// ค่าที่กดในแท็บนี้มาก่อนค่าในเครื่อง ถ้า localStorage เขียนไม่ได้ สวิตช์ก็ยังสลับได้
let chosen: Lights | null = null;

function readStored(): Lights | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "on" || value === "off" ? value : null;
  } catch {
    return null;
  }
}

export function prefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION).matches;
}

// คนที่ขอลดการเคลื่อนไหวเริ่มแบบเปิดไฟ เพราะแสงไฟฉายที่วิ่งตามเมาส์ก็คือภาพเคลื่อนไหวจากการขยับ
function currentLights(): Lights {
  return chosen ?? readStored() ?? (prefersReducedMotion() ? "on" : "off");
}

function subscribe(onChange: () => void) {
  const motion = window.matchMedia(REDUCED_MOTION);
  listeners.add(onChange);
  motion.addEventListener("change", onChange);
  return () => {
    listeners.delete(onChange);
    motion.removeEventListener("change", onChange);
  };
}

export function useRoomLights() {
  return useSyncExternalStore<RoomLights>(subscribe, currentLights, () => "pending");
}

export function switchLights(next: Lights) {
  chosen = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {}
  for (const listener of listeners) listener();
}
