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

export const ALL_850_TOOLS: DynamicTool[] = RAW_DYNAMIC_TOOLS.map(repairDynamicTool);

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
