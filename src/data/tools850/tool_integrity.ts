import { ALL_850_TOOLS } from "./index";

export type ToolIntegrityReport = {
  total: number;
  duplicateIds: number[];
  missingIds: number[];
  duplicateTitles: string[];
  invalidTools: number[];
};

export function verifyAllTools(tools = ALL_850_TOOLS): ToolIntegrityReport {
  const ids = tools.map((t) => t.id);
  const titleCounts = new Map<string, number>();
  for (const t of tools) titleCounts.set(t.title, (titleCounts.get(t.title) ?? 0) + 1);
  const duplicateIds = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))].sort((a, b) => a - b);
  const missingIds: number[] = [];
  for (let id = 151; id <= 1000; id++) if (!ids.includes(id)) missingIds.push(id);
  const duplicateTitles = [...titleCounts.entries()].filter(([, n]) => n > 1).map(([title]) => title).sort();
  const invalidTools = tools.filter((t) => !Number.isInteger(t.id) || !t.title?.trim() || !t.category || !t.description?.trim() || !Array.isArray(t.keywords) || typeof t.run !== "function").map((t) => t.id);
  return { total: tools.length, duplicateIds, missingIds, duplicateTitles, invalidTools };
}
