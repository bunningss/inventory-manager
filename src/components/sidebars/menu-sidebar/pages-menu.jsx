import { useMenuSidebar } from "@/hooks/controllers";
import { pagesData } from "@/lib/static";
import { MenuItem } from "./menu-item";

export function PagesMenu() {
  const menuSidebar = useMenuSidebar();

  return (
    <div className="flex flex-col gap-2">
      {pagesData?.map((item, index) => (
        <MenuItem item={item} key={index} onClick={menuSidebar.onClose} />
      ))}
    </div>
  );
}
