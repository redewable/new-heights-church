import type { ComponentPropsWithoutRef } from "react";
import { Field, inputBaseClasses } from "./Field";
import { cn } from "@/lib/utils/cn";

export function Textarea({
  id,
  label,
  help,
  error,
  required,
  rows = 5,
  className,
  ...rest
}: {
  id: string;
  label: string;
  help?: string;
  error?: string;
  required?: boolean;
  rows?: number;
} & Omit<ComponentPropsWithoutRef<"textarea">, "id" | "rows">) {
  return (
    <Field
      id={id}
      label={label}
      help={help}
      error={error}
      required={required}
      className={className}
    >
      <textarea
        id={id}
        name={rest.name ?? id}
        required={required}
        aria-required={required || undefined}
        aria-invalid={Boolean(error) || undefined}
        rows={rows}
        className={cn(inputBaseClasses(Boolean(error)), "resize-y")}
        {...rest}
      />
    </Field>
  );
}
