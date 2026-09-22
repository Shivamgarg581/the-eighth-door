import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Room",
    short_name: "The Room",
    description: "A cinematic living conversation.",
    start_url: "/",
    display: "standalone",
    background_color: "#050506",
    theme_color: "#050506",
  };
}
