import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Haven — Somewhere to go",
    short_name: "Haven",
    description:
      "A place to say the thing you haven't said yet, and be understood, not managed.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8ff",
    theme_color: "#8b5cf6",
    icons: [
      {
        src: "/icon.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
