"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DatePickerWithRange } from "../date-range-picker";
import { Button } from "../ui/button";
import { FormModal } from "../form/form-modal";
import { FormInput } from "../form/form-input";
import { FormSelect } from "../form/form-select";
import { formatDate } from "@/utils/helpers";

const formSchema = z.object({
  searchKey: z.string().optional().nullable(),
  sortBy: z.enum(["due", "amount"]).optional().or(z.literal("")),
});

export function SalesReportsFilters() {
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

  const createQueryString = useCallback(
    (from, to) => {
      const params = new URLSearchParams(searchParams);
      params.delete("all");
      params.set("from", from);
      params.set("to", to);
      return params.toString();
    },
    [searchParams]
  );

  const updateDateRange = useCallback(
    (from, to) => {
      const queryString = createQueryString(formatDate(from), formatDate(to));
      router.push(`${pathname}?${queryString}`);
    },
    [createQueryString, router, pathname]
  );

  const handleDateFilter = useCallback(
    (filterType) => {
      const today = new Date();
      let from, to;

      switch (filterType) {
        case "today":
          from = to = today;
          break;
        case "week":
          from = new Date(today.setDate(today.getDate() - today.getDay()));
          to = new Date(from);
          to.setDate(to.getDate() + 6);
          break;
        case "month":
          from = new Date(today.getFullYear(), today.getMonth(), 1);
          to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          break;
        case "year":
          from = new Date(today.getFullYear(), 0, 1);
          to = new Date(today.getFullYear(), 11, 31);
          break;
        default:
          return;
      }

      updateDateRange(from, to);
      setActiveFilter(filterType);
    },
    [updateDateRange]
  );

  const handleClear = useCallback(() => {
    const today = new Date();
    const params = new URLSearchParams();
    params.set("from", formatDate(today));
    params.set("to", formatDate(today));

    form.reset({
      searchKey: "",
      sortBy: "",
    });

    router.push(`${pathname}?${params.toString()}`);
    setActiveFilter("today");
  }, [form, router, pathname]);

  const handleAll = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("from");
    params.delete("to");
    params.set("all", "all");
    router.push(`${pathname}?${params.toString()}`);
    setActiveFilter("all");
  }, [searchParams, router, pathname]);

  const handleSubmit = useCallback(
    (data) => {
      const params = new URLSearchParams(searchParams);
      params.set("searchKey", data.searchKey || "");
      params.set("sortBy", data.sortBy || "");
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const filterButtons = useMemo(
    () => [
      { label: "Today", filter: "today" },
      { label: "This Week", filter: "week" },
      { label: "This Month", filter: "month" },
      { label: "This Year", filter: "year" },
    ],
    []
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="space-x-4">
          {filterButtons.map(({ label, filter }) => (
            <Button
              key={filter}
              onClick={() => handleDateFilter(filter)}
              variant={activeFilter === filter ? "default" : "outline"}
            >
              {label}
            </Button>
          ))}
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
            form={form}
            name="sortBy"
            placeholder="Sort by"
            options={[
              { name: "none", value: null },
              { name: "Due / বকেয়া", value: "due" },
              { name: "amount / টাকার পরিমাণ", value: "amount" },
            ]}
          />
        </div>
      </FormModal>
    </div>
  );
}
