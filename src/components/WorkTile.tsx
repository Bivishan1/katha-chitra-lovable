import type { Project } from "@/data/projects";

const aspectClass: Record<Project["aspect"], string> = {
  wide: "aspect-[16/10]",
  portrait: "aspect-[4/5]",
  square: "aspect-square",
};

export function WorkTile({ project, eager = false }: { project: Project; eager?: boolean }) {
  return (
    <div className="group cursor-pointer">
      <div className={`relative overflow-hidden bg-card outline -outline-offset-1 outline-white/5 ${aspectClass[project.aspect]}`}>
        <img
          src={project.image}
          alt={`${project.title} — ${project.category} for ${project.client}`}
          loading={eager ? "eager" : "lazy"}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-linear-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="mt-4 flex justify-between items-start gap-4">
        <h3 style={{ fontFamily: "var(--font-display)" }} className="text-lg md:text-xl uppercase tracking-tight">
          {project.title}
        </h3>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground whitespace-nowrap pt-1">
          {project.category} · {project.year}
        </p>
      </div>
    </div>
  );
}
