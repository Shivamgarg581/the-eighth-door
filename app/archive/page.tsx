import Link from "next/link";

const shelves = [
  ["01","Philosophy shelf","Big questions, small answers."],
  ["02","Midnight cinema","Short horror and strange scenes."],
  ["03","Heart shelf","Love, loss and the things we cannot neatly explain."],
  ["04","Comedy drawer","Questions that deserve an eyebrow raise."],
  ["05","Dream archive","Sleep, imagination and impossible rooms."],
  ["06","Library","Books, stories and why they stay with us."],
];

export default function ArchivePage() {
  return (
    <main className="public-shell">
      <nav className="public-nav">
        <Link href="/" className="brand">THE ROOM</Link>
        <div><Link href="/archive">Library</Link><Link href="/cases">How it works</Link><Link href="/about">About</Link><Link href="/">Enter</Link></div>
      </nav>
      <section className="public-hero compact">
        <span className="micro-line">THE WRITTEN LIBRARY</span>
        <h1>Different questions live on different shelves.</h1>
        <p>Every shelf is made from authored mini-essays, tiny stories, jokes and cinematic fragments. Your wording decides which shelf opens.</p>
      </section>
      <section className="archive-grid">
        {shelves.map(([id,title,text]) => (
          <article key={id} className="archive-card">
            <span>{id} · SHELF</span>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </section>
      <footer className="public-footer"><Link href="/">Ask the room ↗</Link></footer>
    </main>
  );
}