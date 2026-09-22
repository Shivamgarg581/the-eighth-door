import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="public-shell">
      <nav className="public-nav">
        <Link href="/" className="brand">THE ROOM</Link>
        <div><Link href="/archive">Library</Link><Link href="/cases">How it works</Link><Link href="/about">About</Link><Link href="/">Enter</Link></div>
      </nav>
      <section className="public-hero compact">
        <span className="micro-line">ABOUT THE ROOM</span>
        <h1>A chatbot where the answer has a scene.</h1>
        <p>The Room is a cinematic conversation experiment. Your question chooses a character, atmosphere, camera and authored response from a growing library.</p>
      </section>
      <section className="manifesto">
        <div><span>01</span><h2>The character reacts</h2><p>Different subjects bring different personalities: curator, ghost, fool, oracle and dreamer.</p></div>
        <div><span>02</span><h2>The camera is part of the answer</h2><p>One reply can arrive as a wide shot, a profile, a silhouette or an extreme close-up of one eye.</p></div>
        <div><span>03</span><h2>Written, not generic</h2><p>The first release uses an authored response library rather than a blank chatbot response stream.</p></div>
        <div><span>04</span><h2>More shelves over time</h2><p>New stories, jokes, reflections, strange facts and cinematic scenes can be added without rebuilding the whole room.</p></div>
      </section>
      <footer className="public-footer"><Link href="/">Enter The Room →</Link></footer>
    </main>
  );
}