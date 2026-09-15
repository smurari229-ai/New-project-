import { DynamicTool } from "./definitions";
import { ToolMetadata } from "../../types";
import { BATCH_1_TEXT_TOOLS } from "./batch1_text";
import { BATCH_2_CONVERTER_TOOLS } from "./batch2_converters";
import { BATCH_3_MATH_TOOLS } from "./batch3_math";
import { BATCH_4_WEB_SECURITY_TOOLS } from "./batch4_web_security";
import { BATCH_5_CODE_DEV_TOOLS } from "./batch5_code_dev";
import { BATCH_6_DATA_AI_TOOLS } from "./batch6_data_ai";
import { BATCH_7_DESIGN_AUDIO_TOOLS } from "./batch7_design_audio";
import { BATCH_8_SYSTEM_DEVOPS_TOOLS } from "./batch8_system_devops";
import { BATCH_9_FIXED_TOOLS } from "./batch9_fixed";
import { repairDynamicTool } from "./placeholder_repairs";

const RAW_DYNAMIC_TOOLS: DynamicTool[] = [
  ...BATCH_1_TEXT_TOOLS,
  ...BATCH_2_CONVERTER_TOOLS,
  ...BATCH_3_MATH_TOOLS,
  ...BATCH_4_WEB_SECURITY_TOOLS,
  ...BATCH_5_CODE_DEV_TOOLS,
  ...BATCH_6_DATA_AI_TOOLS,
  ...BATCH_7_DESIGN_AUDIO_TOOLS,
  ...BATCH_8_SYSTEM_DEVOPS_TOOLS,
  ...BATCH_9_FIXED_TOOLS,
];

const REPAIRED_DYNAMIC_TOOLS = RAW_DYNAMIC_TOOLS.map(repairDynamicTool);

const withRealRegistryVerifier = (tool: DynamicTool): DynamicTool => {
  if (tool.id !== 1000) return tool;
  return {
    ...tool,
    description: "Verifies the actual loaded registry for IDs 1-1000, duplicates, and missing entries.",
    run: () => {
      const ids = REPAIRED_DYNAMIC_TOOLS.map((item) => item.id);
      const unique = new Set(ids);
      const missing: number[] = [];
      for (let id = 151; id <= 1000; id += 1) if (!unique.has(id)) missing.push(id);
      const duplicates = ids
        .filter((id, index) => ids.indexOf(id) !== index)
        .filter((id, index, arr) => arr.indexOf(id) === index);
      const expectedDynamicCount = 850;
      const countOk = ids.length === expectedDynamicCount;
      const rangeOk = ids.every((id) => id >= 151 && id <= 1000);
      return [
        "Coding Super Hub — Live Tool Registry Verification",
        `Dynamic tools loaded: ${ids.length} / ${expectedDynamicCount}`,
        `Expected IDs present: ${rangeOk && missing.length === 0 ? "YES" : "NO"}`,
        `Duplicate dynamic IDs: ${duplicates.length ? duplicates.join(", ") : "none"}`,
        `Missing dynamic IDs: ${missing.length ? missing.join(", ") : "none"}`,
        `Registry result: ${countOk && rangeOk && duplicates.length === 0 && missing.length === 0 ? "PASS" : "FAIL"}`,
        "Note: static tools 1-150 are verified separately by the application metadata/integrity checks.",
      ].join("\n");
    },
  };
};

export const ALL_850_TOOLS: DynamicTool[] = REPAIRED_DYNAMIC_TOOLS.map(withRealRegistryVerifier);

export const ALL_850_TOOLS_MAP = new Map<number, DynamicTool>(
  ALL_850_TOOLS.map((t) => [t.id, t])
);

export const DYNAMIC_METADATA_LIST: ToolMetadata[] = ALL_850_TOOLS.map((t) => ({
  id: t.id,
  title: t.title,
  category: t.category,
  description: t.description,
  keywords: t.keywords,
}));
