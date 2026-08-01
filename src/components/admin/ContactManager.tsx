import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useContactDetails, type CmsContact } from "@/lib/cms";
import { ResourceManager } from "./ResourceManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const fields: { key: keyof CmsContact; label: string; area?: boolean }[] = [
  { key: "company_name", label: "Company name" },
  { key: "address", label: "Address" },
  { key: "email", label: "Primary email" },
  { key: "secondary_email", label: "Secondary email" },
  { key: "phone", label: "Phone" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "booking_url", label: "Booking / calendar link" },
  { key: "note", label: "Note", area: true },
];

export function ContactManager() {
  const qc = useQueryClient();
  const { data } = useContactDetails();
  const [form, setForm] = useState<Partial<CmsContact>>({});

  useEffect(() => {
    // if (data) setForm(data);
    const t = setTimeout(() => setForm((data ?? {}) as Partial<CmsContact>), 0);
    return () => clearTimeout(t);
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...form };
      delete (payload as Record<string, unknown>).id;
      delete (payload as Record<string, unknown>).created_at;
      delete (payload as Record<string, unknown>).updated_at;
      if (data?.id) {
        const { error } = await supabase.from("contact_details").update(payload as never).eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("contact_details").insert(payload as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Contact details updated");
      qc.invalidateQueries({ queryKey: ["cms"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-8">
      <section className="border border-border rounded-sm">
        <header className="px-4 sm:px-5 py-4 border-b border-border">
          <h3 style={{ fontFamily: "var(--font-display)" }} className="text-lg uppercase tracking-tight">
            Contact Details
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Shown across the site footer and contact page.</p>
        </header>
        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((f) => (
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
          <div className="sm:col-span-2">
            <Button onClick={() => save.mutate()} disabled={save.isPending}>Save contact details</Button>
          </div>
        </div>
      </section>

      <ResourceManager
        table="social_links"
        title="Social Links"
        description="Instagram, YouTube, Facebook and anything else."
        orderBy="sort_order"
        defaults={{ sort_order: 1 }}
        columns={[
          { key: "platform", label: "Platform" },
          { key: "url", label: "URL" },
          { key: "handle", label: "Handle" },
        ]}
        fields={[
          { key: "platform", label: "Platform", type: "text", required: true },
          { key: "url", label: "URL", type: "text", required: true },
          { key: "handle", label: "Handle", type: "text" },
          { key: "sort_order", label: "Sort order", type: "number" },
        ]}
      />
    </div>
  );
}
