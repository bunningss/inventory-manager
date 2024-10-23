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

export function FormRadio({ form }) {
  return (
    <FormField
      control={form.control}
      name="paymentMethod"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="BKASH" />
                </FormControl>
                <FormLabel className="font-semibold flex items-center gap-2 text-base">
                  <Icon icon="bkash" size={28} />
                  <span>bKash pay / বিকাশ পেমেন্ট</span>
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="COD" />
                </FormControl>
                <FormLabel className="font-semibold flex items-center gap-2 text-base">
                  <Icon icon="cod" size={28} />
                  <span>Cash On Delivery / পণ্য পেয়ে পেমেন্ট</span>
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
