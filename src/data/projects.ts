import yakChew from "../assets/proposal/yak-chew.png";
import speaking from "../assets/proposal/speaking.jpg";
import bagiraheko from "../assets/proposal/bagiraheko_aasha.jpg";
import prakash from "../assets/proposal/prakash.jpg";
import npl from "../assets/proposal/npl.jpg";
import surakshya from "../assets/proposal/surakshya_panta.jpg";

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
    id: "prakash-saput-music-video",
    title: "Music Video w/ Prakash Saput",
    client: "Prakash Saput",
    category: "Music Video",
    year: 2024,
    image: prakash,
    aspect: "portrait",
    videoUrl: "https://www.youtube.com/watch?v=B0Nts5ARrOs",
  },
  {
    id: "desh-chhodeko-larko",
    title: "Desh Chhodeko Larko",
    client: "Surakshya Panta",
    category: "Music Video",
    year: 2024,
    image: surakshya,
    aspect: "wide",
    videoUrl: "https://www.youtube.com/watch?v=Uq3lHHmmRvI",
  },
    {
    id: "nepal-premier-league",
    title: "Nepal Premier League",
    client: "SBL (Nepal)",
    category: "Anthem",
    year: 2024,
    image: npl,
    aspect: "wide",
    videoUrl: "https://www.youtube.com/watch?v=Uq3lHHmmRvI",
  },
];
