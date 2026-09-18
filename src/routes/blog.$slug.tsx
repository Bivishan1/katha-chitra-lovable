import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Link2, Share2 } from "lucide-react";
import { toast } from "sonner";
import SiteHeader from "@/components/SiteHeader";
import  SiteFooter  from "@/components/SiteFooter";
import { useBlogPost } from "@/lib/cms";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostPage,
  head: () => ({
    meta: [
      { title: "Story — Story Painters Journal" },
      { name: "description", content: "Field notes and production guides from Story Painters, a Kathmandu-based film and video production company." },
      { property: "og:title", content: "Story Painters Journal" },
      { property: "og:description", content: "Field notes and production guides from filmmaking in Nepal." },
      { property: "og:type", content: "article" },
    ],
  }),
});

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function BlogPostPage() {
  const { slug } = Route.useParams();
  const { data: post, isLoading } = useBlogPost(slug);

  const paragraphs = (post?.content ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

    const tags = Array.isArray(post?.tags) && post!.tags!.length ? (post!.tags as string[]) : post ? [post.category] : [];


  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: post?.title, url });
        return;
      } catch {
        /* dismissed */
      }
    }
    await navigator.clipboard?.writeText(url);
    toast.success("Link copied");
  };

  const copyLink = async () => {
    await navigator.clipboard?.writeText(window.location.href);
    toast.success("Link copied");
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="px-4 sm:px-6 md:px-10 pt-28 sm:pt-36 pb-20">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading story…</p>
          ) : !post ? (
            <div className="py-24 text-center">
              <h1 style={{ fontFamily: "var(--font-display)" }} className="text-3xl uppercase tracking-tight">
                Story not found
              </h1>
              <Link to="/blog" className="mt-6 inline-block text-xs uppercase tracking-widest text-accent">
                Return to journal
              </Link>
            </div>
          ) : (
            <>
              {/* Breadcrumb */}
              <nav className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                <Link to="/" className="hover:text-accent">Home</Link>
                <span className="opacity-40">›</span>
                <Link to="/blog" className="hover:text-accent">Blog</Link>
                <span className="opacity-40">›</span>
                <span className="text-accent">{post.category}</span>
              </nav>

              {/* Title */}
              <header className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                <h1
                  style={{ fontFamily: "var(--font-display)" }}
                  className="md:col-span-8 text-3xl sm:text-5xl md:text-6xl uppercase tracking-tighter leading-[0.95]"
                >
                  {post.title}
                </h1>
                <div className="md:col-span-4 md:text-right">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-accent">Published on</p>
                  <p className="mt-1 text-sm text-foreground/80">{formatDate(post.published_at)}</p>
                </div>
              </header>

              {/* Cover */}
              {post.cover_image_url ? (
                <figure className="mt-10 rounded-2xl overflow-hidden border border-border/70">
                  <img src={post.cover_image_url} alt={post.title} className="w-full object-cover max-h-[70vh]" />
                </figure>
              ) : null}

              {/* Body + sticky author */}
              <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <article className="lg:col-span-8 rounded-2xl border border-border/70 bg-card/40 p-6 sm:p-10">
                  <div className="space-y-5 max-w-2xl">
                    {paragraphs.map((line, i) =>
                      line.startsWith("- ") ? (
                        <p key={i} className="flex gap-3 text-[15px] leading-relaxed text-foreground/85">
                          <span className="text-accent">•</span>
                          <span>{line.slice(2)}</span>
                        </p>
                      ) : (
                        <p key={i} className="text-[15px] leading-relaxed text-foreground/85">
                          {line}
                        </p>
                      ),
                    )}
                  </div>

                  <div className="mt-12 pt-8 border-t border-border/60 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Share dispatch:</span>
                      <button
                        type="button"
                        onClick={share}
                        aria-label="Share this story"
                        className="grid place-items-center h-9 w-9 rounded-md border border-border/70 hover:border-accent hover:text-accent transition-colors"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={copyLink}
                        aria-label="Copy link"
                        className="grid place-items-center h-9 w-9 rounded-md border border-border/70 hover:border-accent hover:text-accent transition-colors"
                      >
                        <Link2 className="h-4 w-4" />
                      </button>
                    </div>
                    <Link
                      to="/blog"
                      className="inline-flex items-center gap-3 rounded-full border border-border/70 px-5 py-3 text-[10px] uppercase tracking-[0.25em] hover:border-accent hover:text-accent transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" /> Return to journal
                    </Link>
                  </div>
                </article>

                <aside className="lg:col-span-4">
                  <div className="lg:sticky lg:top-28 rounded-2xl border border-border/70 bg-card/40 p-6">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Author</p>
                    <div className="mt-4 flex items-center gap-3">
                      {post.author_image_url ? (
                        <img
                          src={post.author_image_url}
                          alt={post.author_name}
                          className="h-11 w-11 rounded-full object-cover border border-border"
                        />
                      ) : (
                        <span className="h-11 w-11 rounded-full bg-muted/50 border border-border" />
                      )}
                      <div>
                        <p className="text-sm font-semibold">{post.author_name}</p>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-accent leading-relaxed">
                          {post.author_role}
                        </p>
                      </div>
                    </div>

                    {tags.length > 0 && (
                      <>
                        <p className="mt-8 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Categories</p>
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {tags.map((t) => (
                            <li
                              key={t}
                              className="rounded-md border border-border/70 bg-background/40 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.18em] text-foreground/75"
                            >
                              {t}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </aside>
              </div>
            </>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}