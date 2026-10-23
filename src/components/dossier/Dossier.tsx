import { Paperclip, TriangleAlert } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { YoutubeEmbed } from "@/components/YoutubeEmbed";
import type { getPostedNeighbors } from "@/data/stories";
import { CATEGORIES, type Series, type Story } from "@/lib/types";
import { formatListenedAt, youtubeWatchUrl } from "@/lib/youtube";
import { handwriting, typewriter } from "./fonts";
import { PinnedCard } from "./PinnedCard";
import { PaperStamp, StampButton } from "./StampButton";
import { WhenHeard } from "./WhenHeard";
import styles from "./dossier.module.css";

type DossierProps = {
  story: Story;
  posted: ReturnType<typeof getPostedNeighbors>;
  related: Story[];
  series?: Series;
};

export function Dossier({ story, posted, related, series }: DossierProps) {
  const warnings = story.warnings ?? [];

  return (
    <article
      data-sticky-listen
      className={`${styles.room} ${typewriter.variable} ${handwriting.variable}`}
    >
      <div className={styles.wrap}>
        <Link href="/" className={styles.back}>
          ← กลับวิทยุ
        </Link>

        <div className={styles.board}>
          <div className={styles.folder}>
            <span className={styles.folderPin} aria-hidden />
            <p className={styles.tab}>แฟ้ม {story.catalog}</p>

            <div className={styles.paper}>
              <p className={styles.memo}>บันทึกเรื่องเล่า</p>
              <h1 className={styles.title}>{story.title}</h1>

              <div className={styles.record}>
                <dl className={styles.fields}>
                  <Field label="ผู้เล่า">{story.guest ?? "ไม่ระบุ"}</Field>
                  <Field label="ที่มา">{story.channel}</Field>
                  <Field label="ความยาว">{story.duration}</Field>
                  <Field label="สถานที่">{CATEGORIES[story.category].label}</Field>
                  <Field label="เก็บเข้าแฟ้ม">
                    <time dateTime={story.listenedAt}>
                      {formatListenedAt(story.listenedAt)}
                    </time>
                  </Field>
                </dl>
                <PaperStamp slug={story.slug} />
              </div>

              <section className={styles.block}>
                <h2 className={styles.label}>สรุปเหตุการณ์</h2>
                <p>{story.excerpt}</p>
              </section>

              {warnings.length > 0 ? (
                <section aria-labelledby="warnings-heading" className={styles.warnBox}>
                  <h2 id="warnings-heading" className={styles.warnTitle}>
                    <TriangleAlert aria-hidden className={styles.warnIcon} />
                    คำเตือนก่อนฟัง
                  </h2>
                  <p>{warnings.join(" · ")}</p>
                </section>
              ) : (
                <p className={styles.calm}>ไม่มีเหตุการณ์หนักที่ต้องเตือน</p>
              )}

              <figure className={styles.photo}>
                <Paperclip aria-hidden strokeWidth={1.5} className={styles.paperclip} />
                <YoutubeEmbed
                  youtubeId={story.youtubeId}
                  title={story.title}
                  className={styles.print}
                />
                <figcaption className={styles.caption}>
                  คลิปจาก {story.channel} · {story.duration}
                </figcaption>
              </figure>

              <div className={styles.actions}>
                <PlayLink youtubeId={story.youtubeId} />
                <StampButton slug={story.slug} />
              </div>

              <section className={styles.block}>
                <h2 className={styles.label}>บันทึกของปอง</h2>
                <p className={styles.handwritten}>{story.note}</p>
              </section>

              {series && <SeriesFile series={series} currentSlug={story.slug} />}

              <section className={styles.block}>
                <div className={styles.labelRow}>
                  <h2 className={styles.label}>ป้ายหลักฐาน</h2>
                  <p className={styles.hint}>กดแล้วดูว่าแฟ้มไหนโยงกัน</p>
                </div>
                <ul className={styles.chips}>
                  {story.tags.map((tag) => (
                    <li key={tag}>
                      <Link
                        href={`/shelf?tag=${encodeURIComponent(tag)}`}
                        aria-label={`ดูแฟ้มที่มีป้าย ${tag}`}
                        className={styles.chip}
                      >
                        {tag}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          <div className={styles.pinned}>
            <nav aria-labelledby="trail-heading" className={styles.pinGroup}>
              <div className={styles.slip}>
                <h2 id="trail-heading" className={styles.slipTitle}>
                  ไล่ตามที่ปองลง
                </h2>
                <p className={styles.slipNote}>
                  แฟ้มที่ {posted.position} จาก {posted.total}
                </p>
              </div>
              <ul className={`${styles.cards} ${styles.trail}`}>
                <li>
                  {posted.prev ? (
                    <PinnedCard
                      story={posted.prev}
                      postit={<><span aria-hidden>← </span>แฟ้มก่อนหน้า</>}
                    />
                  ) : (
                    <p className={styles.emptySlot}>นี่แฟ้มแรกที่ปองลง</p>
                  )}
                </li>
                <li>
                  {posted.next ? (
                    <PinnedCard
                      story={posted.next}
                      postit={<>แฟ้มถัดไป<span aria-hidden> →</span></>}
                    />
                  ) : (
                    <p className={styles.emptySlot}>ไล่ครบแล้ว</p>
                  )}
                </li>
              </ul>
            </nav>

            {related.length > 0 && (
              <section aria-labelledby="related-heading" className={styles.pinGroup}>
                <div className={styles.slip}>
                  <h2 id="related-heading" className={styles.slipTitle}>
                    แฟ้มที่เกี่ยวข้อง
                  </h2>
                </div>
                <ul className={styles.cards}>
                  {related.map((item) => (
                    <li key={item.slug}>
                      <PinnedCard story={item} />
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>

      <div className={styles.bar}>
        {warnings.length > 0 && (
          <p className={styles.barWarning}>
            <TriangleAlert aria-hidden className={styles.warnIcon} />
            <span>มีเนื้อหา {warnings.join(" · ")}</span>
          </p>
        )}
        <div className={styles.barActions}>
          <PlayLink youtubeId={story.youtubeId} />
          <StampButton slug={story.slug} className={styles.barStamp} />
        </div>
      </div>
    </article>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function PlayLink({ youtubeId }: { youtubeId: string }) {
  return (
    <a
      href={youtubeWatchUrl(youtubeId)}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.play}
    >
      ฟังบน YouTube <span aria-hidden>↗</span>
      <span className="sr-only"> (เปิดแท็บใหม่)</span>
    </a>
  );
}

function SeriesFile({ series, currentSlug }: { series: Series; currentSlug: string }) {
  const episodes = series.episodes.toSorted((a, b) => a.order - b.order);

  return (
    <section className={styles.block}>
      <h2 className={styles.label}>อยู่ในชุด {series.title}</h2>
      <p className={styles.hint}>{series.blurb}</p>
      <ol className={styles.episodes}>
        {episodes.map((episode) => {
          const name = `ตอน ${episode.order} ${episode.title}`;

          if (episode.slug === currentSlug) {
            return (
              <li key={episode.order} aria-current="page">
                <span>{name}</span>
                <span className={styles.status}>แฟ้มนี้</span>
              </li>
            );
          }

          if (episode.slug) {
            return (
              <li key={episode.order}>
                <Link href={`/stories/${episode.slug}`} className={styles.episodeLink}>
                  {name}
                </Link>
                <span className={styles.status}>
                  <WhenHeard slug={episode.slug} otherwise="อยู่ในตู้">
                    ฟังแล้ว
                  </WhenHeard>
                </span>
              </li>
            );
          }

          return (
            <li key={episode.order}>
              <span>{name}</span>
              <span className={styles.status}>ยังไม่ได้เก็บ</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
