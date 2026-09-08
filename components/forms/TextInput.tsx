import type { ComponentPropsWithoutRef } from "react";
import { Field, inputBaseClasses } from "./Field";

/**
 * Single-line text input with built-in label / error wiring. If you need
 * a textarea, use `<Textarea>`; for checkboxes, `<Checkbox>`.
 */
export function TextInput({
  id,
  label,
  help,
  error,
  required,
  labelHidden,
  className,
  ...rest
}: {
  id: string;
  label: string;
  help?: string;
  error?: string;
  required?: boolean;
  labelHidden?: boolean;
} & Omit<ComponentPropsWithoutRef<"input">, "id">) {
  return (
    <Field
      id={id}
      label={label}
      help={help}
      error={error}
      required={required}
      labelHidden={labelHidden}
      className={className}
    >
      <input
        id={id}
        name={rest.name ?? id}
        required={required}
        aria-required={required || undefined}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={
          [help ? `${id}-help` : null, error ? `${id}-error` : null]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={inputBaseClasses(Boolean(error))}
        {...rest}
      />
    </Field>
  );
}
