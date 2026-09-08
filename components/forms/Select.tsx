import type { ComponentPropsWithoutRef } from "react";
import { Field, inputBaseClasses } from "./Field";
import { cn } from "@/lib/utils/cn";

export function Select({
  id,
  label,
  help,
  error,
  required,
  className,
  options,
  ...rest
}: {
  id: string;
  label: string;
  help?: string;
  error?: string;
  required?: boolean;
  options: ReadonlyArray<{ value: string; label: string }>;
} & Omit<ComponentPropsWithoutRef<"select">, "id">) {
  return (
    <Field
      id={id}
      label={label}
      help={help}
      error={error}
      required={required}
      className={className}
    >
      <select
        id={id}
        name={rest.name ?? id}
        required={required}
        aria-required={required || undefined}
        aria-invalid={Boolean(error) || undefined}
        className={cn(inputBaseClasses(Boolean(error)), "pr-10")}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
