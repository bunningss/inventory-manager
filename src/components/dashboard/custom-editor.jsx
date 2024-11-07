"use client";

import dynamic from "next/dynamic";
import { Controller } from "react-hook-form";
import { useMemo } from "react";
import { FormControl, FormItem, FormLabel } from "../ui/form";
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
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel
              className={`capitalize relative ${
                required
                  ? "after:content-['*'] after:absolute after:text-destructive after:text-lg"
                  : ""
              }`}
            >
              {label}
            </FormLabel>
          )}
          <FormControl>
            <JoditEditor
              value={field.value}
              config={config}
              tabIndex={1}
              onBlur={field.onChange}
            />
          </FormControl>
          {error && (
            <span className="text-destructive text-sm">{error?.message}</span>
          )}
        </FormItem>
      )}
    />
  );
}
