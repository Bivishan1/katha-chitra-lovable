import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type CmsProject = {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: string;
  year: number;
  image_url: string | null;
  video_url: string | null;
  aspect: "wide" | "portrait" | "square";
  sort_order: number;
  published: boolean;
  created_at?: string;
};

export type CmsFrame = {
  id: string;
  title: string;
  subtitle: string;
  image_url: string | null;
  video_url: string | null;
  sort_order: number;
  published: boolean;
  created_at?: string;
};

export type CmsCategory = {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  sort_order: number;
};

export type CmsEquipmentSubItem = { name: string; image_url?: string | null };

export type CmsEquipmentItem = {
  id: string;
  category_id: string;
  name: string;
  note: string | null;
  image_url: string | null;
    description?: string | null;
  images?: string[] | null;
  sub_items?: CmsEquipmentSubItem[] | null;
  sort_order: number;
  price_day?: number | null;
  price_week?: number | null;
};

export type CmsContact = {
  id: string;
  company_name: string;
  address: string;
  email: string;
  secondary_email: string | null;
  phone: string;
  whatsapp: string | null;
  booking_url: string | null;
  note: string | null;
};

export type CmsSocialLink = {
  id: string;
  platform: string;
  url: string;
  handle: string | null;
  sort_order: number;
};

export type CmsProposal = {
  id: string;
  title: string;
  file_url: string;
  is_active: boolean;
  created_at: string;
};

export type CmsBtsFrame = {
  id: string;
  caption: string;
  alt: string;
  image_url: string | null;
  sort_order: number;
  published: boolean;
  created_at?: string;
};

export type CmsSiteSettings = {
  id: string;
  show_equipment_prices: boolean;
  logo_url: string | null;
  favicon_url: string | null;
};

export type CmsFounderProfile = {
  id: string;
  name: string;
  name_accent: string | null;
  role: string;
  bio_primary: string;
  bio_secondary: string;
  image_url: string | null;
  image_alt: string | null;
};

export type CmsTeamMember = {
  id: string;
  name: string;
  role: string;
  image_url: string | null;
  sort_order: number;
  published: boolean;
};

/** Tables that drive public site content. */
export const CMS_TABLES = [
  "equipment_categories",
  "equipment_items",
  "frames",
  "projects",
  "proposals",
  "contact_details",
  "social_links",
  "site_settings",
  "bts_frames",
  "page_meta",
  "founder_profile",
  "team_members",
] as const;

/**
 * Subscribes to database changes so any admin add/edit/delete instantly
 * refreshes the public site for every visitor.
 */
export function useCmsRealtime() {
  const qc = useQueryClient();
  useEffect(() => {
    const channel = supabase.channel("cms-live");
    for (const table of CMS_TABLES) {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => {
          qc.invalidateQueries({ queryKey: ["cms"] });
        },
      );
    }
    channel.subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ["cms", "settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as unknown as CmsSiteSettings | null;
    },
  });
}

export const MEDIA_BUCKET = "cms-media";

/** Uploads a file to the CMS bucket and returns a long-lived signed URL. */
export async function uploadMedia(file: File, folder: string) {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (signErr || !data)
    throw signErr ?? new Error("Could not create media URL");
  return data.signedUrl;
}

export function useProjects() {
  return useQuery({
    queryKey: ["cms", "projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as CmsProject[];
    },
  });
}

export function useFrames() {
  return useQuery({
    queryKey: ["cms", "frames"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("frames")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as CmsFrame[];
    },
  });
}

/** Equipment categories with their items. Prices are only returned for admins. */
export function useEquipment(withPrices = false) {
  return useQuery({
    queryKey: ["cms", "equipment", withPrices],
    queryFn: async () => {
      const [cats, items] = await Promise.all([
        supabase.from("equipment_categories").select("*").order("sort_order"),
        withPrices
          ? supabase.from("equipment_items").select("*").order("sort_order")
          : supabase
              .from("equipment_items_public")
              .select("*")
              .order("sort_order"),
      ]);
      if (cats.error) throw cats.error;
      if (items.error) throw items.error;
      return {
        categories: (cats.data ?? []) as unknown as CmsCategory[],
        items: (items.data ?? []) as unknown as CmsEquipmentItem[],
      };
    },
  });
}

/** Behind-the-scenes frames shown on the About page. */
export function useBtsFrames() {
  return useQuery({
    queryKey: ["cms", "bts-frames"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bts_frames")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as CmsBtsFrame[];
    },
  });
}

export function useContactDetails() {
  return useQuery({
    queryKey: ["cms", "contact"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_details")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as unknown as CmsContact | null;
    },
  });
}

export function useSocialLinks() {
  return useQuery({
    queryKey: ["cms", "social"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as unknown as CmsSocialLink[];
    },
  });
}

export function useActiveProposal() {
  return useQuery({
    queryKey: ["cms", "proposal"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("proposals")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as unknown as CmsProposal | null;
    },
  });
}

export function useFounderProfile() {
  return useQuery({
    queryKey: ["cms", "founder"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("founder_profile")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as unknown as CmsFounderProfile | null;
    },
  });
}

export function useTeamMembers() {
  return useQuery({
    queryKey: ["cms", "team"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as CmsTeamMember[];
    },
  });
}

export function npr(n: number) {
  return `Rs. ${Number(n).toLocaleString("en-IN")}`;
}
