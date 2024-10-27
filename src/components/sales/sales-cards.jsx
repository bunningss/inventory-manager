"use client";

import { useState, useCallback, useEffect } from "react";
import { CardView } from "../card-view";
import { Input } from "../ui/input";
import { SalesReportCard } from "./sales-report-card";

export function SalesCards({ data }) {
  const [sales, setSales] = useState(data);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSales(data);
  }, [data]);

  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query);
      if (query.trim() === "") {
        setSales(data);
      } else {
        const filteredSales = data.filter((item) =>
          item.saleId?.toLowerCase().includes(query?.toLowerCase())
        );
        setSales(filteredSales);
      }
    },
    [data]
  );

  return (
    <div className="space-y-4 mt-4">
      <Input
        placeholder="Search by ID..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <CardView>
        {sales.map((item, index) => (
          <SalesReportCard key={item._id || index} item={item} />
        ))}
      </CardView>
    </div>
  );
}
