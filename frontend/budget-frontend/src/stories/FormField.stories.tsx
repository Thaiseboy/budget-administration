import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import FormField from "@/components/form/FormField";

type FormFieldStoryArgs = {
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "time"
    | "url"
    | "tel"
    | "search"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio";
  id: string;
  name: string;
  label: string;
  placeholder: string;
  value: string;
  checked: boolean;
  rows: number;
  required: boolean;
  showDescription: boolean;
  description: string;
  options: Array<{ value: string; label: string }>;
  showPasswordToggle: boolean;
  showPrefix: boolean;
  showSuffix: boolean;
  prefixText: string;
  suffixText: string;
};

const defaultOptions = [
  { value: "basic", label: "Basic" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise" },
];

const meta = {
  title: "Form/FormField",
  component: FormField,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: [
        "text",
        "email",
        "password",
        "number",
        "date",
        "time",
        "url",
        "tel",
        "search",
        "textarea",
        "select",
        "checkbox",
        "radio",
      ],
    },
    placeholder: { control: "text" },
    value: { control: "text", description: "Text/select/textarea value" },
    checked: {
      control: "boolean",
      description: "Checkbox/radio checked state",
    },
    rows: {
      control: { type: "number", min: 2, max: 8 },
      if: { arg: "type", eq: "textarea" },
    },
    options: { control: "object", if: { arg: "type", eq: "select" } },
    required: { control: "boolean" },
    showDescription: { control: "boolean" },
    description: { control: "text", if: { arg: "showDescription", eq: true } },
    showPasswordToggle: {
      control: "boolean",
      if: { arg: "type", eq: "password" },
    },
    showPrefix: { control: "boolean", description: "Text inputs only" },
    showSuffix: { control: "boolean", description: "Text inputs only" },
    prefixText: { control: "text", if: { arg: "showPrefix", eq: true } },
    suffixText: { control: "text", if: { arg: "showSuffix", eq: true } },
  },
} satisfies Meta<FormFieldStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

function FormFieldPreview(args: FormFieldStoryArgs) {
  const [value, setValue] = useState(args.value);
  const [checked, setChecked] = useState(Boolean(args.checked));

  useEffect(() => {
    setValue(args.value);
  }, [args.value, args.type]);

  useEffect(() => {
    setChecked(Boolean(args.checked));
  }, [args.checked, args.type]);

  const description = args.showDescription ? args.description : undefined;
  const prefix = args.showPrefix ? (
    <span className="text-slate-400">{args.prefixText}</span>
  ) : undefined;
  const suffix = args.showSuffix ? (
    <span className="text-slate-400">{args.suffixText}</span>
  ) : undefined;

  const commonProps = {
    id: args.id,
    name: args.name,
    label: args.label,
    description,
    required: args.required,
  };

  if (args.type === "checkbox" || args.type === "radio") {
    return (
      <div className="max-w-md">
        <FormField
          {...commonProps}
          type={args.type}
          value={args.value}
          checked={checked}
          onChange={setChecked}
        />
      </div>
    );
  }

  if (args.type === "select") {
    const options = args.options?.length ? args.options : defaultOptions;
    const selectValue = value || options[0]?.value || "";
    return (
      <div className="max-w-md">
        <FormField
          {...commonProps}
          type="select"
          value={selectValue}
          onChange={setValue}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </FormField>
      </div>
    );
  }

  if (args.type === "textarea") {
    return (
      <div className="max-w-md">
        <FormField
          {...commonProps}
          type="textarea"
          value={value}
          rows={args.rows}
          placeholder={args.placeholder}
          onChange={setValue}
        />
      </div>
    );
  }

  return (
    <div className="max-w-md">
      <FormField
        {...commonProps}
        type={args.type}
        value={value}
        placeholder={args.placeholder}
        showPasswordToggle={args.showPasswordToggle}
        prefix={prefix}
        suffix={suffix}
        onChange={setValue}
      />
    </div>
  );
}

const baseArgs = {
  id: "field-example",
  name: "field-example",
  label: "Field label",
  value: "",
  required: false,
  showDescription: true,
  description: "Helper text goes here.",
};

export const TextInput: Story = {
  args: {
    ...baseArgs,
    type: "text",
    placeholder: "Enter a value...",
    showPrefix: false,
    showSuffix: false,
    prefixText: "$",
    suffixText: "kg",
  },
  parameters: {
    controls: {
      include: [
        "label",
        "placeholder",
        "value",
        "required",
        "showDescription",
        "description",
        "showPrefix",
        "prefixText",
        "showSuffix",
        "suffixText",
      ],
    },
  },
  render: (args) => <FormFieldPreview {...args} />,
};

export const PasswordInput: Story = {
  args: {
    ...baseArgs,
    type: "password",
    placeholder: "Enter password...",
    showPasswordToggle: true,
  },
  parameters: {
    controls: {
      include: [
        "label",
        "placeholder",
        "value",
        "required",
        "showDescription",
        "description",
        "showPasswordToggle",
      ],
    },
  },
  render: (args) => <FormFieldPreview {...args} />,
};

export const Textarea: Story = {
  args: {
    ...baseArgs,
    type: "textarea",
    placeholder: "Write something...",
    rows: 3,
  },
  parameters: {
    controls: {
      include: [
        "label",
        "placeholder",
        "value",
        "rows",
        "required",
        "showDescription",
        "description",
      ],
    },
  },
  render: (args) => <FormFieldPreview {...args} />,
};

export const Select: Story = {
  args: {
    ...baseArgs,
    type: "select",
    value: "basic",
    options: defaultOptions,
  },
  parameters: {
    controls: {
      include: [
        "label",
        "value",
        "options",
        "required",
        "showDescription",
        "description",
      ],
    },
  },
  render: (args) => <FormFieldPreview {...args} />,
};

export const Checkbox: Story = {
  args: {
    ...baseArgs,
    type: "checkbox",
    checked: false,
  },
  parameters: {
    controls: {
      include: [
        "label",
        "checked",
        "required",
        "showDescription",
        "description",
      ],
    },
  },
  render: (args) => <FormFieldPreview {...args} />,
};

export const Radio: Story = {
  args: {
    ...baseArgs,
    type: "radio",
    value: "option-1",
    checked: false,
  },
  parameters: {
    controls: {
      include: [
        "label",
        "value",
        "checked",
        "required",
        "showDescription",
        "description",
      ],
    },
  },
  render: (args) => <FormFieldPreview {...args} />,
};
