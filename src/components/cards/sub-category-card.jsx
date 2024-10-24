import Image from "next/image";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { DeleteItem } from "../modals/delete";

export function SubCategoryCard({ subCategory }) {
  return (
    <Card title={subCategory?.name}>
      <CardContent className="flex items-center gap-2 p-1 md:p-1">
        <figure className="relative h-[100px] w-[120px]">
          <Image
            src={subCategory?.icon}
            alt={subCategory?.name}
            fill
            sizes="100px"
            className="object-contain"
          />
        </figure>
        <div className="py-0 px-1 w-full flex flex-col gap-1">
          <CardTitle className="capitalize font-bold text-base">
            {subCategory?.name}
          </CardTitle>
          <span className="text-muted-foreground">
            Category:{" "}
            <span className="font-bold text-foreground">
              {subCategory?.category?.label}
            </span>
          </span>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              Color Code:{" "}
              <span className="font-bold text-foreground">
                {subCategory?.color}
              </span>
            </span>
            <div className="space-x-2">
              <Button size="icon" className="rounded-full" icon="edit" />
              <DeleteItem
                requestUrl="categories/sub-categories"
                _id={subCategory?._id}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
