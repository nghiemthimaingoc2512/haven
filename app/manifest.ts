import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Haven — Somewhere to go",
    short_name: "Haven",
    description:
      "A place to say the thing you haven't said yet, and be understood, not managed.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f2ea",
    theme_color: "#f7f2ea",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
