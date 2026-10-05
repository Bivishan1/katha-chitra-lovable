import { useEffect, useMemo, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowLeft, ChevronLeft, ChevronRight, Info, X } from "lucide-react";
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
   const [showDetails, setShowDetails] = useState(false);


  const subItems = useMemo(
    () => (item ? asArray<CmsEquipmentSubItem>(item.sub_items).filter((s) => s?.name) : []),
    [item],
  );

  // Main photos first, then each kit-content photo — one arrow-navigable slider.
  const gallery = useMemo(() => {
    if (!item) return [] as { url: string; label: string }[];
       const mains = [item.image_url, ...asArray<string>(item.images)].filter(Boolean) as string[];
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
  const t = setTimeout(() => {
    setIndex(0);
    setShowDetails(false);
  }, 0);

  return () => clearTimeout(t);
}, [item?.id]);

  useEffect(() => {
    if (!item || gallery.length < 2) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        setIndex((current) =>
          (current + (event.key === "ArrowRight" ? 1 : -1) + gallery.length) % gallery.length,
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [item, gallery.length]);



  const step = (direction: number) => {
    if (gallery.length > 1) setIndex((current) => (current + direction + gallery.length) % gallery.length);
  };
  const stock = item ? stockStatus(item) : null;
  const details = (item?.description ?? "").split("\n").map((line) => line.trim()).filter(Boolean);
const activeSlide = gallery[index];


  return (
   <DialogPrimitive.Root open={Boolean(item)} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-190 bg-background/30 backdrop-blur-md" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-200 flex flex-col overflow-hidden bg-background/30 text-foreground focus:outline-none"
        >
        
           <header className="relative z-10 flex h-16 shrink-0 items-center justify-between gap-3 px-4 sm:h-20 sm:px-8">
  {/* Back button - Left */}
  <DialogPrimitive.Close asChild>
    <Button
      type="button"
      variant="ghost"
      aria-label="Back to equipment"
      className="h-10 min-w-10 gap-2 bg-card/80 text-foreground hover:text-amber-300 hover:bg-card"
    >
      <ArrowLeft />
      <span className="hidden sm:inline">Back</span>
    </Button>
  </DialogPrimitive.Close>

  {/* Title - Center */}
  <DialogPrimitive.Title className="min-w-0 flex-1 truncate text-center text-sm font-medium sm:text-base">
    {item?.name ?? "Equipment photos"}
  </DialogPrimitive.Title>

  {/* Details button - Right */}
  <Button
    type="button"
    variant="ghost"
    onClick={() => setShowDetails((value) => !value)}
    aria-label={showDetails ? "Hide equipment details" : "Show equipment details"}
    aria-expanded={showDetails}
    className="h-10 min-w-10 gap-2 bg-card/80 text-foreground hover:text-amber-300 hover:bg-card"
  >
    {showDetails ? <X /> : <Info />}
    <span className="hidden sm:inline">
      {showDetails ? "Close details" : "Details"}
    </span>
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
              <p className="text-sm text-muted-foreground">Photo coming soon</p>
            )}
            {gallery.length > 1 && (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  aria-label="Previous photo"
                  onClick={() => step(-1)}
                  className="absolute left-2 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-card/90 text-foreground hover:text-amber-300 hover:bg-card sm:left-8"
                ><ChevronLeft /></Button>
                <Button
                  type="button"
                  variant="secondary"
                  aria-label="Next photo"
                  onClick={() => step(1)}
                  className="absolute right-2 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-card/90 text-foreground hover:text-amber-300 hover:bg-card sm:right-8"
                ><ChevronRight /></Button>
              </>
            )}
          </div>

          {gallery.length > 0 && (
            <footer className="z-10 flex shrink-0 flex-col items-center gap-2 pb-2 sm:pb-3">
             <p>{activeSlide?.label} : <span className="text-muted-foreground"> {index + 1} / {gallery.length}</span></p>
              {gallery.length > 1 && (
                <div className="flex max-w-full gap-2 overflow-x-auto px-1 py-1" aria-label="Equipment photos">
                  {gallery.map((slide, i) => (
                    <Button
                      key={`${slide.url}-${i}`}
                      type="button"
                      variant="ghost"
                      onClick={() => setIndex(i)}
                      aria-label={`Show photo ${i + 1}: ${slide.label}`}
                      aria-current={i === index ? "true" : undefined}
                      className={`h-14 w-14 shrink-0 overflow-hidden rounded-sm border p-0 sm:h-5 sm:w-5 ${i === index ? "border-accent ring-1 ring-accent" : "border-border hover:text-amber-300 hover:bg-card"}`}
                    >
                      <img src={slide.url} alt="" className="h-full w-full object-cover" />
                    </Button>
                  ))}
                </div>
              )}
            </footer>

          )}
                    {showDetails && item && (
            <aside className="absolute inset-x-0 bottom-0 top-16 z-20 overflow-y-auto border-t border-border bg-background p-6 shadow-2xl sm:inset-x-auto sm:bottom-0 sm:right-0 sm:top-20 sm:w-[min(400px,90vw)] sm:border-l sm:border-t-0">
              <div className="mb-6 flex items-start justify-between gap-4">
                <h2 className="font-display text-xl uppercase">{item.name}</h2>
                <Button type="button" variant="ghost" size="icon" aria-label="Close details" onClick={() => setShowDetails(false)}><X /></Button>
              </div>
              <p className="mb-5 text-xs uppercase text-accent">{stock?.label}</p>
              {showPrices && !item.note ? (
                <div className="mb-6 border-t border-border pt-4 text-sm">
                  <p>Per day · {npr(Number(item.price_day ?? 0))}</p>
                  <p className="mt-1 text-muted-foreground">Per week · {npr(Number(item.price_week ?? 0))}</p>
                </div>
              ) : (
                <p className="mb-6 text-xs uppercase text-accent">{item.note || "Rate on request"}</p>
              )}
              {details.length > 0 && (
                <div className="mb-6 border-t border-border pt-4">
                  <h3 className="mb-3 text-xs uppercase text-accent">Product details</h3>
                  {details.map((line, i) => <p key={i} className="mb-2 text-sm leading-relaxed text-foreground/80">{line}</p>)}
                </div>
              )}
              {subItems.length > 0 && (
                <div className="border-t border-border pt-4">
                  <h3 className="mb-3 text-xs uppercase text-accent">Kit contents</h3>
                  {subItems.map((sub, i) => {
                    const photoIndex = gallery.findIndex((slide) => slide.url === sub.image_url);
                    return (
                      <Button
                        key={`${sub.name}-${i}`}
                        type="button"
                        variant="ghost"
                        disabled={photoIndex < 0}
                        onClick={() => { setIndex(photoIndex); setShowDetails(false); }}
                        className="mb-1 h-auto min-h-14 w-full justify-start gap-3 whitespace-normal border-b border-border px-0 py-2 text-left hover:bg-muted"
                      >
                        {sub.image_url && <img src={sub.image_url} alt="" className="h-10 w-10 shrink-0 object-cover" />}
                        <span className="text-xs text-muted-foreground">1x</span>
                        <span className="text-sm">{sub.name}</span>
                      </Button>
                    );
                  })}
                </div>
              )}
            </aside>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
