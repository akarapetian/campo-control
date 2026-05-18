import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { canEditSettings, checkBilingualSections, priorityReports } from "./releaseChecks";

describe("reports, settings, and release checks", () => {
  it("defines priority reports and admin settings access", () => {
    expect(priorityReports).toEqual([
      "Resumen financiero",
      "Exportacion de pagos",
      "Sanidad de hacienda",
      "Peso de hacienda",
      "Obligaciones contractuales",
      "Costos de cultivos"
    ]);

    expect(canEditSettings("owner_admin")).toBe(true);
    expect(canEditSettings("office_user")).toBe(false);
  });

  it("checks bilingual planning artifact section alignment", () => {
    const english = readFileSync(resolve(process.cwd(), "tasks.md"), "utf8");
    const spanish = readFileSync(resolve(process.cwd(), "tasks.es.md"), "utf8");

    expect(checkBilingualSections(english, spanish).missingSections).toEqual([]);
  });

  it("fails alignment when a Spanish task section is missing", () => {
    const english = "## T1: App\n\n## T2: Schema\n";
    const spanish = "## T1: App\n";

    expect(checkBilingualSections(english, spanish).missingSections).toEqual(["T2"]);
  });
});
