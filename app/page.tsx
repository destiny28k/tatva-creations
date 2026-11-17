import { getProjects } from "@/lib/projects";
import { CATEGORY_SLIDES, FEATURED, FOLD_PHOTO, FOLD_STEPS, MARQUEE_WORDS, PROCESS, REASONS, SERVICE_GROUPS, WALL_ROWS } from "@/lib/content";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import Intro from "@/components/home/Intro";
import Wall, { type WallTile } from "@/components/home/Wall";
import Proof from "@/components/home/Proof";
import Statement from "@/components/home/Statement";
import CategorySwap from "@/components/home/CategorySwap";
import FeaturedReel from "@/components/home/FeaturedReel";
import WorkIndex from "@/components/home/WorkIndex";
import Manifesto from "@/components/home/Manifesto";
import Services from "@/components/home/Services";
import Process from "@/components/home/Process";
import Playground from "@/components/home/Playground";
import Marquee from "@/components/home/Marquee";
import ImageTrail from "@/components/home/ImageTrail";
import BriefForm from "@/components/home/BriefForm";
import FlatToFinished from "@/components/home/FlatToFinished";
import ScrollReveal from "@/components/home/ScrollReveal";

export default async function Home() {
  const projects = await getProjects();
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  const pick = (slugs: string[]) => slugs.map((s) => bySlug.get(s)).filter((p) => p !== undefined);
  /** "slug" or "slug:n", where n picks which of the project's photos the tile shows. */
  const tiles = (row: string[]): WallTile[] =>
    row.flatMap((entry) => {
      const [slug, n] = entry.split(":");
      const project = bySlug.get(slug);
      return project ? [{ project, image: Math.min(Number(n ?? 0), project.images.length - 1) }] : [];
    });
  const order = Object.fromEntries(projects.map((p, i) => [p.slug, i]));
  const allImages = projects.flatMap((p) => p.images);

  return (
    <>
      <Intro />
      <main>
        <Wall rows={WALL_ROWS.map(tiles)} order={order} header={<SiteHeader />} />
        <Proof />
        <Statement />
        <CategorySwap slides={CATEGORY_SLIDES} />
        <FeaturedReel projects={pick(FEATURED)} />
        <WorkIndex projects={projects} />
        <FlatToFinished steps={FOLD_STEPS} photo={FOLD_PHOTO.image} photoCaption={FOLD_PHOTO.caption} photoHref={FOLD_PHOTO.href} />
        <Manifesto reasons={REASONS} />
        <Services groups={SERVICE_GROUPS} />
        <Process steps={PROCESS} />
        <Playground images={allImages.slice(0, 12)} />
        <Marquee words={MARQUEE_WORDS} />
        <ImageTrail images={allImages} />
        <BriefForm />
      </main>
      <SiteFooter />
      <ScrollReveal />
    </>
  );
}
