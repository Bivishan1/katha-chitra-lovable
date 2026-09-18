import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import  SiteFooter from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import { useBlogPosts } from "@/lib/cms";
import blogHero from "@/assets/work-documentary.jpg";

export const Route = createFileRoute("/blog/")({
  component: BlogPage,
  head: () => ({
    meta: [
      { title: "Journal — Story Painters" },
      {
        name: "description",
        content:
          "Notes from a Kathmandu video production company — filming locations in Nepal, commercial and documentary production, costs, and working with international brands.",
      },
      { property: "og:title", content: "Journal — Story Painters" },
      { property: "og:description", content: "Field notes from filmmaking in Nepal." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
});

export function formatPostDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function BlogPage() {
  const { data: posts = [], isLoading } = useBlogPosts();

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <PageHero
        image={blogHero}
        alt="Documentary still from a Story Painters field shoot"
        eyebrow="Journal"
        caption="Field notes"
      >
        <h1
          style={{ fontFamily: "var(--font-display)" }}
          className="text-5xl sm:text-7xl md:text-9xl uppercase tracking-tighter leading-[0.85]"
        >
          Field <br /> <span className="italic font-light text-accent">notes.</span>
        </h1>
      </PageHero>

      <section className="px-4 sm:px-6 md:px-10 pb-20 sm:pb-32">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading stories…</p>
          ) : posts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No stories published yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {posts.map((p) => (
                <article
                  key={p.id}
                  className="group flex flex-col rounded-2xl border border-border/70 bg-card/40 overflow-hidden transition-colors hover:border-accent/50"
                >
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="relative block aspect-16/10 overflow-hidden"
                  >
                    {p.cover_image_url ? (
                      <img
                        src={p.cover_image_url}
                        alt={p.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted/40" />
                    )}
                    <span className="absolute top-3 left-3 rounded-md bg-background/80 backdrop-blur px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-foreground/80">
                      {p.category}
                    </span>
                  </Link>

                  <div className="flex flex-col flex-1 p-5 sm:p-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {formatPostDate(p.published_at)}
                    </p>
                    <h2
                      style={{ fontFamily: "var(--font-display)" }}
                      className="mt-3 text-lg sm:text-xl leading-snug tracking-tight group-hover:text-accent transition-colors"
                    >
                      <Link to="/blog/$slug" params={{ slug: p.slug }}>
                        {p.title}
                      </Link>
                    </h2>
                    {p.excerpt ? (
                      <p className="mt-3 text-sm text-foreground/70 leading-relaxed line-clamp-3">{p.excerpt}</p>
                    ) : null}

                    <Link
                      to="/blog/$slug"
                      params={{ slug: p.slug }}
                      className="mt-6 pt-5 border-t border-border/60 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-muted-foreground group-hover:text-accent transition-colors"
                    >
                      Read full story
                      <span className="grid place-items-center h-8 w-8 rounded-full border border-border/70 group-hover:border-accent group-hover:bg-accent/10 transition-colors">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-16 sm:mt-20 text-center">
            <Link
              to="/contact"
              className="inline-block text-xs uppercase tracking-widest px-5 py-3 bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
            >
              Pitch a story idea →
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}