"use client";

import type { ReactNode } from "react";
import { useListened } from "@/components/ListenedProvider";

export function WhenHeard({
  slug,
  children,
  otherwise = null,
}: {
  slug: string;
  children: ReactNode;
  otherwise?: ReactNode;
}) {
  const { heard } = useListened();
  return heard.has(slug) ? children : otherwise;
}
