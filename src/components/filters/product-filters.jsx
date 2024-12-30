"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormModal } from "../form/form-modal";
import { FormInput } from "../form/form-input";
import { FormSelect } from "../form/form-select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

const formSchema = z.object({
  searchKey: z.string().optional().nullable(),
  sortBy: z
    .enum(["name", "price", "stock", "sold", "discount"])
    .optional()
    .or(z.literal("")),
});

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchKey: "",
      sortBy: "",
    },
  });

  const handleSubmit = useCallback(
    (data) => {
      const params = new URLSearchParams(searchParams);
      params.set("searchKey", data.searchKey || "");
      params.set("sortBy", data.sortBy || "");
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const handleClear = useCallback(() => {
    form.reset({
      searchKey: "",
      sortBy: "",
    });

    router.push(`${pathname}`);
  }, [form, router, pathname]);

  return (
    <div className="space-y-2">
      <FormModal form={form} formLabel="search" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            form={form}
            name="searchKey"
            placeholder="Product Name / পণ্যের নাম"
          />
          <FormSelect
            form={form}
            name="sortBy"
            placeholder="Sort by"
            options={[
              { name: "none", value: null },
              { name: "Price (High to Low)", value: "price" },
              { name: "Price (Low to High)", value: "discount" },
              { name: "Name (A - Z)", value: "name" },
              { name: "Stock (Low to High)", value: "stock" },
              { name: "Sales (High to Low)", value: "sold" },
            ]}
            defaultValue={searchParams.get("sortBy") || ""}
          />
        </div>
      </FormModal>
      <Button variant="destructive" icon="delete" onClick={handleClear}>
        Clear
      </Button>
    </div>
  );
}
