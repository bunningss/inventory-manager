import { useMenuSidebar } from "@/hooks/controllers";
import { MenuItem } from "./menu-item";
import { useEffect, useState } from "react";
import { getData } from "@/utils/api-calls";

export function CategoryMenu() {
  const [categories, setCategories] = useState([]);
  const menuSidebar = useMenuSidebar();

  useEffect(() => {
    const getCategories = async () => {
      const res = await getData("categories");
      setCategories(res.response?.payload);
    };

    getCategories();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <MenuItem
        onClick={menuSidebar.onClose}
        item={{ label: "all products", slug: "/shop", icon: "store" }}
      />
      {categories?.map((item, index) => (
        <MenuItem item={item} key={index} onClick={menuSidebar.onClose} />
      ))}
    </div>
  );
}
