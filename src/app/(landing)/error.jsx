"use client";

export default function Error({ error, reset }) {
  return (
    <div className="h-[calc(100vh-120px)] w-full flex flex-col items-center justify-center gap-4">
      <h2>Something went wrong! Please try again later.</h2>
    </div>
  );
}
