import { useEffect, useMemo, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from "lucide-react";
import type { CmsEquipmentItem, CmsEquipmentSubItem } from "@/lib/cms";
import { npr, stockStatus } from "@/lib/cms";
import { Button } from "@/components/ui/button";

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
  const [view, setView] = useState<"details" | "gallery">("details");

  const subItems = useMemo(
    () =>
      item
        ? asArray<CmsEquipmentSubItem>(item.sub_items).filter((s) => s?.name)
        : [],
    [item],
  );

  // Main photos first, then each kit-content photo — one arrow-navigable slider.
  const gallery = useMemo(() => {
    if (!item) return [] as { url: string; label: string }[];
    const mains = [item.image_url, ...asArray<string>(item.images)].filter(
      Boolean,
    ) as string[];
    const slides: { url: string; label: string }[] = [];
    const seen = new Set<string>();
    for (const url of mains) {
      if (!seen.has(url)) {
        seen.add(url);
        slides.push({ url, label: item.name });
      }
    }
    for (const sub of subItems) {
      if (sub.image_url && !seen.has(sub.image_url)) {
        seen.add(sub.image_url);
        slides.push({ url: sub.image_url, label: sub.name });
      }
    }
    return slides;
  }, [item, subItems]);

  // useEffect(() => {
  //   setIndex(0);
  //   setshowDetails(false);
  // }, [item?.id]);

  useEffect(() => {
    if (!item || gallery.length < 2) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        setIndex(
          (current) =>
            (current + (event.key === "ArrowRight" ? 1 : -1) + gallery.length) %
            gallery.length,
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [item, gallery.length]);

  /** Escape in the enlarge view behaves like the Back button — returns to details. */
  useEffect(() => {
    if (!item || view !== "gallery") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        setView("details");
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [item, view]);

  

  const step = (direction: number) => {
    if (gallery.length > 1)
      setIndex(
        (current) => (current + direction + gallery.length) % gallery.length,
      );
  };
  const stock = item ? stockStatus(item) : null;
  const details = (item?.description ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const activeSlide = gallery[index];

  /** Kit row matching the currently shown photo, so its name can be highlighted. */
  const activeSubIndex = useMemo(
    () =>
      activeSlide
        ? subItems.findIndex((sub) => sub.image_url === activeSlide.url)
        : -1,
    [activeSlide, subItems],
  );

  const kitRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const row = kitRefs.current[activeSubIndex];
    if (view === "details" && row)
      row.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeSubIndex, view]);

  return (
    <DialogPrimitive.Root open={Boolean(item)} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-190 bg-background/75 backdrop-blur-xl" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={
            view === "gallery"
              ? "fixed inset-0 z-200 flex flex-col overflow-hidden bg-background/30 text-foreground focus:outline-none"
              : "fixed left-1/2 top-1/2 z-200 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-border bg-card text-card-foreground shadow-2xl focus:outline-none"
          }
        >
          {view === "gallery" ? (
            <>
              <header className="relative z-10 flex h-16 shrink-0 items-center justify-between gap-3 px-4 sm:h-20 sm:px-8">
                <div className="h-10 w-10 sm:w-24" aria-hidden="true" />
                <DialogPrimitive.Title className="min-w-0 flex-1 truncate text-center text-sm font-medium sm:text-base">
                  {item?.name ?? "Equipment photos"}
                </DialogPrimitive.Title>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setView("details")}
                  aria-label="Back to equipment details"
                  className="h-10 p-4 min-w-10 gap-2 bg-card/80 text-foreground "
                >
                  <ArrowLeft />
                  <span className="hidden sm:inline">Back</span>
                </Button>
              </header>

              <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 py-2 sm:px-24">
                {activeSlide ? (
                  <img
                    src={activeSlide.url}
                    alt={`${activeSlide.label} — photo ${index + 1} of ${gallery.length}`}
                    className="max-h-full max-w-full object-contain select-none"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Photo coming soon
                  </p>
                )}
                {gallery.length > 1 && (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      aria-label="Previous photo"
                      onClick={() => step(-1)}
                      className="absolute left-2 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-card/90 text-foreground sm:left-8"
                    >
                      <ChevronLeft />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      aria-label="Next photo"
                      onClick={() => step(1)}
                      className="absolute right-2 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-card/90 text-foreground sm:right-8"
                    >
                      <ChevronRight />
                    </Button>
                  </>
                )}
              </div>

              {gallery.length > 0 && (
                <footer className="z-10 flex shrink-0 flex-col items-center gap-2 px-4 pb-4 pt-2 ">
                  <p className="max-w-full truncate text-center text-xs text-foreground/80">
                    {activeSlide?.label}{" "}
                    <span className="text-muted-foreground">
                      · {index + 1} / {gallery.length}
                    </span>
                  </p>
                  {gallery.length > 1 && (
                    <div
                      className="flex max-w-full gap-2 overflow-x-auto"
                      aria-label="Equipment photos"
                    >
                      {gallery.map((slide, i) => (
                        <Button
                          key={`${slide.url}-${i}`}
                          type="button"
                          variant="ghost"
                          onClick={() => setIndex(i)}
                          aria-label={`Show photo ${i + 1}: ${slide.label}`}
                          aria-current={i === index ? "true" : undefined}
                          className={`h-14 w-14 shrink-0 overflow-hidden rounded-sm border p-0 sm:h-8 sm:w-8 ${i === index ? "border-accent ring-1 ring-accent" : "border-border hover:border-foreground/60"}`}
                        >
                          <img
                            src={slide.url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </Button>
                      ))}
                    </div>
                  )}
                </footer>
              )}
            </>
          ) : (
            <div className="relative grid max-h-[calc(100dvh-2rem)] overflow-y-auto md:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] md:overflow-hidden">
              <DialogPrimitive.Close asChild>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  aria-label="Close equipment details"
                  className="absolute right-3 top-3 z-20 bg-card/90 text-foreground hover:bg-card"
                >
                  <X />
                </Button>
              </DialogPrimitive.Close>

              <div className="flex min-h-72 flex-col border-b border-border bg-background/40 md:min-h-155 md:border-b-0 md:border-r">
                <button
                  type="button"
                  onClick={() => activeSlide && setView("gallery")}
                  aria-label={`Enlarge ${activeSlide?.label ?? item?.name ?? "equipment"} photo`}
                  className="group relative flex min-h-64 flex-1  cursor-zoom-in! items-center justify-center overflow-hidden p-5 sm:p-8"
                >
                  {activeSlide ? (
                    <img
                      src={activeSlide.url}
                      alt={`${activeSlide.label} — photo ${index + 1} of ${gallery.length}`}
                      className="max-h-[58vh] max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.02] md:max-h-100"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Photo coming soon
                    </span>
                  )}
                  {activeSlide && (
                    <span
                      className="absolute bottom-4 right-4 inline-flex h-10 w-10 items-center justify-center border border-border text-foreground shadow-lg"
                      aria-hidden="true"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </span>
                  )}
                </button>

                {gallery.length > 0 && (
                  <div className="flex shrink-0 items-center gap-2 border-t border-border px-4 py-3">
                    {gallery.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Previous photo"
                        onClick={() => step(-1)}
                      >
                        <ChevronLeft />
                      </Button>
                    )}
                    <div
                      className="flex min-w-0 flex-1 gap-2 overflow-x-auto py-1"
                      aria-label="Equipment photos"
                    >
                      {gallery.map((slide, i) => (
                        <Button
                          key={`${slide.url}-${i}`}
                          type="button"
                          variant="ghost"
                          onClick={() => setIndex(i)}
                          aria-label={`Show photo ${i + 1}: ${slide.label}`}
                          aria-current={i === index ? "true" : undefined}
                          className={`h-12 w-12 shrink-0 overflow-hidden rounded-sm border p-0 ${i === index ? "border-accent ring-1 ring-accent" : "border-border hover:border-foreground/60"}`}
                        >
                          <img
                            src={slide.url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </Button>
                      ))}
                    </div>
                    {gallery.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Next photo"
                        onClick={() => step(1)}
                      >
                        <ChevronRight />
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {item && (
                <div className="overflow-y-auto p-6 sm:p-8 md:max-h-155">
                  <p className="mb-3 text-xs uppercase text-accent">
                    Rental equipment
                  </p>
                  <DialogPrimitive.Title className="pr-10 font-display text-2xl uppercase leading-tight sm:text-3xl">
                    {item.name}
                  </DialogPrimitive.Title>
                  <p className="mt-4 text-xs uppercase text-accent">
                    {stock?.label}
                  </p>

                  {showPrices && !item.note ? (
                    <div className="mt-6 border-t border-border pt-5 text-sm">
                      <p>Per day · {npr(Number(item.price_day ?? 0))}</p>
                      <p className="mt-1 text-muted-foreground">
                        Per week · {npr(Number(item.price_week ?? 0))}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-6 border-t border-border pt-5 text-xs uppercase text-accent">
                      {item.note || "Rate on request"}
                    </p>
                  )}

                  {details.length > 0 && (
                    <div className="mt-6 border-t border-border pt-5">
                      <h3 className="mb-3 text-xs uppercase text-accent">
                        Product details
                      </h3>
                      {details.map((line, i) => (
                        <p
                          key={i}
                          className="mb-2 text-sm leading-relaxed text-foreground/80"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  )}

                  {subItems.length > 0 && (
                    <div className="mt-6 border-t border-border pt-5">
                      <h3 className="mb-3 text-xs uppercase text-accent">
                        Kit contents
                      </h3>
                      {subItems.map((sub, i) => {
                        const photoIndex = gallery.findIndex(
                          (slide) => slide.url === sub.image_url,
                        );
                        const highlighted = i === activeSubIndex;
                        return (
                          <Button
                            key={`${sub.name}-${i}`}
                            ref={(el) => {
                              kitRefs.current[i] = el;
                            }}

                            type="button"
                            variant="ghost"
                            disabled={photoIndex < 0}
                            onClick={() => setIndex(photoIndex)}
                            aria-current={highlighted ? "true" : undefined}
                            className={`mb-1  min-h-12 w-full justify-start gap-3 whitespace-normal border-b px-0 py-2 text-left rounded-none hover:bg-muted ${
                              highlighted ? "border-accent bg-accent/10" : "border-border"
                            }`}
                          >
                            {sub.image_url && (
                              <img
                                src={sub.image_url}
                                alt=""
                                className="h-10 w-10 shrink-0 object-cover"
                              />
                            )}
                            <span className={`text-xs ${highlighted ? "text-accent" : "text-muted-foreground"}`}>1x</span>
                            <span className={`text-sm ${highlighted ? "font-medium text-foreground" : ""}`}>{sub.name}</span>
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
