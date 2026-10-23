import {
  ORIGINAL_CABINET,
  presentCabinets,
  storiesInCabinet,
  type ChannelInfo,
} from "@/lib/channels";
import type { Series, Story } from "@/lib/types";

/**
 * หน้าปัดของทุกย่านใช้เรขาคณิตเดียวกันเป็น "ช่อง" (FM หนึ่งช่องคือ 1 MHz)
 * ย่าน AM แค่ติดป้ายตัวเลขใหม่ ระยะบนจอเลยเท่ากันทุกตู้
 */
export type Dial = {
  label: "FM" | "AM";
  /** ความถี่ที่ขอบซ้ายสุดของสเกล */
  lo: number;
  /** ความถี่ต่อหนึ่งช่องบนหน้าปัด */
  per: number;
  digits: number;
};

const FM: Dial = { label: "FM", lo: 87.5, per: 1, digits: 1 };
const AM: Dial = { label: "AM", lo: 520, per: 20, digits: 0 };

const FIRST = 1;
const STEP = 1.5;
const MIN_SPAN = 20.5;

export type Station = { story: Story; freq: number };

export type Preset = {
  number: number;
  title: string;
  total: number;
  /** ตอนที่อยู่ในย่านนี้ เรียงตามลำดับตอน */
  episodes: [PresetEpisode, ...PresetEpisode[]];
};

type PresetEpisode = { index: number; order: number };

type BandBase = { channel: ChannelInfo; dial: Dial; span: number };

export type OnAirBand = BandBase & {
  kind: "on-air";
  /** เรียงจากเรื่องแรกที่ลง (คลื่นต่ำสุด) ไปเรื่องล่าสุด */
  stations: [Station, ...Station[]];
  presets: Preset[];
};

export type OffAirBand = BandBase & { kind: "off-air" };

export type Band = OnAirBand | OffAirBand;

export type BandLink = {
  slug: string;
  label: Dial["label"];
  short: string;
  name: string;
  href: string;
};

export type Reception =
  | { kind: "locked"; index: number; signal: number }
  | { kind: "searching"; freq: number; signal: number };

export function dialAt(dial: Dial, freq: number) {
  return (freq - dial.lo) / dial.per;
}

export function freqAt(dial: Dial, at: number) {
  return dial.lo + at * dial.per;
}

export function formatFreq(dial: Dial, freq: number) {
  return freq.toFixed(dial.digits);
}

/** คลื่นของเรื่องลำดับที่ index นับจากเรื่องแรกที่ลง */
export function stationFreq(dial: Dial, index: number) {
  return freqAt(dial, FIRST + index * STEP);
}

/** ตัวเลขบนสเกลทุกสองช่อง เริ่มที่ครึ่งช่องแรก แบบหน้าปัด FM 88 90 92 */
export function scaleLabels(dial: Dial, span: number) {
  const labels: { at: number; text: string }[] = [];
  for (let at = 0.5; at <= span; at += 2) {
    labels.push({ at, text: freqAt(dial, at).toFixed(0) });
  }
  return labels;
}

function byCatalog(a: Story, b: Story) {
  return a.catalog.localeCompare(b.catalog, "en", { numeric: true });
}

function presetsIn(stations: Station[], series: Series[]) {
  const indexBySlug = new Map(stations.map((station, index) => [station.story.slug, index]));
  const presets: Preset[] = [];
  for (const item of series) {
    const [first, ...rest] = item.episodes
      .toSorted((a, b) => a.order - b.order)
      .flatMap((episode) => {
        const index = episode.slug ? indexBySlug.get(episode.slug) : undefined;
        return index === undefined ? [] : [{ index, order: episode.order }];
      });
    if (first) {
      presets.push({
        number: presets.length + 1,
        title: item.title,
        total: item.episodes.length,
        episodes: [first, ...rest],
      });
    }
  }
  return presets;
}

export function buildBands(stories: Story[], series: Series[]): Band[] {
  return presentCabinets(stories).map((channel) => {
    const dial = channel.original ? FM : AM;
    const [first, ...rest] = storiesInCabinet(stories, channel.slug)
      .toSorted(byCatalog)
      .map((story, index) => ({ story, freq: stationFreq(dial, index) }));
    if (!first) return { kind: "off-air", channel, dial, span: MIN_SPAN };
    const stations: [Station, ...Station[]] = [first, ...rest];
    return {
      kind: "on-air",
      channel,
      dial,
      span: Math.max(MIN_SPAN, FIRST + stations.length * STEP),
      stations,
      presets: presetsIn(stations, series),
    };
  });
}

/** ตู้ที่ไม่รู้จัก (รวมถึง ?cabinet=all ของชั้นวางเดิม) ให้เปิดตู้แรกแทน */
export function pickBand(bands: Band[], cabinet: string) {
  const band =
    bands.find((item) => item.channel.slug === cabinet) ??
    bands.find((item) => item.channel.slug === ORIGINAL_CABINET);
  if (!band) throw new Error(`CHANNELS ต้องมีตู้ ${ORIGINAL_CABINET}`);
  return band;
}

export function bandLinks(bands: Band[]): BandLink[] {
  return bands.map(({ channel, dial }) => ({
    slug: channel.slug,
    label: dial.label,
    short: channel.short,
    name: channel.name,
    href: channel.slug === ORIGINAL_CABINET ? "/" : `/?cabinet=${encodeURIComponent(channel.slug)}`,
  }));
}

export function nearestStation(stations: readonly Station[], dial: Dial, freq: number) {
  let index = 0;
  let gap = Infinity;
  stations.forEach((station, at) => {
    const distance = Math.abs(station.freq - freq) / dial.per;
    if (distance < gap) {
      gap = distance;
      index = at;
    }
  });
  return { index, gap };
}

/** สัญญาณเต็มเมื่อห่างคลื่นไม่เกิน 0.08 ช่อง หายหมดที่ 0.58 และจับคลื่นติดเมื่อเกิน 0.35 */
export function receive(stations: OnAirBand["stations"], dial: Dial, freq: number): Reception {
  const { index, gap } = nearestStation(stations, dial, freq);
  const signal = Math.min(1, Math.max(0, 1 - (gap - 0.08) / 0.5));
  return signal > 0.35 ? { kind: "locked", index, signal } : { kind: "searching", freq, signal };
}

export function presetOf(presets: Preset[], index: number) {
  for (const preset of presets) {
    const episode = preset.episodes.find((item) => item.index === index);
    if (episode) return { preset, order: episode.order };
  }
  return undefined;
}
