"use client";

import InfiniteManifestation from "@/components/InfiniteManifestation";

export default function Error() {
  return (
    <main className="manifestation-page" aria-label="Ambient visual fallback">
      <div className="manifestation-depth depth-one" />
      <div className="manifestation-depth depth-two" />
      <div className="manifestation-depth depth-three" />
      <div className="manifestation-veil" />
      <InfiniteManifestation />
    </main>
  );
}
