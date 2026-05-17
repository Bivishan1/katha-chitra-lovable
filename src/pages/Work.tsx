import { useEffect } from "react";
import SiteHeader from "../components/SiteHeader";
import  SiteFooter  from "../components/SiteFooter";
import { WorkTile } from "../components/WorkTile";
import { projects } from "../data/projects";

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

export default function Work() {
  useEffect(() => {
    document.title = "Work — Katha Chitra";

    setMetaTag(
      'meta[name="description"]',
      "content",
      "Selected films, commercials, documentaries and music videos produced by Katha Chitra in Kathmandu."
    );

    setMetaTag(
      'meta[property="og:title"]',
      "content",
      "Work — Katha Chitra"
    );

    setMetaTag(
      'meta[property="og:description"]',
      "content",
      "A selected archive of Katha Chitra's cinematic work."
    );

    setMetaTag('meta[property="og:url"]', "content", "/work");

    let canonical = document.head.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = "/work";
  }, []);

  return (
    <div className="min-h-screen">
      <SiteHeader />

       <section className="pt-32 sm:pt-40 md:pt-48 pb-12 sm:pb-16 px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-accent mb-4 sm:mb-6">The Archive</p>
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-5xl sm:text-7xl md:text-9xl uppercase tracking-tighter leading-[0.85]">
            Selected <br />
            <span className="italic font-light text-accent">Work</span>
          </h1>

          <p className="mt-6 sm:mt-10 max-w-md text-xs sm:text-sm text-foreground/70 leading-relaxed">
            A growing record of frames, films and campaigns shot across Nepal
            and beyond.
          </p>
        </div>
      </section>

       <section className="px-4 sm:px-6 md:px-10 pb-20 sm:pb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 md:gap-x-8 md:gap-y-24">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={index % 2 === 1 ? "md:mt-32" : ""}
            >
              <WorkTile project={project} />
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}