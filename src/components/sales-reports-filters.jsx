"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { DatePickerWithRange } from "./date-range-picker";
import { Button } from "./ui/button";

export function SalesReportsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const createQueryString = (from, to) => {
    const params = new URLSearchParams(searchParams);
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
  };

  const handleThisWeek = () => {
    const today = new Date();
    const firstDayOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
    updateDateRange(firstDayOfWeek, lastDayOfWeek);
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
  };

  const handleThisYear = () => {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const lastDayOfYear = new Date(today.getFullYear(), 11, 31);
    updateDateRange(firstDayOfYear, lastDayOfYear);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="space-x-4">
        <Button onClick={handleToday}>Today</Button>
        <Button onClick={handleThisWeek}>This Week</Button>
        <Button onClick={handleThisMonth}>This Month</Button>
        <Button onClick={handleThisYear}>This Year</Button>
      </div>
      <DatePickerWithRange />
    </div>
  );
}
