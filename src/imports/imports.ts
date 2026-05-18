type RecordType = "cattle";
type ImportRow = Record<string, string>;

type ImportError = {
  rowNumber: number;
  field: string;
  message: string;
};

type ImportPreview = {
  recordType: RecordType;
  validRows: ImportRow[];
  errors: ImportError[];
  committed: boolean;
};

const requiredFields: Record<RecordType, string[]> = {
  cattle: ["tag", "status"]
};

export function validateImportRows(recordType: RecordType, rows: ImportRow[]): ImportPreview {
  const validRows: ImportRow[] = [];
  const errors: ImportError[] = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 1;
    const rowErrors = requiredFields[recordType]
      .filter((field) => !row[field]?.trim())
      .map((field) => ({
        rowNumber,
        field,
        message: `Fila ${rowNumber}: ${field} es obligatorio.`
      }));

    if (rowErrors.length > 0) {
      errors.push(...rowErrors);
    } else {
      validRows.push(row);
    }
  });

  return {
    recordType,
    validRows,
    errors,
    committed: false
  };
}

export function commitValidRows(preview: ImportPreview, confirmed: boolean): ImportRow[] {
  if (!confirmed) {
    return [];
  }

  preview.committed = true;
  return preview.validRows;
}
