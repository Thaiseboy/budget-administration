import { ReactNode } from "react";

interface BaseFormFieldProps {
  label?: string;
  required?: boolean;
  description?: string;
  wrapperClass?: string;
  labelClass?: string;
  inputClass?: string;
  id?: string;
  name?: string;
}

interface TextInputProps extends BaseFormFieldProps {
  type?: "text" | "email" | "password" | "number" | "date" | "time" | "url" | "tel" | "search";
  value: string;
  onChange: (value: string) => void;
  checked?: never;
  step?: string;
  placeholder?: string;
  min?: string | number;
  max?: string | number;
  children?: never;
  rows?: never;
}

interface TextareaProps extends BaseFormFieldProps {
  type: "textarea";
  value: string;
  onChange: (value: string) => void;
  checked?: never;
  rows?: number;
  placeholder?: string;
  step?: never;
  min?: never;
  max?: never;
  children?: never;
}

interface SelectProps extends BaseFormFieldProps {
  type?: "select";
  value: string;
  onChange: (value: string) => void;
  checked?: never;
  children: ReactNode;
  step?: never;
  placeholder?: never;
  min?: never;
  max?: never;
  rows?: never;
}

interface CheckboxRadioProps extends BaseFormFieldProps {
  type: "checkbox" | "radio";
  value?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children?: never;
  step?: never;
  placeholder?: never;
  min?: never;
  max?: never;
  rows?: never;
}

type FormFieldProps = TextInputProps | TextareaProps | SelectProps | CheckboxRadioProps;

export default function FormField(props: FormFieldProps) {
  const {
    label,
    type = "text",
    required = false,
    description,
    wrapperClass = "",
    labelClass = "",
    inputClass = "",
    id,
    name,
  } = props;

  const baseInputClassName = "mt-1 w-full rounded-lg border px-3 py-2";
  const checkboxRadioClassName = "rounded border-gray-300";

  const getInputClassName = () => {
    if (type === "checkbox" || type === "radio") {
      return inputClass ? `${checkboxRadioClassName} ${inputClass}` : checkboxRadioClassName;
    }
    return inputClass ? `${baseInputClassName} ${inputClass}` : baseInputClassName;
  };

  const finalInputClassName = getInputClassName();

  const renderInput = () => {
    if (type === "checkbox") {
      const { checked, onChange, value } = props as CheckboxRadioProps;
      return (
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          value={value}
          onChange={(e) => onChange(e.target.checked)}
          required={required}
          className={finalInputClassName}
        />
      );
    }

    if (type === "radio") {
      const { checked, onChange, value } = props as CheckboxRadioProps;
      return (
        <input
          id={id}
          name={name}
          type="radio"
          checked={checked}
          value={value}
          onChange={(e) => onChange(e.target.checked)}
          required={required}
          className={finalInputClassName}
        />
      );
    }

    if (props.children) {
      const { value, onChange, children } = props as SelectProps;
      return (
        <select
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={finalInputClassName}
        >
          {children}
        </select>
      );
    }

    if (type === "textarea") {
      const { value, onChange, rows = 3, placeholder } = props as TextareaProps;
      return (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          rows={rows}
          placeholder={placeholder}
          className={finalInputClassName}
        />
      );
    }

    // Default input
    const { value, onChange, step, placeholder, min, max } = props as TextInputProps;
    return (
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        step={step}
        placeholder={placeholder}
        min={min}
        max={max}
        className={finalInputClassName}
      />
    );
  };

  // Other layout for checkbox and radio
  if (type === "checkbox" || type === "radio") {
    return (
      <div className={wrapperClass || "flex items-center"}>
        {renderInput()}
        {label && (
          <label
            htmlFor={id}
            className={labelClass || "ml-2 text-sm font-medium"}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        {description && (
          <small className="block mt-1 text-sm text-gray-500 ml-6">
            {description}
          </small>
        )}
      </div>
    );
  }

  // Normale layout voor andere inputs
  return (
    <div className={wrapperClass}>
      {label && (
        <label
          htmlFor={id}
          className={labelClass || "block text-sm font-medium"}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {renderInput()}

      {description && (
        <small className="block mt-1 text-sm text-gray-500">
          {description}
        </small>
      )}
    </div>
  );
}
