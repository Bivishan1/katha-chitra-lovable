import { useEffect } from "react";
import aboutImage from "../assets/about-studio.jpg";
import  SiteHeader from "../components/SiteHeader";
import  SiteFooter  from "../components/SiteFooter";

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

export default function About() {
  useEffect(() => {
    document.title = "About — Katha Chitra";

    setMetaTag(
      'meta[name="description"]',
      "content",
      "Katha Chitra is a Kathmandu-based production house blending cinematic craft with cultural depth."
    );

    setMetaTag(
      'meta[property="og:title"]',
      "content",
      "About — Katha Chitra"
    );

    setMetaTag(
      'meta[property="og:description"]',
      "content",
      "Inside the studio. Cinematic storytelling from the Himalayas."
    );

    setMetaTag('meta[property="og:url"]', "content", "/about");

    let canonical = document.head.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = "/about";
  }, []);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="pt-32 sm:pt-40 md:pt-48 pb-12 sm:pb-16 px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-accent mb-4 sm:mb-6">Studio</p>
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-4xl sm:text-6xl md:text-8xl uppercase tracking-tighter leading-[0.9] max-w-5xl">
            We tell{" "}
            <span className="italic font-light text-accent">honest</span>{" "}
            stories with cinematic intent.
          </h1>
        </div>
      </section>

      <section className="px-4 sm:px-6 md:px-10 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <img
            src={aboutImage}
            alt="Katha Chitra crew on a Kathmandu rooftop at dusk"
            width={1280}
            height={896}
            loading="lazy"
            className="w-full aspect-video object-cover outline -outline-offset-1 outline-white/5"
          />
        </div>
      </section>

      <section className="px-4 sm:px-6 md:px-10 py-16 sm:py-24 md:py-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12">
          <div className="md:col-span-4">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-accent">Our approach</p>
          </div>

           <div className="md:col-span-8 space-y-6 sm:space-y-8 text-base sm:text-lg leading-relaxed text-foreground/80">
            <p>
              Katha Chitra is a full-service film and media production company
              headquartered in Lalitpur, Nepal. We're a small, senior team of
              directors, cinematographers, editors and producers — built lean on
              purpose.
            </p>

            <p>
              We work with brands, agencies, artists and cultural institutions
              on commercials, branded content, music videos, documentaries and
              digital campaigns. Whether the brief calls for a 30-second spot or
              a long-form series, we take it from first conversation to final
              color grade.
            </p>

            <p>
              The work we're proudest of looks like Nepal — but doesn't
              condescend to it. Specific, modern, unsentimental.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-secondary text-secondary-foreground px-4 sm:px-6 md:px-10 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {[
            { k: "10+", v: "Years in production" },
            { k: "120", v: "Films delivered" },
            { k: "18", v: "Countries reached" },
            { k: "07", v: "Awards & honors" },
          ].map((stat) => (
            <div key={stat.v}>
               <p style={{ fontFamily: "var(--font-display)" }} className="text-4xl sm:text-5xl md:text-7xl text-accent">
                {stat.k}
              </p>

               <p className="mt-2 sm:mt-3 text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground">{stat.v}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}