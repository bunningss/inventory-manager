"use client";

import dynamic from "next/dynamic";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
import { useMemo } from "react";

export function Editor({ placeholder, label, required, content, setContent }) {
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Start typing...",
      height: 500,
    }),
    [placeholder]
  );

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          className={`capitalize ${
            required ? "after:content-['*'] after:text-destructive" : ""
          }`}
        >
          {label}
        </label>
      )}
      <JoditEditor
        value={content}
        config={config}
        tabIndex={1}
        onBlur={(newContent) => setContent(newContent)}
      />
    </div>
  );
}
