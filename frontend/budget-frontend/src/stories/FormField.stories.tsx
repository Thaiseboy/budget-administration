import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import FormField from "@/components/form/FormField";

// === META ===
const meta: Meta<typeof FormField> = {
  title: "Form/FormField",
  component: FormField,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;

// === PLAYGROUND (type selector) ===
type PlaygroundProps = {
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
  required: boolean;
  showDescription: boolean;
  description: string;
  // Password specific
  showPasswordToggle: boolean;
  // Textarea specific
  rows: number;
  // Select specific
  options: Array<{ value: string; label: string }>;
  // Checkbox/Radio specific
  checked: boolean;
  // Text input specific (prefix/suffix)
  showPrefix: boolean;
  prefixText: string;
  showSuffix: boolean;
  suffixText: string;
};

const defaultOptions = [
  { value: "basic", label: "Basic" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise" },
];

const PlaygroundPreview = (args: PlaygroundProps) => {
  const [value, setValue] = useState(args.value);
  const [checked, setChecked] = useState(Boolean(args.checked));
  const [prevArgs, setPrevArgs] = useState({
    value: args.value,
    type: args.type,
    checked: args.checked,
  });

  if (args.value !== prevArgs.value || args.type !== prevArgs.type) {
    setValue(args.value);
    setPrevArgs((prev) => ({ ...prev, value: args.value, type: args.type }));
  }

  if (args.checked !== prevArgs.checked || args.type !== prevArgs.type) {
    setChecked(Boolean(args.checked));
    setPrevArgs((prev) => ({
      ...prev,
      checked: args.checked,
      type: args.type,
    }));
  }

  const description = args.showDescription ? args.description : undefined;
  const prefix = args.showPrefix ? (
    <span className="text-slate-400">{args.prefixText}</span>
  ) : undefined;
  const suffix = args.showSuffix ? (
    <span className="text-slate-400">{args.suffixText}</span>
  ) : undefined;

  const baseProps = {
    id: args.id,
    name: args.name,
    label: args.label,
    description,
    required: args.required,
  };

  switch (args.type) {
    case "checkbox":
      return (
        <div className="max-w-md">
          <FormField
            {...baseProps}
            type="checkbox"
            value={args.value}
            checked={checked}
            onChange={setChecked}
          />
        </div>
      );

    case "radio":
      return (
        <div className="max-w-md">
          <FormField
            {...baseProps}
            type="radio"
            value={args.value}
            checked={checked}
            onChange={setChecked}
          />
        </div>
      );

    case "select": {
      const options = args.options?.length ? args.options : defaultOptions;
      const selectValue = value || options[0]?.value || "";
      return (
        <div className="max-w-md">
          <FormField
            {...baseProps}
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

    case "textarea":
      return (
        <div className="max-w-md">
          <FormField
            {...baseProps}
            type="textarea"
            value={value}
            rows={args.rows}
            placeholder={args.placeholder}
            onChange={setValue}
          />
        </div>
      );

    case "password":
      return (
        <div className="max-w-md">
          <FormField
            {...baseProps}
            type="password"
            value={value}
            placeholder={args.placeholder}
            showPasswordToggle={args.showPasswordToggle}
            onChange={setValue}
          />
        </div>
      );

    default:
      return (
        <div className="max-w-md">
          <FormField
            {...baseProps}
            type={args.type}
            value={value}
            placeholder={args.placeholder}
            prefix={prefix}
            suffix={suffix}
            onChange={setValue}
          />
        </div>
      );
  }
};

export const Playground: StoryObj<PlaygroundProps> = {
  args: {
    type: "text",
    id: "field-example",
    name: "field-example",
    label: "Field Label",
    placeholder: "Enter a value...",
    value: "",
    required: false,
    showDescription: true,
    description: "Helper text goes here.",
    // Password
    showPasswordToggle: true,
    // Textarea
    rows: 3,
    // Select
    options: defaultOptions,
    // Checkbox/Radio
    checked: false,
    // Prefix/Suffix
    showPrefix: false,
    prefixText: "$",
    showSuffix: false,
    suffixText: "kg",
  },
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
      name: "Type",
    },
    id: { control: "text", name: "ID" },
    name: { control: "text", name: "Name" },
    label: { control: "text", name: "Label" },
    placeholder: {
      control: "text",
      name: "Placeholder",
      if: { arg: "type", neq: "checkbox" },
    },
    value: {
      control: "text",
      name: "Value",
      if: { arg: "type", neq: "checkbox" },
    },
    required: { control: "boolean", name: "Required" },
    showDescription: {
      control: "boolean",
      name: "Show Description",
      if: { arg: "type", neq: "checkbox" },
    },
    description: {
      control: "text",
      name: "Description",
      if: { arg: "showDescription", truthy: true },
    },
    // Password specific
    showPasswordToggle: {
      control: "boolean",
      name: "Show Password Toggle",
      if: { arg: "type", eq: "password" },
    },
    // Textarea specific
    rows: {
      control: { type: "number", min: 2, max: 10 },
      name: "Rows",
      if: { arg: "type", eq: "textarea" },
    },
    // Select specific
    options: {
      control: "object",
      name: "Options",
      if: { arg: "type", eq: "select" },
    },
    // Checkbox/Radio specific
    checked: {
      control: "boolean",
      name: "Checked",
      if: { arg: "type", eq: "checkbox" },
    },
    // Prefix/Suffix (text inputs only)
    showPrefix: {
      control: "boolean",
      name: "Show Prefix",
      if: { arg: "type", eq: "text" },
    },
    prefixText: {
      control: "text",
      name: "Prefix Text",
      if: { arg: "showPrefix", truthy: true },
    },
    showSuffix: {
      control: "boolean",
      name: "Show Suffix",
      if: { arg: "type", eq: "text" },
    },
    suffixText: {
      control: "text",
      name: "Suffix Text",
      if: { arg: "showSuffix", truthy: true },
    },
  },
  render: (args: PlaygroundProps) => <PlaygroundPreview {...args} />,
};

// === TEXT INPUT ===
export const Text: StoryObj<PlaygroundProps> = {
  args: {
    type: "text",
    id: "text-example",
    name: "text-example",
    label: "Full Name",
    placeholder: "Enter your name...",
    value: "",
    required: false,
    showDescription: true,
    description: "Your full legal name",
  },
  render: (args: PlaygroundProps) => <PlaygroundPreview {...args} />,
};

// === EMAIL INPUT ===
export const Email: StoryObj<PlaygroundProps> = {
  args: {
    type: "email",
    id: "email-example",
    name: "email-example",
    label: "Email Address",
    placeholder: "you@example.com",
    value: "",
    required: false,
    showDescription: true,
    description: "We'll never share your email",
  },
  render: (args: PlaygroundProps) => <PlaygroundPreview {...args} />,
};

// === PASSWORD INPUT ===
export const Password: StoryObj<PlaygroundProps> = {
  args: {
    type: "password",
    id: "password-example",
    name: "password-example",
    label: "Password",
    placeholder: "Enter password...",
    value: "",
    required: false,
    showDescription: true,
    description: "Minimum 8 characters",
    showPasswordToggle: true,
  },
  render: (args: PlaygroundProps) => <PlaygroundPreview {...args} />,
};

// === NUMBER INPUT ===
export const Number: StoryObj<PlaygroundProps> = {
  args: {
    type: "number",
    id: "number-example",
    name: "number-example",
    label: "Quantity",
    placeholder: "0",
    value: "",
    required: false,
    showDescription: true,
    description: "Enter a number",
  },
  render: (args: PlaygroundProps) => <PlaygroundPreview {...args} />,
};

// === DATE INPUT ===
export const Date: StoryObj<PlaygroundProps> = {
  args: {
    type: "date",
    id: "date-example",
    name: "date-example",
    label: "Date of Birth",
    placeholder: "",
    value: "",
    required: false,
    showDescription: true,
    description: "Select your birth date",
  },
  render: (args: PlaygroundProps) => <PlaygroundPreview {...args} />,
};

// === TIME INPUT ===
export const Time: StoryObj<PlaygroundProps> = {
  args: {
    type: "time",
    id: "time-example",
    name: "time-example",
    label: "Appointment Time",
    placeholder: "",
    value: "",
    required: false,
    showDescription: true,
    description: "Select a time",
  },
  render: (args: PlaygroundProps) => <PlaygroundPreview {...args} />,
};

// === URL INPUT ===
export const Url: StoryObj<PlaygroundProps> = {
  args: {
    type: "url",
    id: "url-example",
    name: "url-example",
    label: "Website",
    placeholder: "https://example.com",
    value: "",
    required: false,
    showDescription: true,
    description: "Enter a valid URL",
  },
  render: (args: PlaygroundProps) => <PlaygroundPreview {...args} />,
};

// === TEL INPUT ===
export const Tel: StoryObj<PlaygroundProps> = {
  args: {
    type: "tel",
    id: "tel-example",
    name: "tel-example",
    label: "Phone Number",
    placeholder: "+31 6 12345678",
    value: "",
    required: false,
    showDescription: true,
    description: "Include country code",
  },
  render: (args: PlaygroundProps) => <PlaygroundPreview {...args} />,
};

// === SEARCH INPUT ===
export const Search: StoryObj<PlaygroundProps> = {
  args: {
    type: "search",
    id: "search-example",
    name: "search-example",
    label: "Search",
    placeholder: "Search...",
    value: "",
    required: false,
    showDescription: false,
  },
  render: (args: PlaygroundProps) => <PlaygroundPreview {...args} />,
};

// === TEXTAREA ===
export const Textarea: StoryObj<PlaygroundProps> = {
  args: {
    type: "textarea",
    id: "textarea-example",
    name: "textarea-example",
    label: "Message",
    placeholder: "Write your message...",
    value: "",
    required: false,
    showDescription: true,
    description: "Maximum 500 characters",
    rows: 4,
  },
  render: (args: PlaygroundProps) => <PlaygroundPreview {...args} />,
};

// === SELECT ===
export const Select: StoryObj<PlaygroundProps> = {
  args: {
    type: "select",
    id: "select-example",
    name: "select-example",
    label: "Plan",
    value: "",
    required: false,
    showDescription: true,
    description: "Choose your subscription plan",
    options: defaultOptions,
  },
  render: (args: PlaygroundProps) => <PlaygroundPreview {...args} />,
};

// === CHECKBOX ===
export const Checkbox: StoryObj<PlaygroundProps> = {
  args: {
    type: "checkbox",
    id: "checkbox-example",
    name: "checkbox-example",
    label: "I agree to the terms and conditions",
    value: "agreed",
    checked: false,
    required: false,
  },
  render: (args: PlaygroundProps) => <PlaygroundPreview {...args} />,
};

// === RADIO ===
export const Radio: StoryObj<PlaygroundProps> = {
  args: {
    type: "radio",
    id: "radio-example",
    name: "radio-example",
    label: "Option 1",
    value: "option-1",
    checked: false,
    required: false,
  },
  render: (args: PlaygroundProps) => <PlaygroundPreview {...args} />,
};
