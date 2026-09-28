import InfiniteManifestation from "@/components/InfiniteManifestation";

export default function Home() {
  return (
    <main className="manifestation-page" aria-label="Infinite manifestation animation">
      <div className="manifestation-depth depth-one" />
      <div className="manifestation-depth depth-two" />
      <div className="manifestation-depth depth-three" />
      <div className="manifestation-veil" />
      <InfiniteManifestation />
    </main>
  );
}
