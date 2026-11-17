import { notFound } from "next/navigation";
import { getNextProject, getProject, getProjects } from "@/lib/projects";
import ProjectView from "@/components/project/ProjectView";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

/** A project opened from inside the site: shown over the current page instead of replacing it. */
export default async function ProjectOverlay({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  const next = await getNextProject(slug);
  return <ProjectView key={slug} project={project} next={next} variant="overlay" />;
}
