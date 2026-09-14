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
import { BATCH_9_FINISHING_TOOLS } from "./batch9_master_finishing";

export const ALL_850_TOOLS: DynamicTool[] = [
  ...BATCH_1_TEXT_TOOLS,        // 151 - 250 (100 tools)
  ...BATCH_2_CONVERTER_TOOLS,   // 251 - 350 (100 tools)
  ...BATCH_3_MATH_TOOLS,        // 351 - 450 (100 tools)
  ...BATCH_4_WEB_SECURITY_TOOLS,// 451 - 550 (100 tools)
  ...BATCH_5_CODE_DEV_TOOLS,    // 551 - 650 (100 tools)
  ...BATCH_6_DATA_AI_TOOLS,     // 651 - 750 (100 tools)
  ...BATCH_7_DESIGN_AUDIO_TOOLS,// 751 - 850 (100 tools)
  ...BATCH_8_SYSTEM_DEVOPS_TOOLS,// 851 - 950 (100 tools)
  ...BATCH_9_FINISHING_TOOLS,   // 951 - 1000 (50 tools)
];

// Map for quick O(1) retrieval by ID
export const ALL_850_TOOLS_MAP = new Map<number, DynamicTool>(
  ALL_850_TOOLS.map((t) => [t.id, t])
);

// Converted metadata for search, category filter, and header stats
export const DYNAMIC_METADATA_LIST: ToolMetadata[] = ALL_850_TOOLS.map((t) => ({
  id: t.id,
  title: t.title,
  category: t.category,
  description: t.description,
  keywords: t.keywords,
}));
