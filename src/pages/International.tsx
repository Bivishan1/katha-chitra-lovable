import { Link } from "@tanstack/react-router";
import heroImage from "../assets/international-hero.jpg";
import SiteHeader  from "../components/SiteHeader";
import  SiteFooter from "../components/SiteFooter";
import { PageHero } from "../components/PageHero";


const offerings = [
  {
    n: "01",
    title: "Local crew",
    body: "Senior DPs, ACs, sound, gaffers, grips and PAs — all vetted, English-speaking and used to international standards.",
  },
  {
    n: "02",
    title: "Location scouting",
    body: "From Kathmandu's living heritage cities to Mustang, Everest, Annapurna, Chitwan and the Terai. Recces, look books, logistics.",
  },
  {
    n: "03",
    title: "Permits & paperwork",
    body: "Filming permits, drone clearances, restricted-area access, talent visas and customs carnets handled end to end.",
  },
  {
    n: "04",
    title: "Filming coordination",
    body: "Schedules, transport, accommodation, catering, security and altitude logistics — full line production from prep to wrap.",
  },
  {
    n: "05",
    title: "Drone shots",
    body: "CAAN-licensed drone operators, FPV rigs and high-altitude aerial coverage with insured equipment.",
  },
  {
    n: "06",
    title: "Post-production support",
    body: "Edit suites, color grading, sound design and DI in Kathmandu — at a fraction of European or North American rates.",
  },
];

export default function International() {
  
  return (
    <div className="min-h-screen ">
      <SiteHeader />

      {/* Hero */}
      <PageHero
        image={heroImage}
        alt="Aerial drone view of a film crew on a Himalayan ridge at golden hour"
        eyebrow="For foreign agencies, filmmakers & brands"
        caption="Line production · Nepal"
      >
        <h1
          style={{ fontFamily: "var(--font-display)" }}
          className="text-5xl sm:text-7xl md:text-8xl uppercase tracking-tighter leading-[0.9]"
        >
          International <br /> Production <br />
          <span className="italic font-light text-accent">Support in Nepal.</span>
        </h1>
        <p className="mt-6 sm:mt-8 max-w-xl text-sm sm:text-base text-foreground/85 leading-relaxed">
          Land in Kathmandu with a film-ready crew. Local fixer, scouting, permits, drone, and post — under one roof.
        </p>
      </PageHero>

      {/* What we cover */}
      <section className="px-4 sm:px-6 md:px-10 py-20 sm:py-28 md:py-32">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-accent mb-3 sm:mb-4">What we cover</p>
          <h2 style={{ fontFamily: "var(--font-display)" }} className="text-3xl sm:text-4xl md:text-6xl uppercase tracking-tight mb-10 sm:mb-16 max-w-3xl">
            One contact. Every department.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {offerings.map((o) => (
              <div key={o.n} className="border-t border-border pt-6">
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="text-[10px] uppercase tracking-widest text-accent">{o.n}</span>
                  <h3 style={{ fontFamily: "var(--font-display)" }} className="text-2xl sm:text-3xl uppercase tracking-tight">
                    {o.title}
                  </h3>
                </div>
                <p className="text-foreground/80 leading-relaxed pl-10">{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary text-secondary-foreground px-4 sm:px-6 md:px-10 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-accent mb-4 sm:mb-6">Planning a shoot in Nepal?</p>
          <h2 className="text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight leading-tight mb-8 sm:mb-10">
            Tell us your dates, crew size and locations.
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link 
              to="/contact"
              className="text-xs uppercase tracking-widest px-5 py-3 bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
            >
              Start a Project
            </Link>
            <Link
              to="/work"
              className="text-xs uppercase tracking-widest px-5 py-3 border border-foreground/40 hover:border-accent hover:text-accent transition-colors"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}