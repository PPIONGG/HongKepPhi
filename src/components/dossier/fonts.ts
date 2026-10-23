import { Special_Elite, Sriracha } from "next/font/google";

export const typewriter = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-typewriter",
});

export const handwriting = Sriracha({
  weight: "400",
  subsets: ["thai", "latin"],
  variable: "--font-handwriting",
});
