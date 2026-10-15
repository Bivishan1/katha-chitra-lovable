import { useEffect } from "react";
// import heroImage from "../assets/hero-showreel.jpg";
import showReel from "../assets/hero-720p.mp4";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { WorkTile } from "../components/WorkTile";
import { useFrames, useProjects, useActiveProposal } from "@/lib/cms";
import { Aperture, Clapperboard, Film, Megaphone, MonitorPlay, Music2 } from "lucide-react";
import capabilitiesImage from "@/assets/bts-set.webp";

// import { projects } from "../data/projects";
import { Link } from "@tanstack/react-router";
import { Reveal } from "../components/Reveal";
import { HeroTypewriter } from "@/components/HeroTypewriter";

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

const capabilities = [
  {
    title: "Commercials",
    description: "Distinct campaign films built to earn attention and move audiences across broadcast and digital.",
    icon: Megaphone,
  },
  {
    title: "Branded Content",
    description: "Story-led films that translate a brand’s purpose into something people genuinely want to watch.",
    icon: Clapperboard,
  },
  {
    title: "Documentaries",
    description: "Human stories shaped with cultural care, field experience, and a precise cinematic eye.",
    icon: Film,
  },
  {
    title: "Music Videos",
    description: "Original visual worlds that turn sound, performance, and movement into memorable screen moments.",
    icon: Music2,
  },
  {
    title: "Digital Campaigns",
    description: "Platform-aware creative systems designed for consistent impact across every screen and format.",
    icon: MonitorPlay,
  },
  {
    title: "Rental Equipment",
    description: "Cameras, lenses, lighting, sound, grip and drones on rent — pro-grade kits at rates well below market.",
    icon: Aperture,
  },
];

export default function Home() {
  const { data: frames = [] } = useFrames();
  const { data: projects = [] } = useProjects();
  const { data: proposal } = useActiveProposal();
  const featured = (
    frames.length
      ? frames.map((f) => ({
          id: f.id,
          title: f.title,
          category: f.subtitle,
          image_url: f.image_url,
          video_url: f.video_url,
          aspect: "wide" as const,
        }))
      : projects
  ).slice(0, 4);

  const scrollToCapabilities = () => {
    const el = document.getElementById("capabilities");
        if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  useEffect(() => {
    document.title =
      "Story Painters Production — Nepali Video Production House";

    setMetaTag(
      'meta[name="description"]',
      "content",
      "Nepal Kathmandu-based film and media production company crafting commercials, branded content, music videos, documentaries, and digital campaigns.",
    );

    setMetaTag(
      'meta[property="og:title"]',
      "content",
      "Story Painters — Nepali Video Production House",
    );

    setMetaTag(
      'meta[property="og:description"]',
      "content",
      "Cinematic storytelling from the heart of the Himalayas Nepal.",
    );

    setMetaTag('meta[property="og:url"]', "content", "/");

    let canonical = document.head.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = "/";

    const schemaId = "katha-chitra-schema";
    let schema = document.getElementById(schemaId) as HTMLScriptElement | null;

    if (!schema) {
      schema = document.createElement("script");
      schema.id = schemaId;
      schema.type = "application/ld+json";
      document.head.appendChild(schema);
    }

    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Story Painters",
      url: "/",
      description:
        "Nepali full-service film and media production company specializing in commercials, branded content, music videos, documentaries, and digital campaigns.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lalitpur",
        addressRegion: "Bagmati",
        addressCountry: "NP",
      },
      email: "storypaintsnp@gmail.com",
    });
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden md:overflow-visible">
      <SiteHeader />

      {/* Hero */}
      {/* Hero — sticky reveal layer 1 */}
      {/* <div className="relative h-screen"> */}
      <section className="sticky top-0 h-screen z-0 flex flex-col justify-end px-4 sm:px-6 md:px-10 pb-12 sm:pb-16 md:pb-20 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster=""
          aria-label="Story Painters showreel"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        >
          <source src={showReel} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-linear-to-b from-background/6 via-background/3 to-backgroun" />

        <div className="relative z-10 max-w-6xl">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-accent mb-4 sm:mb-6 animate-[slideInLeft_0.9s_ease-out_0.1s_both]">
            Est. Kathmandu · MMXIV
          </p>

          <h1
            style={{ fontFamily: "var(--font-display)" }}
            className="text-[18vw] sm:text-[14vw] md:text-[9vw] leading-[0.85] uppercase tracking-tighter font-bold overflow-hidden"
          >
            <span className="block animate-[slideInLeft_1s_cubic-bezier(0.22,1,0.36,1)_0.25s_both]">
              Stories
            </span>
            <span className="block animate-[slideInRight_1s_cubic-bezier(0.22,1,0.36,1)_0.55s_both]">
              From The{" "}
              <span className="text-accent italic font-bold">Peak</span>
            </span>
          </h1>

          <HeroTypewriter text="A full-service film &amp; media production house translating Himalayan soul into global visual narratives." />
          {/* new learn more button  */}
          <div className="mt-8 sm:mt-10 animate-[slideInUp_0.9s_ease-out_1.2s_both]">
            <button
              type="button"
              onClick={scrollToCapabilities}
              className="cursor-pointer group inline-flex items-center gap-3 text-[10px] sm:text-xs uppercase tracking-[0.3em] px-5 py-3 bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
            >
              Learn More
              <span className="inline-block transition-transform group-hover:translate-y-1">
                ↓
              </span>
            </button>
          </div>
          {/* new learn more button close  */}
        </div>

        <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-6 md:right-10 z-10 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-foreground/60">
          Showreel · 2026 →
        </div>
      </section>
      {/* </div> */}

       {/* Capabilities — immediate value proposition after the showreel */}
      <section id="capabilities" className="relative isolate overflow-hidden px-4 py-20 sm:px-6 sm:py-24 md:px-10 md:py-32 scroll-mt-24">
        <img
          src={capabilitiesImage}
          alt="Katha Chitra crew working on a film production set"
          width={1920}
          height={1080}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 -z-10 bg-background/80" />
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-background via-background/65 to-background" />

        <div className="mx-auto max-w-7xl">
          <Reveal direction="up" className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
            <p className="mb-4 text-[10px] uppercase text-accent sm:text-[11px]">01 — Capabilities</p>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-4xl font-bold uppercase leading-none sm:text-5xl md:text-7xl">
              What we <span className="font-light italic text-accent">serve.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-foreground/70 sm:text-base">
              From the first idea to the final master, we unite strategy, production, and post under one experienced Kathmandu team.
            </p>
          </Reveal>

          <ul className="grid border-y border-border md:grid-cols-6">
            {capabilities.map((service, index) => {
              const Icon = service.icon;
              return (
                <Reveal
                  as="li"
                  key={service.title}
                  direction="up"
                  delay={index * 80}
                  className={`group border-b border-border px-2 py-8 last:border-b-0 md:col-span-2 md:px-7 md:py-10 ${index % 3 !== 2 ? "md:border-r" : ""} ${index < 3 ? "md:border-b" : "md:border-b-0"}`}
                >
                  <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-4 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-6">
                    <div className="flex h-12 w-12 items-center justify-center border border-accent/50 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground sm:h-14 sm:w-14">
                      <Icon aria-hidden className="h-6 w-6" strokeWidth={1.4} />
                    </div>
                    <div>
                      <p className="mb-3 text-[9px] text-muted-foreground">0{index + 1}</p>
                      <h3 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-semibold uppercase leading-tight transition-colors group-hover:text-accent sm:text-2xl">
                        {service.title}
                      </h3>
                      <p className="mt-3 max-w-md text-sm leading-6 text-foreground/70">{service.description}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>

          <Reveal direction="up" delay={180} className="mt-9 text-center">
            <Link to="/services" className="inline-flex border-b border-accent pb-1 text-xs uppercase text-accent transition-opacity hover:opacity-70">
              Explore all services →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Selected Work — proof follows capabilities */}


      <section className="relative z-20 bg-background py-20 sm:py-24 md:py-16 px-4 sm:px-6 md:px-10 shadow-[0_-30px_60px_-20px_rgba(0,0,0,0.6)]">
        <div className="flex flex-wrap gap-4 justify-between items-end mb-10 sm:mb-16">
          <Reveal direction="left">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-accent mb-3 sm:mb-4">
              02 — Selected Work
            </p>
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-3xl sm:text-4xl md:text-6xl uppercase"
            >
              Recent Frames
            </h2>
          </Reveal>
          <Reveal direction="right" delay={150}>
            <Link
              to="/work"
              className="text-[10px] sm:text-xs uppercase text-accent border-b border-accent pb-1 hover:opacity-70"
            >
              All projects →
            </Link>
          </Reveal>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-12 md:gap-6">
          {featured[0] && (
            <div className="md:col-span-6 aspect-[0]">
              <Reveal direction="left" delay={250} className="">
                <WorkTile project={featured[0]} />
              </Reveal>
            </div>
          )}

          {featured[1] && (
            <div className="md:col-span-6  md:sticky md:top-24 md:self-start z-10 pb-11 aspect-[0]">
              <Reveal direction="right" delay={300}>
                <WorkTile project={featured[1]} />
              </Reveal>
            </div>
          )}

          {featured[2] && (
            <div className="md:col-span-6 aspect-[0]">
              <Reveal direction="fade" delay={350}>
                <WorkTile project={featured[2]} />
              </Reveal>
            </div>
          )}

          {featured[3] && (
            <div className="md:col-span-6 md:mt-2 z-20">
              <Reveal direction="fade" delay={350}>
                <WorkTile project={featured[3]} />
              </Reveal>
            </div>
          )}
        </div>
      </section>

      {/* About teaser — slides up over services */}
      <section className="relative z-30 bg-background py-20 sm:py-24 md:py-16 px-4 sm:px-6 md:px-10 shadow-[0_-30px_60px_-20px_rgba(0,0,0,0.6)]">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal direction="fade" delay={200}>
            <p
              style={{ fontFamily: "var(--font-nepali)" }}
              className="text-xl sm:text-2xl text-accent mb-4 sm:mb-6"
            >
              कथा{" "}
              <u>
                <i>Painters</i>
              </u>{" "}
            </p>
          </Reveal>
          <Reveal direction="left" delay={290}>
            <p
              style={{ fontFamily: "var(--font-display)" }}
              className="text-2xl sm:text-3xl md:text-5xl uppercase leading-tight tracking-tight text-balance"
            >
              A house built on the foundation of{" "}
              <span className="italic font-light text-accent">
                narrative truth
              </span>
              .
            </p>
          </Reveal>
          <Reveal direction="right" delay={400}>
            <p className="mt-8 text-foreground/70 max-w-xl mx-auto leading-relaxed">
              We blend cinematic craft with cultural depth to create work that
              resonates across borders — from intimate documentaries to
              large-scale brand campaigns.
            </p>
          </Reveal>

          <Reveal direction="up" delay={200}>
            <Link
              to="/about"
              className="inline-block mt-10 text-xs uppercase tracking-widest text-accent border-b border-accent pb-1 hover:opacity-70"
            >
              Inside the studio →
            </Link>
          </Reveal>
          {/* proposal section */}
          <Reveal
            direction="left"
            delay={200}
            className="relative py-20 sm:py-24 md:py-16 px-4 sm:px-6 md:px-10 md:col-span-7"
          >
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-3xl sm:text-4xl md:text-6xl uppercase tracking-tight leading-[0.95]"
            >
              Take our deck{" "}
              <span className="italic font-light text-accent">
                to your team.
              </span>
            </h2>
            <p className="mt-5 sm:mt-6 max-w-xl mx-auto text-foreground/75 leading-relaxed text-center">
              A short PDF with our story, recent commercials, documentaries,
              music videos and the people behind the lens — formatted for
              sharing with clients and partners.
            </p>
          </Reveal>
          <Reveal direction="right" delay={200} className=" md:text-center">
            {proposal ? (
              <>
                <a
                  href={proposal.file_url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-3 text-[10px] sm:text-xs uppercase tracking-[0.3em] px-5 py-3 bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
                >
                  Download Proposal
                  <span className="inline-block transition-transform group-hover:translate-y-0.5">
                    ↓
                  </span>
                </a>
                <p className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                  {proposal.title} · PDF
                </p>
              </>
            ) : null}
          </Reveal>
        </div>
      </section>
      <section
        id="capabilities"
        className="sticky top-0 z-10 overflow-hidden bg-secondary text-secondary-foreground flex items-center px-4 sm:px-6 md:px-10 scroll-mt-24"
      >
        <SiteFooter />
      </section>
    </div>
  );
}
