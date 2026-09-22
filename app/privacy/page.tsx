import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="public-shell">
      <nav className="public-nav">
        <Link href="/" className="brand">THE ROOM</Link>
        <div><Link href="/archive">Library</Link><Link href="/cases">How it works</Link><Link href="/about">About</Link><Link href="/">Enter</Link></div>
      </nav>
      <section className="public-hero compact">
        <span className="micro-line">LEGAL · PRIVACY</span>
        <h1>Privacy, plainly.</h1>
        <p>The current experience keeps recent conversation history in your browser so the room can remember the session.</p>
      </section>
      <section className="manifesto">
        <div><span>01</span><h2>Local history</h2><p>The current release stores up to the most recent eight conversation turns in browser storage.</p></div>
        <div><span>02</span><h2>No required account</h2><p>You can use the first release without creating an account or sending a chat history to a server.</p></div>
        <div><span>03</span><h2>Authored content</h2><p>The response library is bundled with the site. The first release does not send each question to a generative AI API.</p></div>
        <div><span>04</span><h2>Clear memory</h2><p>The Library panel includes a clear-memory control that removes the local conversation history.</p></div>
      </section>
      <footer className="public-footer"><Link href="/">Back to The Room →</Link></footer>
    </main>
  );
}