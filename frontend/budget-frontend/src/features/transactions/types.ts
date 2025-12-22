export type TypeFilter = "all" | "income" | "expense";

export type ImportPreviewRow = {
  rowNumber: number;
  date: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
};

export type ImportPreview = {
  fileName: string;
  rows: ImportPreviewRow[];
};
