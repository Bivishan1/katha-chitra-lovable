import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  ScrollRestoration,
  type ErrorComponentProps,
} from "@tanstack/react-router";

import { Toaster } from "@/components/ui/sooner";
import { supabase } from "@/integrations/supabase/client";
import { CmsRealtime } from "@/components/CmsRealtime";
// import { useFavicon } from "@/hooks/useFavicon";
import { BackToTop } from "@/components/BackToTop";
import { WhatsAppButton } from "@/components/WhatsappButton";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen overflow-hidden items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>

        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

import appCss from "../App.css?inline";

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600&family=Noto+Sans+Devanagari:wght@700&display=swap";


function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);

  const router = useRouter();

  return (
    <div className="flex min-h-screen overflow-hidden items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">
          Something went wrong
        </h1>

        <p className="mt-2 text-muted-foreground">
          Please try again.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Try Again
          </button>

          <Link
            to="/"
            className="rounded-md border px-4 py-2"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// function FaviconSync() {
//   useFavicon();
//   return null;
// }

// function RootComponent() {
//   // useFavicon();
//   const { queryClient } = Route.useRouteContext();

//   const router = useRouter();

//   useEffect(() => {
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((event) => {
//       if (
//         event === "SIGNED_IN" ||
//         event === "SIGNED_OUT" ||
//         event === "USER_UPDATED"
//       ) {
//         router.invalidate();

//         if (event !== "SIGNED_OUT") {
//           queryClient.invalidateQueries();
//         }
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, [queryClient, router]);

//   return (
//     <QueryClientProvider client={queryClient}>
//       <FaviconSync />
//             <CmsRealtime />
//       <Outlet />
//       <BackToTop/>
//       <WhatsAppButton/>
//       <Toaster position="bottom-right" />
//     </QueryClientProvider>
//   );
// }

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Katha Chitra — Nepali Video Production House" },
      { name: "description", content: "Katha Chitra is a Kathmandu-based film and media production company crafting commercials, branded content, music videos, documentaries, and digital campaigns." },
      { property: "og:site_name", content: "Katha Chitra" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: import.meta.env.VITE_SUPABASE_URL, crossOrigin: "anonymous" },
      { rel: "preload", as: "style", href: FONT_URL },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* Non-blocking font stylesheet */}
        <link rel="stylesheet" href={FONT_URL} media="print" onLoad={(e) => { e.currentTarget.media = "all"; }} />
        <noscript><link rel="stylesheet" href={FONT_URL} /></noscript>
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [router, queryClient]);

  const [idle, setIdle] = useState(false);
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(() => setIdle(true), { timeout: 2500 });
    else window.setTimeout(() => setIdle(true), 1500);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {idle && <CmsRealtime />}
      <Outlet />
      {idle && <BackToTop />}
      {idle && <WhatsAppButton />}

      <Toaster position="bottom-right" />
    </QueryClientProvider>
  );
}