import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";

import { Toaster } from "@/components/ui/sooner";
import { supabase } from "@/integrations/supabase/client";
import { CmsRealtime } from "@/components/CmsRealtime";
import { useFavicon } from "@/hooks/useFavicon";
import { BackToTop } from "@/components/BackToTop";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
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

function ErrorComponent({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error(error);

  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
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

function FaviconSync() {
  useFavicon();
  return null;
}

function RootComponent() {
  // useFavicon();
  const { queryClient } = Route.useRouteContext();

  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "USER_UPDATED"
      ) {
        router.invalidate();

        if (event !== "SIGNED_OUT") {
          queryClient.invalidateQueries();
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <FaviconSync />
            <CmsRealtime />
      <Outlet />
      <BackToTop/>
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  );
}

export const Route =
  createRootRouteWithContext<{
    queryClient: QueryClient;
  }>()({
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
  });