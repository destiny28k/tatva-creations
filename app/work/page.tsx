import type { Metadata } from "next";
import { getProjects } from "@/lib/projects";
import AllProducts from "@/components/work/AllProducts";

export const metadata: Metadata = { title: "All products | Tatva" };

/** Direct visit to /work. Opening it from inside the site shows the overlay version instead. */
export default async function WorkPage() {
  const projects = await getProjects();
  return <AllProducts projects={projects} variant="page" />;
}
