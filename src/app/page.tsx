import Link from "next/link";
import { FeaturedStory } from "@/components/FeaturedStory";
import { StoryShelf } from "@/components/StoryShelf";
import { getFeaturedStory, stories } from "@/data/stories";
import { formatListenedAt, latestListenedAt } from "@/lib/youtube";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string | string[] }>;
}) {
  const { tag } = await searchParams;
  const activeTag = Array.isArray(tag) ? tag[0] : tag;
  const featured = getFeaturedStory();
  const latest = latestListenedAt(stories);

  return (
    <div>
      <FeaturedStory story={featured} />

      <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-8 sm:px-6 sm:pt-12">
        <section className="grid gap-6 border border-paper/10 bg-cabinet/60 px-4 py-6 sm:grid-cols-[1.4fr_1fr] sm:gap-8 sm:px-8 sm:py-7">
          <div>
            <p className="font-mono text-[11px] tracking-[0.28em] text-ember uppercase">
              เข้ามาในห้องนี้แล้ว
            </p>
            <p className="mt-3 max-w-xl font-serif text-xl leading-snug text-pretty text-paper sm:text-3xl">
              ไม่ใช่คลังเรื่องผีทั้งอินเทอร์เน็ต เป็นชั้นวางของคนที่ฟัง YouTube ดึกๆ
              แล้วเก็บเฉพาะเรื่องที่ยังวนอยู่ในหัว
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-4 self-end font-mono text-[12px] tracking-[0.08em] text-dust uppercase">
            <div className="border-l border-ember/40 pl-3 sm:pl-4">
              <dt className="text-[10px] tracking-[0.18em]">เรื่องในตู้</dt>
              <dd className="mt-1 font-serif text-3xl text-paper normal-case tracking-normal">
                {String(stories.length).padStart(2, "0")}
              </dd>
            </div>
            <div className="border-l border-paper/15 pl-3 sm:pl-4">
              <dt className="text-[10px] tracking-[0.18em]">เก็บล่าสุด</dt>
              <dd className="mt-1 text-sm text-paper normal-case tracking-normal">
                {formatListenedAt(latest)}
              </dd>
            </div>
          </dl>
        </section>

        <StoryShelf
          stories={stories}
          featuredSlug={featured.slug}
          activeTag={activeTag}
        />

        <section className="mt-12 border border-paper/10 bg-gradient-to-br from-shelf to-cabinet px-4 py-8 sm:mt-20 sm:px-10 sm:py-10">
          <p className="font-mono text-[11px] tracking-[0.28em] text-dust uppercase">
            เจ้าของห้อง
          </p>
          <p className="mt-3 max-w-2xl font-serif text-2xl leading-snug text-pretty text-paper sm:text-3xl">
            ฟังจบแล้วบางเรื่องก็ปล่อยผ่าน เรื่องที่ยังวนถึงเช้า ค่อยถูกเก็บเข้าตู้
          </p>
          <Link
            href="/about"
            className="mt-6 inline-flex min-h-11 cursor-pointer items-center text-sm text-ember-soft underline-offset-4 hover:underline"
          >
            อ่านเกี่ยวกับห้องนี้
          </Link>
        </section>
      </div>
    </div>
  );
}
