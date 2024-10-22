import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function Sidebar({
  children,
  footer,
  isOpen,
  onClose,
  title,
  subtitle,
}) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="h-full flex flex-col justify-between">
        <SheetHeader>
          <SheetTitle className="first-letter:capitalize">{title}</SheetTitle>
          <SheetDescription className="first-letter:capitalize">
            {subtitle}
          </SheetDescription>
        </SheetHeader>
        <div className="h-full overflow-y-auto mb-1">{children}</div>
        <SheetFooter>{footer}</SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
