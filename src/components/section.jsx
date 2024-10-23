import { cn } from "@/lib/utils";

export const Section = ({ children, className }) => {
  return <section className={cn("mt-6", className)}>{children}</section>;
};
