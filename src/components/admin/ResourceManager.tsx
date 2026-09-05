import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia } from "@/lib/cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";

export type FieldDef = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "boolean" | "image" | "file" | "select" | "gallery" | "subitems";
  options?: { value: string; label: string }[];
  required?: boolean;
  help?: string;
};


type SubItem = { name: string; image_url: string };

function toList<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function GalleryField({
  value,
  onChange,
  upload,
}: {
  value: unknown;
  onChange: (next: string[]) => void;
  upload: (file: File) => Promise<string>;
}) {
  const list = toList<string>(value);
  const [busy, setBusy] = useState(false);

  const addFiles = async (files: FileList) => {
    setBusy(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) urls.push(await upload(file));
      onChange([...list, ...urls]);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= list.length) return;
    const next = [...list];
    const [row] = next.splice(from, 1);
    next.splice(to, 0, row);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/*"
          multiple
          disabled={busy}
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        {busy && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      </div>
      {list.length > 0 && (
        <ul className="grid grid-cols-4 gap-2">
          {list.map((url, idx) => (
            <li key={`${url}-${idx}`} className="relative group">
              <img src={url} alt="" className="h-16 w-full object-cover rounded-sm border border-border" />
              <div className="absolute inset-x-0 bottom-0 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  aria-label="Move left"
                  className="px-1 text-xs bg-background/80"
                  onClick={() => move(idx, idx - 1)}
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="Remove image"
                  className="px-1 text-xs bg-background/80 text-destructive"
                  onClick={() => onChange(list.filter((_, i) => i !== idx))}
                >
                  ✕
                </button>
                <button
                  type="button"
                  aria-label="Move right"
                  className="px-1 text-xs bg-background/80"
                  onClick={() => move(idx, idx + 1)}
                >
                  →
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SubItemsField({
  value,
  onChange,
  upload,
}: {
  value: unknown;
  onChange: (next: SubItem[]) => void;
  upload: (file: File) => Promise<string>;
}) {
  const list = toList<SubItem>(value);
  const set = (idx: number, patch: Partial<SubItem>) =>
    onChange(list.map((row, i) => (i === idx ? { ...row, ...patch } : row)));

  return (
    <div className="space-y-3">
      {list.map((row, idx) => (
        <div key={idx} className="flex items-start gap-2 border border-border rounded-sm p-2">
          {row.image_url ? (
            <img src={row.image_url} alt="" className="h-12 w-12 object-cover rounded-sm shrink-0" />
          ) : (
            <div className="h-12 w-12 rounded-sm bg-muted shrink-0" />
          )}
          <div className="flex-1 space-y-2 min-w-0">
            <Input
              value={row.name ?? ""}
              placeholder="Item name (e.g. Sony GM 24mm F1.4)"
              onChange={(e) => set(idx, { name: e.target.value })}
            />
            <Input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                try {
                  set(idx, { image_url: await upload(file) });
                } catch (err) {
                  toast.error((err as Error).message);
                }
              }}
            />
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Remove included item"
            onClick={() => onChange(list.filter((_, i) => i !== idx))}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" onClick={() => onChange([...list, { name: "", image_url: "" }])}>
        <Plus className="w-4 h-4 mr-1" /> Add included item
      </Button>
    </div>
  );
}

type Row = Record<string, unknown>;

export function ResourceManager({
  table,
  title,
  description,
  fields,
  columns,
  orderBy = "sort_order",
  defaults = {},
  extraFilter,
  onChanged,
}: {
  table: string;
  title: string;
  description?: string;
  fields: FieldDef[];
  columns: { key: string; label: string; render?: (row: Row) => React.ReactNode }[];
  orderBy?: string;
  defaults?: Row;
  extraFilter?: { column: string; value: string } | null;
  onChanged?: () => void;
}) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Row | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const queryKey = ["admin", table, extraFilter?.value ?? "all"];

  const { data: rows = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      let q = supabase.from(table as never).select("*").order(orderBy, { ascending: true });
      if (extraFilter) q = q.eq(extraFilter.column, extraFilter.value) as typeof q;
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey });
    qc.invalidateQueries({ queryKey: ["cms"] });
    onChanged?.();
  };

  const save = useMutation({
    mutationFn: async (values: Row) => {
      const payload = { ...values };
      delete payload.id;
      delete payload.created_at;
      delete payload.updated_at;
      if (extraFilter) payload[extraFilter.column] = extraFilter.value;
      if (values.id) {
        const { error } = await supabase.from(table as never).update(payload as never).eq("id", values.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table as never).insert(payload as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Saved");
      setOpen(false);
      setEditing(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table as never).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const startNew = () => {
    setEditing({ ...defaults });
    setOpen(true);
  };

  const setValue = (key: string, value: unknown) =>
    setEditing((prev) => ({ ...(prev ?? {}), [key]: value }));

  const handleUpload = async (key: string, file: File) => {
    setBusy(true);
    try {
      const url = await uploadMedia(file, table);
      setValue(key, url);
      toast.success("File uploaded");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="border border-border rounded-sm">
      <header className="flex flex-wrap gap-3 items-center justify-between px-4 sm:px-5 py-4 border-b border-border">
        <div>
          <h3 style={{ fontFamily: "var(--font-display)" }} className="text-lg uppercase tracking-tight">
            {title}
          </h3>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
        <Button size="sm" onClick={startNew}>
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </header>

      {isLoading ? (
        <p className="px-5 py-6 text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="px-5 py-6 text-sm text-muted-foreground">Nothing here yet.</p>
      ) : (
        <ul className="divide-y divide-border">
          {rows.map((row) => (
            <li key={String(row.id ?? "")} className="px-4 sm:px-5 py-3 flex flex-wrap gap-3 items-center justify-between">
              <div className="min-w-0 flex-1 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-1">
                {columns.map((c) => (
                  <div key={c.key} className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-widest text-muted-foreground">
                      {c.label}
                    </span>
                    <span className="block text-sm truncate">
                      {c.render ? c.render(row) : String(row[c.key] ?? "—")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Edit"
                  onClick={() => {
                    setEditing(row);
                    setOpen(true);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Delete"
                  onClick={() => {
                    if (confirm("Delete this entry permanently?")) {
                      const id = row.id;
                      if (typeof id === "string" || typeof id === "number") {
                        remove.mutate(String(id));
                      }
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? `Edit ${title}` : `New ${title}`}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {fields.map((f: FieldDef) => {
              const value = editing?.[f.key];
              return (
                <div key={f.key} className="space-y-1.5">
                  <Label htmlFor={f.key}>{f.label}</Label>
                  {f.type === "textarea" ? (
                    <Textarea id={f.key} value={String(value ?? "")} onChange={(e) => setValue(f.key, e.target.value)} />
                  ) : f.type === "boolean" ? (
                    <div className="pt-1">
                      <Switch id={f.key} checked={Boolean(value)} onCheckedChange={(v) => setValue(f.key, v)} />
                    </div>
                  ) : f.type === "select" ? (
                    <select
                      id={f.key}
                      value={String(value ?? "")}
                      onChange={(e) => setValue(f.key, e.target.value)}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="">Select…</option>
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    ) : f.type === "gallery" ? (
                    <GalleryField
                      value={value}
                      onChange={(next) => setValue(f.key, next)}
                      upload={(file) => uploadMedia(file, table)}
                    />
                  ) : f.type === "subitems" ? (
                    <SubItemsField
                      value={value}
                      onChange={(next) => setValue(f.key, next)}
                      upload={(file) => uploadMedia(file, table)}
                    />
                  ) : f.type === "image" || f.type === "file" ? (
                    <div className="space-y-2">
                      <Input
                        id={f.key}
                        value={String(value ?? "")}
                        placeholder="Paste a URL, or upload below"
                        onChange={(e) => setValue(f.key, e.target.value)}
                      />
                      <Input
                        type="file"
                        accept={f.type === "image" ? "image/*" : "application/pdf"}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(f.key, file);
                        }}
                      />
                      {f.type === "image" && typeof value === "string" && value ? (
                        <img src={value} alt="" className="h-20 w-auto rounded-sm object-cover" />
                      ) : null}
                    </div>
                  ) : (
                    <Input
                      id={f.key}
                      type={f.type === "number" ? "number" : "text"}
                      value={String(value ?? "")}
                      onChange={(e) =>
                        setValue(f.key, f.type === "number" ? Number(e.target.value) : e.target.value)
                      }
                    />
                  )}
                  {f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              disabled={busy || save.isPending}
              onClick={() => {
                const values = editing ?? {};
                const missing = fields.find((f) => f.required && !values[f.key]);
                if (missing) return toast.error(`${missing.label} is required`);
                save.mutate(values);
              }}
            >
              {(busy || save.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
