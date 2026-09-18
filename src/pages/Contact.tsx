import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import SiteHeader from "../components/SiteHeader";
import { PageHero } from "../components/PageHero";
import { toast } from "sonner";
import { AtSign, ExternalLink, Loader2, MapPin } from "lucide-react";
import contactHero from "../assets/bts-set.jpg";
import { useContactDetails, useSocialLinks } from "@/lib/cms";

const projectTypes = [
  "Commercial",
  "Branded Content",
  "Music Video",
  "Documentary",
  "Digital Campaign",
  "Equipment Rental",
  "Other",
];

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

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    type: "Commercial",
    budget: "",
    message: "",
  });
  const { data: contact } = useContactDetails();
  const { data: socials } = useSocialLinks();
  const phone = contact?.phone || "+977 9801040899";
  // const address = contact?.address || "Kathmandu, Nepal";
  const email = contact?.email || "storypaintersnp@gmail.com";
  const [sending, setSending] = useState(false);


  useEffect(() => {
    document.title = "Contact — Story Painters";

    setMetaTag(
      'meta[name="description"]',
      "content",
      "Start a project with Story Painters. Reach our Kathmandu studio for commercials, branded content, music videos, documentaries and digital campaigns.",
    );

    setMetaTag(
      'meta[property="og:title"]',
      "content",
      "Contact — Story Painters",
    );

    setMetaTag(
      'meta[property="og:description"]',
      "content",
      "Let's tell your story. Reach out to our Kathmandu studio.",
    );

    setMetaTag('meta[property="og:url"]', "content", "/contact");

    let canonical = document.head.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = "/contact";
  }, []);

  const googleMapAddress =`https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2999.0492689359726!2d85.3316251!3d27.6980616!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190057228a45%3A0xbaf0faea869773a3!2sStory%20Painters%20%E2%80%93%20Film%20Fixer%20%26%20Camera%20Gear%20Rental%20Nepal!5e1!3m2!1sen!2snp!4v1789478015059!5m2!1sen!2snp`;

  // new web3forms form template
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSending(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
          name: form.name,
          company: form.company,
          phone: form.phone,
          email: form.email,
          budget: form.budget,
          type: form.type,
          message: form.message,
          subject: `[${form.type}] ${form.name} — ${form.company || "Inquiry"}`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Enquiry sent successfully", {
          description:
            "Our production team will get back to you within 24–48 hours.",
        });

        window.scrollTo({ top: 0, behavior: "smooth" });

        setForm({
          name: "",
          company: "",
          email: "",
          phone: "",
          budget: "",
          type: projectTypes[0],
          message: "",
        });
      } else {
        toast.error("Failed to send enquiry", {
          description: result.message || "Please try again in a few moments.",
        });
      }
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong", {
        description: "Unable to send your enquiry. Please try again later.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <PageHero
        image={contactHero}
        alt="On-set production team during a Kathmandu shoot"
        eyebrow="Project inquiry"
        caption={email}
      >
        <h1
          style={{ fontFamily: "var(--font-display)" }}
          className="text-4xl sm:text-6xl md:text-7xl uppercase tracking-tighter leading-[0.95] max-w-5xl"
        >
          Have a film, brand campaign, or documentary idea?{" "}
          <span className="italic font-light text-accent">
            Let's build it together.
          </span>
        </h1>
        <div className="mt-8 sm:mt-12 flex flex-wrap gap-3 sm:gap-4">
          <a
            href="#inquiry"
            className="text-xs uppercase tracking-widest px-5 py-3 bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
          >
            Start a Project
          </a>
          <Link
            to="https://drive.google.com/file/d/1GgrG6hLkosiBa36GhOlXGqeN3WZT09O6/view?usp=sharing"
            className="text-xs uppercase tracking-widest px-5 py-3 border border-foreground/40 text-foreground hover:border-accent hover:text-accent transition-colors"
          >
            View Proposal
          </Link>
          <a
            href={contact?.booking_url || "https://calendar.app.google/"}
            target="_blank"
            rel="noreferrer"
            className="text-xs uppercase tracking-widest px-5 py-3 border border-foreground/40 text-foreground hover:border-accent hover:text-accent transition-colors"
          >
            Book a Call
          </a>
        </div>
      </PageHero>

      <section className="px-4 sm:px-6 md:px-10 pb-20 sm:pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Contact details */}
          <aside className="lg:col-span-4 space-y-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Information
              </p>
              <h2
                style={{ fontFamily: "var(--font-display)" }}
                className="mt-2 text-2xl sm:text-3xl uppercase tracking-tight"
              >
                Our{" "}
                <span className="italic font-light text-accent">Contact</span>
              </h2>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/40 p-5 sm:p-6">
              <MapPin className="h-5 w-5 text-accent" aria-hidden />
              <p className="mt-4 text-sm font-semibold uppercase tracking-wide">
                Office Address
              </p>
              <p className="mt-2 text-sm text-accent/90 leading-relaxed whitespace-pre-line">
                {contact?.address}
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/40 p-5 sm:p-6">
              <AtSign className="h-5 w-5 text-accent" aria-hidden />
              <p className="mt-4 text-sm font-semibold uppercase tracking-wide">
                Email & Phone
              </p>
              <a
                href={`mailto:${email}`}
                className="mt-2 block text-sm text-accent/90 hover:text-accent break-all"
              >
                {email}
              </a>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-widest text-accent mb-3">
                Phone
              </p>

              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="mt-1 block text-sm text-foreground/80 hover:text-accent"
              >
                {phone || "+977-9841004524"}
              </a>
            </div>

            <div className="relative rounded-2xl border border-border/70 overflow-hidden">
              <iframe
                title="Katha Chitra studio location"
                  src={googleMapAddress}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-60 "
              />
              <a
                href={googleMapAddress}
                target="_blank"
                rel="noreferrer"
                className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-background px-2.5 py-1.5 text-[10px] uppercase tracking-widest hover:text-accent"
              >
                Open in Maps <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {(socials ?? []).length > 0 && (
              <div className="rounded-2xl border border-border/70 bg-card/40 p-5 sm:p-6">
                <p className="text-sm font-semibold uppercase tracking-wide">
                  Follow
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-foreground/80">
                  {(socials ?? []).map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-accent"
                    >
                      {s.platform}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Inquiry form */}
          <div className="lg:col-span-8 rounded-2xl border border-border/70 bg-card/40 p-5 sm:p-8 md:p-10">
            <p className="text-[10px] uppercase tracking-[0.3em] text-accent">
              Inquiry form
            </p>
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="mt-2 text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight"
            >
              Request{" "}
              <span className="italic font-light text-accent">a Quote</span>
            </h2>

            <form onSubmit={onSubmit} className="mt-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field
                  label="Full name"
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  required
                  placeholder="e.g. John Doe"
                />
                <Field
                  label="Email address"
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  required
                  placeholder="john@example.com"
                />
                <Field
                  label="Phone number"
                  value={form.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                  placeholder="+977 98XXXXXXXX"
                />
                <Field
                  label="Company"
                  value={form.company}
                  onChange={(v) => setForm({ ...form, company: v })}
                  placeholder="Company / brand"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                  Our services
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full rounded-lg bg-background/60 border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
                >
                  {projectTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <Field
                label="Budget (USD)"
                value={form.budget}
                onChange={(value) => setForm({ ...form, budget: value })}
                placeholder="e.g. 10–25k"
              />
              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                  Your message
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="Tell us about your project or requirements…"
                  className="w-full rounded-lg bg-background/60 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full inline-flex items-center justify-center gap-3 rounded-lg bg-accent text-accent-foreground py-4 text-xs uppercase tracking-[0.3em] shadow-[0_10px_40px_-12px_hsl(var(--accent))] hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {sending ? (
                  <>
                    Sending
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                  </>
                ) : (
                  "Send Enquiry →"
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
};

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: FieldProps) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
        {label} {required && <span className="text-accent">*</span>}
      </label>

      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-background/60 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
      />
    </div>
  );
}
