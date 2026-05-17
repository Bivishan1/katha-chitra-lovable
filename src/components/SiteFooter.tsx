import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
     <footer className="py-20 sm:py-28 md:py-40 px-4 sm:px-6 md:px-10 border-t border-border">
      <div className="max-w-7xl mx-auto">
         <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-8 sm:mb-10 text-muted-foreground">
          Ready to tell your story?
        </p>

        <Link
          to="/contact"
          style={{ fontFamily: "var(--font-display)" }}
           className="block text-[15vw] md:text-[10vw] leading-[0.9] uppercase tracking-tighter hover:text-accent transition-colors duration-500 wrap-break-words"
        >
          Let's <br className="md:hidden" />
          Collaborate
          <span className="text-accent">.</span>
        </Link>

        <div className="mt-16 sm:mt-24 pt-8 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground">
          <div>
            <p className="text-foreground/60 mb-2">Studio</p>
            <p>Jhamsikhel, Lalitpur</p>
            <p>Kathmandu, Nepal</p>
          </div>

          <div>
            <p className="text-foreground/60 mb-2">Inquiries</p>
            <a
              href="mailto:hello@kathachitra.com"
              className="hover:text-accent"
            >
              hello@kathachitra.com
            </a>
          </div>

          <div>
            <p className="text-foreground/60 mb-2">Follow</p>
            <div className="flex flex-col gap-1">
              <a href="#" className="hover:text-accent">
                Instagram
              </a>
              <a href="#" className="hover:text-accent">
                Vimeo
              </a>
              <a href="#" className="hover:text-accent">
                YouTube
              </a>
            </div>
          </div>

          <div className="md:text-right">
            <p className="text-foreground/60 mb-2">© 2025</p>
            <p>Katha Chitra Films</p>
            <p style={{ fontFamily: "var(--font-nepali)" }}>कथा चित्र</p>
          </div>
        </div>
      </div>
    </footer>
  );
}