# ชุดเรื่อง คำเตือนเนื้อหา และหมวดที่โตได้ — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ให้เว็บ ห้องเก็บผี แสดงชุดเรื่องที่เล่าต่อกันเป็นตอนๆ เตือนเนื้อหาหนักก่อนคนกดฟัง และมีลิสต์หมวดที่โตตามของจริงแทนที่จะตันตอนเจอเรื่องแปลก

**Architecture:** ชุดเรื่องเก็บใน `src/data/series.ts` เป็นแหล่งเดียว โดย `Story` ไม่มีฟิลด์ชี้กลับ — เว็บหาย้อนกลับจาก `episodes[].slug` ตอนที่ยังไม่เก็บคือตอนที่ไม่มี `slug` คำเตือนเป็น `warnings?: string[]` ธรรมดาใน `Story` แสดงทุกที่ที่มีปุ่มยิงเข้า YouTube ส่วนหมวดเพิ่มเป็น 12 อันโดยมี `other` เป็นที่พักถาวร แล้วให้ปุ่มกรองสร้างจากหมวดที่มีเรื่องอยู่จริง

**Tech Stack:** Next.js 16.3 (App Router, Turbopack), React 19.2, TypeScript 5, Tailwind CSS 4, lucide-react

**Spec:** `docs/superpowers/specs/2026-08-14-series-and-warnings-design.md`

## Global Constraints

- **ไม่มี test framework ในเรพนี้** — `package.json` มีแค่ `dev` / `build` / `start` / `lint` รอบตรวจของแผนนี้คือ `npx tsc --noEmit` + `npx eslint src` + `curl` ยิงใส่ dev server ที่รันอยู่ ห้ามติดตั้ง vitest/jest เพิ่มโดยไม่ถามเจ้าของเรพก่อน
- **ห้ามเพิ่ม dependency ใหม่** — ใช้ `lucide-react`, `motion` ที่มีอยู่แล้วเท่านั้น (ตามข้อจำกัดที่เรพตั้งไว้ใน design doc ของ React Bits)
- **ห้ามใช้ text animation ของ React Bits กับข้อความไทย** — `DecryptedText` ตัดข้อความทีละตัวอักษรแล้วสระ/วรรณยุกต์จะหลุด ใช้ได้เฉพาะ Latin/ตัวเลข (เช่น `HK-001`)
- **ปุ่มและลิงก์ที่กดได้ต้องสูงอย่างน้อย 44px** — โค้ดเดิมใช้ `min-h-11` กับ `cursor-pointer` ทุกจุด
- **ชื่อ icon จาก lucide-react คือ `TriangleAlert`** — ไม่ใช่ `AlertTriangle` (ยืนยันจาก `node_modules/lucide-react/dist/lucide-react.d.ts:21207`)
- **สีที่ใช้ได้** — `paper`, `dust`, `night`, `cabinet`, `shelf`, `frame`, `slip`, `ember`, `ember-soft`, `sage`, `tape` (นิยามใน `src/app/globals.css`)
- **dev server** — ถ้ายังไม่รัน ให้เปิดด้วย `npm run dev` ก่อนเริ่ม แล้วปล่อยรันยาวตลอดการทำงาน

---

### Task 1: เพิ่มหมวดใหม่ 5 อัน และซ่อนปุ่มกรองที่ไม่มีเรื่อง

เพิ่ม `hospital` / `military` / `water` / `ruins` / `other` เข้า `CATEGORIES` แล้วให้ `StoryShelf` สร้างปุ่มกรองจากหมวดที่มีเรื่องอยู่จริงเท่านั้น สองอย่างนี้ต้องมาคู่กัน — เพิ่มหมวดอย่างเดียวจะได้ปุ่ม 13 ปุ่มที่กดแล้วว่าง 11 ปุ่ม

**Files:**
- Modify: `src/lib/types.ts:1-9` (object `CATEGORIES`)
- Modify: `src/components/StoryShelf.tsx:9-15` (module-level `const filters`)

**Interfaces:**
- Consumes: ไม่มี — task แรก
- Produces: `CategoryId` ขยายเป็น 12 ค่า (`"home" | "hotel" | "school" | "forest" | "temple" | "road" | "hospital" | "military" | "water" | "ruins" | "mix" | "other"`) — type นี้ derive จาก `keyof typeof CATEGORIES` อยู่แล้ว ไม่ต้องแก้บรรทัด `export type CategoryId`

- [ ] **Step 1: เพิ่ม 5 หมวดใหม่ใน `CATEGORIES`**

แทนที่ object `CATEGORIES` ใน `src/lib/types.ts` ทั้งก้อนด้วยอันนี้ (ลำดับสำคัญ — ปุ่มกรองเรียงตามลำดับนี้ และ `mix` กับ `other` ต้องอยู่ท้ายสุด):

```ts
export const CATEGORIES = {
  home: { label: "บ้าน", hint: "บ้าน ห้องเช่า คอนโด" },
  hotel: { label: "โรงแรม", hint: "โรงแรม ที่พัก" },
  school: { label: "โรงเรียน", hint: "โรงเรียน มหาลัย" },
  forest: { label: "ป่าเขา", hint: "ป่า เขา ทางเปลี่ยว" },
  temple: { label: "วัด", hint: "วัด สถานที่ศักดิ์สิทธิ์" },
  road: { label: "ถนน", hint: "รถ ทาง เดินทาง" },
  hospital: { label: "โรงพยาบาล", hint: "โรงพยาบาล คลินิก ห้องดับจิต" },
  military: { label: "ทหาร", hint: "ค่ายทหาร เกณฑ์ทหาร" },
  water: { label: "ทะเล/แม่น้ำ", hint: "ทะเล เรือ แม่น้ำ คนจมน้ำ" },
  ruins: { label: "ตึกร้าง", hint: "ตึกร้าง คอนโดร้าง โรงงานร้าง" },
  mix: { label: "รวมเรื่อง", hint: "คลิปรวมหลายตอน" },
  other: { label: "อื่นๆ", hint: "ที่ที่ยังไม่มีชั้นของตัวเอง" },
} as const;
```

- [ ] **Step 2: ตรวจว่ายัง compile ผ่าน**

Run: `npx tsc --noEmit`
Expected: ไม่มี output (ผ่าน) — `CategoryId` ขยายเองอัตโนมัติ ไม่มีที่ไหนพัง

- [ ] **Step 3: ยืนยันว่าปุ่มกรองงอกเป็น 13 ปุ่ม (คือปัญหาที่กำลังจะแก้)**

Run:
```bash
curl -s http://localhost:3000/ | grep -o 'role="tab"' | wc -l | tr -d ' '
```
Expected: `13` — นี่คืออาการที่ Step 4-5 จะแก้ ถ้าได้ `8` แปลว่า Step 1 ยังไม่มีผล (ห้ามใช้ `grep -c` — HTML อยู่บรรทัดเดียว จะได้ `1` เสมอ) ให้เช็คว่า dev server รันอยู่จริง

- [ ] **Step 4: ย้าย `filters` เข้าไปในคอมโพเนนต์ให้คำนวณจากเรื่องที่มีจริง**

ลบ `const filters` ระดับโมดูล (`src/components/StoryShelf.tsx:9-15`) ทั้งก้อนออก:

```ts
const filters: Array<{ id: "all" | CategoryId; label: string }> = [
  { id: "all", label: "ทั้งหมด" },
  ...Object.entries(CATEGORIES).map(([id, value]) => ({
    id: id as CategoryId,
    label: value.label,
  })),
];
```

แล้วเพิ่มก้อนนี้ข้างในฟังก์ชัน `StoryShelf` ใต้บรรทัด `const [category, setCategory] = useState<"all" | CategoryId>("all");`:

```ts
  const filters = useMemo(() => {
    const present = new Set(stories.map((story) => story.category));
    return [
      { id: "all" as const, label: "ทั้งหมด" },
      ...Object.entries(CATEGORIES)
        .filter(([id]) => present.has(id as CategoryId))
        .map(([id, value]) => ({ id: id as CategoryId, label: value.label })),
    ];
  }, [stories]);
```

`useMemo` ถูก import อยู่แล้วที่บรรทัด 5 ไม่ต้องเพิ่ม import

- [ ] **Step 5: ตรวจว่าปุ่มเหลือเท่าที่มีเรื่องจริง**

Run:
```bash
npx tsc --noEmit && npx eslint src
curl -s http://localhost:3000/ | grep -o 'role="tab"' | wc -l | tr -d ' '
```
Expected: tsc/eslint ไม่มี output แล้ว `grep -c` ได้ `2` (ทั้งหมด + บ้าน) เพราะตู้มีเรื่องเดียวหมวด `home`

- [ ] **Step 6: ตรวจว่าปุ่มที่เหลือคือปุ่มที่ถูกต้อง**

Run:
```bash
curl -s http://localhost:3000/ | grep -oE 'role="tab"[^>]*>[^<]*' | grep -oE '>[^<]*$'
```
Expected: สองบรรทัดคือ `>ทั้งหมด` และ `>บ้าน` — ต้องไม่มี `>โรงพยาบาล` หรือหมวดอื่นที่ยังไม่มีเรื่อง

(Task 2 จะเปลี่ยน `category` ของเรื่องนี้เป็น `other` ตอนนั้นปุ่มที่สองจะกลายเป็น
`>อื่นๆ` แทน — ยังเป็น 2 ปุ่มเหมือนเดิม ไม่ต้องตกใจ)

- [ ] **Step 7: Commit**

```bash
git add src/lib/types.ts src/components/StoryShelf.tsx
git commit -m "เพิ่มหมวดสถานที่ 5 อัน แล้วซ่อนปุ่มกรองของชั้นที่ยังไม่มีของ"
```

---

### Task 2: คำเตือนเนื้อหา

เพิ่มฟิลด์ `warnings` ใน `Story` สร้างคอมโพเนนต์สองแบบ (เต็ม/ย่อ) แล้ววางในทุกที่ที่มีปุ่มยิงเข้า YouTube ได้ทันที

**Files:**
- Modify: `src/lib/types.ts` (type `Story`)
- Create: `src/components/ContentWarnings.tsx`
- Modify: `src/app/stories/[slug]/page.tsx`
- Modify: `src/components/StoryCard.tsx`
- Modify: `src/components/FeaturedStory.tsx`
- Modify: `src/data/stories.ts`

**Interfaces:**
- Consumes: `CATEGORIES` ที่ Task 1 ขยายแล้ว (ไม่ได้ใช้ตรงๆ แต่ต้องอยู่บน Task 1)
- Produces:
  - `ContentWarnings({ warnings, className }: { warnings?: string[]; className?: string })` — แถบเต็ม คืน `null` เมื่อไม่มีคำเตือน
  - `WarningChip({ warnings, className }: { warnings?: string[]; className?: string })` — ป้ายย่อ คืน `null` เมื่อไม่มีคำเตือน
  - `Story.warnings?: string[]`

- [ ] **Step 1: เพิ่มฟิลด์ `warnings` ใน type `Story`**

ใน `src/lib/types.ts` เพิ่มบรรทัดนี้ใน type `Story` ต่อจาก `tags: string[];`:

```ts
  warnings?: string[];
```

เป็น optional เพราะเรื่องส่วนใหญ่ไม่มีอะไรหนักเป็นพิเศษ และเรื่องเก่าที่ยังไม่ได้ใส่ต้องไม่พัง

- [ ] **Step 2: สร้างคอมโพเนนต์คำเตือน**

สร้าง `src/components/ContentWarnings.tsx`:

```tsx
import { TriangleAlert } from "lucide-react";

export function ContentWarnings({
  warnings,
  className = "",
}: {
  warnings?: string[];
  className?: string;
}) {
  if (!warnings || warnings.length === 0) return null;

  return (
    <aside
      aria-label="คำเตือนเนื้อหา"
      className={`border-l-2 border-ember bg-cabinet/60 px-4 py-3 ${className}`}
    >
      <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.24em] text-ember uppercase">
        <TriangleAlert className="size-3.5" aria-hidden />
        คำเตือน
      </p>
      <p className="mt-2 text-sm leading-relaxed text-paper/85">
        เรื่องนี้มี: {warnings.join(" · ")}
      </p>
    </aside>
  );
}

export function WarningChip({
  warnings,
  className = "",
}: {
  warnings?: string[];
  className?: string;
}) {
  if (!warnings || warnings.length === 0) return null;

  const [first, ...rest] = warnings;
  const label = rest.length > 0 ? `${first} +${rest.length}` : first;

  return (
    <p
      className={`inline-flex items-center gap-1.5 border border-ember/40 px-2 py-0.5 text-[11px] text-ember-soft ${className}`}
    >
      <TriangleAlert className="size-3" aria-hidden />
      <span className="sr-only">คำเตือนเนื้อหา: </span>
      <span>{label}</span>
    </p>
  );
}
```

- [ ] **Step 3: อัปเดตข้อมูลเรื่อง "ที่เก่า" ตามผลจาก prompt v2**

ข้อมูลก้อนนี้มาจากการรัน prompt v2 จริงกับ agent ที่ฟังคลิปได้ ไม่ใช่การเดา

ใน `src/data/stories.ts` แก้เรื่อง `thi-kao` สี่บรรทัดนี้:

```ts
    category: "other",
    excerpt: "เรื่องหมู่บ้านที่เริ่มจากเพื่อนบ้านและรักต้องห้าม แล้วค่อยๆ หนักไปที่สถานที่เดิม",
    note: "เล่าช้าๆ ตั้งแต่ชีวิตประจำวันและความสัมพันธ์ในวัยเรียนจนถึงจุดที่สถานที่เดิมเข้ามามีบทบาท รายละเอียดการคุยกันของกลุ่มเพื่อนและการใช้ชีวิตในหมู่บ้านทำให้เรื่องไม่ใช่ผีโผล่ทันที แต่เป็นการสะสมความหนักใจก่อนจะถึงส่วนที่เกี่ยวกับที่เก่า เก็บไว้เพราะเป็นแนวเรื่องชีวิตชนบทที่หลอนจากความสัมพันธ์มากกว่าจากภาพหลอนตรงๆ",
    tags: ["เชียงใหม่", "ลำพูน", "หมู่บ้าน", "ที่เก่า", "พี่เบลล์", "ต้นลำไย", "วัยเรียน", "ชนบท"],
    warnings: ["แท้งลูก", "อุบัติเหตุ", "ฆ่าตัวตาย (แขวนคอ)"],
```

**ทำไม `category` เปลี่ยนจาก `home` เป็น `other`** — agent ตอบว่าไม่มีหมวดไหนตรง
แล้วเสนอชื่อ "หมู่บ้าน / ที่เก่าในชนบท" มาให้ ซึ่งถูกต้องตามกฎที่เราตั้งไว้:
หมวด `home` หมายถึง "บ้าน ห้องเช่า คอนโด" ส่วนนี่เป็นเรื่องระดับหมู่บ้าน
ยังไม่ตั้ง "หมู่บ้าน" เป็นหมวดจริงเพราะกฎเลื่อนขั้นต้องมีครบ 3 เรื่องก่อน

**บันทึกไว้:** "หมู่บ้าน / ชนบท" คือหมวดที่รอเลื่อนขั้นตัวแรก

หมายเหตุ: normalize `ค่อย ๆ` เป็น `ค่อยๆ` และ `ตรง ๆ` เป็น `ตรงๆ` (ไม่เว้นวรรค)
ให้ตรงกับที่ไฟล์เดิมเขียนไว้ ส่วนแท็กไม่มี "บ้าน" นำหน้าแล้วเพราะหมวดเปลี่ยนเป็น `other`

- [ ] **Step 4: วางแถบเต็มในหน้ารายเรื่อง**

ใน `src/app/stories/[slug]/page.tsx` เพิ่ม import:

```ts
import { ContentWarnings } from "@/components/ContentWarnings";
```

แล้ววาง `<ContentWarnings warnings={story.warnings} className="mt-6" />` ไว้**ก่อน**บล็อกที่มี `<YoutubeEmbed`  — คนต้องเห็นคำเตือนก่อนเจอปุ่มเล่น ถ้าวางหลังคลิปก็ไม่มีประโยชน์

- [ ] **Step 5: วางป้ายย่อในการ์ดและเรื่องเด่น**

ใน `src/components/StoryCard.tsx` เพิ่ม import:

```ts
import { WarningChip } from "./ContentWarnings";
```

แล้ววาง `<WarningChip warnings={story.warnings} />` ไว้ในกล่องเดียวกับ `TagList` (กล่อง `<div className="mt-auto px-4 pt-1 pb-3">`) โดยให้อยู่**เหนือ** `TagList` และเปลี่ยน `className` ของกล่องเป็น `"mt-auto flex flex-col items-start gap-2 px-4 pt-1 pb-3"`

ใน `src/components/FeaturedStory.tsx` เพิ่ม import แบบเดียวกัน:

```ts
import { WarningChip } from "./ContentWarnings";
```

แล้ววาง `<WarningChip warnings={story.warnings} className="mt-4" />` ไว้**ก่อน** `<TagList tags={story.tags} className="mt-4" />`

- [ ] **Step 6: ตรวจว่าคำเตือนขึ้นครบทุกที่**

Run:
```bash
npx tsc --noEmit && npx eslint src
echo "--- story page (เต็ม) ---"
curl -s http://localhost:3000/stories/thi-kao | grep -oE 'เรื่องนี้มี: [^<]*'
echo "--- featured (ย่อ) ---"
curl -s http://localhost:3000/ | grep -oE 'แท้งลูก \+2'
```
Expected:
- tsc/eslint ไม่มี output
- หน้ารายเรื่องได้ `เรื่องนี้มี: แท้งลูก · อุบัติเหตุ · ฆ่าตัวตาย (แขวนคอ)`
- หน้าแรกได้ `แท้งลูก +2`

- [ ] **Step 7: ตรวจว่าเรื่องที่ไม่มีคำเตือนไม่ขึ้นแถบว่าง**

Run:
```bash
curl -s http://localhost:3000/about | grep -c 'คำเตือนเนื้อหา' || echo "0 (ถูกต้อง)"
```
Expected: `0 (ถูกต้อง)` — หน้า about ไม่มี story เลยต้องไม่มีแถบคำเตือนโผล่

- [ ] **Step 8: Commit**

```bash
git add src/lib/types.ts src/components/ContentWarnings.tsx src/components/StoryCard.tsx src/components/FeaturedStory.tsx src/app/stories src/data/stories.ts
git commit -m "เตือนเนื้อหาหนักก่อนคนกดออกไปฟังคลิป"
```

---

### Task 3: ชุดเรื่องที่เล่าต่อกันเป็นตอน

**Files:**
- Modify: `src/lib/types.ts`
- Create: `src/data/series.ts`
- Create: `src/components/SeriesBox.tsx`
- Modify: `src/app/stories/[slug]/page.tsx`

**Interfaces:**
- Consumes: `Story` type จาก `@/lib/types` (ไม่ได้แก้เพิ่มใน task นี้)
- Produces:
  - `SeriesEpisode = { order: number; title: string; slug?: string }`
  - `Series = { slug: string; title: string; blurb: string; episodes: SeriesEpisode[] }`
  - `seriesList: Series[]`
  - `getSeriesForStory(storySlug: string): { series: Series; episode: SeriesEpisode } | undefined`
  - `SeriesBox({ series, currentSlug }: { series: Series; currentSlug: string })`

- [ ] **Step 1: เพิ่ม type ของชุดเรื่อง**

ใน `src/lib/types.ts` เพิ่มท้ายไฟล์:

```ts
export type SeriesEpisode = {
  order: number;
  title: string;
  /** มีเมื่อเก็บเข้าตู้แล้วเท่านั้น ไม่มี = ยังไม่ได้เก็บ */
  slug?: string;
};

export type Series = {
  slug: string;
  title: string;
  blurb: string;
  episodes: SeriesEpisode[];
};
```

- [ ] **Step 2: สร้างไฟล์ข้อมูลชุดเรื่อง**

สร้าง `src/data/series.ts`:

```ts
import type { Series } from "@/lib/types";

/**
 * เพิ่มชุดใหม่: ก็อปก้อนด้านล่างแล้วแปะต่อท้ายอาร์เรย์
 *
 * ตอนไหนที่ยังไม่ได้เก็บเข้าตู้ ให้ใส่แค่ order กับ title
 * พอเก็บเข้ามาแล้วค่อยเติม slug — เว็บอัปเดตสถานะเองทั้งชุด
 */
export const seriesList: Series[] = [
  {
    slug: "khun-k",
    title: "เรื่องเล่าของคุณเค",
    blurb: "สามคลิปที่คุณเคเล่าต่อกัน ฟังเรียงแล้วประติดประต่อได้",
    episodes: [
      { order: 1, title: "ที่เก่า", slug: "thi-kao" },
      { order: 2, title: "บังเอิญ" },
      { order: 3, title: "ขอให้จบ" },
    ],
  },
];

export function getSeriesForStory(storySlug: string) {
  for (const series of seriesList) {
    const episode = series.episodes.find((item) => item.slug === storySlug);
    if (episode) return { series, episode };
  }
  return undefined;
}
```

ไฟล์นี้**ห้าม** import `@/data/stories` — ความสัมพันธ์เดินทางเดียวเสมอ

- [ ] **Step 3: สร้างกล่องชุดเรื่อง**

สร้าง `src/components/SeriesBox.tsx`:

```tsx
import Link from "next/link";
import type { Series } from "@/lib/types";

export function SeriesBox({
  series,
  currentSlug,
}: {
  series: Series;
  currentSlug: string;
}) {
  const episodes = [...series.episodes].sort((a, b) => a.order - b.order);
  const collected = episodes.filter((episode) => episode.slug).length;

  return (
    <section
      aria-labelledby="series-heading"
      className="mt-8 border border-paper/10 bg-cabinet/60 px-4 py-6 sm:px-6"
    >
      <p className="font-mono text-[11px] tracking-[0.24em] text-ember uppercase">
        ชุดเรื่อง
      </p>
      <h2
        id="series-heading"
        className="mt-2 font-serif text-2xl leading-snug text-pretty text-paper"
      >
        {series.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-pretty text-dust">
        {series.blurb}
      </p>
      <p className="mt-1 font-mono text-[11px] tracking-wide text-dust">
        เก็บแล้ว {collected} จาก {episodes.length} ตอน
      </p>

      <ol className="mt-5 flex flex-col gap-2">
        {episodes.map((episode) => {
          const isCurrent = episode.slug === currentSlug;
          const order = String(episode.order).padStart(2, "0");

          if (isCurrent) {
            return (
              <li
                key={episode.order}
                aria-current="true"
                className="flex items-center gap-3 border border-ember bg-ember/15 px-3 py-2.5"
              >
                <span className="font-mono text-[11px] text-ember">{order}</span>
                <span className="text-sm text-paper">{episode.title}</span>
                <span className="ml-auto font-mono text-[10px] tracking-[0.16em] text-ember uppercase">
                  กำลังอ่าน
                </span>
              </li>
            );
          }

          if (episode.slug) {
            return (
              <li key={episode.order}>
                <Link
                  href={`/stories/${episode.slug}`}
                  className="flex min-h-11 cursor-pointer items-center gap-3 border border-paper/12 px-3 py-2.5 transition-colors duration-200 hover:border-ember/50 hover:bg-shelf"
                >
                  <span className="font-mono text-[11px] text-dust">{order}</span>
                  <span className="text-sm text-paper">{episode.title}</span>
                  <span className="ml-auto font-mono text-[10px] tracking-[0.16em] text-dust uppercase">
                    เก็บแล้ว
                  </span>
                </Link>
              </li>
            );
          }

          return (
            <li
              key={episode.order}
              className="flex items-center gap-3 border border-dashed border-paper/12 px-3 py-2.5"
            >
              <span className="font-mono text-[11px] text-dust/60">{order}</span>
              <span className="text-sm text-dust/70">{episode.title}</span>
              <span className="ml-auto font-mono text-[10px] tracking-[0.16em] text-dust/60 uppercase">
                ยังไม่ได้เก็บ
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
```

ตอนที่ยังไม่เก็บใช้ `<li>` เปล่า ไม่ใช่ `<Link>` หรือ `<button disabled>` — ไม่มีอะไรให้กด ก็ไม่ควรดูเหมือนกดได้

- [ ] **Step 4: วางกล่องในหน้ารายเรื่อง**

ใน `src/app/stories/[slug]/page.tsx` เพิ่ม import สองบรรทัด:

```ts
import { SeriesBox } from "@/components/SeriesBox";
import { getSeriesForStory } from "@/data/series";
```

ในฟังก์ชันคอมโพเนนต์ ต่อจากบรรทัดที่หา `story` แล้ว (หลัง `notFound()` guard) เพิ่ม:

```ts
  const seriesEntry = getSeriesForStory(story.slug);
```

แล้ววางกล่องไว้**ก่อน** `<RelatedStories`:

```tsx
      {seriesEntry && (
        <SeriesBox series={seriesEntry.series} currentSlug={story.slug} />
      )}
```

- [ ] **Step 5: ตรวจว่ากล่องชุดขึ้นถูกต้อง**

Run:
```bash
npx tsc --noEmit && npx eslint src
curl -s http://localhost:3000/stories/thi-kao | grep -oE 'เรื่องเล่าของคุณเค|กำลังอ่าน|ยังไม่ได้เก็บ|เก็บแล้ว 1 จาก 3 ตอน|บังเอิญ|ขอให้จบ' | sort | uniq -c
```
Expected: เจอ `เรื่องเล่าของคุณเค` 1 ครั้ง, `กำลังอ่าน` 1 ครั้ง, `ยังไม่ได้เก็บ` 2 ครั้ง, `เก็บแล้ว 1 จาก 3 ตอน` 1 ครั้ง, `บังเอิญ` 1 ครั้ง, `ขอให้จบ` 1 ครั้ง

- [ ] **Step 6: ตรวจว่าตอนที่ยังไม่เก็บกดไม่ได้**

Run:
```bash
curl -s http://localhost:3000/stories/thi-kao | grep -oE 'href="/stories/[a-z-]*"' | sort -u
```
Expected: ต้อง**ไม่มี** `href="/stories/bang-oen"` หรือลิงก์ไปตอนที่ยังไม่เก็บ (ตอนนี้ตู้มีเรื่องเดียว ผลลัพธ์อาจว่างเปล่า ซึ่งถูกต้อง)

- [ ] **Step 7: Commit**

```bash
git add src/lib/types.ts src/data/series.ts src/components/SeriesBox.tsx src/app/stories
git commit -m "โยงเรื่องที่เล่าต่อกันเป็นชุด พร้อมช่องว่างของตอนที่ยังไม่ได้เก็บ"
```

---

### Task 4: อัปเดต README แล้วตรวจทั้งระบบ

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: ทุกอย่างจาก Task 1-3
- Produces: ไม่มี — task ปิดงาน

- [ ] **Step 1: เพิ่มวิธีใช้ของใหม่ใน README**

เพิ่มสามหัวข้อนี้ต่อจากหัวข้อ "เพิ่มเรื่องใหม่" ใน `README.md`:

````markdown
## คำเตือนเนื้อหา

ใส่ `warnings: ["แท้งลูก", "อุบัติเหตุ"]` ในเรื่องที่มีเหตุการณ์หนัก
จะขึ้นเป็นแถบเตือนในหน้าเรื่อง และป้ายย่อบนการ์ดหน้าแรก

เรื่องที่ไม่มีอะไรหนักเป็นพิเศษ ไม่ต้องใส่ฟิลด์นี้เลย

## เพิ่มชุดเรื่อง

แก้ `src/data/series.ts` สำหรับเรื่องที่เล่าต่อกันเป็นตอนๆ

ตอนที่ยังไม่ได้เก็บใส่แค่ `order` กับ `title` พอเก็บคลิปนั้นเข้าตู้แล้ว
ค่อยเติม `slug` — หน้าเว็บอัปเดตสถานะเองทั้งชุด ไม่ต้องแก้ที่อื่น

## เพิ่มหมวดใหม่

เรื่องที่ไม่เข้าหมวดไหนเลย ใส่ `category: "other"` ได้ ไม่ผิด
ความเฉพาะเจาะจงไปอยู่ในแท็กแทน

เมื่อ `other` มีเรื่องแนวเดียวกันครบ **3 เรื่อง** ค่อยตั้งเป็นหมวดจริง —
เพิ่มบรรทัดใน `CATEGORIES` (`src/lib/types.ts`) แล้วแก้ `category`
ของสามเรื่องนั้น ปุ่มกรองในชั้นวางโผล่เองเมื่อมีเรื่องอยู่ในหมวด
````

- [ ] **Step 2: ตรวจทั้งระบบด้วย production build**

Run:
```bash
npx tsc --noEmit && npx eslint src && npm run build
```
Expected: ทั้งสามคำสั่งผ่าน build แสดง route `ƒ /`, `○ /about`, `● /stories/thi-kao`

- [ ] **Step 3: ตรวจ acceptance ทั้ง 7 ข้อจาก spec**

Run:
```bash
echo "1-2. กล่องชุดเรื่อง"
curl -s http://localhost:3000/stories/thi-kao | grep -oE 'กำลังอ่าน|ยังไม่ได้เก็บ' | sort | uniq -c
echo "3. คำเตือนย่อหน้าแรก"
curl -s http://localhost:3000/ | grep -oE 'แท้งลูก \+2'
echo "4. คำเตือนเต็มหน้าเรื่อง"
curl -s http://localhost:3000/stories/thi-kao | grep -oE 'เรื่องนี้มี: [^<]*'
echo "6. ปุ่มกรอง (ต้องเป็น ทั้งหมด + อื่นๆ)"
curl -s http://localhost:3000/ | grep -oE 'role="tab"[^>]*>[^<]*' | grep -oE '>[^<]*$'
```
Expected: `กำลังอ่าน` 1 / `ยังไม่ได้เก็บ` 2 / `แท้งลูก +2` /
`เรื่องนี้มี: แท้งลูก · อุบัติเหตุ · ฆ่าตัวตาย (แขวนคอ)` / ปุ่มสองอันคือ `>ทั้งหมด` กับ `>อื่นๆ`

(ข้อ 5 "เรื่องที่ไม่อยู่ในชุดไหนไม่ขึ้นกล่องชุด" ยังทดสอบไม่ได้จนกว่าจะมีเรื่องที่สองในตู้ — ให้บันทึกไว้ว่ายังไม่ได้ตรวจ อย่ารายงานว่าผ่าน)

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "บันทึกวิธีใช้ชุดเรื่อง คำเตือน และกฎเลื่อนขั้นหมวด"
```

---

## หมายเหตุสำหรับคนทำ

**เรื่องที่ทดสอบด้วย curl ไม่ได้** — hover, การ scroll ไปที่ `#shelf` ตอนกดแท็ก, หน้าตาบนมือถือ, และ animation ของ `RevealOnScroll` ต้องเปิดเบราว์เซอร์ดูเอง เครื่องที่เขียนแผนนี้ไม่มี browser driver ถ้าคุณมี ให้เปิดดูจริงแล้วรายงานว่าเห็นอะไร

**อย่ารายงานว่าผ่านถ้ายังไม่ได้รัน** — ทุก Step ที่มี `Run:` ต้องรันจริงและอ่าน output จริงก่อนติ๊ก checkbox
