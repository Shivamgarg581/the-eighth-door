"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("The Eighth Door error", error);
  }, [error]);

  return (
    <main className="public-shell centered-public">
      <span className="micro-line">CASE INTERRUPTED</span>
      <h1>The corridor flickered.</h1>
      <p>The experience hit an unexpected error. Your local case should remain safe.</p>
      <button className="public-cta" onClick={() => reset()}>Try again →</button>
    </main>
  );
}
