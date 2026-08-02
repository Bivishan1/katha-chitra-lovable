import { Link } from "@tanstack/react-router";
import SiteHeader from "../components/SiteHeader";
import  SiteFooter  from "../components/SiteFooter";
import { PageHero } from "../components/PageHero";
import rentalHero from "../assets/bts-monitor.jpg";
import camerasBg from "../assets/cameras.jpg";
import lensesBg from "../assets/lenses.jpg";
import lightingBg from "../assets/lighting.jpg";
import gripBg from "../assets/grip.jpg";
import soundBg from "../assets/sound.jpg";
import dronesBg from "../assets/drone.jpg";

const npr = (n: number) => `NPR ${n.toLocaleString("en-IN")}`;

const categories = [
  {
    n: "01",
    title: "Cinema Cameras",
    image: camerasBg,
    body:
      "Sony FX-series, RED Komodo, Blackmagic URSA and mirrorless A-cams — ready with media, batteries and accessories.",
    items: [
      { name: "Sony FX6", day: 18000, week: 95000 },
      { name: "Sony FX3", day: 12000, week: 65000 },
      { name: "RED Komodo 6K", day: 25000, week: 135000 },
      { name: "Blackmagic URSA / Pocket 6K", day: 9000, week: 48000 },
      { name: "Sony A7S III / A7 IV", day: 6500, week: 34000 },
    ],
  },
  {
    n: "02",
    title: "Lenses",
    image: lensesBg,
    body:
      "Cine primes and zooms, vintage glass and fast stills lenses — PL, E and EF mounts with full mount-swap support.",
    items: [
      { name: "Sigma Cine FF primes", day: 5000, week: 25000 },
      { name: "DZOFilm Vespid set", day: 8000, week: 40000 },
      { name: "Canon CN-E primes", day: 12000, week: 60000 },
      { name: "Sony G Master zooms", day: 10000, week: 50000 },
    ],
  },
  {
    n: "03",
    title: "Lighting",
    image: lightingBg,
    body:
      "Aputure, Nanlux and Arri-grade fixtures with full modifier packages, stands and distro.",
    items: [
      { name: "Aputure 600x", day: 4500, week: 24000 },
      { name: "Aputure 300x", day: 2800, week: 15000 },
      { name: "Nanlux Evoke 1200", day: 6500, week: 34000 },
      { name: "Astera Titan tube (each)", day: 1800, week: 9500 },
      { name: "HMI 1.2K kit", day: 8000, week: 42000 },
      { name: "HMI 2.5K kit", day: 12000, week: 65000 },
    ],
  },
  {
    n: "04",
    title: "Grip & Support",
    image: gripBg,
    body:
      "Tripods, sliders, gimbals, jibs and dollies — including stabilized vehicle and aerial-ready mounts.",
    items: [
      { name: "DJI Ronin 4D", day: 12000, week: 65000 },
      { name: "DJI RS3 Pro", day: 3500, week: 18000 },
      { name: "O'Connor / Sachtler head + sticks", day: 4500, week: 24000 },
      { name: "Slider package (1m)", day: 2500, week: 13000 },
      { name: "Jib package (up to 3m)", day: 6000, week: 32000 },
      { name: "Easy-rig / shoulder rig", day: 2000, week: 10500 }],
  },
  {
    n: "05",
    title: "Sound",
    image: soundBg,
    body:
      "Production sound packages with wireless lavs, boom kits and on-set mixers — recordists available on request.",
    items: [
      { name: "Sennheiser MKH 416 + boom kit", day: 3500, week: 18000 },
      { name: "Wisycom wireless (2ch)", day: 5500, week: 29000 },
      { name: "Sennheiser G4 wireless (each)", day: 1500, week: 8000 },
      { name: "Sound Devices MixPre-6 II", day: 4500, week: 24000 },
      { name: "Comtek IFB (4 rx)", day: 2500, week: 13000 }],
  },
  {
    n: "06",
    title: "Drones & Aerial",
    image: dronesBg,
    body:
      "CAAN-licensed drone operators with insured rigs, FPV cinema drones and high-altitude packages.",
    items: [
       { name: "DJI Inspire 3 + pilot", day: 45000, week: 240000 },
      { name: "DJI Mavic 3 Cine + pilot", day: 15000, week: 80000 },
      { name: "FPV cinema drone + pilot", day: 25000, week: 135000 },
      { name: "CAAN permit coordination", day: 0, week: 0, note: "Quoted per shoot" },],
  },
];
const perks = [
  { title: "Daily & weekly rates", body: "Flexible day, weekend and weekly pricing with multi-day discounts." },
  { title: "Delivery in Kathmandu", body: "Pickup from our Lalitpur kit room or same-day delivery within the valley." },
  { title: "On-set support", body: "Add a kit tech or 1st AC to your booking — we keep the gear running on the day." },
  { title: "Fully insured", body: "All equipment insured. Damage waivers and certificates of insurance on request." },
];
export default function RentalEquipmentPage() {
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
        {categories.map((c) => (
          <section
            key={c.n}
            className="relative overflow-hidden border-t border-border"
          >
            {/* Full-bleed background image */}
            <img
              src={c.image}
              alt={`${c.title} — rental equipment`}
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
                  {c.n} · Category
                </div>
                <h2
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-4xl sm:text-5xl md:text-7xl uppercase tracking-tight leading-[0.9] mb-6"
                >
                  {c.title}
                </h2>
                <p className="text-sm sm:text-base text-foreground/80 leading-relaxed max-w-md">
                  {c.body}
                </p>
              </div>
              {/* Price table */}
              <div className="col-span-12 md:col-span-7 md:pl-8">
                <div className="backdrop-blur-md bg-background/40 border border-border/60 rounded-sm">
                  <div className="hidden sm:grid grid-cols-12 px-5 py-3 border-b border-border/60 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    <div className="col-span-6">Item</div>
                    <div className="col-span-3 text-right">Per day</div>
                    <div className="col-span-3 text-right">Per week</div>
                  </div>
                  <ul className="divide-y divide-border/60">
                    {c.items.map((i) => (
                     <li
                        key={i.name}
                        className="grid grid-cols-12 gap-2 px-5 py-4 items-baseline hover:bg-accent/5 transition-colors"
                      >
                        <div className="col-span-12 sm:col-span-6 text-sm sm:text-[15px] text-foreground">
                          {i.name}
                        </div>
                        {"note" in i && i.note ? (
                          <div className="col-span-12 sm:col-span-6 text-right text-xs uppercase tracking-widest text-accent">
                            {i.note}
                          </div>
                        ) : (
                          <>
                            <div className="col-span-6 sm:col-span-3 text-left sm:text-right">
                              <span className="sm:hidden text-[10px] uppercase tracking-widest text-muted-foreground mr-2">
                                Day
                              </span>
                              <span
                                style={{ fontFamily: "var(--font-display)" }}
                                className="text-base sm:text-lg tracking-tight text-foreground"
                              >
                                {npr(i.day)}
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
                                {npr(i.week)}
                              </span>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                   <p className="px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground border-t border-border/60">
                    Prices in NPR · exclusive of VAT · weekly = 6 days
                  </p>
                </div>
                </div>
            </div>
          </section>
        ))}
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