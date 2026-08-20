"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { stories } from "@/data/stories";
import {
  decodeListenedCode,
  encodeListenedCode,
  readListened,
  writeListened,
} from "@/lib/listened";

const catalogBySlug = Object.fromEntries(
  stories.map((story) => [story.slug, story.catalog]),
);
const slugByCatalog = Object.fromEntries(
  stories.map((story) => [story.catalog, story.slug]),
);

type ListenedContextValue = {
  heard: Set<string>;
  ready: boolean;
  code: string;
  toggle: (slug: string) => void;
  applyCode: (code: string) => { ok: boolean; added: number };
};

const ListenedContext = createContext<ListenedContextValue | null>(null);

export function ListenedProvider({ children }: { children: ReactNode }) {
  const [heard, setHeard] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setHeard(new Set(readListened()));
    setReady(true);
  }, []);

  const toggle = useCallback((slug: string) => {
    setHeard((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      writeListened([...next]);
      return next;
    });
  }, []);

  const applyCode = useCallback(
    (raw: string) => {
      const slugs = decodeListenedCode(raw, slugByCatalog);
      if (!slugs) return { ok: false, added: 0 };
      const added = slugs.filter((slug) => !heard.has(slug)).length;
      setHeard((prev) => {
        const next = new Set(prev);
        for (const slug of slugs) next.add(slug);
        writeListened([...next]);
        return next;
      });
      return { ok: true, added };
    },
    [heard],
  );

  const code = useMemo(
    () => encodeListenedCode([...heard], catalogBySlug),
    [heard],
  );

  const value = useMemo(
    () => ({ heard, ready, code, toggle, applyCode }),
    [heard, ready, code, toggle, applyCode],
  );

  return <ListenedContext.Provider value={value}>{children}</ListenedContext.Provider>;
}

export function useListened() {
  const context = useContext(ListenedContext);
  if (!context) {
    throw new Error("useListened ต้องอยู่ใน ListenedProvider");
  }
  return context;
}
