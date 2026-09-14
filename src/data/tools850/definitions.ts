import { ToolCategory } from "../../types";

export interface DynamicTool {
  id: number;
  title: string;
  category: ToolCategory;
  description: string;
  keywords: string[];
  inputType?: "text" | "textarea" | "number" | "two-inputs" | "select-text" | "action";
  label1?: string;
  label2?: string;
  placeholder?: string;
  placeholder2?: string;
  default1?: string;
  default2?: string;
  options?: { label: string; value: string }[];
  actionLabel?: string;
  run: (val1: string, val2?: string) => string;
}
