"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useListened } from "./ListenedProvider";

export function CabinetCode() {
  const { ready, code, heard, applyCode } = useListened();
  const [open, setOpen] = useState(false);
  const [paste, setPaste] = useState("");
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const field = document.createElement("textarea");
      field.value = code;
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function apply() {
    const result = applyCode(paste);
    if (!result.ok) {
      setMessage("รหัสนี้ใช้ไม่ได้ ลองคัดลอกใหม่จากเครื่องเดิม");
      return;
    }
    if (result.added === 0) {
      setMessage("เครื่องนี้จำเรื่องพวกนั้นอยู่แล้ว");
    } else {
      setMessage(`จำเพิ่มอีก ${result.added} เรื่องในเครื่องนี้แล้ว`);
    }
    setPaste("");
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={titleId}
        className="inline-flex min-h-11 cursor-pointer items-center px-2 font-mono text-[11px] tracking-[0.14em] text-dust uppercase hover:text-paper sm:px-3"
      >
        ย้ายเครื่อง
      </button>
      {open ? (
        <div
          id={titleId}
          role="dialog"
          aria-label="ย้ายเรื่องที่ฟังแล้วไปเครื่องอื่น"
          className="absolute top-[calc(100%+0.75rem)] right-0 z-40 w-[min(calc(100vw-2rem),22rem)] border border-frame/30 bg-night px-4 py-4 shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
        >
          <p className="text-sm leading-relaxed text-dust">
            ส่งออกรหัสไปเครื่องอื่น หรือนำรหัสจากมือถือ/คอมมาใส่ที่นี่
          </p>

          <p className="mt-4 font-mono text-[10px] tracking-[0.16em] text-ember uppercase">
            ส่งออก
          </p>
          <div className="mt-2 flex flex-col gap-2">
            <code className="min-h-11 content-center break-all border border-paper/12 bg-cabinet px-3 py-2 font-mono text-xs text-paper">
              {ready ? code : "…"}
            </code>
            <button
              type="button"
              onClick={() => void copyCode()}
              disabled={!ready}
              className="inline-flex min-h-11 cursor-pointer items-center justify-center border border-paper/15 px-4 text-sm text-paper hover:border-ember hover:text-ember-soft disabled:cursor-wait"
            >
              {copied ? "คัดลอกแล้ว" : "Export รหัส"}
            </button>
          </div>
          {ready && heard.size === 0 ? (
            <p className="mt-2 text-xs text-dust">กดว่าฟังแล้วสักเรื่อง รหัสถึงจะมีของให้ย้าย</p>
          ) : null}

          <p className="mt-4 font-mono text-[10px] tracking-[0.16em] text-ember uppercase">
            นำเข้า
          </p>
          <form
            className="mt-2 flex flex-col gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              apply();
            }}
          >
            <label htmlFor="cabinet-code-input" className="sr-only">
              วางรหัสจากเครื่องอื่น
            </label>
            <input
              id="cabinet-code-input"
              value={paste}
              onChange={(event) => setPaste(event.target.value)}
              placeholder="วางรหัสจากเครื่องอื่น"
              autoComplete="off"
              spellCheck={false}
              className="min-h-11 border border-paper/15 bg-cabinet px-3 text-sm text-paper placeholder:text-dust/70"
            />
            <button
              type="submit"
              disabled={!paste.trim()}
              className="inline-flex min-h-11 cursor-pointer items-center justify-center bg-ember px-4 text-sm font-medium text-night hover:bg-ember-soft disabled:cursor-not-allowed disabled:opacity-40"
            >
              Import เข้าเครื่องนี้
            </button>
          </form>
          {message ? (
            <p className="mt-2 text-sm text-paper" role="status">
              {message}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
