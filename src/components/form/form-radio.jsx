"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Icon } from "../icon";

export function FormRadio({ form, options, name }) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              {options?.map((option, index) => (
                <FormItem
                  className="flex items-center space-x-3 space-y-0"
                  key={index}
                >
                  <FormControl>
                    <RadioGroupItem value={option?.value} />
                  </FormControl>
                  <FormLabel className="font-semibold flex items-center gap-2 text-base">
                    <Icon icon={option?.icon} size={28} />
                    <span>{option?.name}</span>
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
