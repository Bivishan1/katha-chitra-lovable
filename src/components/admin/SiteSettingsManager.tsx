import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia, useSiteSettings } from "@/lib/cms";
import {
  PAGE_META_DEFAULTS,
  PAGE_META_SLUGS,
  type CmsPageMeta,
  type PageMetaSlug,
} from "@/lib/page-meta";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function SiteSettingsManager() {
  const qc = useQueryClient();
  const { data: settings } = useSiteSettings();
  const [logoBusy, setLogoBusy] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const handleLogoUpload = async (file: File) => {
    if (!settings?.id) {
      toast.error(
        "Site settings row not found. Run the latest database migration.",
      );
      return;
    }
    setLogoBusy(true);
    try {
      const url = await uploadMedia(file, "site_settings");
      const { error } = await supabase
        .from("site_settings")
        .update({ logo_url: url })
        .eq("id", settings.id);
      if (error) throw error;
      toast.success("Logo updated");
      qc.invalidateQueries({ queryKey: ["cms"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setLogoBusy(false);
    }
  };

  // handle favicon upload
  const handleFaviconUpload = async (file: File) => {
    if (!settings?.id) {
      toast.error(
        "Site settings row not found. Run the latest database migration.",
      );
      return;
    }
    setUploadingFavicon(true);
    try {
      const url = await uploadMedia(file, "site_settings");
      const { error } = await supabase
        .from("site_settings")
        .update({ favicon_url: url })
        .eq("id", settings.id);
      if (error) throw error;
      toast.success("Favicon updated");
      qc.invalidateQueries({ queryKey: ["cms"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploadingFavicon(false);
    }
  };

  const clearLogo = useMutation({
    mutationFn: async () => {
      if (!settings?.id) throw new Error("Site settings not found");
      const { error } = await supabase
        .from("site_settings")
        .update({ logo_url: null })
        .eq("id", settings.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Logo reset to default");
      qc.invalidateQueries({ queryKey: ["cms"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // clear favicon
  const clearFavicon = useMutation({
    mutationFn: async () => {
      if (!settings?.id) throw new Error("Site settings not found");
      const { error } = await supabase
        .from("site_settings")
        .update({ favicon_url: null })
        .eq("id", settings.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Favicon reset to default");
      qc.invalidateQueries({ queryKey: ["cms"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // // toggle price favicon mutation for CMS
  // const setFavicon = useMutation({
  //   mutationFn: async (url: string) => {
  //     if (settings?.id) {
  //       const { error } = await supabase
  //         .from("site_settings")
  //         .update({ favicon_url: url} as never)
  //         .eq("id", settings.id);
  //       if (error) throw error;
  //     } else {
  //       const { error } = await supabase
  //         .from("site_settings")
  //         .insert({ favicon_url: url } as never);
  //       if (error) throw error;
  //     }
  //   },
  //   onSuccess: () => {
  //     toast.success("Favicon updated");
  //     qc.invalidateQueries({ queryKey: ["cms"] });
  //   },
  //   onError: (e: Error) => toast.error(e.message),
  // });

  // // handler for favicon upload
  // async function handleFaviconUpload(file: File) {
  //   setUploadingFavicon(true);
  //   try {
  //     const path = `favicon-${Date.now()}.${file.name.split(".").pop()}`;
  //     const { error: uploadError } = await supabase.storage
  //       .from("site_settings") // <- same bucket your other "image" fields upload to
  //       .upload(path, file, { upsert: true });
  //     if (uploadError) throw uploadError;

  //     const { data: pub } = supabase.storage.from("site_settings").getPublicUrl(path);
  //     setFavicon.mutate(pub.publicUrl);
  //   } catch (e) {
  //     toast.error(e instanceof Error ? e.message : "Upload failed");
  //   } finally {
  //     setUploadingFavicon(false);
  //   }
  // }

  return (
    <div className="space-y-8">
      <section className="border border-border rounded-sm">
        <header className="px-4 sm:px-5 py-4 border-b border-border">
          <h3
            style={{ fontFamily: "var(--font-display)" }}
            className="text-lg uppercase tracking-tight"
          >
            Site Logo
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Shown in the site header. Leave empty to use the bundled default
            logo.
          </p>
        </header>
        <div className="p-4 sm:p-5 space-y-4">
          {settings?.logo_url && (
            <img
              src={settings.logo_url}
              alt="Current site logo"
              className="h-16 w-auto object-contain border border-border rounded-sm p-2 bg-secondary/30"
            />
          )}
          <div className="flex flex-wrap gap-3 items-center">
            <Label htmlFor="logo-upload" className="cursor-pointer">
              <span className="inline-flex items-center px-4 py-2 text-sm border border-border rounded-md hover:border-accent transition-colors">
                {logoBusy ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Upload logo
              </span>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={logoBusy}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleLogoUpload(file);
                  e.target.value = "";
                }}
              />
            </Label>
            {settings?.logo_url && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => clearLogo.mutate()}
                disabled={clearLogo.isPending}
              >
                Reset to default
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="border border-border rounded-sm">
        <header className="px-4 sm:px-5 py-4 border-b border-border">
          <h3
            style={{ fontFamily: "var(--font-display)" }}
            className="text-lg uppercase tracking-tight"
          >
            Favicon
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-lg">
            Shown in the browser tab. Square PNG, ideally 512×512 or larger.
          </p>
        </header>
        <div className="p-4 sm:p-5 space-y-4">
          {settings?.favicon_url && (
            <img
              src={settings.favicon_url}
              alt="Current favicon"
              className="h-16 w-auto object-contain border border-border rounded-sm p-2 bg-secondary/30"
            />
          )}
          <div className="flex flex-wrap gap-3 items-center">
            <Label htmlFor="favicon-upload" className="cursor-pointer">
              <span className="inline-flex items-center px-4 py-2 text-sm border border-border rounded-md hover:border-accent transition-colors">
                {uploadingFavicon ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Upload favicon
              </span>
              <Input
                id="favicon-upload"
                type="file"
                accept="image/png"
                disabled={uploadingFavicon}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleFaviconUpload(file);
                  e.target.value = "";
                }}
                className="sr-only"
              />
            </Label>
            {settings?.favicon_url && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => clearFavicon.mutate()}
                disabled={clearFavicon.isPending}
              >
                Reset to default
              </Button>
            )}
          </div>
        </div>
      </section>

      <PageMetaEditor />
    </div>
  );
}

function PageMetaEditor() {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin", "page-meta"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_meta")
        .select("*")
        .order("slug");
      if (error) throw error;
      return (data ?? []) as unknown as CmsPageMeta[];
    },
  });

  const [forms, setForms] = useState<Record<string, CmsPageMeta>>({});

  useEffect(() => {
    const next: Record<string, CmsPageMeta> = {};
    for (const { slug } of PAGE_META_SLUGS) {
      const row = rows.find((r) => r.slug === slug);
      next[slug] = row ?? PAGE_META_DEFAULTS[slug as PageMetaSlug];
    }
    const t = setTimeout(() => setForms(next), 0);
    return () => clearTimeout(t);
  }, [rows]);

  const save = useMutation({
    mutationFn: async (slug: PageMetaSlug) => {
      const payload = forms[slug];
      if (!payload) return;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { slug: _label, ...rest } = payload;
      const existing = rows.find((r) => r.slug === slug);
      if (existing) {
        const { error } = await supabase
          .from("page_meta")
          .update(rest)
          .eq("slug", slug);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("page_meta")
          .insert({ slug, ...rest });
        if (error) throw error;
      }
    },
    onSuccess: (_, slug) => {
      toast.success(`Saved ${slug} page title`);
      qc.invalidateQueries({ queryKey: ["admin", "page-meta"] });
      qc.invalidateQueries({ queryKey: ["cms"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Loading page titles…</p>
    );
  }

  return (
    <section className="border border-border rounded-sm">
      <header className="px-4 sm:px-5 py-4 border-b border-border">
        <h3
          style={{ fontFamily: "var(--font-display)" }}
          className="text-lg uppercase tracking-tight"
        >
          Page Titles & SEO
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Browser tab titles and meta descriptions for each public page.
        </p>
      </header>
      <div className="divide-y divide-border">
        {PAGE_META_SLUGS.map(({ slug, label }) => {
          const form = forms[slug];
          if (!form) return null;
          return (
            <div key={slug} className="p-4 sm:p-5 space-y-4">
              <p className="text-xs uppercase tracking-widest text-accent">
                {label}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor={`${slug}-title`}>Page title</Label>
                  <Input
                    id={`${slug}-title`}
                    value={form.title}
                    onChange={(e) =>
                      setForms((p) => ({
                        ...p,
                        [slug]: { ...form, title: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor={`${slug}-description`}>
                    Meta description
                  </Label>
                  <Textarea
                    id={`${slug}-description`}
                    value={form.description}
                    onChange={(e) =>
                      setForms((p) => ({
                        ...p,
                        [slug]: { ...form, description: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`${slug}-og-title`}>Open Graph title</Label>
                  <Input
                    id={`${slug}-og-title`}
                    value={form.og_title ?? ""}
                    onChange={(e) =>
                      setForms((p) => ({
                        ...p,
                        [slug]: { ...form, og_title: e.target.value || null },
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`${slug}-og-description`}>
                    Open Graph description
                  </Label>
                  <Input
                    id={`${slug}-og-description`}
                    value={form.og_description ?? ""}
                    onChange={(e) =>
                      setForms((p) => ({
                        ...p,
                        [slug]: {
                          ...form,
                          og_description: e.target.value || null,
                        },
                      }))
                    }
                  />
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => save.mutate(slug as PageMetaSlug)}
                disabled={save.isPending}
              >
                Save {label}
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
