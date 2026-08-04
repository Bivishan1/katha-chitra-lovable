
import { Play } from "lucide-react";
import {useState} from "react";

export type TileProject = {
  id: string;
  title: string;
  client?: string | null;
  category?: string | null;
  year?: number | null;
  image_url?: string | null;
  video_url?: string | null;
  aspect?: "wide" | "portrait" | "square" | null;
};

const aspectClass: Record<string, string> = {
  wide: "aspect-[16/10]",
  portrait: "aspect-[4/5]",
}


function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

export function WorkTile({ project, eager = false }: { project: TileProject; eager?: boolean }) {
  //getting thumbnail with youtubeid
  const videoUrl = project.video_url ?? "";
  const fallback = project.image_url ?? "";
    const ytId = videoUrl ? getYouTubeId(videoUrl) : null;
  const [thumb, setThumb] = useState(
      ytId && !project.image_url ? `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg` : fallback,
  );
  const handleError = () => {
    if (ytId && thumb.includes("maxresdefault")) {
      setThumb(`https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`);
     } else if (fallback && thumb !== fallback) {
      setThumb(fallback);
    }
  };

  return (
    <div className="group">
       <div
        className={`relative overflow-hidden bg-card outline -outline-offset-1 outline-white/5 ${
          aspectClass[project.aspect ?? "wide"] ?? aspectClass.wide
        }`}
      >
        {thumb && (
          <img
            src={thumb}
            onError={handleError}
            alt={`${project.title}${project.category ? ` — ${project.category}` : ""}${
              project.client ? ` for ${project.client}` : ""
            }`}
            loading={eager ? "eager" : "lazy"}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/10 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        {videoUrl && (
          <>
            <a
              href={videoUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Watch ${project.title} video`}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accent/90 text-accent-foreground backdrop-blur-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] transition-transform duration-500 ease-out scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100">
                <span className="absolute inset-0 rounded-full bg-accent/60 animate-ping opacity-0 group-hover:opacity-60" />
                <Play className="relative w-6 h-6 sm:w-7 sm:h-7 ml-0.5 fill-current" strokeWidth={0} />
              </span>
            </a>
        <a
              href={videoUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 inline-flex items-center gap-2 px-3.5 py-2 bg-background/70 backdrop-blur-md border border-white/15 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
            >
              <Play className="w-3 h-3 fill-current" strokeWidth={0} />
              Watch Video
            </a>
          </>
        )}
      </div>
      <div className="mt-4 flex justify-between items-start gap-4">
        <h3 style={{ fontFamily: "var(--font-display)" }} className="text-lg md:text-xl uppercase tracking-tight">
          {project.title}
        </h3>
       {(project.category || project.year) && (
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground whitespace-nowrap pt-1">
            {[project.category, project.year].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
    </div>
  );
}
