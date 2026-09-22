import Link from "next/link";

export default function NotFound() {
  return (
    <main className="public-shell centered-public">
      <span className="micro-line">404 · THE PATH IS MISSING</span>
      <h1>This door does not exist.</h1>
      <p>Or it exists somewhere else.</p>
      <Link href="/" className="public-cta">Return to the corridor →</Link>
    </main>
  );
}
