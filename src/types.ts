export type ToolCategory =
  | "All"
  | "Web"
  | "Text"
  | "Formatting"
  | "Converters"
  | "Security"
  | "Encryption"
  | "Hashes"
  | "Math"
  | "Time"
  | "Color"
  | "Generators"
  | "HTML"
  | "CSS"
  | "JavaScript"
  | "API"
  | "Data"
  | "DevOps"
  | "Utilities"
  | "Miscellaneous";

export interface ToolItem {
  id: number;
  title: string;
  category: ToolCategory;
  description?: string;
  keywords?: string[];
}

export interface LanguageInfo {
  name: string;
  category: string;
  starterCode?: string;
  description?: string;
  extension?: string;
}

export interface AIChatMessage {
  role: "user" | "bot";
  text: string;
  timestamp?: number;
}
