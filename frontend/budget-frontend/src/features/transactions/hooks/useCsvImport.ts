import { useRef, useState } from "react";
import { createTransaction } from "../../../api/transactions";
import { useToast } from "../../../components/feedback/ToastContext";
import { normalizeCategory } from "../../../utils/categories";
import { parseCsv } from "../../../utils/csv";
import type { Transaction } from "../../../types";
import type { ImportPreview } from "../types";

type UseCsvImportArgs = {
  onCreated: (transaction: Transaction) => void;
};

function parseAmount(raw: string): number {
  const trimmed = raw.trim();
  if (!trimmed) return Number.NaN;
  const normalized =
    trimmed.includes(",") && !trimmed.includes(".")
      ? trimmed.replace(",", ".")
      : trimmed;
  return Number(normalized);
}

export function useCsvImport({ onCreated }: UseCsvImportArgs) {
  const toast = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImportCsv(file: File) {
    setIsImporting(true);
    try {
      const text = await file.text();
      const rows = parseCsv(text);

      if (rows.length === 0) {
        toast.error("CSV is empty");
        return;
      }

      const [header, ...dataRows] = rows;
      const headerMap = header.map((h) => h.trim().toLowerCase());
      const dateIdx = headerMap.indexOf("date");
      const typeIdx = headerMap.indexOf("type");
      const categoryIdx = headerMap.indexOf("category");
      const amountIdx = headerMap.indexOf("amount");
      const descriptionIdx = headerMap.indexOf("description");

      if ([dateIdx, typeIdx, categoryIdx, amountIdx, descriptionIdx].some((i) => i < 0)) {
        toast.error("CSV header is missing required columns");
        return;
      }

      const rowsWithData = dataRows
        .map((row, i) => ({ row, rowNumber: i + 2 }))
        .filter(({ row }) => row.some((cell) => (cell ?? "").trim() !== ""));

      if (rowsWithData.length === 0) {
        toast.error("CSV has no data rows");
        return;
      }

      const parsed = rowsWithData.map(({ row, rowNumber }) => {
        const date = (row[dateIdx] ?? "").trim();
        const typeRaw = (row[typeIdx] ?? "").trim().toLowerCase();
        const amount = parseAmount(String(row[amountIdx] ?? ""));
        const category = normalizeCategory(row[categoryIdx]);
        const description = (row[descriptionIdx] ?? "").trim();

        return {
          rowNumber,
          date,
          type: typeRaw as "income" | "expense",
          amount,
          category,
          description,
        };
      });

      const invalidRows = parsed.filter(
        (t) =>
          !t.date ||
          (t.type !== "income" && t.type !== "expense") ||
          !Number.isFinite(t.amount)
      );

      if (invalidRows.length > 0) {
        const rowList = invalidRows
          .slice(0, 5)
          .map((t) => t.rowNumber)
          .join(", ");
        const suffix = invalidRows.length > 5 ? "..." : "";
        toast.error(`Invalid CSV rows: ${rowList}${suffix}`);
        return;
      }

      setImportPreview({
        fileName: file.name,
        rows: parsed,
      });
    } catch (err) {
      toast.error("Failed to import CSV");
      console.error(err);
    } finally {
      setIsImporting(false);
    }
  }

  async function handleConfirmImport() {
    if (!importPreview) return;
    setIsImporting(true);
    try {
      const created = await Promise.all(
        importPreview.rows.map(({ rowNumber, ...payload }) => createTransaction(payload))
      );

      created.forEach((t) => onCreated(t));
      toast.success(`Imported ${created.length} transaction(s)`);
      setImportPreview(null);
    } catch (err) {
      toast.error("Failed to import CSV");
      console.error(err);
    } finally {
      setIsImporting(false);
    }
  }

  return {
    fileInputRef,
    importPreview,
    isImporting,
    handleImportCsv,
    handleConfirmImport,
    clearImportPreview: () => setImportPreview(null),
  };
}
