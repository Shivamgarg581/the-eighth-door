import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  if (!base) return [];
  return [
    { url: base, lastModified: new Date() },
    { url: base + "/archive", lastModified: new Date() },
    { url: base + "/cases", lastModified: new Date() },
    { url: base + "/about", lastModified: new Date() },
    { url: base + "/privacy", lastModified: new Date() },
    { url: base + "/terms", lastModified: new Date() },
  ];
}
