import { cn } from "@/lib/utils";

export function Block({ children, className, title, headerContent }) {
  return (
    <section className="bg-secondary rounded-md px-4 py-8">
      {/* Block Heading */}
      <div className="flex items-center justify-between">
        <h3 className="capitalize before:content-[''] relative text-lg font-semibold before:absolute before:-left-4 before:top-0 before:bottom-0 before:m-auto before:h-7 before:w-1 before:rounded-tr-md before:rounded-br-md before:bg-primary lg:before:h-8">
          {title}
        </h3>
        {headerContent && <div>{headerContent}</div>}
      </div>

      {/* Block content */}
      {children && <div className={cn("mt-6", className)}>{children}</div>}
    </section>
  );
}
