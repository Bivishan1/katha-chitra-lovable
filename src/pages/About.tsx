import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import aboutImage from "../assets/about-studio.jpg";
import  SiteHeader from "../components/SiteHeader";
import  SiteFooter  from "../components/SiteFooter";
import founderImage from "../assets/team-founder.jpeg";
import btsSet from "../assets/bts-set.jpg";
import btsMonitor from "../assets/bts-monitor.jpg";
import { PageHero } from "../components/PageHero";
import { useContactDetails } from "@/lib/cms";
import btsMustang from "@/assets/work-mustang.jpg";
import btsDoc from "@/assets/work-documentary.jpg";
import { useBtsFrames } from "@/lib/cms";
// import { supabase } from "../../supabase/client";


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

// const { data, error } = await supabase
//   .from("equipment_items")
//   .insert({
//     name: "Laptop",
// price: 25000,
//   })
//   .select();

// console.log(data);
// console.log(error);

const BTS_FALLBACKS = [btsSet, btsMonitor, btsMustang, btsDoc]

export default function About() {

  // onlysupabase testing
//   useEffect(() => {
//     const testConnection = async () => {
//       const { data, error } = await supabase
//         .from("equipment_items")
//         .select("*");

//       console.log("Data:", data);
//       console.log("Error:", error);
//       console.log('supbase url:',import.meta.env.VITE_SUPABASE_URL);
// console.log('supabase:',supabase);
//     };

//     testConnection();
//   }, []);
  const { data: btsFrames = [] } = useBtsFrames();
  const { data: contact } = useContactDetails();


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

           <PageHero
        image={aboutImage}
        alt="Katha Chitra crew on a Kathmandu rooftop at dusk"
        eyebrow="Studio"
        caption="Est. Kathmandu · MMXIV"
      >
        <h1 style={{ fontFamily: "var(--font-display)" }} className="text-4xl sm:text-6xl md:text-8xl uppercase tracking-tighter leading-[0.9] max-w-5xl">
          We tell <span className="italic font-light text-accent">honest</span> stories with cinematic intent.
        </h1>
      </PageHero>

      <section className="px-4 sm:px-6 md:px-10 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <img
            src={btsSet}
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
              headquartered in {contact?.address}. We're a small, senior team of
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

{/* Founder & Team */}
      <section className="px-4 sm:px-6 md:px-10 py-16 sm:py-24 md:py-32">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-accent mb-10 sm:mb-16">The Team</p>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-12">
            <div className="md:col-span-5">
              <img
                src={founderImage}
                alt="Aarav Shrestha, founder and creative director of Katha Chitra"
                width={1024}
                height={1280}
                loading="lazy"
                className="w-full aspect-4/5 object-cover outline-1 -outline-offset-1 outline-white/5"
              />
            </div>
            <div className="md:col-span-7 flex flex-col justify-center">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Founder & Creative Director</p>
              <h3 style={{ fontFamily: "var(--font-display)" }} className="text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight mb-6">
                Saugat <span className="italic font-light text-accent">Dhital</span>
              </h3>
              <p className="text-foreground/80 leading-relaxed mb-4">
                A decade behind the lens — from independent documentary work across Mustang and Humla to broadcast commercials for South Asian brands.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                Aarav leads a senior bench of cinematographers, producers, sound designers and colorists. Every project is touched by people who have shipped hundreds of hours of work, not interns chasing a portfolio.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 sm:mt-20">
            {[
              { name: "Pranisha Karki", role: "Head of Production" },
              { name: "Bibek Lama", role: "Director of Photography" },
              { name: "Mira Tamang", role: "Editor & Colorist" },
              { name: "Sujan Rai", role: "Sound Designer" },
            ].map((m) => (
              <div key={m.name} className="border-t border-border pt-4">
                <p style={{ fontFamily: "var(--font-display)" }} className="text-lg sm:text-xl uppercase tracking-tight">{m.name}</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Production philosophy */}
      <section className="px-4 sm:px-6 md:px-10 py-16 sm:py-24 md:py-32 border-t border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12">
          <div className="md:col-span-4">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-accent">Production philosophy</p>
          </div>
          <div className="md:col-span-8 space-y-8">
            {[
              { k: "Story first", v: "We start with the question, not the camera. A treatment is rewritten until the through-line is undeniable." },
              { k: "Lean by design", v: "Small senior crews move faster, light better, and listen harder than bloated trucks. Every person on set has decision power." },
              { k: "Specific to place", v: "Nepal is not a backdrop. We cast locally, scout obsessively, and let the geography do work the script doesn't have to." },
              { k: "Finish like we mean it", v: "Color, sound and grade are not afterthoughts. The last 10% is where the film becomes itself." },
            ].map((p) => (
              <div key={p.k} className="grid grid-cols-12 gap-4 border-t border-border pt-6">
                <p style={{ fontFamily: "var(--font-display)" }} className="col-span-12 md:col-span-4 text-xl sm:text-2xl uppercase tracking-tight text-accent">{p.k}</p>
                <p className="col-span-12 md:col-span-8 text-foreground/80 leading-relaxed">{p.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kit Room / Rentals */}
      <section className="px-4 sm:px-6 md:px-10 py-16 sm:py-24 md:py-32 border-t border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12">
          <div className="md:col-span-4">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-accent">The Kit Room</p>
          </div>
          <div className="md:col-span-8 space-y-6">
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-3xl sm:text-4xl md:text-6xl uppercase tracking-tight">
              Now renting <span className="italic font-light text-accent">our gear.</span>
            </h2>
            <p className="text-foreground/80 leading-relaxed text-base sm:text-lg">
              The cameras, lenses, lighting, grip, sound and drones we shoot on are now available to other crews working in Nepal — daily and weekly rentals with delivery in Kathmandu, on-set support and full insurance.
            </p>
            <Link
              to="/rental-equipment"
              className="inline-block text-xs uppercase tracking-widest px-5 py-3 border border-foreground/40 hover:border-accent hover:text-accent transition-colors"
            >
              See the Kit Room →
            </Link>
          </div>
        </div>
      </section>

      {/* BTS */}
      <section className="px-4 sm:px-6 md:px-10 py-16 sm:py-24 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between items-end gap-4 mb-10 sm:mb-16">
            <div>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-accent mb-3 sm:mb-4">Behind the scenes</p>
              <h2 style={{ fontFamily: "var(--font-display)" }} className="text-3xl sm:text-4xl md:text-6xl uppercase tracking-tight">
                On set, off script.
              </h2>
            </div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Frames from recent shoots</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {btsFrames.map((f, i) => (
              <figure key={f.id} className="group">
                <img
                  src={f.image_url || BTS_FALLBACKS[i % BTS_FALLBACKS.length]}
                  alt={f.alt || f.caption || "Behind the scenes on a Katha Chitra production"}
                  loading="lazy"
                  className="w-full aspect-[16/10] object-cover outline outline-1 -outline-offset-1 outline-white/5"
                />
                {f.caption && (
                  <figcaption className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                    {f.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      </section>


      <SiteFooter />
    </div>
  );
}