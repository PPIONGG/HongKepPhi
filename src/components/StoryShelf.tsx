"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CATEGORIES, type CategoryId, type Story } from "@/lib/types";
import { StoryCard } from "./StoryCard";

const filters: Array<{ id: "all" | CategoryId; label: string }> = [
  { id: "all", label: "ทั้งหมด" },
  ...Object.entries(CATEGORIES).map(([id, value]) => ({
    id: id as CategoryId,
    label: value.label,
  })),
];

export function StoryShelf({
  stories,
  featuredSlug,
}: {
  stories: Story[];
  featuredSlug?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | CategoryId>("all");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const searching = needle.length > 0 || category !== "all";
    return stories.filter((story) => {
      if (!searching && featuredSlug && story.slug === featuredSlug) return false;
      const inCategory = category === "all" || story.category === category;
      if (!inCategory) return false;
      if (!needle) return true;
      const haystack = [
        story.title,
        story.guest ?? "",
        story.channel,
        story.excerpt,
        story.note,
        ...story.tags,
        CATEGORIES[story.category].label,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [stories, query, category, featuredSlug]);

  const suggestions = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle.length < 1) return [];
    return stories
      .filter((story) => {
        const text = `${story.title} ${story.channel} ${story.guest ?? ""}`.toLowerCase();
        return text.includes(needle);
      })
      .slice(0, 4);
  }, [stories, query]);

  const searching = query.trim().length > 0 || category !== "all";

  return (
    <section aria-labelledby="shelf-heading" className="mt-10 sm:mt-16">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
        <div>
          <p className="font-mono text-[11px] tracking-[0.28em] text-dust uppercase">
            ชั้นวาง
          </p>
          <h2 id="shelf-heading" className="mt-2 font-serif text-3xl font-semibold text-paper sm:text-4xl">
            เรื่องที่เก็บไว้
          </h2>
          <p className="mt-2 text-sm text-dust" aria-live="polite">
            {searching
              ? `พบ ${visible.length} เรื่องในชั้นนี้`
              : `${stories.length} เรื่องในตู้ เลือกตามสถานที่หรือค้นจากชื่อ`}
          </p>
        </div>
        <div className="relative w-full lg:max-w-md">
          <label htmlFor="shelf-search" className="mb-2 block text-sm text-dust">
            ค้นหาในห้อง
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-dust"
              aria-hidden
            />
            <input
              id="shelf-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ชื่อเรื่อง ช่อง หรือสถานที่"
              autoComplete="off"
              className="min-h-12 w-full border border-paper/15 bg-night/70 pr-4 pl-10 text-base text-paper placeholder:text-dust/70"
            />
          </div>
          {suggestions.length > 0 && (
            <ul className="absolute z-20 mt-1 w-full border border-paper/12 bg-cabinet shadow-xl">
              {suggestions.map((story) => (
                <li key={story.slug}>
                  <Link
                    href={`/stories/${story.slug}`}
                    className="block cursor-pointer px-4 py-3 text-sm text-paper transition-colors duration-200 hover:bg-shelf"
                  >
                    <span className="font-medium">{story.title}</span>
                    <span className="mt-0.5 block text-xs text-dust">
                      {story.channel}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div
        className="chip-row -mx-4 mt-5 px-4 pr-8 pb-2 sm:mx-0 sm:px-0"
        role="tablist"
        aria-label="กรองตามชนิดสถานที่"
      >
        {filters.map((item) => {
          const active = category === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(item.id)}
              className={`min-h-11 shrink-0 cursor-pointer border px-4 text-sm transition-colors duration-200 ${
                active
                  ? "border-ember bg-ember/15 text-paper"
                  : "border-paper/12 bg-transparent text-dust hover:border-paper/25 hover:text-paper"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="mt-10 border border-dashed border-paper/15 px-6 py-14 text-center">
          <p className="font-serif text-3xl text-paper">ชั้นนี้ยังว่าง</p>
          <p className="mx-auto mt-3 max-w-md text-dust">
            ในห้องนี้ยังไม่มีเรื่องที่ตรงกับคำค้นนั้น ลองชื่อช่อง ชื่อสถานที่
            หรือเปิดชั้นทั้งหมดอีกครั้ง
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {filters.slice(1, 5).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory(item.id);
                }}
                className="min-h-11 cursor-pointer border border-paper/15 px-3 text-sm text-dust hover:border-ember hover:text-paper"
              >
                ลองชั้น{item.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            className="mt-5 min-h-11 cursor-pointer border border-paper/20 px-4 text-sm text-paper hover:border-ember hover:text-ember-soft"
          >
            เปิดชั้นทั้งหมด
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 pt-3 sm:mt-8 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
          {visible.map((story, index) => (
            <StoryCard key={story.slug} story={story} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
