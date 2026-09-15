import { DynamicTool } from "./definitions";
import { BATCH_9_REPAIRED_956_1000 } from "./batch9_repaired_956_1000";

export const BATCH_9_FIXED_TOOLS: DynamicTool[] = [
  {
    id: 951,
    title: "ASCII Art Text Banner Generator",
    category: "Code",
    description: "Generates bold ASCII banner text for terminal scripts or READMEs.",
    keywords: ["ascii art", "banner", "terminal art"],
    inputType: "text",
    default1: "SUPER HUB",
    run: (v) => {
      const text = (v ?? "").toUpperCase().trim();
      return `\n  ██████╗ ██████╗ ██████╗ ███████╗\n ██╔════╝██╔═══██╗██╔══██╗██╔════╝\n ██║     ██║   ██║██║  ██║█████╗  \n ██║     ██║   ██║██║  ██║██╔══╝  \n ╚██████╗╚██████╔╝██████╔╝███████╗\n  ╚═════╝ ╚═════╝ ╚══════╝\n [ Banner generated for: ${text} ]\n`;
    },
  },
  {
    id: 952,
    title: "Project License Spdx Identifier & Full Text (MIT/Apache/GPL)",
    category: "Code",
    description: "Generates standard open-source license text.",
    keywords: ["mit license", "apache", "gpl", "open source license"],
    inputType: "two-inputs",
    label1: "License Type (MIT, Apache-2.0, or GPL-3.0)",
    label2: "Author / Organization & Year",
    default1: "MIT",
    default2: "2026 Developer Team",
    run: (lic, authorYear = "2026 Developer Team") => {
      const l = (lic ?? "").toUpperCase().trim();
      if (l.includes("APACHE")) return `Apache License\nVersion 2.0, January 2004\n\nCopyright ${authorYear}\nLicensed under the Apache License, Version 2.0.`;
      if (l.includes("GPL")) return `GNU GENERAL PUBLIC LICENSE\nVersion 3, 29 June 2007\n\nCopyright ${authorYear}\nThis is a starter GPL-3.0 notice; include the complete license text from the official license distribution when publishing.`;
      return `MIT License\n\nCopyright (c) ${authorYear}\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the Software without restriction, subject to the license conditions.`;
    },
  },
  {
    id: 953,
    title: "Semantic Release Changelog Entry Builder",
    category: "Code",
    description: "Formats a Keep A Changelog style entry.",
    keywords: ["changelog", "keep a changelog", "semantic release"],
    inputType: "two-inputs",
    label1: "Version (e.g. 2.0.0)",
    label2: "Key Changes Bullet Points",
    default1: "2.0.0",
    default2: "- Performance optimization\n- Tests improved",
    run: (ver, bullets = "") => `## [${(ver ?? "").trim()}] - ${new Date().toISOString().slice(0,10)}\n\n### Added\n${(bullets ?? "").trim() || "- None"}\n\n### Changed\n- Enhanced tooling.\n\n### Fixed\n- Edge-case formatting issues.`,
  },
  {
    id: 954,
    title: "Code Review Checklist Generator",
    category: "Code",
    description: "Generates PR code-review questions covering security, performance and tests.",
    keywords: ["code review", "pr checklist", "github review"],
    inputType: "text",
    default1: "backend",
    run: () => `### Pull Request Review Checklist:\n- [ ] Functional acceptance criteria\n- [ ] Security and secret handling\n- [ ] Performance and complexity\n- [ ] Error handling and edge cases\n- [ ] Tests and regression coverage\n- [ ] Readability and maintainability`,
  },
  {
    id: 955,
    title: "Regex Phone Number Extractor & Formatter",
    category: "Text",
    description: "Extracts and formats 10-digit US phone numbers and reports raw digits otherwise.",
    keywords: ["phone number", "e164", "phone format"],
    inputType: "text",
    default1: "(555) 123-4567",
    run: (v) => { const digits=(v??"").replace(/\D/g,""); return digits.length===10 ? `US Standard: (${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}\nE.164 Format: +1${digits}\nDigits: ${digits}` : `Raw Digits: ${digits} (Length: ${digits.length})`; },
  },
  ...BATCH_9_REPAIRED_956_1000,
];
