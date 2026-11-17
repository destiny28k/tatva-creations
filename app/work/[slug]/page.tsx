import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNextProject, getProject, getProjects } from "@/lib/projects";
import ProjectView from "@/components/project/ProjectView";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject((await params).slug);
  return project ? { title: `${project.name} | Tatva`, description: project.summary } : {};
}

/** Direct visit to a project URL. Opening it from inside the site shows the overlay version instead. */
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  const next = await getNextProject(slug);
  return <ProjectView key={slug} project={project} next={next} variant="page" />;
}
