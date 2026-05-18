# Campo Control

Campo Control es un prototipo React desktop-first para operaciones agropecuarias argentinas. Esta planificado para ayudar a gestionar hacienda, actividad agricola, flujo de caja, cobranzas diferidas por venta de hacienda, gastos diferidos, importaciones, recordatorios y reportes operativos.

La app usa espanol por defecto para operadores, con un selector de ingles para duenios o colaboradores que hablan ingles.

## Estado Actual

Este repositorio es un prototipo local temprano. Actualmente incluye:

- Login y estructura de app oscuros, desktop-first.
- Selector Espanol/Ingles para etiquetas soportadas de estructura, login, navegacion y tablero.
- Logica de agrupacion del tablero de flujo de caja.
- Helpers de dominio y tests para perfiles de hacienda, ventas de hacienda, gastos diferidos, analitica de cultivos, importaciones, exportes de pagos/liquidacion, recordatorios y checks de release.
- Borrador inicial de esquema Supabase en `supabase/migrations/`.

Todavia no esta completo:

- Conexion real a un proyecto Supabase.
- Autenticacion de produccion.
- UI completa para subir CSV/Excel.
- Datos reales persistidos del negocio.
- Integracion con proveedor de email.

## Requisitos

- Se recomienda Node.js 20 o superior.
- npm.

Verificar versiones:

```bash
node --version
npm --version
```

## Inicio Rapido

Instalar dependencias:

```bash
npm install
```

Iniciar servidor local de desarrollo:

```bash
npm run dev
```

Abrir la app:

```text
http://localhost:5173/
```

El login actual es solo para el prototipo local. Hacer click en `Iniciar sesion` / `Sign in` para entrar a la estructura de la app.

## Selector De Idioma

La app empieza en espanol.

Usar el boton `English` para cambiar etiquetas soportadas a ingles. Usar `Espanol` para volver.

El espanol sigue siendo el idioma predeterminado del producto y ARS sigue siendo la moneda principal.

## Comandos Utiles

Ejecutar tests:

```bash
npm test
```

Ejecutar build de produccion:

```bash
npm run build
```

Ejecutar tests en modo watch:

```bash
npm run test:watch
```

## Estructura Del Proyecto

```text
src/
  App.tsx                    Estructura principal y selector de idioma
  dashboard/                 Componentes del tablero de flujo de caja
  domain/                    Helpers compartidos de dominio
  cattle/                    Perfil de hacienda y programacion de ventas
  finance/                   Finanzas y gastos diferidos
  crops/                     Analitica de cultivos
  contracts/                 Helpers de contratos/servicios
  imports/                   Helpers de validacion de importaciones
  payroll/                   Helpers de exportacion de pagos/liquidacion
  reminders/                 Seleccion de recordatorios
  release/                   Checks de release y planificacion
supabase/migrations/         Borrador inicial de esquema Supabase
spec.md / spec.es.md         Especificacion del producto
plan.md / plan.es.md         Plan tecnico y de UI
tasks.md / tasks.es.md       Seguimiento de tareas por fase
test-plan.md / test-plan.es.md
```

## Importar Datos CSV Existentes

La UI final de importacion todavia no esta construida. El helper actual de importacion soporta solo una plantilla acotada de hacienda para tests de validacion:

```csv
tag,status
A-001,active
A-002,active
```

Antes de implementar importaciones reales, conviene reunir los encabezados de los CSV/Excel actuales del negocio para:

- hacienda
- pesos
- registros sanitarios
- finanzas
- empleados
- pagos y adelantos
- contratos
- servicios
- campos, ciclos y eventos de cultivos

Esos encabezados van a definir las plantillas reales de importacion.

## Notas Para Colaboradores

Esto todavia no es software de produccion. Es un prototipo funcional y una base de planificacion/codigo. Los proximos pasos importantes son conectar Supabase, construir pantallas reales para los flujos de dominio e implementar el wizard de importacion con plantillas reales de planillas.

---

# Campo Control

Campo Control is a desktop-first React prototype for Argentine agricultural operations. It is planned to help manage cattle, crop activity, cash-flow timing, deferred cattle-sale collections, deferred expenses, imports, reminders, and operational reports.

The app defaults to Spanish for operators, with an English language toggle for English-speaking owners or collaborators.

## Current Status

This repository is an early local prototype. It currently includes:

- Dark desktop-first login and app shell.
- Spanish/English UI toggle for supported shell, login, navigation, and dashboard labels.
- Cash-flow dashboard grouping logic.
- Domain helpers and tests for cattle profiles, cattle sales, deferred expenses, crop analytics, imports, payroll/payment exports, reminders, and release checks.
- Initial Supabase schema migration draft under `supabase/migrations/`.

Not yet complete:

- Real Supabase project connection.
- Production authentication.
- Full CSV/Excel upload UI.
- Real persisted business data.
- Email provider integration.

## Requirements

- Node.js 20 or newer is recommended.
- npm.

Check your versions:

```bash
node --version
npm --version
```

## Quickstart

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Open the app:

```text
http://localhost:5173/
```

The current login is a local prototype. Click `Iniciar sesion` / `Sign in` to enter the app shell.

## Language Toggle

The app starts in Spanish.

Use the `English` button to switch supported UI labels to English. Use `Espanol` to switch back.

Spanish remains the default product language and ARS remains the primary currency.

## Useful Commands

Run tests:

```bash
npm test
```

Run the production build:

```bash
npm run build
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Project Structure

```text
src/
  App.tsx                    Main app shell and language toggle
  dashboard/                 Cash-flow dashboard components
  domain/                    Shared domain helpers
  cattle/                    Cattle profile and sale scheduling logic
  finance/                   Finance and deferred expense logic
  crops/                     Crop analytics logic
  contracts/                 Contract/service helpers
  imports/                   Import validation helpers
  payroll/                   Payroll/payment export helpers
  reminders/                 Reminder selection helpers
  release/                   Release and planning checks
supabase/migrations/         Initial Supabase schema draft
spec.md / spec.es.md         Product specification
plan.md / plan.es.md         Technical and UI plan
tasks.md / tasks.es.md       Phase task tracking
test-plan.md / test-plan.es.md
```

## Importing Existing CSV Data

The finished import UI is not built yet. The current import helper supports only a narrow cattle template for validation tests:

```csv
tag,status
A-001,active
A-002,active
```

Before real imports are implemented, collect the headers from existing business CSV/Excel files for:

- cattle
- weights
- health records
- finances
- employees
- payments and advances
- contracts
- services
- crop fields, cycles, and events

Those headers will drive the real import templates.

## Notes For Collaborators

This is not yet production software. It is a working prototype and planning/code foundation. The next major steps are connecting Supabase, building real screens for the domain flows, and implementing the import wizard against real spreadsheet templates.

---

