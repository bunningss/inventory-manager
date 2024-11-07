"use client";

import { Controller } from "react-hook-form";
import { useMemo } from "react";
import dynamic from "next/dynamic";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export function CustomEditor({ name, form, placeholder, label, required }) {
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Start typing...",
      height: 500,
    }),
    [placeholder]
  );

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState: { error } }) => (
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
            value={field.value}
            config={config}
            tabIndex={1}
            onBlur={field.onChange}
          />

          {error && <span className="text-destructive">{error?.message}</span>}
        </div>
      )}
    />
  );
}
