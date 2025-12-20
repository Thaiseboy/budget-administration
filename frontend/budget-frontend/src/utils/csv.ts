export function toCsvValue(value: string | number | null | undefined): string {
  const s = String(value ?? "");
  const escaped = s.replace(/"/g, '""');
  return `"${escaped}"`;
}

export function downloadCsv(filename: string, rows: Array<Record<string, unknown>>) {
  const header = ["date", "type", "category", "amount", "description"];
  const lines = [
    header.join(","),
    ...rows.map((row) =>
      [
        toCsvValue(row.date as string),
        toCsvValue(row.type as string),
        toCsvValue(row.category as string),
        toCsvValue(row.amount as number),
        toCsvValue(row.description as string),
      ].join(",")
    ),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
