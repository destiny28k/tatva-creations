import type { Project } from "./types";

// Project content. This file is the single source of project data:
// when Sanity is connected, these functions fetch from Sanity instead and nothing else changes.

const THF = "The Health Factory";
const RANGE_STORY =
  "Every pack follows one system: the maroon wordmark band on top, the product name set large and loud, and the clean-label claims held in a fixed strip, so new products slot in without a redesign.";

/** Main pack shot of each Health Factory product: peanut butter classic and chocolate, protein bread, sourdough, rusk, digestive, toasted pops, mini cakes, brownie cake, pav. */
const THF_RANGE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `/thf/p${n}-1.jpg`);
const work = (name: string) => [`/tatva/work/${name}.jpg`];

const PROJECTS: Project[] = [
  // Work from Tatva's company profile.
  {
    slug: "fragkart-perfume-boxes", name: "Fragkart perfume boxes", client: "Fragkart", category: "Packaging", format: "Kraft shipping cartons",
    accent: "#A47A4E", backdrop: "#E9DFD2", images: work("fragkart"),
    summary: "Kraft cartons for a perfume brand, printed in a single colour with the floral mark, the fragrance family and a Genuine seal.",
    story: "Two carton sizes share one layout, so the feminine and masculine fragrances read as one family while the label line tells them apart.",
  },
  {
    slug: "dosa-plaza-takeaway-boxes", name: "Dosa Plaza takeaway boxes", client: "Dosa Plaza", category: "Packaging", format: "Printed food cartons",
    accent: "#F5C518", backdrop: "#F3E3B5", images: work("dosa-plaza"),
    summary: "A family of takeaway cartons for the Dosa Plaza restaurant chain, in the brand's bright yellow and deep green with food photography on the lid.",
    story: "Boxes for different dishes share the same colours, chef mascot and photo style, so every order is recognisable as Dosa Plaza at a glance.",
  },
  {
    slug: "jsw-desk-calendar", name: "JSW desk calendar", client: "JSW", category: "Print promotion", format: "Spiral-bound desk calendar",
    accent: "#2D5DA8", backdrop: "#DCE3EC", images: work("jsw-calendar"),
    summary: "A desk calendar for JSW built around one idea per month. The June page carries the theme Innovate, with a light-bulb balloon rising above the clouds.",
    story: "A calendar sits on a desk all year, so each page is designed as a small poster first and a date grid second.",
  },
  {
    slug: "mirbeg-s-launch-display", name: "Mirbeg S launch display", client: "Mirbeg S", category: "Print promotion", format: "Desk display with card holder",
    accent: "#EF7D22", backdrop: "#F3E2C8", images: work("mirbeg"),
    summary: "A desk display for the launch of Mirbeg S, with a printed header announcing a first-in-India 3D tablet technology and a tray of branded cards.",
    story: "It stays on a doctor's desk long after the visit, keeping the brand in view every time a card is taken.",
  },
  {
    slug: "world-hypertension-day-standee", name: "World Hypertension Day standee", client: "Healthcare awareness", category: "Paper engineering", format: "Die-cut tent standee",
    accent: "#C62828", backdrop: "#EFE3DA", images: work("hypertension-standee"),
    summary: "A die-cut counter standee for World Hypertension Day, shaped around a heart and an ECG line, with prevention tips, health risks and a Know your numbers panel.",
    story: "It folds flat for shipping and stands on its own on a clinic or pharmacy counter.",
  },
  {
    slug: "theotears-eye-drops-display", name: "Theotears D eye drops display", client: "Theotears D & CycloTears D", category: "Paper engineering", format: "Pop-up counter display",
    accent: "#F5B21B", backdrop: "#F4E7C6", images: work("theotears-display"),
    summary: "A pop-up counter display introducing vitamin D3 enriched eye drops, with a sunburst header, folding side wings and slots that hold the product cartons.",
    story: "A flat sheet opens into a three-sided stage, so the products stand up and the message faces the customer at the counter.",
  },

  // Packaging for The Health Factory: one project, the whole range in the gallery.
  {
    slug: "the-health-factory-range", name: "The Health Factory range", client: THF, category: "Packaging", format: "Tubs, pouches, bread bags and cartons",
    accent: "#7DB928", backdrop: "#F3E2CC", images: THF_RANGE,
    summary: "Packaging across The Health Factory's range of zero-maida breads, peanut butters, rusks, biscuits, snacks and cakes.",
    story: RANGE_STORY,
  },
];

export async function getProjects(): Promise<Project[]> {
  return PROJECTS;
}

export async function getProject(slug: string): Promise<Project | undefined> {
  return PROJECTS.find((p) => p.slug === slug);
}

/** The project shown after this one, wrapping round to the first. */
export async function getNextProject(slug: string): Promise<Project> {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  return PROJECTS[(i + 1) % PROJECTS.length];
}
