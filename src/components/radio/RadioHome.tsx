"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { ORIGINAL_CABINET } from "@/lib/channels";
import { lcd, techno } from "./fonts";
import {
  DialWindow,
  Grille,
  Knob,
  Readout,
  SeekButton,
  SpeakerIcon,
  cx,
  openStaticAudio,
  useStaticLevel,
  type StaticAudio,
} from "./parts";
import styles from "./radio.module.css";
import {
  formatFreq,
  freqAt,
  stationFreq,
  type Band,
  type BandLink,
  type OffAirBand,
} from "./stations";
import { Tuner } from "./Tuner";

type Sound =
  | { kind: "off" }
  | { kind: "on"; audio: StaticAudio }
  | { kind: "muted"; audio: StaticAudio }
  | { kind: "unavailable" };

const SOUND_LABEL = {
  off: "เสียงซ่า ปิดอยู่",
  on: "เสียงซ่า เปิดอยู่",
  muted: "เสียงซ่า ปิดอยู่",
  unavailable: "เครื่องนี้เล่นเสียงไม่ได้",
} satisfies Record<Sound["kind"], string>;

export function RadioHome({ band, links }: { band: Band; links: BandLink[] }) {
  const [sound, setSound] = useState<Sound>({ kind: "off" });
  const device = sound.kind === "on" || sound.kind === "muted" ? sound.audio : null;
  const playing = sound.kind === "on" ? sound.audio : null;

  useEffect(() => {
    if (!device) return;
    return () => {
      void device.context.close();
    };
  }, [device]);

  function toggleSound() {
    switch (sound.kind) {
      case "on":
        void sound.audio.context.suspend();
        setSound({ kind: "muted", audio: sound.audio });
        return;
      case "muted":
        void sound.audio.context.resume();
        setSound({ kind: "on", audio: sound.audio });
        return;
      case "off":
        try {
          setSound({ kind: "on", audio: openStaticAudio() });
        } catch {
          setSound({ kind: "unavailable" });
        }
        return;
      case "unavailable":
        return;
    }
  }

  return (
    <div className={cx(styles.radio, techno.variable, lcd.variable)}>
      <div className={styles.wrap}>
        <div className={styles.top}>
          {links.length > 1 ? (
            <nav aria-label="เลือกคลื่น" className={styles.bands}>
              {links.map((link) => (
                <Link
                  key={link.slug}
                  href={link.href}
                  title={link.name}
                  className={styles.bandLink}
                  aria-current={link.slug === band.channel.slug ? "page" : undefined}
                >
                  <b>{link.label}</b>
                  {link.short}
                </Link>
              ))}
            </nav>
          ) : null}
          <span className={styles.onAir} data-off={band.kind === "off-air" ? "" : undefined}>
            <i aria-hidden />
            {band.kind === "on-air" ? `ON AIR · ${band.stations.length} คลื่น` : "OFF AIR · ยังไม่มีคลื่น"}
          </span>
          <button
            type="button"
            className={styles.sound}
            aria-pressed={sound.kind === "on"}
            disabled={sound.kind === "unavailable"}
            onClick={toggleSound}
          >
            <SpeakerIcon />
            <span>{SOUND_LABEL[sound.kind]}</span>
          </button>
        </div>

        {band.kind === "on-air" ? (
          <Tuner key={band.channel.slug} band={band} audio={playing} />
        ) : (
          <OffAir
            key={band.channel.slug}
            band={band}
            home={links.find((link) => link.slug === ORIGINAL_CABINET)}
            audio={playing}
          />
        )}
      </div>
    </div>
  );
}

function OffAir({
  band,
  home,
  audio,
}: {
  band: OffAirBand;
  home: BandLink | undefined;
  audio: StaticAudio | null;
}) {
  const { dial, channel } = band;
  const at = Math.round(band.span / 2);
  const headingId = useId();
  useStaticLevel(audio, 1);

  return (
    <>
      <section className={styles.body} aria-label="วิทยุจูนหาเรื่อง">
        <Grille name={channel.name} />
        <div className={styles.main}>
          <DialWindow dial={dial} span={band.span} at={at} noise={1} placed={false} />
          <p className={styles.howto}>คลื่นนี้ยังไม่มีรายการ ได้ยินแต่เสียงซ่า</p>
          <div className={styles.controls}>
            <SeekButton step={-1} />
            <Readout dial={dial} freq={freqAt(dial, at)} signal={0} />
            <SeekButton step={1} />
          </div>
        </div>
        <Knob at={at} />
      </section>

      <div className={styles.lower}>
        <section className={styles.now}>
          <div className={styles.dead}>
            <div className={styles.meta}>
              <span className={styles.call}>
                {dial.label} {formatFreq(dial, freqAt(dial, at))}
              </span>
              <span>{channel.name}</span>
            </div>
            <h1 className={styles.title}>ยังไม่มีสัญญาณ</h1>
            {channel.blurb ? <p className={styles.excerpt}>{channel.blurb}</p> : null}
            <div className={styles.actions}>
              {home ? (
                <Link className={styles.play} href={home.href}>
                  กลับไปฟัง {home.label} {home.short}
                </Link>
              ) : null}
              {channel.youtube ? (
                <a className={styles.pill} href={channel.youtube} target="_blank" rel="noopener noreferrer">
                  ไปช่องนี้บน YouTube
                </a>
              ) : null}
            </div>
          </div>
        </section>
        <section className={styles.guide} aria-labelledby={headingId}>
          <h2 id={headingId}>ผังรายการ</h2>
          <p className={styles.guideSub}>คลื่นนี้ยังไม่มีรายการ</p>
          <p className={styles.empty}>
            เรื่องแรกที่เก็บเข้าตู้นี้จะออกอากาศที่ {dial.label} {formatFreq(dial, stationFreq(dial, 0))}
          </p>
        </section>
      </div>
    </>
  );
}
