import { RadioHome } from "@/components/radio/RadioHome";
import { bandLinks, buildBands, pickBand } from "@/components/radio/stations";
import { seriesList } from "@/data/series";
import { stories } from "@/data/stories";
import { parseCabinet } from "@/lib/channels";

const bands = buildBands(stories, seriesList);
const links = bandLinks(bands);

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const { cabinet } = await searchParams;
  return <RadioHome band={pickBand(bands, parseCabinet(cabinet))} links={links} />;
}
