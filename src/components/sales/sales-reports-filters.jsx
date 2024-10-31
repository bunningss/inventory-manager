"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePickerWithRange } from "../date-range-picker";
import { Button } from "../ui/button";
import { FormModal } from "../form/form-modal";
import { FormInput } from "../form/form-input";
import { FormSelect } from "../form/form-select";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/helpers";

const formSchema = z.object({
  searchKey: z.string().optional().nullable(),
  sortBy: z.enum(["due", "amount"]).optional().or(z.literal("")),
});

export function SalesReportsFilters() {
  const [resetKey, setResetKey] = useState(0);
  const [activeFilter, setActiveFilter] = useState("today");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchKey: "",
      sortBy: "",
    },
  });

  useEffect(() => {
    const sortBy = searchParams.get("sortBy") || "";
    form.setValue("sortBy", sortBy);
  }, [searchParams, form]);

  const createQueryString = (from, to) => {
    const params = new URLSearchParams(searchParams);
    const type = params.get("all");
    if (type) {
      params.delete("all");
    }
    params.set("from", from);
    params.set("to", to);
    return params.toString();
  };

  const updateDateRange = (from, to) => {
    const queryString = createQueryString(formatDate(from), formatDate(to));
    router.push(`${pathname}?${queryString}`);
  };

  const handleToday = () => {
    const today = new Date();
    updateDateRange(today, today);
    setActiveFilter("today");
  };

  const handleClear = () => {
    const params = new URLSearchParams();
    params.set("from", formatDate(new Date()));
    params.set("to", formatDate(new Date()));

    form.reset({
      searchKey: "",
      sortBy: "",
    });

    setResetKey((prevKey) => prevKey + 1);

    router.push(`${pathname}?${params.toString()}`);

    setActiveFilter("today");
  };

  const handleThisWeek = () => {
    const today = new Date();
    const firstDayOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
    updateDateRange(firstDayOfWeek, lastDayOfWeek);
    setActiveFilter("week");
  };

  const handleThisMonth = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );
    updateDateRange(firstDayOfMonth, lastDayOfMonth);
    setActiveFilter("month");
  };

  const handleThisYear = () => {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const lastDayOfYear = new Date(today.getFullYear(), 11, 31);
    updateDateRange(firstDayOfYear, lastDayOfYear);
    setActiveFilter("year");
  };

  const handleAll = () => {
    const params = new URLSearchParams();
    params.set("all", "all");
    router.push(`${pathname}?${params.toString()}`);
    setActiveFilter("all");
  };

  const handleSubmit = (data) => {
    const params = new URLSearchParams(searchParams);
    params.set("searchKey", data.searchKey || "");
    params.set("sortBy", data.sortBy || "");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="space-x-4">
          <Button
            onClick={handleToday}
            variant={activeFilter === "today" ? "default" : "outline"}
          >
            Today
          </Button>
          <Button
            onClick={handleThisWeek}
            variant={activeFilter === "week" ? "default" : "outline"}
          >
            This Week
          </Button>
          <Button
            onClick={handleThisMonth}
            variant={activeFilter === "month" ? "default" : "outline"}
          >
            This Month
          </Button>
          <Button
            onClick={handleThisYear}
            variant={activeFilter === "year" ? "default" : "outline"}
          >
            This Year
          </Button>
          <Button
            onClick={handleAll}
            variant={activeFilter === "all" ? "default" : "outline"}
          >
            All
          </Button>
          <Button onClick={handleClear} variant="destructive">
            Clear
          </Button>
        </div>
        <DatePickerWithRange
          setActiveFilter={setActiveFilter}
          activeFilter={activeFilter}
        />
      </div>
      <FormModal form={form} formLabel="search" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            form={form}
            name="searchKey"
            placeholder="Receipt ID or Customer Name"
          />
          <FormSelect
            key={resetKey}
            form={form}
            name="sortBy"
            placeholder="Sort by"
            options={[
              {
                name: "none",
                value: null,
              },
              {
                name: "Due / বকেয়া",
                value: "due",
              },
              {
                name: "amount / টাকার পরিমাণ",
                value: "amount",
              },
            ]}
          />
        </div>
      </FormModal>
    </div>
  );
}
