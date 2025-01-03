"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body className="h-screen w-screen flex flex-col items-center justify-center gap-4">
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
