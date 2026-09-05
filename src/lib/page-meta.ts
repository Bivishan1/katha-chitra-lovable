import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type PageMetaSlug =
  | "home"
  | "about"
  | "work"
  | "services"
  | "contact"
  | "rental-equipment"
  | "international_support";

export type CmsPageMeta = {
  slug: string;
  title: string;
  description: string;
  og_title: string | null;
  og_description: string | null;
  canonical_path: string;
};

export const PAGE_META_SLUGS: { slug: PageMetaSlug; label: string }[] = [
  { slug: "home", label: "Home" },
  { slug: "about", label: "About" },
  { slug: "work", label: "Work" },
  { slug: "services", label: "Services" },
  { slug: "contact", label: "Contact" },
  { slug: "rental-equipment", label: "Equipment Rentals" },
  { slug: "international_support", label: "International Support" },
];

export const PAGE_META_DEFAULTS: Record<PageMetaSlug, CmsPageMeta> = {
  home: {
    slug: "home",
    title: "Story Painters Production — Nepali Video Production House",
    description:
      "Nepal Kathmandu-based film and media production company crafting commercials, branded content, music videos, documentaries, and digital campaigns.",
    og_title: "Story Painters — Nepali Video Production House",
    og_description: "Cinematic storytelling from the heart of the Himalayas Nepal.",
    canonical_path: "/",
  },
  about: {
    slug: "about",
    title: "About — Story Painters",
    description:
      "Story Painters is a Kathmandu-based production house blending cinematic craft with cultural depth.",
    og_title: "About — Story Painters",
    og_description: "Inside the studio. Cinematic storytelling from the Himalayas.",
    canonical_path: "/about",
  },
  work: {
    slug: "work",
    title: "Work — Story Painters",
    description: "Selected films, commercials and branded content from Story Painters.",
    og_title: "Work — Story Painters",
    og_description: "Portfolio of cinematic work from Kathmandu.",
    canonical_path: "/work",
  },
  services: {
    slug: "services",
    title: "Services — Story Painters",
    description:
      "Commercial production, branded content, music videos, documentaries and post-production in Nepal.",
    og_title: "Services — Story Painters",
    og_description: "Full-service film and media production in Kathmandu.",
    canonical_path: "/services",
  },
  contact: {
    slug: "contact",
    title: "Contact — Story Painters",
    description:
      "Get in touch with Story Painters for production enquiries, rentals and collaborations.",
    og_title: "Contact — Story Painters",
    og_description: "Reach the Story Painters team in Kathmandu.",
    canonical_path: "/contact",
  },
  "rental-equipment": {
    slug: "rental-equipment",
    title: "Equipment Rentals — Story Painters",
    description:
      "Rent cinema cameras, lenses, lighting, grip, sound and drones from Story Painters in Kathmandu.",
    og_title: "Equipment Rentals — Story Painters",
    og_description:
      "Professional production gear available for daily and weekly rental in Nepal.",
    canonical_path: "/rental-equipment",
  },
  international_support: {
    slug: "international_support",
    title: "International Production Support — Story Painters",
    description:
      "Fixer, location scouting and production support for international crews filming in Nepal.",
    og_title: "International Production Support — Story Painters",
    og_description: "On-the-ground production support for international teams in Nepal.",
    canonical_path: "/international_support",
  },
};

function setMetaTag(selector: string, attribute: string, content: string) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");

    if (selector.includes("property=")) {
      const property = selector.match(/property="([^"]+)"/)?.[1];
      if (property) element.setAttribute("property", property);
    }

    if (selector.includes("name=")) {
      const name = selector.match(/name="([^"]+)"/)?.[1];
      if (name) element.setAttribute("name", name);
    }

    document.head.appendChild(element);
  }

  element.setAttribute(attribute, content);
}

export function applyPageMeta(meta: CmsPageMeta) {
  document.title = meta.title;

  setMetaTag('meta[name="description"]', "content", meta.description);
  setMetaTag('meta[property="og:title"]', "content", meta.og_title ?? meta.title);
  setMetaTag(
    'meta[property="og:description"]',
    "content",
    meta.og_description ?? meta.description,
  );
  setMetaTag('meta[property="og:url"]', "content", meta.canonical_path);

  let canonical = document.head.querySelector(
    'link[rel="canonical"]',
  ) as HTMLLinkElement | null;

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }

  canonical.href = meta.canonical_path;
}

export function usePageMeta(slug: PageMetaSlug) {
  return useQuery({
    queryKey: ["cms", "page-meta", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_meta")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as unknown as CmsPageMeta | null;
    },
  });
}

export function useAllPageMeta() {
  return useQuery({
    queryKey: ["cms", "page-meta"],
    queryFn: async () => {
      const { data, error } = await supabase.from("page_meta").select("*").order("slug");
      if (error) throw error;
      return (data ?? []) as unknown as CmsPageMeta[];
    },
  });
}

/** Applies DB-backed page title and meta tags, falling back to built-in defaults. */
export function useApplyPageMeta(slug: PageMetaSlug) {
  const { data } = usePageMeta(slug);
  const meta = data ?? PAGE_META_DEFAULTS[slug];

  useEffect(() => {
    applyPageMeta(meta);
  }, [meta]);
}