"use client";

import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { errorNotification } from "@/utils/toast";

export function DatePickerWithRange({ className, setActiveFilter }) {
  const [date, setDate] = React.useState({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleClick = () => {
    if (!date.to || !date.from) return errorNotification("Please select date.");

    const params = new URLSearchParams(searchParams);
    params.set("from", date.from?.toISOString());
    params.set("to", date.to?.toISOString());

    router.push(`${pathname}?${params.toString()}`);
    setActiveFilter("custom");
  };

  return (
    <div className={cn("flex gap-2 my-4", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd-MM-yyyy")} -{" "}
                  {format(date.to, "dd-MM-yyyy")}
                </>
              ) : (
                format(date.from, "dd-MM-yyyy")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={4}
          />
        </PopoverContent>
      </Popover>
      <Button onClick={handleClick}>apply</Button>
    </div>
  );
}
