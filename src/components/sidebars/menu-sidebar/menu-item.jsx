import { DynamicIcon } from "@/components/dynamic-icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function MenuItem({ item, onClick }) {
  return (
    <Link href={item?.slug ? item?.slug : "#"} passHref>
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={onClick}
      >
        {item?.label && <span>{item?.label}</span>}
        <DynamicIcon name={item?.icon} />
      </Button>
    </Link>
  );
}
