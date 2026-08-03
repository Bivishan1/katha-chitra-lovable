import { Link } from "@tanstack/react-router";
import SiteHeader from "../components/SiteHeader";
import  SiteFooter  from "../components/SiteFooter";
import { PageHero } from "../components/PageHero";
import { useEquipment, useSiteSettings, npr } from "@/lib/cms";
import rentalHero from "../assets/bts-monitor.jpg";
import camerasBg from "../assets/cameras.jpg";
import lensesBg from "../assets/lenses.jpg";
import lightingBg from "../assets/lighting.jpg";
import gripBg from "../assets/grip.jpg";
import soundBg from "../assets/sound.jpg";
import dronesBg from "../assets/drone.jpg";

const fallbackImages = [camerasBg, lensesBg, lightingBg, gripBg, soundBg, dronesBg];

const perks = [
  { title: "Daily & weekly rates", body: "Flexible day, weekend and weekly pricing with multi-day discounts." },
  { title: "Delivery in Kathmandu", body: "Pickup from our Lalitpur kit room or same-day delivery within the valley." },
  { title: "On-set support", body: "Add a kit tech or 1st AC to your booking — we keep the gear running on the day." },
  { title: "Fully insured", body: "All equipment insured. Damage waivers and certificates of insurance on request." },
];
export default function RentalEquipmentPage() {
  const { data: equipment } = useEquipment();
  const { data: settings } = useSiteSettings();
  const categories = equipment?.categories ?? [];
  const items = equipment?.items ?? [];
  const showPrices = Boolean(settings?.show_equipment_prices);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      {/* Hero */}
       <PageHero
        image={rentalHero}
        alt="Cinema camera and monitor on a film set"
        eyebrow="Rental Equipment"
        caption="Kit Room · Kathmandu"
      >
        <h1
          style={{ fontFamily: "var(--font-display)" }}
          className="text-5xl sm:text-7xl md:text-9xl uppercase tracking-tighter leading-[0.85]"
        >
          Gear, ready <br />
          <span className="italic font-light text-accent">to roll.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-sm sm:text-base text-foreground/80 leading-relaxed">
          A working kit room in Kathmandu — cameras, lenses, lighting, grip, sound and drones. Daily and weekly rentals, with delivery, on-set support and full insurance.
        </p>
      </PageHero>
      {/* Categories */}
      {/* Categories — full-bleed image bands with price table */}
      <div>
        {categories.map((c, idx) => {
          const catItems = items.filter((i) => i.category_id === c.id);
          return (
          <section key={c.id} className="relative overflow-hidden border-t border-border">
            {/* Full-bleed background image */}
            <img
              src={c.image_url || fallbackImages[idx % fallbackImages.length]}
              alt={`${c.name} — rental equipment`}
              loading="lazy"
              width={1920}
              height={1080}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Scrims for legibility */}
            <div className="absolute inset-0 bg-background/70" />
            <div className="absolute inset-0 bg-linear-gradient-to-r from-background via-background/70 to-background/30" />
            <div className="absolute inset-0 bg-linear-gradient-to-b from-background/40 via-transparent to-background/80" />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-20 sm:py-28 md:py-36 grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-5 flex flex-col justify-center">
                <div className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-accent mb-4">
                  {String(idx + 1).padStart(2, "0")} · Category
                </div>
                <h2
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-4xl sm:text-5xl md:text-7xl uppercase tracking-tight leading-[0.9] mb-6"
                >
                  {c.name}
                </h2>
                <p className="text-sm sm:text-base text-foreground/80 leading-relaxed max-w-md">
                  {c.description}
                </p>
              </div>
              {/* Price table */}
              <div className="col-span-12 md:col-span-7 md:pl-8">
                <div className="backdrop-blur-md bg-background/40 border border-border/60 rounded-sm">
                  <div className="hidden sm:grid grid-cols-12 px-5 py-3 border-b border-border/60 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    <div className="col-span-6">Item</div>
                    <div className={showPrices ? "col-span-6" : "col-span-12"}>Item</div>
                    {showPrices && (
                      <>
                        <div className="col-span-3 text-right">Per day</div>
                        <div className="col-span-3 text-right">Per week</div>
                      </>
                    )}
                  </div>
                  <ul className="divide-y divide-border/60">
                   {catItems.length === 0 && (
                      <li className="px-5 py-4 text-sm text-muted-foreground">Kit list coming soon.</li>
                    )}
                    {catItems.map((i) => (
                     <li
                        key={i.id}
                        className="grid grid-cols-12 gap-2 px-5 py-4 items-baseline hover:bg-accent/5 transition-colors"
                      >
                        <div className={`col-span-12 text-sm sm:text-[15px] text-foreground ${showPrices ? "sm:col-span-6" : ""}`}>
                          {i.name}
                        </div>
                        {i.note ? (
                          <div className="col-span-12 sm:col-span-6 text-right text-xs uppercase tracking-widest text-accent">
                            {i.note}
                          </div>
                        ) : showPrices ? (
                          <>
                            <div className="col-span-6 sm:col-span-3 text-left sm:text-right">
                              <span className="sm:hidden text-[10px] uppercase tracking-widest text-muted-foreground mr-2">
                                Day
                              </span>
                              <span
                                style={{ fontFamily: "var(--font-display)" }}
                                className="text-base sm:text-lg tracking-tight text-foreground"
                              >
                                 {npr(Number(i.price_day ?? 0))}
                              </span>
                            </div>
                            <div className="col-span-6 sm:col-span-3 text-right">
                              <span className="sm:hidden text-[10px] uppercase tracking-widest text-muted-foreground mr-2">
                                Week
                              </span>
                              <span
                                style={{ fontFamily: "var(--font-display)" }}
                                className="text-base sm:text-lg tracking-tight text-accent"
                              >
                                 {npr(Number(i.price_week ?? 0))}
                              </span>
                            </div>
                          </>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                   <p className="px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground border-t border-border/60">
                    {showPrices
                      ? "Prices in NPR · exclusive of VAT · weekly = 6 days"
                      : "Rates on request · send your kit list and shoot dates for a quote"}
                  </p>
                </div>
                </div>
            </div>
          </section>
        )
      })}
      </div>
      {/* Perks */}
      <section className="px-4 sm:px-6 md:px-10 py-20 sm:py-28 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-accent mb-3 sm:mb-4">
            How it works
          </p>
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-3xl sm:text-4xl md:text-6xl uppercase tracking-tight mb-10 sm:mb-16 max-w-3xl"
          >
            Book the kit. We handle the rest.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {perks.map((p) => (
              <div key={p.title} className="border-t border-border pt-6">
                <h3
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-xl sm:text-2xl uppercase tracking-tight mb-2"
                >
                  {p.title}
                </h3>
                <p className="text-foreground/80 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="bg-secondary text-secondary-foreground px-4 sm:px-6 md:px-10 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-accent mb-4 sm:mb-6">
            Need a quote?
          </p>
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight leading-tight mb-8 sm:mb-10"
          >
            Send your kit list and shoot dates.
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/contact"
              className="text-xs uppercase tracking-widest px-5 py-3 bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
            >
              Request a Quote
            </Link>
            <Link
              to="/services"
              className="text-xs uppercase tracking-widest px-5 py-3 border border-foreground/40 hover:border-accent hover:text-accent transition-colors"
            >
              See Services
            </Link>
            <a
              href="https://calendar.app.google/"
              target="_blank"
              rel="noreferrer"
              className="text-xs uppercase tracking-widest px-5 py-3 border border-foreground/40 hover:border-accent hover:text-accent transition-colors"
            >
              Book a Call
            </a>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}