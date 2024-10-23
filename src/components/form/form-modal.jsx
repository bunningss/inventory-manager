"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

export function FormModal({
  form,
  onSubmit,
  children,
  formLabel,
  icon,
  loading,
  disabled,
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {children}
        <Button
          icon={icon}
          type="submit"
          className="w-full"
          loading={loading}
          disabled={disabled}
        >
          {formLabel}
        </Button>
      </form>
    </Form>
  );
}
