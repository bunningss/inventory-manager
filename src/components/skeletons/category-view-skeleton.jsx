import { CategoryboxSkeleton } from "./category-box-skeleton";

export function CategoryviewSkeleton() {
  return (
    <section>
      <div className="flex gap-4 overflow-hidden">
        <CategoryboxSkeleton />
        <CategoryboxSkeleton />
        <CategoryboxSkeleton />
        <CategoryboxSkeleton />
        <CategoryboxSkeleton />
        <CategoryboxSkeleton />
        <CategoryboxSkeleton />
      </div>
    </section>
  );
}
