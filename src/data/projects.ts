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
  },
  {
    id: "the-last-weaver",
    title: "The Last Weaver",
    client: "Independent",
    category: "Documentary",
    year: 2024,
    image: workDocumentary,
    aspect: "portrait",
  },
  {
    id: "echoes-of-the-valley",
    title: "Echoes of the Valley",
    client: "Bipul Chhetri",
    category: "Music Video",
    year: 2023,
    image: workMusic,
    aspect: "square",
  },
  {
    id: "kathmandu-midnight",
    title: "Kathmandu Midnight",
    client: "Tiger Palm Apparel",
    category: "Branded",
    year: 2023,
    image: workBranded,
    aspect: "wide",
  },
  {
    id: "mustang-letters",
    title: "Letters from Mustang",
    client: "Visit Nepal",
    category: "Documentary",
    year: 2022,
    image: workMustang,
    aspect: "wide",
  },
];
