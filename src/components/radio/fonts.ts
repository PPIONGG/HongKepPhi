import { Chakra_Petch, VT323 } from "next/font/google";

export const techno = Chakra_Petch({
  weight: ["500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-techno",
});

export const lcd = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-lcd",
});
