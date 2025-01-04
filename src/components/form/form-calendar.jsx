import React from "react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { getYear, setMonth, setYear, getMonth, format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function FormCalendar({
  name,
  form,
  label,
  placeholder = "Pick a date / তারিখ নির্বাচন করুন",
  allowFuture,
  required,
  startYear = getYear(new Date()) - 100,
  endYear = getYear(new Date()) + 20,
}) {
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = React.useState(currentDate);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = React.useMemo(
    () =>
      Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i),
    [endYear, startYear]
  );

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
                  ? "after:content-['*'] after:absolute after:text-destructive after:text-lg after:-bottom-2"
                  : ""
              }`}
            >
              {label}
            </FormLabel>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "py-2 px-3 text-left font-normal rounded-md border-input",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="grid grid-cols-2 gap-2 p-2 ">
                <Select
                  defaultValue={months[getMonth(currentDate)]}
                  onValueChange={(value) => {
                    const newDate = setMonth(
                      selectedDate,
                      months.indexOf(value)
                    );
                    setSelectedDate(newDate);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, i) => (
                      <SelectItem key={i} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  defaultValue={getYear(currentDate).toString()}
                  onValueChange={(value) => {
                    const newDate = setYear(selectedDate, parseInt(value));
                    setSelectedDate(newDate);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year, i) => (
                      <SelectItem key={i} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date);
                  if (date) {
                    setSelectedDate(date);
                  }
                }}
                month={selectedDate}
                onMonthChange={setSelectedDate}
                disabled={
                  !allowFuture
                    ? (date) =>
                        date > new Date() || date < new Date("1900-01-01")
                    : undefined
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
