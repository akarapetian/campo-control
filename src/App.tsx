import { useState } from "react";
import { CashFlowPanel } from "./dashboard/CashFlowPanel";
import "./styles.css";

type AppProps = {
  initialPath?: string;
};

type Language = "es" | "en";

const copy = {
  es: {
    accessNote: "Inicia sesion para continuar",
    cattle: "Hacienda",
    contracts: "Contratos y servicios",
    crops: "Cultivos",
    dashboard: "Tablero",
    employees: "Empleados",
    eyebrow: "Gestion agropecuaria",
    finance: "Finanzas",
    imports: "Importaciones",
    languageButton: "English",
    loginCopy: "Tablero operativo para pagos, hacienda, cultivos e importaciones.",
    loginCta: "Iniciar sesion",
    navLabel: "Navegacion principal",
    reports: "Reportes",
    settings: "Configuracion",
    summary: "Resumen operativo",
    user: "Usuario"
  },
  en: {
    accessNote: "Sign in to continue",
    cattle: "Cattle",
    contracts: "Contracts and services",
    crops: "Crops",
    dashboard: "Dashboard",
    employees: "Employees",
    eyebrow: "Farm management",
    finance: "Finance",
    imports: "Imports",
    languageButton: "Espanol",
    loginCopy: "Operations dashboard for payments, cattle, crops, and imports.",
    loginCta: "Sign in",
    navLabel: "Primary navigation",
    reports: "Reports",
    settings: "Settings",
    summary: "Operations summary",
    user: "User"
  }
};

const routeKeys = [
  ["dashboard", "/dashboard"],
  ["cattle", "/cattle"],
  ["crops", "/crops"],
  ["finance", "/finance"],
  ["employees", "/employees"],
  ["contracts", "/contracts"],
  ["imports", "/imports"],
  ["reports", "/reports"],
  ["settings", "/settings"]
] as const;

type RouteKey = (typeof routeKeys)[number][0];

function routeKeyFromPath(path: string): RouteKey {
  return routeKeys.find(([, href]) => href === path)?.[0] ?? "dashboard";
}

function CowLogo() {
  return (
    <svg
      aria-label="Logo de Campo Control"
      className="cow-logo"
      role="img"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="cow-logo__badge" height="64" rx="14" width="64" />
      <path className="cow-logo__horn" d="M17 19c-5-5-9-4-11-1 2 4 6 7 12 8" />
      <path className="cow-logo__horn" d="M47 19c5-5 9-4 11-1-2 4-6 7-12 8" />
      <path className="cow-logo__head" d="M15 23c0-9 34-9 34 0v16c0 10-8 17-17 17s-17-7-17-17V23Z" />
      <path className="cow-logo__spot" d="M24 17c5-2 12-1 14 3-2 5-10 5-15 2-2-1-2-4 1-5Z" />
      <circle className="cow-logo__eye" cx="25" cy="34" r="2" />
      <circle className="cow-logo__eye" cx="39" cy="34" r="2" />
      <path className="cow-logo__muzzle" d="M23 43c0-4 18-4 18 0v3c0 5-18 5-18 0v-3Z" />
      <circle className="cow-logo__nostril" cx="29" cy="45" r="1.4" />
      <circle className="cow-logo__nostril" cx="35" cy="45" r="1.4" />
    </svg>
  );
}

function LanguageToggle({
  language,
  onToggle
}: {
  language: Language;
  onToggle: () => void;
}) {
  return (
    <button className="language-toggle" type="button" onClick={onToggle}>
      {copy[language].languageButton}
    </button>
  );
}

function LoginScreen({
  guarded,
  language,
  onLogin,
  onToggleLanguage
}: {
  guarded: boolean;
  language: Language;
  onLogin: () => void;
  onToggleLanguage: () => void;
}) {
  const text = copy[language];

  return (
    <main className="login-screen theme-dark" data-testid="login-screen">
      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-actions">
          <LanguageToggle language={language} onToggle={onToggleLanguage} />
        </div>
        <CowLogo />
        <div>
          <p className="eyebrow">{text.eyebrow}</p>
          <h1 id="login-title">Campo Control</h1>
          <p className="login-copy">{text.loginCopy}</p>
          {guarded ? <p className="access-note">{text.accessNote}</p> : null}
        </div>
        <button className="primary-button" type="button" onClick={onLogin}>
          {text.loginCta}
        </button>
      </section>
    </main>
  );
}

function AppShell({
  initialPath,
  language,
  onToggleLanguage
}: {
  initialPath: string;
  language: Language;
  onToggleLanguage: () => void;
}) {
  const [activeRoute, setActiveRoute] = useState<RouteKey>(routeKeyFromPath(initialPath));
  const text = copy[language];

  return (
    <div className="app-shell desktop-first-shell narrow-tolerant" data-testid="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="/dashboard"
          aria-label="Campo Control"
          onClick={(event) => {
            event.preventDefault();
            setActiveRoute("dashboard");
          }}
        >
          <CowLogo />
          <span>Campo Control</span>
        </a>
        <nav aria-label={text.navLabel}>
          {routeKeys.map(([key, href]) => (
            <a
              aria-current={activeRoute === key ? "page" : undefined}
              href={href}
              key={href}
              onClick={(event) => {
                event.preventDefault();
                setActiveRoute(key);
              }}
            >
              {text[key]}
            </a>
          ))}
        </nav>
        <LanguageToggle language={language} onToggle={onToggleLanguage} />
      </aside>
      <main className="workspace">
        <header className="workspace-header">
          <div>
            <p className="eyebrow">{text[activeRoute]}</p>
            <h1>{activeRoute === "dashboard" ? text.summary : text[activeRoute]}</h1>
          </div>
          <button className="secondary-button" type="button">
            {text.user}
          </button>
        </header>
        {activeRoute === "dashboard" ? (
          <CashFlowPanel items={[]} language={language} today="2026-06-10" />
        ) : null}
      </main>
    </div>
  );
}

export function App({ initialPath = window.location.pathname }: AppProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [language, setLanguage] = useState<Language>("es");
  const guardedPath = initialPath !== "/";
  const toggleLanguage = () => setLanguage((current) => (current === "es" ? "en" : "es"));

  if (!authenticated) {
    return (
      <LoginScreen
        guarded={guardedPath}
        language={language}
        onLogin={() => setAuthenticated(true)}
        onToggleLanguage={toggleLanguage}
      />
    );
  }

  return (
    <AppShell
      initialPath={initialPath}
      language={language}
      onToggleLanguage={toggleLanguage}
    />
  );
}
