"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ALL_CABINETS,
  CHANNELS,
  cabinetCopy,
  cabinetHref,
  presentCabinets,
  storiesInCabinet,
} from "@/lib/channels";
import { CATEGORIES, type CategoryId, type Story } from "@/lib/types";
import { useListened } from "./ListenedProvider";
import { StoryCard } from "./StoryCard";

export function StoryShelf({
  stories,
  featuredSlug,
  activeTag,
  activeCabinet,
}: {
  stories: Story[];
  featuredSlug?: string;
  activeTag?: string;
  activeCabinet: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | CategoryId>("all");
  const [findOpen, setFindOpen] = useState(Boolean(activeTag));
  const [unheardOnly, setUnheardOnly] = useState(false);
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const { heard, ready } = useListened();

  useEffect(() => {
    setCategory("all");
  }, [activeCabinet]);

  const cabinets = useMemo(() => presentCabinets(stories), [stories]);
  const inCabinet = useMemo(
    () => storiesInCabinet(stories, activeCabinet),
    [stories, activeCabinet],
  );
  const copy = cabinetCopy(activeCabinet, stories);
  const cabinetMeta = CHANNELS.find((item) => item.slug === activeCabinet);
  const emptyCabinet = inCabinet.length === 0;

  const filters = useMemo(() => {
    const present = new Set(inCabinet.map((story) => story.category));
    return [
      { id: "all" as const, label: "ทั้งหมด" },
      ...Object.entries(CATEGORIES)
        .filter(([id]) => present.has(id as CategoryId))
        .map(([id, value]) => ({ id: id as CategoryId, label: value.label })),
    ];
  }, [inCabinet]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const searching =
      needle.length > 0 || category !== "all" || Boolean(activeTag) || unheardOnly;
    const filtered = inCabinet.filter((story) => {
      if (
        sort === "newest" &&
        !searching &&
        featuredSlug &&
        story.slug === featuredSlug
      ) {
        return false;
      }
      if (unheardOnly && heard.has(story.slug)) return false;
      if (activeTag && !story.tags.includes(activeTag)) return false;
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
    return sort === "oldest" ? [...filtered].toReversed() : filtered;
  }, [inCabinet, query, category, featuredSlug, activeTag, unheardOnly, heard, sort]);

  const suggestions = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle.length < 1) return [];
    return inCabinet
      .filter((story) => {
        const text = `${story.title} ${story.channel} ${story.guest ?? ""}`.toLowerCase();
        return text.includes(needle);
      })
      .slice(0, 4);
  }, [inCabinet, query]);

  const searching =
    query.trim().length > 0 || category !== "all" || Boolean(activeTag) || unheardOnly;
  const heardInCabinet = inCabinet.filter((story) => heard.has(story.slug)).length;

  return (
    <section id="shelf" aria-labelledby="shelf-heading" className="mt-10 scroll-mt-24 sm:mt-16">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
        <div>
          <p className="font-mono text-[11px] tracking-[0.28em] text-dust uppercase">
            ชั้นวาง
          </p>
          <h2 id="shelf-heading" className="mt-2 font-serif text-3xl font-semibold text-paper sm:text-4xl">
            {emptyCabinet ? copy.title : "อยากฟังเรื่องอื่น"}
          </h2>
          <p className="mt-2 text-sm text-dust" aria-live="polite">
            {emptyCabinet
              ? "ยังไม่มีเรื่องในตู้นี้"
              : searching
                ? `พบ ${visible.length} เรื่อง`
                : ready && heardInCabinet > 0
                  ? `ฟังไปแล้ว ${heardInCabinet} จาก ${inCabinet.length} เรื่องในตู้นี้`
                  : "กดฟังเลยได้ ไม่ต้องเดา"}
          </p>
        </div>
        {emptyCabinet ? null : (
        <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            if (findOpen || (searching && !unheardOnly)) {
              setFindOpen(false);
              setQuery("");
              setCategory("all");
            } else {
              setFindOpen(true);
            }
          }}
          className="inline-flex min-h-11 w-fit cursor-pointer items-center border border-paper/15 px-4 text-sm text-dust hover:border-paper/30 hover:text-paper"
        >
          {findOpen || query.trim() || category !== "all" || activeTag ? "ซ่อนการค้น" : "หาเรื่อง"}
        </button>
        <button
          type="button"
          onClick={() => setUnheardOnly((value) => !value)}
          aria-pressed={unheardOnly}
          className={`inline-flex min-h-11 w-fit cursor-pointer items-center border px-4 text-sm transition-colors duration-200 ${
            unheardOnly
              ? "border-ember bg-ember/15 text-paper"
              : "border-paper/15 text-dust hover:border-paper/30 hover:text-paper"
          }`}
        >
          ยังไม่ฟัง
        </button>
        <div
          className="flex border border-paper/15"
          role="group"
          aria-label="เรียงเรื่อง"
        >
          <button
            type="button"
            onClick={() => setSort("newest")}
            aria-pressed={sort === "newest"}
            className={`inline-flex min-h-11 cursor-pointer items-center px-3 text-sm transition-colors duration-200 ${
              sort === "newest" ? "bg-cabinet text-paper" : "text-dust hover:text-paper"
            }`}
          >
            เพิ่งลง
          </button>
          <button
            type="button"
            onClick={() => setSort("oldest")}
            aria-pressed={sort === "oldest"}
            className={`inline-flex min-h-11 cursor-pointer items-center px-3 text-sm transition-colors duration-200 ${
              sort === "oldest" ? "bg-cabinet text-paper" : "text-dust hover:text-paper"
            }`}
          >
            เรื่องแรกก่อน
          </button>
        </div>
        </div>
        )}
      </div>

      {emptyCabinet || !(findOpen || searching) ? null : (
      <div className="relative mt-5 w-full lg:max-w-md">
          <label htmlFor="shelf-search" className="mb-2 block text-sm text-dust">
            หาเรื่องในตู้
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
      )}

      <div
        className="chip-row -mx-4 mt-5 px-4 pr-8 pb-2 sm:mx-0 sm:px-0"
        role="tablist"
        aria-label="เลือกตู้"
      >
        {cabinets.map((item) => {
          const active = activeCabinet === item.slug;
          const count = storiesInCabinet(stories, item.slug).length;
          return (
            <Link
              key={item.slug}
              href={cabinetHref(item.slug, activeTag)}
              role="tab"
              aria-selected={active}
              className={`flex min-h-11 shrink-0 cursor-pointer flex-col justify-center border px-4 py-2 transition-colors duration-200 ${
                active
                  ? "border-frame bg-cabinet text-paper"
                  : "border-paper/12 bg-transparent text-dust hover:border-frame/50 hover:text-paper"
              }`}
            >
              <span className="font-mono text-[10px] tracking-[0.16em] text-ember uppercase">
                {count === 0 ? "ยังว่าง" : "ตู้"}
              </span>
              <span className="text-sm leading-tight">
                <span className="sm:hidden">{item.short}</span>
                <span className="hidden sm:inline">{item.name}</span>
              </span>
            </Link>
          );
        })}
        {cabinets.length > 1 ? (
          <Link
            href={cabinetHref(ALL_CABINETS, activeTag)}
            role="tab"
            aria-selected={activeCabinet === ALL_CABINETS}
            className={`flex min-h-11 shrink-0 cursor-pointer items-center border px-4 text-sm transition-colors duration-200 ${
              activeCabinet === ALL_CABINETS
                ? "border-frame bg-cabinet text-paper"
                : "border-paper/12 bg-transparent text-dust hover:border-frame/50 hover:text-paper"
            }`}
          >
            ทั้งบ้าน
          </Link>
        ) : null}
      </div>

      {emptyCabinet || !(findOpen || searching) ? null : (
      <div
        className="chip-row -mx-4 mt-3 px-4 pr-8 pb-2 sm:mx-0 sm:px-0"
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
      )}

      {activeTag && (
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-l-2 border-ember bg-cabinet/60 px-4 py-3">
          <p className="text-sm text-dust">
            กำลังดูแท็ก{" "}
            <span className="text-paper">{activeTag}</span>
          </p>
          <Link
            href={cabinetHref(activeCabinet)}
            className="inline-flex min-h-8 cursor-pointer items-center text-sm text-ember-soft underline-offset-4 hover:underline"
          >
            เลิกดูแท็กนี้
          </Link>
        </div>
      )}

      {visible.length === 0 && !searching ? (
        <div className="mt-10 border border-dashed border-paper/15 px-6 py-14 text-center">
          <p className="font-serif text-3xl text-paper">ตู้นี้ยังว่าง</p>
          <p className="mx-auto mt-3 max-w-md text-dust">
            {emptyCabinet
              ? "ปองเปิดตู้ไว้แล้ว ยังไม่ได้หยิบเรื่องใส่ ไว้ฟังจบแล้วค่อยมาลง"
              : "ตอนนี้มีเรื่องเดียวในตู้ และมันอยู่ข้างบนนี้แล้ว ชั้นวางจะเริ่มมีของเมื่อเก็บเรื่องที่สอง"}
          </p>
          {emptyCabinet && cabinetMeta?.youtube ? (
            <a
              href={cabinetMeta.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 cursor-pointer items-center border border-paper/20 px-4 text-sm text-paper hover:border-ember hover:text-ember-soft"
            >
              ไปดูช่องต้นทางบน YouTube
            </a>
          ) : null}
        </div>
      ) : visible.length === 0 ? (
        <div className="mt-10 border border-dashed border-paper/15 px-6 py-14 text-center">
          <p className="font-serif text-3xl text-paper">ชั้นนี้ยังว่าง</p>
          <p className="mx-auto mt-3 max-w-md text-dust">
            ในตู้นี้ยังไม่มีเรื่องที่ตรงกับคำค้นนั้น ลองชื่อเรื่อง ชื่อสถานที่
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
          {activeTag ? (
            <Link
              href={cabinetHref(activeCabinet)}
              className="mt-5 inline-flex min-h-11 cursor-pointer items-center border border-paper/20 px-4 text-sm text-paper hover:border-ember hover:text-ember-soft"
            >
              เปิดชั้นทั้งหมด
            </Link>
          ) : (
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
          )}
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
