import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Card from "@/components/ui/Card";

type CardStoryArgs = ComponentProps<typeof Card> & {
  width: "sm" | "md" | "lg";
  padding: "sm" | "md" | "lg";
  layout: "default" | "withBadge" | "grid";
  showTitle: boolean;
  title: string;
  body: string;
  showFooter: boolean;
  footerText: string;
  balanceLabel: string;
  balanceValue: string;
  badgeText: string;
};

const widthClasses: Record<CardStoryArgs["width"], string> = {
  sm: "w-64",
  md: "w-80",
  lg: "w-96",
};

const paddingClasses: Record<CardStoryArgs["padding"], string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const footerPaddingClasses: Record<CardStoryArgs["padding"], string> = {
  sm: "px-4 py-3",
  md: "px-6 py-4",
  lg: "px-8 py-5",
};

const meta = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    layout: {
      control: "select",
      options: ["default", "withBadge", "grid"],
      description: "Content layout preset for the playground",
    },
    className: { table: { disable: true } },
    children: { table: { disable: true } },
  },
} satisfies Meta<CardStoryArgs>;

export default meta;
type Story = StoryObj<CardStoryArgs>;

export const Playground: Story = {
  args: {
    variant: "default",
    layout: "default",
    width: "md",
    padding: "md",
    showTitle: true,
    title: "Monthly Report",
    body: "A quick overview of your income and expenses.",
    showFooter: true,
    footerText: "Updated 2 hours ago",
    balanceLabel: "Balance",
    balanceValue: "€ 1.240,50",
    badgeText: "+4.2%",
  },
  argTypes: {
    layout: {
      control: "select",
      options: ["default", "withBadge", "grid"],
      description: "Switches the card content layout",
    },
    width: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
      description: "Card width preset",
    },
    padding: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
      description: "Inner padding preset",
    },
    showTitle: { control: "boolean", if: { arg: "layout", eq: "default" } },
    title: { control: "text", if: { arg: "layout", eq: "default" } },
    body: { control: "text", if: { arg: "layout", eq: "default" } },
    showFooter: { control: "boolean", if: { arg: "layout", eq: "default" } },
    footerText: { control: "text", if: { arg: "layout", eq: "default" } },
    balanceLabel: { control: "text", if: { arg: "layout", eq: "withBadge" } },
    balanceValue: { control: "text", if: { arg: "layout", eq: "withBadge" } },
    badgeText: { control: "text", if: { arg: "layout", eq: "withBadge" } },
  },
  render: ({
    layout,
    width,
    padding,
    showTitle,
    title,
    body,
    showFooter,
    footerText,
    balanceLabel,
    balanceValue,
    badgeText,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    className,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    children,
    ...cardArgs
  }) => {
    if (layout === "withBadge") {
      return (
        <Card
          {...cardArgs}
          className={`${paddingClasses[padding]} ${widthClasses[width]}`}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-slate-400">{balanceLabel}</div>
              <div className="text-2xl font-semibold text-slate-100">
                {balanceValue}
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300">
              {badgeText}
            </span>
          </div>
        </Card>
      );
    }

    if (layout === "grid") {
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card
            className={`${paddingClasses[padding]} ${widthClasses[width]}`}
            variant="default"
          >
            <div className="text-sm text-slate-400">Income</div>
            <div className="text-xl font-semibold text-slate-100">€ 3.200</div>
          </Card>
          <Card
            className={`${paddingClasses[padding]} ${widthClasses[width]}`}
            variant="default"
          >
            <div className="text-sm text-slate-400">Expenses</div>
            <div className="text-xl font-semibold text-slate-100">€ 1.950</div>
          </Card>
        </div>
      );
    }

    return (
      <Card {...cardArgs} className={widthClasses[width]}>
        <div className={paddingClasses[padding]}>
          {showTitle ? (
            <div className="text-base font-medium text-slate-100">{title}</div>
          ) : null}
          <div className="mt-2 text-sm text-slate-300">{body}</div>
        </div>
        {showFooter ? (
          <div
            className={`border-t border-slate-700 ${footerPaddingClasses[padding]} text-xs text-slate-400`}
          >
            {footerText}
          </div>
        ) : null}
      </Card>
    );
  },
};

export const Default: Story = {
  args: {
    className: "p-6 w-80",
    variant: "default",
    children: <div className="text-sm text-slate-200">Simple card content</div>,
  },
};

export const withBadge: Story = {
  args: {
    className: "p-6 w-96",
    variant: "elevated",
    children: (
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-400">Balance</div>
          <div className="text-2xl font-semibold text-slate-100">
            € 1.240,50
          </div>
        </div>
        <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300">
          +4.2%
        </span>
      </div>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    className: "w-96 p-0",
    variant: "elevated",
    children: (
      <>
        <div className="p-6">
          <div className="text-base font-medium text-slate-100">
            Monthly Report
          </div>
          <div className="mt-2 text-sm text-slate-300">
            A quick overview of your income and expenses.
          </div>
        </div>
        <div className="border-t border-slate-700 px-6 py-4 text-xs text-slate-400">
          Updated 2 hours ago
        </div>
      </>
    ),
  },
};

export const Grid: Story = {
  parameters: {
    layout: "padded",
  },
  args: {
    children: null,
  },
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card className="p-5" variant="default">
        <div className="text-sm text-slate-400">Income</div>
        <div className="text-xl font-semibold text-slate-100">€ 3.200</div>
      </Card>
      <Card className="p-5" variant="default">
        <div className="text-sm text-slate-400">Expenses</div>
        <div className="text-xl font-semibold text-slate-100">€ 1.950</div>
      </Card>
    </div>
  ),
};
