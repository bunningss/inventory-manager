"use client";

import { useMenuSidebar } from "@/hooks/controllers";
import { Sidebar } from "../sidebar";
import { useState } from "react";
import { CategoryMenu } from "./category-menu";
import { PagesMenu } from "./pages-menu";

export function MenuSidebar() {
  const [selected, setSelected] = useState("categories");
  const menuSidebar = useMenuSidebar();

  return (
    <Sidebar
      isOpen={menuSidebar.isOpen}
      onClose={menuSidebar.onClose}
      title="menu"
      subtitle="browse our collection"
    >
      <div>
        {/* Header */}
        <div className="grid grid-cols-2">
          <div
            role="button"
            onClick={() => setSelected("categories")}
            className={`p-2 rounded-tl-md rounded-bl-md border border-shade border-r-0 transition-colors duration-300 ${
              selected === "categories" ? "bg-accent" : ""
            }`}
          >
            <h3 className="text-sm font-semibold text-center uppercase">
              categories
            </h3>
          </div>
          <div
            role="button"
            onClick={() => setSelected("pages")}
            className={`p-2 rounded-tr-md rounded-br-md border border-shade transition-colors duration-300 ${
              selected === "pages" ? "bg-accent" : ""
            }`}
          >
            <h3 className="text-sm font-semibold text-center uppercase">
              browse
            </h3>
          </div>
        </div>
        {/* Content */}
        <div className="mt-4">
          {selected === "categories" && <CategoryMenu />}
          {selected === "pages" && <PagesMenu />}
        </div>
      </div>
    </Sidebar>
  );
}
