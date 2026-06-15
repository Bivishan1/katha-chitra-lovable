import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import  SiteFooter  from "../components/SiteFooter";

const categories = [
  {
    n: "01",
    title: "Cinema Cameras",
    body:
      "Sony FX-series, RED Komodo, Blackmagic URSA and mirrorless A-cams — ready with media, batteries and accessories.",
    items: ["Sony FX6 / FX3", "RED Komodo 6K", "Blackmagic URSA / Pocket 6K", "Sony A7S III / A7 IV"],
  },
  {
    n: "02",
    title: "Lenses",
    body:
      "Cine primes and zooms, vintage glass and fast stills lenses — PL, E and EF mounts with full mount-swap support.",
    items: ["Sigma Cine FF primes", "DZOFilm Vespid set", "Canon CN-E primes", "Sony G Master zooms"],
  },
  {
    n: "03",
    title: "Lighting",
    body:
      "Aputure, Nanlux and Arri-grade fixtures with full modifier packages, stands and distro.",
    items: ["Aputure 600x / 300x", "Nanlux Evoke 1200", "Astera Titan tubes", "HMI 1.2K / 2.5K kits"],
  },
  {
    n: "04",
    title: "Grip & Support",
    body:
      "Tripods, sliders, gimbals, jibs and dollies — including stabilized vehicle and aerial-ready mounts.",
    items: ["DJI Ronin 4D / RS3 Pro", "O'Connor & Sachtler heads", "Slider & jib packages", "Easy-rigs & shoulder rigs"],
  },
  {
    n: "05",
    title: "Sound",
    body:
      "Production sound packages with wireless lavs, boom kits and on-set mixers — recordists available on request.",
    items: ["Sennheiser MKH 416", "Wisycom & Sennheiser wireless", "Sound Devices MixPre", "Comtek IFB systems"],
  },
  {
    n: "06",
    title: "Drones & Aerial",
    body:
      "CAAN-licensed drone operators with insured rigs, FPV cinema drones and high-altitude packages.",
    items: ["DJI Inspire 3", "Mavic 3 Cine", "FPV cinema drones", "Aerial permits & pilots"],
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
      <section className="pt-32 sm:pt-40 md:pt-48 pb-12 sm:pb-20 px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-accent mb-4 sm:mb-6">
            Rental Equipment
          </p>
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
        </div>
      </section>
      {/* Categories */}
      <section className="px-4 sm:px-6 md:px-10 pb-20 sm:pb-32">
        <div className="max-w-7xl mx-auto">
          <ul className="divide-y divide-border border-t border-border">
            {categories.map((c) => (
              <li key={c.n} className="grid grid-cols-12 gap-4 sm:gap-6 py-10 sm:py-12 md:py-16 group">
                <div className="col-span-12 md:col-span-2 text-[10px] sm:text-xs uppercase tracking-widest text-accent">
                  {c.n}
                </div>
                <div className="col-span-12 md:col-span-5">
                  <h2
                    style={{ fontFamily: "var(--font-display)" }}
                    className="text-3xl sm:text-4xl md:text-6xl uppercase tracking-tight group-hover:text-accent transition-colors"
                  >
                    {c.title}
                  </h2>
                </div>
                <div className="col-span-12 md:col-span-5">
                  <p className="text-sm sm:text-base text-foreground/80 leading-relaxed mb-4 sm:mb-6">
                    {c.body}
                  </p>
                  <ul className="text-xs uppercase tracking-widest text-muted-foreground space-y-2">
                    {c.items.map((i) => (
                      <li key={i}>— {i}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
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