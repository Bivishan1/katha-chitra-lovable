import { useEffect } from "react";
import { Link} from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import  SiteHeader from "../components/SiteHeader";
import  SiteFooter from "../components/SiteFooter";
import { PageHero } from "../components/PageHero";
import { Button } from "@/components/ui/button";
import servicesHero from "../assets/work-commercial.jpg";
import commercialImage from "@/assets/work-commercial.jpg";
import brandedImage from "@/assets/work-branded.jpg";
import musicImage from "@/assets/work-music.jpg";
import documentaryImage from "@/assets/work-documentary.jpg";
import digitalImage from "@/assets/bts-monitor.jpg";
import internationalImage from "@/assets/international-hero.jpg";
import rentalImage from "@/assets/cameras.jpg";

const services = [
  {
    n: "01",
    title: "Commercials",
    body: "From TVCs to high-impact social spots, we craft visual identities that resonate with the modern Nepali consumer and travel well across global markets.",
    bullets: ["TVC & broadcast", "Social cutdowns", "Performance creative"],
    image: commercialImage,
    alt : "Commercial film location in the Nepal Himalayas at sunrise"
  },
  {
    n: "02",
    title: "Branded Content",
    body: "Long-form, story-led work for brands who would rather be watched than skipped — anchored in real characters and real places.",
    bullets: ["Brand films", "Founder stories", "Episodic series"],
    image: brandedImage,
    alt : "Branded content film location in the Nepal Himalayas at sunrise"
  },
  {
    n: "03",
    title: "Music Videos",
    body: "Merging rhythm with high-end cinematography to create iconic visual legacies for artists across Nepal and the diaspora.",
    bullets: ["Concept & treatment", "Direction & DP", "Color & finish"],
    image: musicImage,
    alt : "Music video film location in the Nepal Himalayas at sunrise"
  },
  {
    n: "04",
    title: "Documentaries",
    body: "Authentic storytelling rooted in culture, human struggle and the breathtaking reality of the Himalayas.",
    bullets: ["Short docs", "Feature length", "Field production"],
    image: documentaryImage,
    alt : "Documentary film location in the Nepal Himalayas at sunrise"
  },
  {
    n: "05",
    title: "Digital Campaigns",
    body: "Beyond production. We build comprehensive digital campaigns that ensure your story actually reaches its audience.",
    bullets: ["Strategy & rollout", "Platform-native edits", "Paid creative"],
    image: digitalImage,
    alt : "Digital campaign film location in the Nepal Himalayas at sunrise"
  },
  {
    n: "06",
    title: "Rental Equipment",
    body:
      "A working kit room in Kathmandu — cinema cameras, lenses, lighting, grip, sound and drones. Daily and weekly rentals with delivery, on-set support and full insurance. Available standalone or bundled with crew.",
    bullets: [
      "Cameras, lenses & lighting",
      "Grip, sound & drones",
      "Delivery & on-set support",
    ],
    image: rentalImage,
    alt : "Rental equipment film location in the Nepal Himalayas at sunrise"
  },
  {
    n: "07",
    title: "International Production",
    body: "Expanding our reach beyond Nepal's borders, we bring global standards and local authenticity to every project.",
    bullets: [
      "Permits & location scouting",
      "Drone filming & post support",
    ],
    image: internationalImage,
    alt: "International production crew filming in the Nepal Himalayas",
  },
];

function setMetaTag(selector: string, attribute: string, content: string) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");

    if (selector.includes("property=")) {
      const property = selector.match(/property="([^"]+)"/)?.[1];
      if (property) element.setAttribute("property", property);
    }

    if (selector.includes("name=")) {
      const name = selector.match(/name="([^"]+)"/)?.[1];
      if (name) element.setAttribute("name", name);
    }

    document.head.appendChild(element);
  }

  element.setAttribute(attribute, content);
}

export default function Services() {
  useEffect(() => {
    document.title = "Services — Story Painters";

    setMetaTag(
      'meta[name="description"]',
      "content",
      "End-to-end production services: commercials, branded content, music videos, documentaries and digital campaigns."
    );

    setMetaTag(
      'meta[property="og:title"]',
      "content",
      "Services — Story Painters"
    );

    setMetaTag(
      'meta[property="og:description"]',
      "content",
      "Concept to final color grade — full-service video production from Kathmandu."
    );

    setMetaTag('meta[property="og:url"]', "content", "/services");
    setMetaTag('meta[property="og:type"]', "content", "website");
    setMetaTag('meta[name="twitter:card"]', "content", "summary_large_image");



    let canonical = document.head.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = "/services";
  }, []);

  return (
    <div className="min-h-screen bg-service-surface font-studio">
      <SiteHeader />

      <PageHero
        image={servicesHero}
        alt="Cinema camera setup on a commercial shoot"
        eyebrow="02 — Capabilities"
        caption="Services · Kathmandu"
      >
        <h1 style={{ fontFamily: "var(--font-display)" }} className="text-5xl sm:text-7xl md:text-9xl uppercase tracking-tighter leading-[0.85]">
          What we <br /> <span className="italic font-light text-accent">make.</span>
        </h1>
      </PageHero>

     <main className="px-4 py-20 sm:px-6 sm:py-28 md:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <header className="mb-12 grid gap-8 border-b border-service-line pb-10 md:mb-16 md:grid-cols-[minmax(0,1fr)_minmax(18rem,26rem)] md:items-end md:pb-14">
            <div className="min-w-0">
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-service-ember sm:text-xs">
                Full-service production
              </p>
              <h2 className="font-display text-4xl font-bold uppercase leading-[0.92] sm:text-6xl md:text-7xl lg:text-8xl">
                Built for every <span className="text-service-ember">frame.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm font-light leading-7 text-foreground/70 sm:text-base">
              Creative thinking, local production intelligence, and exacting craft—from the first treatment to the final master.
            </p>
          </header>

          <ol className="grid grid-cols-1 gap-px overflow-hidden border border-service-line bg-service-line sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <li
                key={service.n}
                className={`group relative min-h-124 overflow-hidden bg-service-panel sm:min-h-136 ${index === 3 || index === 5 ? "lg:col-span-2" : ""}`}
              >
                <img
                  src={service.image}
                  alt={service.alt}
                  width={1200}
                  height={1500}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover opacity-50 grayscale transition-[transform,filter,opacity] duration-700 ease-out group-hover:scale-105 group-hover:opacity-75 group-hover:grayscale-0 motion-reduce:transition-none"
                />
                <div className="absolute inset-0 bg-linear-to-t from-service-surface via-service-surface/35 to-service-surface/20" />
                <div className="absolute inset-0 bg-linear-to-r from-service-surface/30 to-transparent" />

                <div className="relative flex h-full min-h-124 flex-col justify-between p-6 sm:min-h-136 sm:p-8">
                  <div className="flex items-center justify-between border-b border-foreground/20 pb-4">
                    <span className="text-xs font-semibold tracking-[0.24em] text-service-ember">{service.n}</span>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/55">Story Painters</span>
                  </div>

                  <div className="translate-y-0 transition-transform duration-500 ease-out md:translate-y-20 md:group-hover:translate-y-0 motion-reduce:transform-none">
                    <h3 className="mb-4 max-w-xl font-display text-3xl font-bold uppercase leading-[0.95] sm:text-4xl">
                      {service.title}
                    </h3>
                    <p className="max-w-xl text-sm leading-6 text-foreground/80 transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100 motion-reduce:opacity-100">
                      {service.body}
                    </p>
                    <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-foreground/65 transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100 motion-reduce:opacity-100">
                      {service.bullets.map((bullet) => (
                        <li key={bullet} className="before:mr-2 before:text-service-ember before:content-['—']">{bullet}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
        </ol>

          <section className="grid gap-8 border-b border-service-line py-16 sm:py-20 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-service-ember">Have a brief?</p>
              <h2 className="max-w-4xl font-display text-4xl font-bold uppercase leading-none sm:text-6xl md:text-7xl">
                Let’s make something worth watching.
              </h2>
            </div>
            <Button asChild size="lg" className="h-12 rounded-none bg-service-ember px-6 text-xs uppercase tracking-[0.16em] text-accent-foreground hover:bg-service-ember/90">
              <Link to="/contact">
                Start a project <ArrowUpRight aria-hidden />
              </Link>
            </Button>
          </section>
        </div>
</main>
      <SiteFooter />
    </div>
  );
}