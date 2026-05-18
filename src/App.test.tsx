import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("Campo Control app shell", () => {
  it("renders a dark Spanish login with the Campo Control cow logo", () => {
    render(<App initialPath="/" />);

    expect(screen.getByRole("img", { name: "Logo de Campo Control" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Campo Control" })).toBeInTheDocument();
    expect(screen.getByText("Gestion agropecuaria")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Iniciar sesion" })).toBeInTheDocument();
    expect(screen.getByTestId("login-screen")).toHaveClass("theme-dark");
  });

  it("does not show authenticated dashboard navigation before login", () => {
    render(<App initialPath="/dashboard" />);

    expect(screen.getByText("Inicia sesion para continuar")).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Navegacion principal" })).not.toBeInTheDocument();
  });

  it("shows the desktop-first app shell after login with routes for each primary module", async () => {
    const user = userEvent.setup();
    render(<App initialPath="/" />);

    await user.click(screen.getByRole("button", { name: "Iniciar sesion" }));

    expect(screen.getAllByRole("img", { name: "Logo de Campo Control" })).toHaveLength(1);
    expect(screen.getByRole("navigation", { name: "Navegacion principal" })).toBeInTheDocument();

    for (const label of [
      "Tablero",
      "Hacienda",
      "Cultivos",
      "Finanzas",
      "Empleados",
      "Contratos y servicios",
      "Importaciones",
      "Reportes",
      "Configuracion"
    ]) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }

    expect(screen.getByTestId("app-shell")).toHaveClass("desktop-first-shell");
    expect(screen.getByTestId("app-shell")).toHaveClass("narrow-tolerant");
  });

  it("keeps the user signed in when switching between primary navigation tabs", async () => {
    const user = userEvent.setup();
    render(<App initialPath="/" />);

    await user.click(screen.getByRole("button", { name: "Iniciar sesion" }));
    await user.click(screen.getByRole("link", { name: "Hacienda" }));

    expect(screen.queryByText("Inicia sesion para continuar")).not.toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Navegacion principal" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Hacienda" })).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Finanzas" }));

    expect(screen.queryByText("Inicia sesion para continuar")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Finanzas" })).toBeInTheDocument();
  });

  it("toggles supported login, protected-route, navigation, and dashboard labels to English and back", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<App initialPath="/" />);

    expect(screen.getByText("Gestion agropecuaria")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "English" }));

    expect(screen.getByText("Farm management")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();

    rerender(<App initialPath="/dashboard" />);
    expect(screen.getByText("Sign in to continue")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cattle" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Operations summary" })).toBeInTheDocument();
    expect(screen.getByText("Cash collected")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Espanol" }));

    expect(screen.getByRole("navigation", { name: "Navegacion principal" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tablero" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Resumen operativo" })).toBeInTheDocument();
  });
});
