import type { CategorySlide, Client, Contact, ListItem, Reason, ServiceGroup, Stat } from "./types";

// Site copy that is not a project, taken from Tatva's company profile. Moves to Sanity alongside the projects.

export const STUDIO_NAME = "Tatva";
export const STUDIO_FULL_NAME = "Tatva Creatives";
export const TAGLINE = "Concept development, packaging, print promotion, paper engineering, designing and digital solutions";
export const PROMISE = "We don’t just create packaging. We create experiences that strengthen brands.";
export const ABOUT =
  "Tatva is a creative solutions partner specialising in concept development, packaging design, print promotion, paper engineering and end-to-end execution, with digital solutions such as ERP, websites and digital marketing. We help brands turn ideas into products and experiences through innovation, quality and precision.";

export const CONTACT: Contact = {
  phone: "+91 81085 88335",
  phoneHref: "tel:+918108588335",
  email: "tatva.prints@gmail.com",
  location: "Navi Mumbai, Maharashtra",
  linkedin: "https://www.linkedin.com/company/tatva-creatives",
  instagram: "https://www.instagram.com/tatvacreatives",
  instagramHandle: "@tatvacreatives",
};
export const WHATSAPP_URL = "https://wa.me/918108588335";

/** Brand colours from the Tatva logo. */
export const BRAND = { navy: "#23356B", olive: "#7E8C2D", magenta: "#C2185B", orange: "#EF7D22", yellow: "#F5C518" };

/**
 * Tiles on each row of the hero wall, in order. "slug" shows a project's main photo;
 * "slug:3" shows its fourth photo, so one project with many photos can fill several tiles.
 */
const THF = "the-health-factory-range";
export const WALL_ROWS: string[][] = [
  ["fragkart-perfume-boxes", `${THF}:2`, "jsw-desk-calendar", `${THF}:6`, "world-hypertension-day-standee", `${THF}:0`, "mirbeg-s-launch-display", `${THF}:7`],
  ["dosa-plaza-takeaway-boxes", `${THF}:4`, "theotears-eye-drops-display", `${THF}:8`, "fragkart-perfume-boxes", `${THF}:5`, "jsw-desk-calendar", `${THF}:3`],
  ["mirbeg-s-launch-display", `${THF}:9`, "world-hypertension-day-standee", `${THF}:1`, "theotears-eye-drops-display", `${THF}:6`, "dosa-plaza-takeaway-boxes", `${THF}:2`],
];

export const FEATURED: string[] = [
  "fragkart-perfume-boxes", "dosa-plaza-takeaway-boxes", "jsw-desk-calendar", "mirbeg-s-launch-display", "world-hypertension-day-standee", "theotears-eye-drops-display",
];

export const CLIENTS: Client[] = [
  { name: "Macleods", logo: "/tatva/clients/macleods.png", width: 600, height: 153 },
  { name: "Emcure", logo: "/tatva/clients/emcure.png", width: 316, height: 64 },
  { name: "Serum Institute of India", logo: "/tatva/clients/serum-institute.png", width: 359, height: 235 },
  { name: "Entod", logo: "/tatva/clients/entod.png", width: 176, height: 200 },
  { name: "National Safety Council of India", logo: "/tatva/clients/national-safety-council.png", width: 600, height: 175 },
  { name: "Privi Speciality Chemicals", logo: "/tatva/clients/privi.png", width: 600, height: 195 },
  { name: "Somatico Pharmacal", logo: "/tatva/clients/somatico.png", width: 600, height: 163 },
  { name: "RIGO LED", logo: "/tatva/clients/rigo-led.png", width: 600, height: 167 },
  { name: "URIHK", logo: "/tatva/clients/urihk.png", width: 278, height: 118 },
  { name: "The Health Factory", logo: "/tatva/clients/the-health-factory.png", width: 148, height: 129 },
  { name: "Dosa Plaza", logo: "/tatva/clients/dosa-plaza.png", width: 447, height: 447 },
];

export const STATS: Stat[] = [
  { value: 11, suffix: "+", label: "brands on our client list, from pharma to food" },
  { value: 10, label: "services across print, packaging and digital, under one roof" },
  { value: 7, label: "steps from first conversation to final delivery" },
];

/** "Tatva creates ..." word swap. */
export const CATEGORY_SLIDES: CategorySlide[] = [
  { word: "Concepts", caption: "Concept development", background: BRAND.navy, color: "#F3F1EA", image: "/tatva/work/jsw-calendar.jpg" },
  { word: "Packaging", caption: "Packaging design", background: BRAND.yellow, color: "#2A2108", image: "/tatva/work/dosa-plaza.jpg" },
  { word: "Print", caption: "Print promotion", background: BRAND.orange, color: "#2A1505", image: "/tatva/work/mirbeg.jpg" },
  { word: "Paper", caption: "Paper engineering", background: BRAND.olive, color: "#F6F7EC", image: "/tatva/work/theotears-display.jpg" },
];

export const REASONS: Reason[] = [
  { title: "Innovative ideas", text: "Every brief starts with a concept built around your brand, not a template.", background: BRAND.navy, color: "#F3F1EA" },
  { title: "Fast turnaround", text: "Design, prototyping and production happen with one team, so timelines stay short.", background: BRAND.olive, color: "#F6F7EC" },
  { title: "Premium quality", text: "Materials, finishes and print checked to a standard you would put your name on.", background: BRAND.yellow, color: "#2A2108" },
  { title: "Reliable delivery", text: "Every job is quality-checked and delivered on the date we agree.", background: "#1F7A8C", color: "#F1FAFB" },
  { title: "Cost effective", text: "One partner from idea to delivery means no extra costs between separate vendors.", background: BRAND.orange, color: "#2A1505" },
  { title: "One-stop solution", text: "Concept, design, paper engineering, print and execution, all under one roof.", background: BRAND.magenta, color: "#FFF0F5" },
];

/** Services in two groups. `art` picks the small animated illustration on each card. */
export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    id: "print",
    label: "Print & packaging",
    items: [
      { title: "Concept development", art: "concept", text: "Strategic ideas and creative concepts aligned with your brand identity and market needs.", tags: ["Brand ideas", "Campaign concepts"] },
      { title: "Packaging design", art: "packaging", text: "Packaging that combines function, good looks and brand value.", tags: ["Cartons", "Labels", "Gift boxes"] },
      { title: "Print promotion", art: "print", text: "Print material that raises brand visibility and engagement, from calendars to launch kits.", tags: ["Calendars", "Launch kits", "Leaflets"] },
      { title: "Paper engineering", art: "paper", text: "Paper structures that pop, fold and stand, for interactive and engaging pieces.", tags: ["Pop-ups", "Standees", "Displays"] },
      { title: "Designing & production", art: "production", text: "From creative design to precise production, with modern technology and quality control.", tags: ["Artwork", "Printing", "Finishing"] },
      { title: "Execution", art: "execution", text: "End-to-end execution and on-time delivery, with a commitment to quality.", tags: ["Quality check", "Delivery"] },
    ],
  },
  {
    id: "digital",
    label: "Digital solutions",
    items: [
      { title: "ERP systems", art: "erp", text: "One system for stock, sales, accounts and people, set up around how your business already works.", tags: ["Inventory", "Billing", "Reports"] },
      { title: "Websites & e-commerce", art: "web", text: "Fast, good-looking websites and online stores that your team can update.", tags: ["Company sites", "Online stores"] },
      { title: "Digital marketing", art: "marketing", text: "Campaigns, search and ads that bring the right customers to your brand.", tags: ["SEO", "Ads", "Campaigns"] },
      { title: "Social media & content", art: "social", text: "Posts, reels and creative that keep your brand in front of people every day.", tags: ["Instagram", "LinkedIn", "Reels"] },
    ],
  },
];
/** Every service as a flat list, for the brief form. */
export const SERVICES = SERVICE_GROUPS.flatMap((g) => g.items);

export const PROCESS: ListItem[] = [
  { title: "Understanding the client", text: "We start with your brand, your audience and what the piece has to achieve." },
  { title: "Research & concept", text: "We study the market and shape concepts that fit the brief." },
  { title: "Design development", text: "The chosen concept is developed into final artwork and structure." },
  { title: "Prototype", text: "A physical sample, so you can hold it and approve it before production." },
  { title: "Production", text: "Printing, cutting and assembly with the right materials and finishes." },
  { title: "Quality check", text: "Every batch is checked against the approved prototype." },
  { title: "Delivery", text: "Packed and delivered to you on time." },
];

export const MARQUEE_WORDS = ["Concepts", "Packaging", "Calendars", "Standees", "Pop-ups", "Displays"];

/** "Flat to finished": how a paper-engineered display comes together. */
export const FOLD_STEPS = [
  { title: "Die-cut & print", text: "The whole display is printed and cut from one flat sheet." },
  { title: "Fold", text: "Scored fold lines let each panel lift into place." },
  { title: "Assemble", text: "Wings and lip lock together, so the display stands firmly on its own." },
  { title: "On the counter", text: "Ships flat, opens in seconds and holds the product in front of the customer." },
];
export const FOLD_PHOTO = {
  image: "/tatva/work/theotears-display.jpg",
  caption: "Theotears D counter display",
  href: "/work/theotears-eye-drops-display",
};
