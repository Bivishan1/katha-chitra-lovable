import { Link } from "@tanstack/react-router";
import {
  useContactDetails,
  useSocialLinks,

} from "@/lib/cms";


export default function SiteFooter() {
  const { data: contact } = useContactDetails();
  const { data: socials } = useSocialLinks();
  const email = contact?.email || "kathachitra5@gmail.com";

  const footerLinks = [
    {
      title: "Studio",
      items: [
        ...(contact?.address?.split("\n") ?? [
          "New Baneshwor, Nepal",
        ]),
        contact?.phone || "+977-9841004524",
      ],
    },
    {
      title: "Inquiries",
      items: [
        {
          label: email,
          href: `mailto:${email}`,
        },
      ],
    },
    {
      title: "Contact",
      items: contact?.whatsapp
        ? [
            {
              label: "WhatsApp",
              href: `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`,
            },
          ]
        : [],
    },
    {
      title: "Follow us",
      items:
        socials?.map((social) => ({
          label: social.platform,
          href: social.url,
        })) ?? [],
    },
  ];
  return (
     <footer className="border-t border-border px-4 py-20 sm:px-6 sm:py-15 lg:px-10">
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
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="copyright text-center  tracking-widest text-muted-foreground sm:text-[11px] lg:mt-10">
          <p className="mb-2 text-foreground/60">© 2025</p>
          <p>Story Painter Films</p>
          <p style={{ fontFamily: "var(--font-nepali)" }}>Story Painters</p>
        </div>
        <div className="flex items-center justify-between text-[10px] uppercase ">
          {/* make this link to a center */}
          <Link
            to="/rental-equipment"
            className="block mt-2 hover:text-accent"
          >
            Rent Equipment →
          </Link>
         <div className="flex items-center justify-center gap-2 text-[10px]">
  <span>Designed & developed with ❤️ by</span>
  <a
    href="https://linktr.ee/bivishan"
    target="_blank"
    rel="noopener noreferrer"
    className="font-semibold text-gray-700 hover:text-blue-600 transition-colors"
  >
    Bivishan Sapkota
  </a>
</div>

        </div>
      </div>
    </footer>
  );
}
