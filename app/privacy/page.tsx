import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="public-shell">
      <nav className="public-nav">
        <Link href="/" className="brand">THE EIGHTH DOOR</Link>
        <div><Link href="/archive">Archive</Link><Link href="/cases">Cases</Link><Link href="/about">About</Link><Link href="/">Enter</Link></div>
      </nav>
      <section className="public-hero compact">
        <span className="micro-line">LEGAL · PRIVACY</span>
        <h1>Privacy, plainly.</h1>
        <p>The first release stores story progress locally in your browser. Optional cloud features can be added later and will be documented here before they are enabled.</p>
      </section>
      <section className="manifesto">
        <div><span>01</span><h2>Local progress</h2><p>Your case can persist in browser storage without requiring an account.</p></div>
        <div><span>02</span><h2>No secret keys in the client</h2><p>Production credentials belong in deployment secrets, never in the repository.</p></div>
        <div><span>03</span><h2>Optional analytics</h2><p>Any future analytics should be limited to useful anonymous events such as chapter entry or puzzle completion.</p></div>
        <div><span>04</span><h2>Control</h2><p>The experience includes a local reset control so you can erase the saved case from the current browser.</p></div>
      </section>
      <footer className="public-footer"><Link href="/">Back to the corridor →</Link></footer>
    </main>
  );
}
