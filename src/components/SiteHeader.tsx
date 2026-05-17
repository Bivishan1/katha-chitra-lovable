import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

const links = [
  { to: "/work", label: "Work" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export default function SiteHeader() {
   const [open, setOpen] = useState(false);
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-10 py-4 md:py-6 flex justify-between items-center mix-blend-difference text-foreground">
        <Link to="/" className="flex items-baseline gap-2 sm:gap-3" onClick={() => setOpen(false)}>
          <span style={{ fontFamily: "var(--font-display)" }} className="text-lg sm:text-xl md:text-2xl font-bold tracking-tighter uppercase">
            Katha Chitra
          </span>
          <span style={{ fontFamily: "var(--font-nepali)" }} className="hidden sm:inline text-sm opacity-50">
            कथा चित्र
          </span>
        </Link>
        <div className="hidden md:flex gap-10 text-[11px] font-medium uppercase tracking-[0.2em]">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `${isActive ? "text-accent" : "hover:text-accent"} transition-colors duration-300`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden flex flex-col gap-1.5 p-2 -mr-2 md:cursor-default cursor-pointer"
        >
          <span className={`block h-px w-6 bg-current transition-transform ${open ? "translate-y-1.75 rotate-45" : ""}`} />
          <span className={`block h-px w-6 bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block h-px w-6 bg-current transition-transform ${open ? "-translate-y-1.75 -rotate-45" : ""}`} />
        </button>
      </nav>
      {open && (
        <div className="fixed inset-0 z-40 bg-background md:hidden flex flex-col justify-center px-6">
          <ul className="space-y-6">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  onClick={() => setOpen(false)}
                  style={{ fontFamily: "var(--font-display)" }}
                  className={({ isActive }) =>
                    `${isActive ? "text-accent" : "hover:text-accent"} block text-5xl uppercase tracking-tighter`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}