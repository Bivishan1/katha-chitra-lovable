import workCommercial from "../assets/work-commercial.jpg";
import workDocumentary from "../assets/work-documentary.jpg";
import workMusic from "../assets/work-music.jpg";
import workBranded from "../assets/work-branded.jpg";
import workMustang from "../assets/work-mustang.jpg";

export type Project = {
  id: string;
  title: string;
  client: string;
  category: "Commercial" | "Documentary" | "Music Video" | "Branded";
  year: number;
  image: string;
  aspect: "wide" | "portrait" | "square";
  videoUrl : string;
};

export const projects: Project[] = [
  {
    id: "high-altitude-spirits",
    title: "High Altitude Spirits",
    client: "Annapurna Luxury",
    category: "Commercial",
    year: 2024,
    image: workCommercial,
    aspect: "wide",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "the-last-weaver",
    title: "The Last Weaver",
    client: "Independent",
    category: "Documentary",
    year: 2024,
    image: workDocumentary,
    aspect: "portrait",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",

  },
  {
    id: "echoes-of-the-valley",
    title: "Echoes of the Valley",
    client: "Bipul Chhetri",
    category: "Music Video",
    year: 2023,
    image: workMusic,
    aspect: "square",
   videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",

  },
  {
    id: "kathmandu-midnight",
    title: "Kathmandu Midnight",
    client: "Tiger Palm Apparel",
    category: "Branded",
    year: 2023,
    image: workBranded,
    aspect: "wide",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",

  },
  {
    id: "mustang-letters",
    title: "Letters from Mustang",
    client: "Visit Nepal",
    category: "Documentary",
    year: 2022,
    image: workMustang,
    aspect: "wide",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",

  },
];
