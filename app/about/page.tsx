import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="public-shell">
      <nav className="public-nav">
        <Link href="/" className="brand">THE EIGHTH DOOR</Link>
        <div>
          <Link href="/archive">Archive</Link>
          <Link href="/cases">Cases</Link>
          <Link href="/about">About</Link>
          <Link href="/">Enter</Link>
        </div>
      </nav>
      <section className="public-hero compact">
        <span className="micro-line">ABOUT THE EXPERIENCE</span>
        <h1>Hide the answer.<br />Never hide the logic.</h1>
        <p>The Eighth Door is a browser-based mystery built around exploration, environmental clues, layered puzzles and a world that remembers what you do.</p>
      </section>
      <section className="manifesto">
        <div><span>01</span><h2>Quiet horror</h2><p>No constant jump scares. The fear comes from things being slightly, impossibly wrong.</p></div>
        <div><span>02</span><h2>Layered puzzles</h2><p>A clue discovered in one place can become the key to another. Observation comes before deduction.</p></div>
        <div><span>03</span><h2>Living world</h2><p>Return visits can alter scenes, reveal different details and expose deeper secrets.</p></div>
        <div><span>04</span><h2>Respect the player</h2><p>The free core experience stays playable. Optional support can expand the archive without hiding the logic.</p></div>
      </section>
      <footer className="public-footer"><Link href="/">Enter the doors →</Link></footer>
    </main>
  );
}
