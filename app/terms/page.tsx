import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="public-shell">
      <nav className="public-nav">
        <Link href="/" className="brand">THE EIGHTH DOOR</Link>
        <div><Link href="/archive">Archive</Link><Link href="/cases">Cases</Link><Link href="/about">About</Link><Link href="/">Enter</Link></div>
      </nav>
      <section className="public-hero compact">
        <span className="micro-line">LEGAL · TERMS</span>
        <h1>Rules of the corridor.</h1>
        <p>The Eighth Door is an entertainment experience. Do not rely on its fictional clues, messages or story as real-world guidance.</p>
      </section>
      <section className="manifesto">
        <div><span>01</span><h2>Entertainment</h2><p>All story elements, fictional records and puzzle systems are created for entertainment.</p></div>
        <div><span>02</span><h2>Respect the experience</h2><p>Do not attempt to reproduce hidden infrastructure, access private systems or interfere with other players.</p></div>
        <div><span>03</span><h2>Availability</h2><p>The project may change, expand, pause or remove experimental features as it evolves.</p></div>
        <div><span>04</span><h2>Payments</h2><p>Any future paid features will clearly identify price, scope and what is unlocked before purchase.</p></div>
      </section>
      <footer className="public-footer"><Link href="/">Back to the corridor →</Link></footer>
    </main>
  );
}
