import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CattleProfile } from "./CattleProfile";

const cattle = {
  id: "cow-1",
  tag: "A-102",
  label: "Vaquillona A-102",
  status: "active",
  origin: "Lote Norte"
};

describe("CattleProfile", () => {
  it("shows cattle details, chronological weights, health events, and chart data", () => {
    render(
      <CattleProfile
        cattle={cattle}
        weights={[
          { id: "w2", cattleId: "cow-1", recordedAt: "2026-05-10", weight: 425, unit: "kg" },
          { id: "w1", cattleId: "cow-1", recordedAt: "2026-04-10", weight: 410, unit: "kg" }
        ]}
        healthEvents={[
          {
            id: "h1",
            cattleId: "cow-1",
            eventDate: "2026-05-12",
            type: "Tratamiento",
            treatment: "Antibiotico indicado"
          }
        ]}
      />
    );

    expect(screen.getByRole("heading", { name: "Vaquillona A-102" })).toBeInTheDocument();
    expect(screen.getByText("Caravana A-102")).toBeInTheDocument();

    const weightList = screen.getByRole("list", { name: "Historial de peso" });
    const weightItems = within(weightList).getAllByRole("listitem");
    expect(weightItems[0]).toHaveTextContent("10/04/2026");
    expect(weightItems[1]).toHaveTextContent("10/05/2026");

    expect(screen.getByRole("img", { name: "Grafico de peso en el tiempo" })).toBeInTheDocument();
    expect(screen.getByText("Tratamiento")).toBeInTheDocument();
    expect(screen.getByText("Antibiotico indicado")).toBeInTheDocument();
  });

  it("shows a Spanish sparse-data state when chart data is insufficient", () => {
    render(
      <CattleProfile
        cattle={cattle}
        weights={[{ id: "w1", cattleId: "cow-1", recordedAt: "2026-04-10", weight: 410, unit: "kg" }]}
        healthEvents={[]}
      />
    );

    expect(screen.queryByRole("img", { name: "Grafico de peso en el tiempo" })).not.toBeInTheDocument();
    expect(screen.getByText("No hay suficientes pesajes para mostrar un grafico.")).toBeInTheDocument();
  });
});
