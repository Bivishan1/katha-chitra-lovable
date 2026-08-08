import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia, useFounderProfile, type CmsFounderProfile } from "@/lib/cms";
import { ResourceManager } from "./ResourceManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const founderFields: { key: keyof CmsFounderProfile; label: string; area?: boolean }[] = [
  { key: "name", label: "First name" },
  { key: "name_accent", label: "Accent name (italic part)" },
  { key: "role", label: "Role / title" },
  { key: "bio_primary", label: "Primary bio", area: true },
  { key: "bio_secondary", label: "Secondary bio", area: true },
  { key: "image_alt", label: "Photo alt text" },
];

export function AboutContentManager() {
  const qc = useQueryClient();
  const { data } = useFounderProfile();
  const [form, setForm] = useState<Partial<CmsFounderProfile>>({});
  const [photoBusy, setPhotoBusy] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setForm((data ?? {}) as Partial<CmsFounderProfile>), 0);
    return () => clearTimeout(t);
  }, [data]);

  const saveFounder = useMutation({
    mutationFn: async () => {
      const payload = { ...form };
      delete (payload as Record<string, unknown>).id;
      delete (payload as Record<string, unknown>).created_at;
      delete (payload as Record<string, unknown>).updated_at;
      delete (payload as Record<string, unknown>).is_singleton;

      if (data?.id) {
        const { error } = await supabase.from("founder_profile").update(payload as never).eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("founder_profile").insert(payload as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Founder profile updated");
      qc.invalidateQueries({ queryKey: ["cms"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handlePhotoUpload = async (file: File) => {
    setPhotoBusy(true);
    try {
      const url = await uploadMedia(file, "founder_profile");
      setForm((p) => ({ ...p, image_url: url }));
      toast.success("Photo uploaded — save to apply");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setPhotoBusy(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="border border-border rounded-sm">
        <header className="px-4 sm:px-5 py-4 border-b border-border">
          <h3 style={{ fontFamily: "var(--font-display)" }} className="text-lg uppercase tracking-tight">
            Founder
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Name, photo and bio shown in the About page team section.
          </p>
        </header>
        <div className="p-4 sm:p-5 space-y-4">
          <div className="space-y-2">
            <Label>Founder photo</Label>
            {form.image_url && (
              <img
                src={form.image_url}
                alt={form.image_alt ?? "Founder"}
                className="w-40 aspect-4/5 object-cover border border-border"
              />
            )}
            <Label htmlFor="founder-photo" className="cursor-pointer inline-block">
              <span className="inline-flex items-center px-4 py-2 text-sm border border-border rounded-md hover:border-accent transition-colors">
                {photoBusy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Upload photo
              </span>
              <input
                id="founder-photo"
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={photoBusy}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handlePhotoUpload(file);
                  e.target.value = "";
                }}
              />
            </Label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {founderFields.map((f) => (
              <div key={f.key} className={`space-y-1.5 ${f.area ? "sm:col-span-2" : ""}`}>
                <Label htmlFor={f.key}>{f.label}</Label>
                {f.area ? (
                  <Textarea
                    id={f.key}
                    value={(form[f.key] as string) ?? ""}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  />
                ) : (
                  <Input
                    id={f.key}
                    value={(form[f.key] as string) ?? ""}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  />
                )}
              </div>
            ))}
          </div>

          <Button onClick={() => saveFounder.mutate()} disabled={saveFounder.isPending}>
            Save founder profile
          </Button>
        </div>
      </section>

      <ResourceManager
        table="team_members"
        title="Team Members"
        description="People listed below the founder on the About page."
        orderBy="sort_order"
        defaults={{ published: true, sort_order: 1 }}
        columns={[
          { key: "name", label: "Name" },
          { key: "role", label: "Role" },
          { key: "published", label: "Published", render: (r) => (r.published ? "Yes" : "No") },
        ]}
        fields={[
          { key: "name", label: "Name", type: "text", required: true },
          { key: "role", label: "Role", type: "text", required: true },
          { key: "image_url", label: "Photo (optional)", type: "image" },
          { key: "sort_order", label: "Sort order", type: "number" },
          { key: "published", label: "Published", type: "boolean" },
        ]}
      />
    </div>
  );
}
