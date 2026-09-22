import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://theeighthdoor.com";
  return [
    { url: base, lastModified: new Date() },
    { url: base + "/archive", lastModified: new Date() },
    { url: base + "/cases", lastModified: new Date() },
    { url: base + "/about", lastModified: new Date() },
  ];
}
