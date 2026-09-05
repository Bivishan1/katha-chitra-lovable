import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { CmsEquipmentItem, CmsEquipmentSubItem } from "@/lib/cms";
import { npr } from "@/lib/cms";

function asArray<T>(value: unknown): T[] {
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

export function EquipmentDetailDialog({
  item,
  showPrices,
  onOpenChange,
}: {
  item: CmsEquipmentItem | null;
  showPrices: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [index, setIndex] = useState(0);

  const subItems = useMemo(
    () => (item ? asArray<CmsEquipmentSubItem>(item.sub_items).filter((s) => s?.name) : []),
    [item],
  );

  // Main photos first, then each kit-content photo — one arrow-navigable slider.
  const gallery = useMemo(() => {
    if (!item) return [] as { url: string; label: string }[];
    const extra = asArray<string>(item.images).filter(Boolean);
    const mains = [item.image_url, ...extra].filter(Boolean) as string[];
    const slides: { url: string; label: string }[] = [];
    const seen = new Set<string>();
    for (const url of mains) {
      if (!seen.has(url)) {
        seen.add(url);
        slides.push({ url, label: item.name });
      }
    }
    for (const s of subItems) {
      if (s.image_url && !seen.has(s.image_url)) {
        seen.add(s.image_url);
        slides.push({ url: s.image_url, label: s.name });
      }
    }
    return slides;
  }, [item, subItems]);

  // Map each kit-content photo to its slide index so clicking a row jumps the slider.
  const subItemSlideIndex = useMemo(() => {
    const map = new Map<string, number>();
    gallery.forEach((g, i) => {
      if (!map.has(g.url)) map.set(g.url, i);
    });
    return map;
  }, [gallery]);

//   useEffect(() => {
//     setIndex(0);
//   }, [item?.id]);
   useEffect(() => {
      const t = setTimeout(() =>  setIndex(0));
      return () => clearTimeout(t);
    }, [item?.id]);

  const step = (dir: number) => {
    if (gallery.length < 2) return;
    setIndex((i) => (i + dir + gallery.length) % gallery.length);
  };

  const details = (item?.description ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <Dialog open={!!item} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left">
          <DialogTitle
            style={{ fontFamily: "var(--font-display)" }}
            className="uppercase tracking-tight text-xl sm:text-2xl pr-8"
          >
            {item?.name}
          </DialogTitle>
        </DialogHeader>

        {item && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* Gallery */}
            <div>
              <div className="relative bg-muted/30 rounded-sm overflow-hidden">
                {gallery.length > 0 ? (
                  <img
                    src={gallery[index].url}
                    alt={`${gallery[index].label} — photo ${index + 1}`}
                    className="w-full h-60 sm:h-90 object-contain"
                  />
                ) : (
                  <div className="w-full h-60 sm:h-90 flex items-center justify-center text-xs uppercase tracking-widest text-muted-foreground">
                    Photo coming soon
                  </div>
                )}

                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous photo"
                      onClick={() => step(-1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/80 border border-border flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next photo"
                      onClick={() => step(1)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/80 border border-border flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {gallery.length > 1 && (
                <>
                <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {gallery.map((slide, i) => (
                    <li key={`${slide.url}-${i}`}>
                      <button
                        type="button"
                        onClick={() => setIndex(i)}
                        aria-label={`Show ${slide.label}`}
                        aria-current={i === index}
                        className={`h-14 w-14 shrink-0 rounded-sm overflow-hidden border transition-colors ${
                          i === index ? "border-accent" : "border-border/60 hover:border-foreground/40"
                        }`}
                      >
                        <img src={slide.url} alt={slide.label} className="w-full h-full object-cover" />
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground truncate">
                  {index + 1} / {gallery.length} · {gallery[index]?.label}
                </p>
                </>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              {subItems.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-accent mb-3">Kit contents</p>
                  <ul className="divide-y divide-border/60 border-y border-border/60">
                    {subItems.map((s, i) => {
                      const slideIdx = s.image_url ? subItemSlideIndex.get(s.image_url) : undefined;
                      const active = slideIdx !== undefined && slideIdx === index;
                      return (
                        <li key={`${s.name}-${i}`}>
                          <button
                            type="button"
                            disabled={slideIdx === undefined}
                            onClick={() => slideIdx !== undefined && setIndex(slideIdx)}
                            aria-label={slideIdx !== undefined ? `Show photo of ${s.name}` : s.name}
                            className={`w-full flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-sm text-left transition-colors ${
                              slideIdx !== undefined ? "hover:bg-accent/5 cursor-pointer" : "cursor-default"
                            } ${active ? "bg-accent/10" : ""}`}
                          >
                            <span
                              className={`h-12 w-12 shrink-0 rounded-sm overflow-hidden border bg-muted/30 transition-colors ${
                                active ? "border-accent" : "border-border/60"
                              }`}
                            >
                              {s.image_url ? (
                                <img src={s.image_url} alt={s.name} className="w-full h-full object-cover" />
                              ) : null}
                            </span>
                            <span className="text-xs text-muted-foreground shrink-0">1x</span>
                            <span className="text-sm text-foreground min-w-0">{s.name}</span>
                            {slideIdx !== undefined && (
                              <ChevronRight className="w-4 h-4 ml-auto shrink-0 text-muted-foreground" />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div>
                {showPrices && !item.note ? (
                  <>
                    <p className="text-xs text-muted-foreground">1 day</p>
                    <p
                      style={{ fontFamily: "var(--font-display)" }}
                      className="text-2xl sm:text-3xl tracking-tight"
                    >
                      {npr(Number(item.price_day ?? 0))}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Per week {npr(Number(item.price_week ?? 0))}
                    </p>
                  </>
                ) : (
                  <p className="text-xs uppercase tracking-widest text-accent">
                    {item.note || "Rate on request"}
                  </p>
                )}
              </div>

              {details.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-accent">Product details</p>
                  {details.map((line, i) => (
                    <p key={i} className="text-sm text-foreground/80 leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
