import { useEffect } from "react";
import  SiteHeader from "../components/SiteHeader";
import  SiteFooter from "../components/SiteFooter";
import { PageHero } from "../components/PageHero";
import servicesHero from "../assets/work-commercial.jpg";

const services = [
  {
    n: "01",
    title: "Commercials",
    body: "From TVCs to high-impact social spots, we craft visual identities that resonate with the modern Nepali consumer and travel well across global markets.",
    bullets: ["TVC & broadcast", "Social cutdowns", "Performance creative"],
  },
  {
    n: "02",
    title: "Branded Content",
    body: "Long-form, story-led work for brands who would rather be watched than skipped — anchored in real characters and real places.",
    bullets: ["Brand films", "Founder stories", "Episodic series"],
  },
  {
    n: "03",
    title: "Music Videos",
    body: "Merging rhythm with high-end cinematography to create iconic visual legacies for artists across Nepal and the diaspora.",
    bullets: ["Concept & treatment", "Direction & DP", "Color & finish"],
  },
  {
    n: "04",
    title: "Documentaries",
    body: "Authentic storytelling rooted in culture, human struggle and the breathtaking reality of the Himalayas.",
    bullets: ["Short docs", "Feature length", "Field production"],
  },
  {
    n: "05",
    title: "Digital Campaigns",
    body: "Beyond production. We build comprehensive digital campaigns that ensure your story actually reaches its audience.",
    bullets: ["Strategy & rollout", "Platform-native edits", "Paid creative"],
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
    <div className="min-h-screen">
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

     <section className="px-4 sm:px-6 md:px-10 pb-20 sm:pb-32">
        <div className="max-w-7xl mx-auto">
          <ul className="divide-y divide-border border-t border-border">
            {services.map((service) => (
             <li key={service.n} className="grid grid-cols-12 gap-4 sm:gap-6 py-10 sm:py-12 md:py-16 group">
                <div className="col-span-12 md:col-span-2 text-[10px] sm:text-xs uppercase tracking-widest text-accent">{service.n}</div>

                <div className="col-span-12 md:col-span-5">
                 <h2 style={{ fontFamily: "var(--font-display)" }} className="text-3xl sm:text-4xl md:text-6xl uppercase tracking-tight group-hover:text-accent transition-colors">
                    {service.title}
                  </h2>
                </div>

                <div className="col-span-12 md:col-span-5">
                 <p className="text-sm sm:text-base text-foreground/80 leading-relaxed mb-4 sm:mb-6">{service.body}</p>

                  <ul className="text-xs uppercase tracking-widest text-muted-foreground space-y-2">
                    {service.bullets.map((bullet) => (
                      <li key={bullet}>— {bullet}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}