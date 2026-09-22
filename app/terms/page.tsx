import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="public-shell">
      <nav className="public-nav">
        <Link href="/" className="brand">THE ROOM</Link>
        <div><Link href="/archive">Library</Link><Link href="/cases">How it works</Link><Link href="/about">About</Link><Link href="/">Enter</Link></div>
      </nav>
      <section className="public-hero compact">
        <span className="micro-line">LEGAL · TERMS</span>
        <h1>A small room for strange conversations.</h1>
        <p>The Room is an entertainment and creative-writing experience. Its stories and fictional voices are not professional advice.</p>
      </section>
      <section className="manifesto">
        <div><span>01</span><h2>Entertainment</h2><p>Responses are written for reflection, storytelling and fun.</p></div>
        <div><span>02</span><h2>Original presentation</h2><p>The interface and animated characters are part of the creative experience and may change as the project evolves.</p></div>
        <div><span>03</span><h2>Future features</h2><p>Accounts, cloud sync, new content and optional paid features may be added later and described before they are enabled.</p></div>
        <div><span>04</span><h2>Respect</h2><p>Do not use the site to harass, impersonate or interfere with other people's systems.</p></div>
      </section>
      <footer className="public-footer"><Link href="/">Return to the room →</Link></footer>
    </main>
  );
}