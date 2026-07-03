import { useEffect } from "react";
// import heroImage from "../assets/hero-showreel.jpg";
import showReel from "../assets/hero-720p.mp4";
import  SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { WorkTile } from "../components/WorkTile";
import { projects } from "../data/projects";
import { Link } from "react-router-dom";
import { Reveal } from "../components/Reveal";

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

export default function Home() {
  const featured = projects.slice(0, 3);
   const scrollToCapabilities = () => {
    const el = document.getElementById("capabilities");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    document.title = "Katha Chitra Production — Nepali Video Production House";

    setMetaTag(
      'meta[name="description"]',
      "content",
      "Nepal Kathmandu-based film and media production company crafting commercials, branded content, music videos, documentaries, and digital campaigns."
    );

    setMetaTag(
      'meta[property="og:title"]',
      "content",
      "Katha Chitra — Nepali Video Production House"
    );

    setMetaTag(
      'meta[property="og:description"]',
      "content",
      "Cinematic storytelling from the heart of the Himalayas Nepal."
    );

    setMetaTag('meta[property="og:url"]', "content", "/");

    let canonical = document.head.querySelector(
      'link[rel="canonical"]'
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
      name: "Katha Chitra",
      url: "/",
      description:
        "Nepali full-service film and media production company specializing in commercials, branded content, music videos, documentaries, and digital campaigns.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lalitpur",
        addressRegion: "Bagmati",
        addressCountry: "NP",
      },
      email: "hello@kathachitra.com",
    });
  }, []);

  return (
     <div className="min-h-screen relative">
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
          poster=''
          aria-label="Katha Chitra showreel"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        >
          <source
            src={showReel}
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-linear-to-b from-background/60 via-background/30 to-background" />

        <div className="relative z-10 max-w-6xl">
           <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-accent mb-4 sm:mb-6 animate-[slideInLeft_0.9s_ease-out_0.1s_both]">
            Est. Kathmandu · MMXIV
          </p>

          <h1
            style={{ fontFamily: "var(--font-display)" }}
            className="text-[18vw] sm:text-[14vw] md:text-[9vw] leading-[0.85] uppercase tracking-tighter font-bold overflow-hidden"
          >
            <span className="block animate-[slideInLeft_1s_cubic-bezier(0.22,1,0.36,1)_0.25s_both]">Stories</span>
            <span className="block animate-[slideInRight_1s_cubic-bezier(0.22,1,0.36,1)_0.55s_both]">
              From The <span className="text-accent italic font-light">Peak</span>
            </span>
          </h1>

           <p className="mt-6 sm:mt-10 max-w-md text-xs sm:text-sm leading-relaxed text-foreground/80 border-l border-accent pl-4 sm:pl-6 uppercase tracking-wider animate-[slideInUp_0.9s_ease-out_0.95s_both]">
            A full-service film &amp; media production house translating
            Himalayan soul into global visual narratives.
          </p>
          {/* new learn more button  */}
          <div className="mt-8 sm:mt-10 animate-[slideInUp_0.9s_ease-out_1.2s_both]">
            <button
              type="button"
              onClick={scrollToCapabilities}
              className="cursor-pointer group inline-flex items-center gap-3 text-[10px] sm:text-xs uppercase tracking-[0.3em] px-5 py-3 bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
            >
              Learn More
              <span className="inline-block transition-transform group-hover:translate-y-1">↓</span>
            </button>
          </div>
          {/* new learn more button close  */}
        </div>

         <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-6 md:right-10 z-10 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-foreground/60">
          Showreel · 2025 →
        </div>
      </section>
      {/* </div> */}

      {/* Selected Work */}
     {/* Selected Work — slides up over hero */}
      <section className="relative z-20 bg-background py-20 sm:py-24 md:py-16 px-4 sm:px-6 md:px-10 shadow-[0_-30px_60px_-20px_rgba(0,0,0,0.6)]">
        <div className="flex flex-wrap gap-4 justify-between items-end mb-10 sm:mb-16">
          <Reveal direction="left">
           <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-accent mb-3 sm:mb-4">01 — Selected Work</p>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-3xl sm:text-4xl md:text-6xl uppercase tracking-tight">
              Recent Frames
            </h2>
            </Reveal>
          <Reveal direction="right" delay={150}>
            <Link to="/work" className="text-[10px] sm:text-xs uppercase tracking-widest text-accent border-b border-accent pb-1 hover:opacity-70">
              All projects →
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6">
          {featured[0] && (
           
            <div className="md:col-span-8">
               <Reveal direction="left" delay={250}>
              <WorkTile project={featured[0]} />
              </Reveal>
            </div>
          )}

          {featured[1] && (
            <div className="md:col-span-4 md:mt-24  md:sticky md:top-24 md:self-start">
              <Reveal direction="right" delay={300}>
              <WorkTile project={featured[1]} />
              </Reveal>
            </div>
          )}

          {featured[2] && (
            <div className="md:col-span-5 md:-mt-12">
              <Reveal direction="fade" delay={350}>
                <WorkTile project={featured[2]} />
              </Reveal>
            </div>
          )}
        </div>
      </section>

      {/* Services teaser */}
       {/* Services teaser — sticky reveal layer 2 */}
      {/* <div className="relative h-screen"> */}
        <section id= "capabilities" className="sticky top-0 h-screen z-10 overflow-hidden bg-secondary text-secondary-foreground flex px-4 sm:px-6 md:px-10 scroll-mt-24">
        <div className="w-full">
        <Reveal direction="left">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-accent mb-3 sm:mb-4">02 — Capabilities</p>
          </Reveal>
          <Reveal direction="left" delay={120}>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-3xl sm:text-4xl md:text-6xl uppercase tracking-tight mb-6 sm:mb-10">
              What we make.
            </h2>
          </Reveal>

          <ul className="divide-y divide-border">
            {[
              "Commercials",
              "Branded Content",
              "Documentaries",
              "Music Videos",
              "Digital Campaigns",
              "Rental Equipments"
            ].map((s, index) => (
             <Reveal as="li" key={s} direction="up" delay={index * 90}>
                <div className="py-3 sm:py-4 md:py-5 flex items-center justify-between gap-4 group">
                  <span style={{ fontFamily: "var(--font-display)" }} className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight group-hover:text-accent transition-colors">
                    {s}
                  </span>
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground shrink-0">
                    0{index + 1}
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>

           <Reveal direction="up" delay={200}>
            <Link to="/services" className="inline-block mt-8 text-xs uppercase tracking-widest text-accent border-b border-accent pb-1 hover:opacity-70">
              Explore services →
            </Link>
          </Reveal>
        </div>
      </section>
      {/* </div> */}

      {/* About teaser — slides up over services */}
      <section className="relative z-30 bg-background py-20 sm:py-24 md:py-16 px-4 sm:px-6 md:px-10 shadow-[0_-30px_60px_-20px_rgba(0,0,0,0.6)]">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal direction = "fade" delay ={200}>
          <p style={{ fontFamily: "var(--font-nepali)" }} className="text-xl sm:text-2xl text-accent mb-4 sm:mb-6">कथा चित्र</p>
          </Reveal>
            <Reveal direction = "left" delay ={290}>
          <p style={{ fontFamily: "var(--font-display)" }} className="text-2xl sm:text-3xl md:text-5xl uppercase leading-tight tracking-tight text-balance">
            A house built on the foundation of{" "}
            <span className="italic font-light text-accent">
              narrative truth
            </span>
            .
          </p>
          </Reveal>
            <Reveal direction = "right" delay ={400}>
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
        </div>
      </section>
<section id= "capabilities" className="sticky top-0 h-screen z-10 overflow-hidden bg-secondary text-secondary-foreground flex items-center px-4 sm:px-6 md:px-10 scroll-mt-24">
      <SiteFooter />
    </section>
    </div>
  );
}