import { useEffect } from "react";
import SiteHeader from "../components/SiteHeader";
import  SiteFooter  from "../components/SiteFooter";
import { WorkTile } from "../components/WorkTile";
import { useFrames, useProjects } from "@/lib/cms";
import { PageHero } from "../components/PageHero";
import workHero from "../assets/work-mustang.jpg";

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
    document.title = "Work — Story Painters";

    setMetaTag(
      'meta[name="description"]',
      "content",
      "Selected films, commercials, documentaries and music videos produced by Story Painters in Kathmandu."
    );

    setMetaTag(
      'meta[property="og:title"]',
      "content",
      "Work — Story Painters"
    );

    setMetaTag(
      'meta[property="og:description"]',
      "content",
      "A selected archive of Story Painters' cinematic work."
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

  const { data: projects = [], isLoading } = useProjects();
  const { data: frames = [] } = useFrames();
  // Newly added frames stack first; projects already represented by a frame are not repeated.
  const frameTitles = new Set(frames.map((f) => f.title.trim().toLowerCase()));
  const tiles = [
    ...frames.map((f) => ({
      id: f.id,
      title: f.title,
      category: f.subtitle,
      image_url: f.image_url,
      video_url: f.video_url,
      aspect: "wide" as const,
    })),
    ...projects.filter((p) => !frameTitles.has(p.title.trim().toLowerCase())),
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <PageHero
        image={workHero}
        alt="Cinematographer framing a shot in the high Himalayas"
        eyebrow="The Archive"
        caption="Selected Work · 2025"
      >
        <h1 style={{ fontFamily: "var(--font-display)" }} className="text-5xl sm:text-7xl md:text-9xl uppercase tracking-tighter leading-[0.85]">
          Selected <br /> <span className="italic font-light text-accent">Work</span>
        </h1>
        <p className="mt-6 sm:mt-10 max-w-md text-xs sm:text-sm text-foreground/80 leading-relaxed">
          A growing record of frames, films and campaigns shot across Nepal and beyond.
        </p>
      </PageHero>

       <section className="px-4 sm:px-6 md:px-10 pb-20 sm:pb-32">
        {isLoading && (
          <p className="max-w-7xl mx-auto text-xs uppercase tracking-widest text-muted-foreground">Loading work…</p>
        )}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 md:gap-x-8 md:gap-y-24">
          {tiles.map((p, idx) => (
            <div key={p.id} className={idx % 2 === 1 ? "md:mt-32" : ""}>
              <WorkTile project={p} />
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}