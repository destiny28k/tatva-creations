import type { Project, Spec } from "./types";

/** The three facts shown under a project: client, category and format. */
export function getSpecs(p: Project): Spec[] {
  return [
    { label: "Client", value: p.client },
    { label: "Service", value: p.category },
    { label: "Format", value: p.format },
  ];
}
