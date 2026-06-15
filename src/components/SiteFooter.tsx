import { Link } from "react-router-dom";

const footerLinks = [
  {
    title: "Studio",
    items: ["Jhamsikhel, Lalitpur", "Kathmandu, Nepal"],
  },
  {
    title: "Inquiries",
    items: [
      {
        label: "hello@kathachitra.com",
        href: "mailto:hello@kathachitra.com",
      },
    ],
  },
  {
    title: "Follow",
    items: [
      { label: "Instagram", href: "#" },
      { label: "Vimeo", href: "#" },
      { label: "YouTube", href: "#" },
    ],
  },
];


export default function SiteFooter() {
  return (
  <footer className="border-t border-border px-4 py-20 sm:px-6 sm:py-28 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <p className="mb-8 text-[10px] uppercase tracking-[0.28em] text-muted-foreground sm:mb-10 sm:text-[11px] sm:tracking-[0.4em]">
          Ready to tell your story?
        </p>

        <Link
          to="/contact"
          style={{ fontFamily: "var(--font-display)" }}
          className="block w-full text-[clamp(4.25rem,14vw,11rem)] font-normal uppercase leading-[0.85] tracking-tighter text-foreground transition-colors duration-500 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          <span className="block sm:inline">Let's</span>{" "}
          <span className="wrap-break-word">Collaborate</span>
          <span className="text-accent">.</span>
        </Link>

        <div className="mt-14 grid gap-8 border-t border-border pt-8 text-[10px] uppercase tracking-widest text-muted-foreground sm:mt-20 sm:grid-cols-2 sm:text-[11px] lg:mt-24 lg:grid-cols-4">
          {footerLinks.map((section) => (
            <div key={section.title} className="min-w-0">
              <p className="mb-2 text-foreground/60">{section.title}</p>

              <div className="flex flex-col gap-1">
                {section.items.map((item) =>
                  typeof item === "string" ? (
                    <p key={item}>{item}</p>
                  ) : (
                    <a
                      key={item.label}
                      href={item.href}
                      className="wrap-break-word transition-colors hover:text-accent focus-visible:outline-none focus-visible:text-accent"
                    >
                      {item.label}
                    </a>
                  )
                )}
              </div>
            </div>
          ))}

          <div className="min-w-0 sm:col-span-2 lg:col-span-1 lg:text-right">
            <p className="mb-2 text-foreground/60">© 2025</p>
            <p>Katha Chitra Films</p>
            <p style={{ fontFamily: "var(--font-nepali)" }}>कथा चित्र</p>
          </div>
        </div>
      </div>
    </footer>
  );
}