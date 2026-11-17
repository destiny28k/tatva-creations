export type Spec = { label: string; value: string };

/** The service lines a project can belong to. */
export type Service = "Packaging" | "Print promotion" | "Paper engineering";

export type Project = {
  slug: string;
  name: string;
  client: string;
  category: Service;
  format: string;
  /** Short line used on the work list, reel and project page. */
  summary: string;
  /** Second paragraph on the project page. */
  story: string;
  /** Colour of the dot on the work list. */
  accent: string;
  /** Soft colour shown behind the photo while it loads. */
  backdrop: string;
  /** One or more photos; the first is the main shot. */
  images: string[];
};

export type Stat = { value: number; suffix?: string; label: string };
/** A coloured card in the "Why clients love working with us" stack. */
export type Reason = { title: string; text: string; background: string; color: string };
export type ListItem = { title: string; text: string };

/** Which animated illustration a service card shows. */
export type ServiceArt = "concept" | "packaging" | "print" | "paper" | "production" | "execution" | "erp" | "web" | "marketing" | "social";
export type ServiceItem = { title: string; text: string; art: ServiceArt; tags: string[] };
export type ServiceGroup = { id: string; label: string; items: ServiceItem[] };
export type CategorySlide = { word: string; caption: string; background: string; color: string; image: string };
export type Client = { name: string; logo: string; width: number; height: number };
export type Contact = { phone: string; phoneHref: string; email: string; location: string; linkedin: string; instagram: string; instagramHandle: string };

