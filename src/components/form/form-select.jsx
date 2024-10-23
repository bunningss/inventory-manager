"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FormSelect({
  form,
  name,
  label,
  placeholder,
  description,
  options,
  required,
  keyName = "name",
  keyValue = "value",
}) {
  return (
    <FormField
      control={form.control}
      name={name || ""}
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
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="capitalize">
                <SelectValue placeholder={placeholder || ""} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options?.map((option, index) => {
                return (
                  <SelectItem
                    value={option[keyValue]}
                    key={index}
                    className="capitalize"
                  >
                    {option[keyName]}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
