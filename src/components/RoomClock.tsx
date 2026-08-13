"use client";

import { useEffect, useState } from "react";

export function RoomClock() {
  const [label, setLabel] = useState("ในห้องนี้");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const time = new Intl.DateTimeFormat("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now);
      setLabel(`ในห้องนี้ · ${time}`);
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-[10px] tracking-[0.18em] text-dust uppercase">
      {label}
    </span>
  );
}
