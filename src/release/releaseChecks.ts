type AppRole = "owner_admin" | "office_user" | "field_user" | "read_only_accountant";

export const priorityReports = [
  "Resumen financiero",
  "Exportacion de pagos",
  "Sanidad de hacienda",
  "Peso de hacienda",
  "Obligaciones contractuales",
  "Costos de cultivos"
];

export function canEditSettings(role: AppRole) {
  return role === "owner_admin";
}

function taskIds(markdown: string) {
  return [...markdown.matchAll(/^## (T\d+):/gm)].map((match) => match[1]);
}

export function checkBilingualSections(englishMarkdown: string, spanishMarkdown: string) {
  const englishIds = taskIds(englishMarkdown);
  const spanishIds = new Set(taskIds(spanishMarkdown));

  return {
    missingSections: englishIds.filter((id) => !spanishIds.has(id))
  };
}
