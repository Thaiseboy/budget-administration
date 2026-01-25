import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import ConfirmDialog from "./ConfirmDialog";
import Button from "../Button";

const meta = {
  title: "UI/ConfirmDialog",
  component: ConfirmDialog,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: {
        inline: false,
        iframeHeight: 520,
      },
    },
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    isOpen: true,
    title: "Delete transaction?",
    message: "This action cannot be undone.",
    confirmText: "Delete",
    cancelText: "Cancel",
    variant: "danger",
    isLoading: false,
    onClose: () => {},
    onConfirm: () => {},
  },
};

export const WithTrigger: Story = {
  args: {
    isOpen: false,
    title: "Archive report?",
    message: "You can restore it later from the archive.",
    confirmText: "Archive",
    cancelText: "Cancel",
    variant: "info",
    isLoading: false,
    onClose: () => {},
    onConfirm: () => {},
  },
  parameters: {
    controls: {
      exclude: ["isOpen"],
    },
  },
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <div className="flex mt-6 items-center justify-center">
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open dialog
        </Button>
        <ConfirmDialog
          {...args}
          isOpen={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        />
      </div>
    );
  },
};
