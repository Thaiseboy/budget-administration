import { Button } from "@/components/ui";
import type { ImportPreview } from "../types";

type ImportCsvPreviewModalProps = {
  preview: ImportPreview;
  isImporting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ImportCsvPreviewModal({
  preview,
  isImporting,
  onCancel,
  onConfirm,
}: ImportCsvPreviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close dialog"
        onClick={onCancel}
      />

      <div className="relative z-10 w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-800 shadow-xl">
        <div className="p-5">
          <h2 className="text-base font-semibold text-slate-100">Preview import</h2>
          <p className="mt-1 text-sm text-slate-300">
            File: {preview.fileName} - {preview.rows.length} rows
          </p>

          <div className="mt-4 max-h-[50vh] overflow-auto rounded-lg border border-slate-700">
            <table className="w-full text-sm text-slate-200">
              <thead className="sticky top-0 bg-slate-700 text-slate-200">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                    Row
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                    Date
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                    Type
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                    Category
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {preview.rows.slice(0, 20).map((row) => (
                  <tr key={row.rowNumber} className="border-t border-slate-700">
                    <td className="px-3 py-2 text-slate-400">{row.rowNumber}</td>
                    <td className="px-3 py-2">{row.date}</td>
                    <td className="px-3 py-2 capitalize">{row.type}</td>
                    <td className="px-3 py-2">{row.category}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{row.amount}</td>
                    <td className="max-w-[240px] truncate px-3 py-2" title={row.description}>
                      {row.description || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {preview.rows.length > 20 && (
            <p className="mt-2 text-xs text-slate-400">
              Showing first 20 of {preview.rows.length} rows.
            </p>
          )}

          <div className="mt-5 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onCancel}
              className="border border-slate-600 bg-transparent text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onConfirm}
              disabled={isImporting}
              className="bg-slate-700 text-slate-100 hover:bg-slate-600"
            >
              {isImporting ? "Importing..." : "Import"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
