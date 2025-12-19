import FormField from "./FormField";

type FieldConfig = {
  type?: "text" | "email" | "password" | "number" | "date" | "time" | "url" | "tel" | "search" | "textarea" | "checkbox" | "radio" | "select";
  name: string;
  id?: string;
  label?: string;
  value?: string;
  checked?: boolean;
  required?: boolean;
  placeholder?: string;
  description?: string;
  step?: string;
  rows?: number;
  min?: string | number;
  max?: string | number;
  wrapperClass?: string;
  labelClass?: string;
  inputClass?: string;
  options?: Array<{ value: string; label: string }>;
  onChange?: (value: string | boolean) => void;
};

interface FormFieldGroupProps {
  fields: FieldConfig[];
  formData?: Record<string, unknown>;
  onFieldChange?: (name: string, value: string | boolean) => void;
}

export default function FormFieldGroup({
  fields,
  formData = {},
  onFieldChange,
}: FormFieldGroupProps) {
  const handleChange = (name: string, value: string | boolean) => {
    if (onFieldChange) {
      onFieldChange(name, value);
    }
  };

  return (
    <>
      {fields.map((field) => {
        const {
          type = "text",
          name,
          id = name,
          options,
          onChange,
          value: configValue,
          checked: configChecked,
          ...restProps
        } = field;

        const {
          label,
          required,
          description,
          wrapperClass,
          labelClass,
          inputClass,
          placeholder,
          step,
          rows,
          min,
          max,
        } = restProps;

        const commonProps = {
          label,
          required,
          description,
          wrapperClass,
          labelClass,
          inputClass,
        };

        if (type === "checkbox" || type === "radio") {
          const checked = Boolean(configChecked ?? formData[name] ?? false);
          return (
            <FormField
              key={id}
              type={type}
              id={id}
              name={name}
              checked={checked}
              onChange={(newChecked) => {
                onChange?.(newChecked);
                handleChange(name, newChecked);
              }}
              {...commonProps}
            />
          );
        }

        if (type === "select" && options) {
          const value = String(configValue ?? formData[name] ?? "");
          return (
            <FormField
              key={id}
              value={value}
              onChange={(newValue) => {
                onChange?.(newValue);
                handleChange(name, newValue);
              }}
              {...commonProps}
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </FormField>
          );
        }

        if (type === "textarea") {
          const value = String(configValue ?? formData[name] ?? "");
          return (
            <FormField
              key={id}
              type="textarea"
              id={id}
              name={name}
              value={value}
              rows={rows}
              placeholder={placeholder}
              onChange={(newValue) => {
                onChange?.(newValue);
                handleChange(name, newValue);
              }}
              {...commonProps}
            />
          );
        }

        // Default: Text inputs (type narrowing for TypeScript)
        const value = String(configValue ?? formData[name] ?? "");
        const inputType = type as "text" | "email" | "password" | "number" | "date" | "time" | "url" | "tel" | "search";
        return (
          <FormField
            key={id}
            type={inputType}
            id={id}
            name={name}
            value={value}
            step={step}
            placeholder={placeholder}
            min={min}
            max={max}
            onChange={(newValue) => {
              onChange?.(newValue);
              handleChange(name, newValue);
            }}
            {...commonProps}
          />
        );
      })}
    </>
  );
}
