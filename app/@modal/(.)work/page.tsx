import { getProjects } from "@/lib/projects";
import AllProducts from "@/components/work/AllProducts";

/** /work opened from inside the site: shown over the current page instead of replacing it. */
export default async function AllProductsOverlay() {
  const projects = await getProjects();
  return <AllProducts projects={projects} variant="overlay" />;
}
