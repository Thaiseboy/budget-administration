import type { Meta, StoryObj } from '@storybook/react-vite'
import Card from '@/components/ui/Card'

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Extra utility classes for the card container',
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    className: 'p-6 w-80',
    children: <div className="text-sm text-slate-200">Simple card content</div>,
  },
}

export const WithHeader: Story = {
  args: {
    className: 'p-6 w-96',
    children: (
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-400">Balance</div>
          <div className="text-2xl font-semibold text-white">€ 1.240,50</div>
        </div>
        <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300">
          +4.2%
        </span>
      </div>
    ),
  },
}

export const WithFooter: Story = {
  args: {
    className: 'w-96 p-0',
    children: (
      <>
        <div className="p-6">
          <div className="text-base font-medium text-white">Monthly Report</div>
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
}

export const Grid: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card className="p-5">
        <div className="text-sm text-slate-400">Income</div>
        <div className="text-xl font-semibold text-white">€ 3.200</div>
      </Card>
      <Card className="p-5">
        <div className="text-sm text-slate-400">Expenses</div>
        <div className="text-xl font-semibold text-white">€ 1.950</div>
      </Card>
    </div>
  ),
}
