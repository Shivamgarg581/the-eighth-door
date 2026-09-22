import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Eighth Door",
    short_name: "Eighth Door",
    description: "An interactive mystery adventure.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
  };
}
