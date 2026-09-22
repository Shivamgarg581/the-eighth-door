import Link from "next/link";

export default function CasesPage() {
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
        <span className="micro-line">FIELD REPORTS</span>
        <h1>Case files.</h1>
        <p>Every ending leaves a different footprint.</p>
      </section>
      <section className="case-public-card">
        <div className="case-public-stamp">017</div>
        <div>
          <span className="micro-line">CURRENT CASE</span>
          <h2>Your case is created inside the experience.</h2>
          <p>Find clues, open rooms, collect secrets and return with a spoiler-safe case file. This page intentionally contains no solutions.</p>
          <Link href="/" className="public-cta">Enter the experience ↗</Link>
        </div>
      </section>
      <footer className="public-footer">A case is not closed because the door is.</footer>
    </main>
  );
}
