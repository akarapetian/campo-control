import { describe, expect, it } from "vitest";
import { commitValidRows, validateImportRows } from "./imports";

describe("imports with validation preview", () => {
  it("previews valid cattle rows before commit", () => {
    const preview = validateImportRows("cattle", [
      { tag: "A-1", status: "active" },
      { tag: "A-2", status: "active" }
    ]);

    expect(preview.validRows).toHaveLength(2);
    expect(preview.errors).toEqual([]);
    expect(preview.committed).toBe(false);
  });

  it("returns Spanish row-level errors and excludes invalid rows", () => {
    const preview = validateImportRows("cattle", [
      { tag: "", status: "active" },
      { tag: "A-2", status: "" }
    ]);

    expect(preview.validRows).toEqual([]);
    expect(preview.errors).toEqual([
      { rowNumber: 1, field: "tag", message: "Fila 1: tag es obligatorio." },
      { rowNumber: 2, field: "status", message: "Fila 2: status es obligatorio." }
    ]);
  });

  it("commits valid rows only after explicit confirmation", () => {
    const preview = validateImportRows("cattle", [
      { tag: "A-1", status: "active" },
      { tag: "", status: "active" }
    ]);

    expect(commitValidRows(preview, false)).toEqual([]);
    expect(commitValidRows(preview, true)).toEqual([{ tag: "A-1", status: "active" }]);
  });
});
