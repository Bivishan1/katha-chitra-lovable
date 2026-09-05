import {Link} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import SiteHeader from "../components/SiteHeader";
import { PageHero } from "../components/PageHero";
import {toast } from "sonner";
import {Loader2} from "lucide-react";
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
    type: "Commercial",
    budget: "",
    message: "",
  });
  const { data: contact } = useContactDetails();
  const { data: socials } = useSocialLinks();
  const email = contact?.email || "kathachitra5@gmail.com";
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
        budget: "",
        type: projectTypes[0],
        message: "",
      });
    } else {
      toast.error("Failed to send enquiry", {
        description:
          result.message || "Please try again in a few moments.",
      });
    }
  } catch (error) {
    console.error(error);

    toast.error("Something went wrong", {
      description:
        "Unable to send your enquiry. Please try again later.",
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
        <h1 style={{ fontFamily: "var(--font-display)" }} className="text-4xl sm:text-6xl md:text-7xl uppercase tracking-tighter leading-[0.95] max-w-5xl">
          Have a film, brand campaign, or documentary idea?{" "}
          <span className="italic font-light text-accent">Let's build it together.</span>
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
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-12 md:gap-16">
          {/* Info */}
          <aside className="md:col-span-4 space-y-10">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-accent mb-3">
                Studio
              </p>

             <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                {contact?.address || "New Baneshwor, Kathmandu\nKathmandu, Nepal"}
              </p>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-widest text-accent mb-3">
                Email
              </p>

                <a href={`mailto:${email}`} className="text-foreground hover:text-accent">
                {email}
              </a>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-widest text-accent mb-3">
                Phone
              </p>

              <a
                href={`tel:${(contact?.phone || "+97714123456").replace(/\s/g, "")}`}
                className="text-foreground hover:text-accent"
              >
                {contact?.phone || "+977 1 412 3456"}
              </a>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-widest text-accent mb-3">
                Follow
              </p>

              <div className="flex flex-col gap-1 text-foreground/80">
               {(socials ?? []).map((s) => (
                  <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="hover:text-accent">
                    {s.platform}
                  </a>
                ))}
              </div>
            </div>
          </aside>

          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="md:col-span-8 space-y-6 sm:space-y-8"
          >
          
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <Field
                label="Name"
                value={form.name}
                onChange={(value) => setForm({ ...form, name: value })}
                required
              />

              <Field
                label="Company"
                value={form.company}
                onChange={(value) => setForm({ ...form, company: value })}
              />

              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) => setForm({ ...form, email: value })}
                required
              />

              <Field
                label="Budget (USD)"
                value={form.budget}
                onChange={(value) => setForm({ ...form, budget: value })}
                placeholder="e.g. 10–25k"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-muted-foreground mb-3">
                Project type
              </label>

              <div className="flex flex-wrap gap-2">
                {projectTypes.map((projectType) => (
                  <button
                    type="button"
                    key={projectType}
                    onClick={() => setForm({ ...form, type: projectType })}
                    className={`text-xs uppercase tracking-widest px-4 py-2 border transition-colors ${
                      form.type === projectType
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border text-foreground/70 hover:border-accent hover:text-accent"
                    }`}
                  >
                    {projectType}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-muted-foreground mb-3">
                Tell us about the project
              </label>

              <textarea
                required
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-transparent border border-border px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <button
  type="submit"
  disabled={sending}
  className="lex items-center gap-3 text-xl sm:text-2xl md:text-3xl uppercase tracking-tight text-accent border-b border-accent pb-2 hover:gap-6 transition-all disabled:opacity-60 disabled:hover:gap-3"
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
      <label className="block text-[11px] uppercase tracking-widest text-muted-foreground mb-3">
        {label} {required && <span className="text-accent">*</span>}
      </label>

      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-border py-2 text-foreground focus:outline-none focus:border-accent transition-colors"
      />
    </div>
  );
}
