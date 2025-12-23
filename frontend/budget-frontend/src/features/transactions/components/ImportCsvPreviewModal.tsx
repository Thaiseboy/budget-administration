import { Button } from "@/components/ui";
import type { ImportPreview } from "../types";
import { useTranslation } from "@/i18n";

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
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label={t("closeDialog")}
        onClick={onCancel}
      />

      <div className="relative z-10 w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-800 shadow-xl">
        <div className="p-5">
          <h2 className="text-base font-semibold text-slate-100">{t("previewImport")}</h2>
          <p className="mt-1 text-sm text-slate-300">
            {t("fileRowsSummary", { file: preview.fileName, rows: preview.rows.length })}
          </p>

          <div className="mt-4 max-h-[50vh] overflow-auto rounded-lg border border-slate-700">
            <table className="w-full text-sm text-slate-200">
              <thead className="sticky top-0 bg-slate-700 text-slate-200">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                    {t("row")}
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                    {t("date")}
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                    {t("type")}
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                    {t("category")}
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide">
                    {t("amount")}
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                    {t("description")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {preview.rows.slice(0, 20).map((row) => (
                  <tr key={row.rowNumber} className="border-t border-slate-700">
                    <td className="px-3 py-2 text-slate-400">{row.rowNumber}</td>
                    <td className="px-3 py-2">{row.date}</td>
                    <td className="px-3 py-2 capitalize">
                      {row.type === "income" ? t("income") : t("expense")}
                    </td>
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
              {t("showingFirstRows", { count: 20, total: preview.rows.length })}
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
              {t("cancel")}
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onConfirm}
              disabled={isImporting}
              className="bg-slate-700 text-slate-100 hover:bg-slate-600"
            >
              {isImporting ? t("importing") : t("import")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
