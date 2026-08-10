// src/hooks/useFavicon.ts
import { useEffect } from "react";
import { useSiteSettings } from "@/lib/cms";

/** Swaps the static /favicon.png for a CMS-uploaded one once it's loaded. */
export function useFavicon() {
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    if (!settings?.favicon_url) return;
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.type = "image/png";
    link.href = settings.favicon_url;
  }, [settings?.favicon_url]);
}