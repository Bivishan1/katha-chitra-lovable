import type { ReactNode } from "react";
type PageHeroProps = {
  image: string;
  alt: string;
  eyebrow?: string;
  children: ReactNode;
  /** Tailwind min-height utility for the hero. Default ~70vh. */
  minH?: string;
  /** Optional small label rendered bottom-right (e.g. "01 / Studio"). */
  caption?: string;
};
/**
 * Premium full-bleed page hero with a cinematic background image,
 * dark gradient scrim for legibility, subtle grain and a soft
 * Ken-Burns drift. Used as the top section of every content page.
 */
export function PageHero({
  image,
  alt,
  eyebrow,
  children,
  minH = "min-h-[70vh] sm:min-h-[78vh] md:min-h-[82vh]",
  caption,
}: PageHeroProps) {
  return (
    <section
      className={`relative ${minH} flex flex-col justify-end px-4 sm:px-6 md:px-10 pt-32 sm:pt-40 md:pt-48 pb-12 sm:pb-16 md:pb-20 overflow-hidden`}
    >
      {/* Background image with slow drift */}
      <img
        src={image}
        alt={alt}
        width={1920}
        height={1080}
        loading="eager"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover scale-110 origin-center animate-[heroDrift_18s_ease-in-out_infinite_alternate]"
      />
      {/* Cinematic scrim: dark base + bottom fade into page */}
      <div className="absolute inset-0 bg-background/55" />
      <div className="absolute inset-0 bg-linear-to-b from-background/70 via-background/30 to-background" />
      {/* Side vignette for type legibility */}
      <div className="absolute inset-0 bg-linear-to-r from-background/80 via-background/10 to-transparent" />
      {/* Subtle film grain */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />
      {/* Bottom hairline */}
      <div className="absolute left-0 right-0 bottom-0 h-px bg-linear-to-r from-transparent via-accent/40 to-transparent" />
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {eyebrow ? (
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-accent mb-4 sm:mb-6 animate-[slideInLeft_0.9s_ease-out_0.1s_both]">
            {eyebrow}
          </p>
        ) : null}
        <div className="animate-[slideInUp_1s_cubic-bezier(0.22,1,0.36,1)_0.25s_both]">
          {children}
        </div>
      </div>
      {caption ? (
        <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-6 md:right-10 z-10 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-foreground/60">
          {caption}
        </div>
      ) : null}
    </section>
  );
}