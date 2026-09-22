import Link from "next/link";

const files = [
  { id: "017-A", title: "The Seven Doors", status: "RECOVERED", text: "A corridor. Seven entrances. One contradiction." },
  { id: "017-B", title: "The Black Forest", status: "OPEN", text: "The path changes after you leave it." },
  { id: "017-C", title: "The Hollow Mountain", status: "LOCKED", text: "Three knocks were heard beneath the stone." },
  { id: "017-D", title: "The Forgotten Lake", status: "LOCKED", text: "The reflection moved before the water did." },
  { id: "017-E", title: "The Silent Village", status: "LOCKED", text: "Twelve houses. One lit window." },
  { id: "017-F", title: "The Observatory", status: "LOCKED", text: "The telescope was not pointed at the sky." },
];

export default function ArchivePage() {
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
        <span className="micro-line">ARCHIVE · CASE 017</span>
        <h1>What we found.</h1>
        <p>Fragments recovered from the world behind the doors.</p>
      </section>
      <section className="archive-grid">
        {files.map((item) => (
          <article key={item.id} className="archive-card">
            <span>{item.id} · {item.status}</span>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </article>
        ))}
      </section>
      <footer className="public-footer">Some records only appear after they are discovered.</footer>
    </main>
  );
}
