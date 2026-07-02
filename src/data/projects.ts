import yakChew from "../assets/proposal/yak-chew.png";
import speaking from "../assets/proposal/speaking.jpg";
import bagiraheko from "../assets/proposal/bagiraheko_aasha.jpg";


export type Project = {
  id: string;
  title: string;
  client: string;
  category: "Commercial" | "Documentary" | "Music Video" | "Branded" | "Anthem";
  year: number;
  image: string;
  aspect: "wide" | "portrait" | "square";
  videoUrl : string;
};

export const projects: Project[] = [
  {
    id: "yak-chew-supply",
    title: "Yak Chew Supply",
    client: "Yak Chew Supply Co.",
    category: "Documentary",
    year: 2024,
    image: yakChew,
    aspect: "wide",
    videoUrl: "https://www.youtube.com/watch?v=w9cvhcLk1i4&t=156s",
  },
    {
      id: "the-speaking-titan",
      title: "The Speaking Titan",
      client: "Ambition Guru / Daami Media",
      category: "Branded",
      year: 2024,
      image: speaking,
      aspect: "wide",
      videoUrl: "https://www.youtube.com/watch?v=p0zsbO71ExM",
    },
  {
    id: "bagi-raheko-aasha",
    title: "Bagi Raheko Aasha",
    client: "CREASION (NGO)",
    category: "Documentary",
    year: 2024,
    image: bagiraheko,
    aspect: "wide",
    videoUrl: "https://www.youtube.com/watch?v=inmFjJUXjqs",
  },
  {
    id: "yaad-haru",
    title: "Yaad Haru - Music Video",
    client: "Ashish Adhikari",
    category: "Music Video",
    year: 2024,
    image: '',
    aspect: "portrait",
    videoUrl: "https://www.youtube.com/watch?v=ak6euuieHrc",
  },
  {
    id: "kathmandu-sumnima",
    title: "Kathmandu - Sumnima",
    client: "Sumnima",
    category: "Music Video",
    year: 2024,
    image: '',
    aspect: "wide",
    videoUrl: "https://www.youtube.com/watch?v=UYoay4kRaz4",
  },
    {
    id: "nepal-premier-league",
    title: "Nepal Premier League",
    client: "SBL (Nepal)",
    category: "Anthem",
    year: 2024,
    image: '',
    aspect: "wide",
    videoUrl: "https://www.youtube.com/watch?v=-LRG342jBv4",
  },
];
