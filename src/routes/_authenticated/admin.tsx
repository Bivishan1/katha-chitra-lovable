import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/use-admin";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { EquipmentManager } from "@/components/admin/EquipmentManager";
import { ContactManager } from "@/components/admin/ContactManager";
import { SiteSettingsManager } from "@/components/admin/SiteSettingsManager";
import { AboutContentManager } from "@/components/admin/AboutContentManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ShieldAlert, LogOut } from "lucide-react";

function AdminPage() {
  const { data, isLoading } = useAdmin();
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    // Attempt to claim the admin role for allowlisted emails on first visit.
    if (data?.user && !data.isAdmin) {
      supabase.rpc("has_role",{ _user_id: data?.user?.id, _role: "admin" }).then(({ data: granted }) => {
        if (granted) qc.invalidateQueries({ queryKey: ["admin-session"] });
      });
    }
  }, [data, qc]);

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (isLoading) {
    return <main className="min-h-screen grid place-items-center text-sm text-muted-foreground">Checking access…</main>;
  }


  if (!data?.isAdmin) {
    return (
      <main className="min-h-screen grid place-items-center px-4 text-center">
        <div className="max-w-md">
          <ShieldAlert className="w-8 h-8 mx-auto text-destructive" />
          <h1 style={{ fontFamily: "var(--font-display)" }} className="mt-4 text-2xl uppercase tracking-tight">
            Not authorised
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This account does not have administrator access to the Story Painters content manager.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <Button variant="outline" onClick={signOut}>Sign out</Button>
            <Link to="/" className="inline-flex items-center px-4 py-2 text-sm border border-border rounded-md">
              Back to site
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border px-4 sm:px-6 md:px-10 py-5 flex flex-wrap gap-3 items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent">Story Painters</p>
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl uppercase tracking-tight">
            Content Manager
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-xs text-muted-foreground">{data.user?.email}</span>
          <Link to="/" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-accent">
            View site
          </Link>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-1" /> Sign out
          </Button>
        </div>
      </header>

      <div className="px-4 sm:px-6 md:px-10 py-8 max-w-6xl mx-auto">
        <Tabs defaultValue="equipment">
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="frames">Frames</TabsTrigger>
            <TabsTrigger value="bts">Behind the Scenes</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="site">Site & SEO</TabsTrigger>
            <TabsTrigger value="about-content">About Page</TabsTrigger>
            <TabsTrigger value="contact">Contact & Social</TabsTrigger>
          </TabsList>

          <TabsContent value="equipment" className="mt-6">
            <EquipmentManager />
          </TabsContent>

          <TabsContent value="frames" className="mt-6">
            <ResourceManager
              table="frames"
              title="Recent Frames"
              description="Featured highlights on the homepage."
              orderBy="sort_order"
              defaults={{ published: true, sort_order: 0, subtitle: "" }}
              columns={[
                { key: "title", label: "Title" },
                { key: "subtitle", label: "Subtitle" },
                { key: "published", label: "Published", render: (r) => (r.published ? "Yes" : "No") },
              ]}
              fields={[
                { key: "title", label: "Title", type: "text", required: true },
                { key: "subtitle", label: "Subtitle", type: "text" },
                { key: "image_url", label: "Image", type: "image" },
                { key: "video_url", label: "Video link (YouTube etc.)", type: "text" },
                { key: "sort_order", label: "Sort order", type: "number" },
                { key: "published", label: "Published", type: "boolean" },
              ]}
            />
          </TabsContent>

          {/* new bts */}
           <TabsContent value="bts" className="mt-6">
            <ResourceManager
              table="bts_frames"
              title="Behind the Scenes"
              description="On-set frames shown in the Behind the Scenes section of the About page."
              orderBy="sort_order"
              defaults={{ published: true, sort_order: 0, caption: "", alt: "" }}
              columns={[
                { key: "caption", label: "Caption" },
                { key: "sort_order", label: "Order" },
                { key: "published", label: "Published", render: (r) => (r.published ? "Yes" : "No") },
              ]}
              fields={[
                { key: "caption", label: "Caption", type: "text" },
                { key: "alt", label: "Image description (alt text)", type: "text" },
                { key: "image_url", label: "Image", type: "image" },
                { key: "sort_order", label: "Sort order", type: "number" },
                { key: "published", label: "Published", type: "boolean" },
              ]}
            />
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <ResourceManager
              table="projects"
              title="Projects / Works"
              description="The portfolio archive shown on the Work page."
              orderBy="sort_order"
              defaults={{ published: true, sort_order: 1, aspect: "wide", category: "Commercial", year: new Date().getFullYear() }}
              columns={[
                { key: "title", label: "Title" },
                { key: "client", label: "Client" },
                { key: "category", label: "Category" },
              ]}
              fields={[
                { key: "title", label: "Title", type: "text", required: true },
                { key: "slug", label: "Slug (unique)", type: "text", required: true, help: "Lowercase, dashes only — e.g. npl-official-anthem" },
                { key: "client", label: "Client", type: "text" },
                {
                  key: "category",
                  label: "Category",
                  type: "select",
                  options: ["Commercial", "Documentary", "Music Video", "Branded"].map((v) => ({ value: v, label: v })),
                },
                { key: "year", label: "Year", type: "number" },
                { key: "video_url", label: "Video / embed link", type: "text" },
                { key: "image_url", label: "Cover image (optional)", type: "image", help: "Leave empty to use the YouTube thumbnail." },
                {
                  key: "aspect",
                  label: "Tile shape",
                  type: "select",
                  options: [
                    { value: "wide", label: "Wide" },
                    { value: "portrait", label: "Portrait" },
                    { value: "square", label: "Square" },
                  ],
                },
                { key: "sort_order", label: "Sort order", type: "number" },
                { key: "published", label: "Published", type: "boolean" },
              ]}
            />
          </TabsContent>

          <TabsContent value="proposals" className="mt-6">
            <ResourceManager
              table="proposals"
              title="Proposals"
              description="Upload a PDF and mark one as active — that one is offered for download on the site."
              orderBy="created_at"
              defaults={{ is_active: true }}
              columns={[
                { key: "title", label: "Title" },
                { key: "is_active", label: "Active", render: (r) => (r.is_active ? "Yes" : "No") },
              ]}
              fields={[
                { key: "title", label: "Title", type: "text", required: true },
                { key: "file_url", label: "PDF file", type: "file", required: true },
                { key: "is_active", label: "Active (offered for download)", type: "boolean" },
              ]}
            />
          </TabsContent>

          <TabsContent value="site" className="mt-6">
            <SiteSettingsManager />
          </TabsContent>

          <TabsContent value="about-content" className="mt-6">
            <AboutContentManager />
          </TabsContent>

          <TabsContent value="contact" className="mt-6">
            <ContactManager />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});
