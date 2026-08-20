"use client";

import { useEffect, useState } from "react";

export function RoomClock() {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <time className="font-mono text-[10px] tracking-[0.18em] text-dust uppercase">
      <span className="sm:hidden">{time}</span>
      <span className="hidden sm:inline">ในห้องนี้ · {time}</span>
    </time>
  );
}
