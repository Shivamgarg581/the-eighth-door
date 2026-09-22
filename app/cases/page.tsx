import Link from "next/link";

export default function CasesPage() {
  return (
    <main className="public-shell">
      <nav className="public-nav">
        <Link href="/" className="brand">THE ROOM</Link>
        <div><Link href="/archive">Library</Link><Link href="/cases">How it works</Link><Link href="/about">About</Link><Link href="/">Enter</Link></div>
      </nav>
      <section className="public-hero compact">
        <span className="micro-line">HOW THE ROOM WORKS</span>
        <h1>Your question controls the scene.</h1>
        <p>No account is required for the first release. Ask something, then watch the room choose its response style.</p>
      </section>
      <section className="case-public-card">
        <div className="case-public-stamp">01</div>
        <div>
          <span className="micro-line">QUESTION → SCENE</span>
          <h2>Topic matching selects an authored response.</h2>
          <p>Questions are matched against local keywords. The selected response defines the character, mood, camera and story lines. The conversation is saved locally so recent questions can return as echoes.</p>
          <Link href="/" className="public-cta">Enter the room ↗</Link>
        </div>
      </section>
      <footer className="public-footer">The answer is only half the experience.</footer>
    </main>
  );
}