import { DynamicTool } from "./definitions";

const PLACEHOLDER_RANGES: Array<[number, number]> = [
  // Batch 4 and Batch 6 still contain legacy generic-result runners in these ranges.
  // Keep the repair at the shared layer so affected tools receive title-specific output.
  [521, 550],
  [561, 650],
  [661, 750],
  [761, 850],
  [856, 950],
];

const isPlaceholderId = (id: number) => PLACEHOLDER_RANGES.some(([start, end]) => id >= start && id <= end);

const clean = (value: string) => String(value ?? "").trim();

const numbers = (value: string) => (value.match(/-?\d+(?:\.\d+)?/g) || []).map(Number).filter(Number.isFinite);

const slug = (value: string) => clean(value)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "") || "example";

const pascal = (value: string) => clean(value)
  .replace(/[^a-zA-Z0-9]+/g, " ")
  .split(/\s+/)
  .filter(Boolean)
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join("") || "Example";

const csvRows = (value: string) => clean(value).split(/\r?\n/).map((row) => row.split(",").map((cell) => cell.trim()));

const codeTemplate = (title: string, value: string) => {
  const name = pascal(title.replace(/generator|snippet|template|formatter|builder|guide|helper|config|commands|one-liner/gi, ""));
  const input = clean(value) || "example";
  const lower = title.toLowerCase();

  if (lower.includes("dockerfile")) {
    if (lower.includes("python")) return `# ${title}\nFROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt ./\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nCMD ["python", "app.py"]`;
    if (lower.includes("go")) return `# ${title}\nFROM golang:1.24 AS build\nWORKDIR /src\nCOPY . .\nRUN CGO_ENABLED=0 go build -o /out/app .\nFROM gcr.io/distroless/static-debian12\nCOPY --from=build /out/app /app\nENTRYPOINT ["/app"]`;
    return `# ${title}\nFROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY . .\nCMD ["npm", "start"]`;
  }

  if (lower.includes("github actions") || lower.includes("gitlab ci")) {
    return `# ${title}\n# Replace the commands below with your project's test/build commands.\nsteps:\n  - install dependencies\n  - run lint/typecheck\n  - run tests\n  - run production build`;
  }

  if (lower.includes("react component")) return `import React from "react";\n\nexport interface ${name}Props {\n  className?: string;\n}\n\nexport function ${name}({ className = "" }: ${name}Props) {\n  return <div className={className}>${input}</div>;\n}`;

  if (lower.includes("html5 boilerplate")) return `<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>${input}</title>\n</head>\n<body>\n  <main id="app"></main>\n  <script type="module" src="/src/main.js"></script>\n</body>\n</html>`;

  if (lower.includes("manifest")) return JSON.stringify({ name: input, short_name: input.slice(0, 12), start_url: "/", display: "standalone", icons: [] }, null, 2);

  if (lower.includes("sql") || lower.includes("database")) return `-- ${title}\n-- Input: ${input}\nSELECT * FROM example_table\nWHERE id = 1\nORDER BY created_at DESC\nLIMIT 10;`;

  if (lower.includes("graphql")) return `# ${title}\ntype Query {\n  example(id: ID!): Example\n}\n\ntype Example {\n  id: ID!\n  value: String!\n}`;

  if (lower.includes("bash") || lower.includes("shell")) return `#!/usr/bin/env bash\nset -euo pipefail\n\n# ${title}\nINPUT=${JSON.stringify(input)}\nprintf '%s\\n' "$INPUT"`;

  if (lower.includes("python")) return `# ${title}\nvalue = ${JSON.stringify(input)}\n\nprint(value)`;
  if (lower.includes("rust")) return `// ${title}\nfn main() {\n    let value = ${JSON.stringify(input)};\n    println!("{}", value);\n}`;
  if (lower.includes("go ") || lower.includes(" golang")) return `// ${title}\npackage main\n\nimport "fmt"\n\nfunc main() {\n    value := ${JSON.stringify(input)}\n    fmt.Println(value)\n}`;

  if (lower.includes("css")) return `/* ${title} */\n.example {\n  display: block;\n  max-width: 100%;\n  margin: 0 auto;\n  padding: 1rem;\n  box-sizing: border-box;\n}`;

  if (lower.includes("svg")) return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="${input}">\n  <rect width="100" height="100" rx="12" fill="currentColor" opacity="0.12" />\n  <text x="50" y="55" text-anchor="middle" font-size="8">${input.slice(0, 18)}</text>\n</svg>`;

  if (lower.includes("json") || lower.includes("config")) return JSON.stringify({ name: input, enabled: true, options: {} }, null, 2);

  if (lower.includes("git ") || lower.includes("git")) return `# ${title}\ngit status\ngit add .\ngit commit -m "${slug(input)}"\ngit push`;

  if (lower.includes("typescript") || lower.includes("javascript") || lower.includes("node")) return `// ${title}\nconst input = ${JSON.stringify(input)};\n\nexport function ${name}(value: string = input) {\n  return value;\n}`;

  return `# ${title}\nInput: ${input}\n\nGenerated starter output:\n- Identify the exact project/runtime requirements.\n- Apply the relevant standard pattern for this tool.\n- Validate the generated result before production use.`;
};

const repairedRun = (title: string, value: string) => {
  const t = title.toLowerCase();
  const v = clean(value);

  if (t.includes("word") && t.includes("character")) {
    return `Characters: ${v.length}\nWords: ${v ? v.split(/\s+/).length : 0}\nLines: ${v ? v.split(/\r?\n/).length : 0}`;
  }
  if (t.includes("slug")) return slug(v);
  if (t.includes("json") && (t.includes("formatter") || t.includes("format"))) {
    try { return JSON.stringify(JSON.parse(v), null, 2); } catch (error: any) { return `JSON Error: ${error.message}`; }
  }
  if (t.includes("csv")) {
    const rows = csvRows(v);
    return rows.map((row) => row.map((cell) => JSON.stringify(cell)).join(",")).join("\n");
  }
  if (t.includes("base64")) {
    try {
      if (t.includes("decode")) return decodeURIComponent(escape(atob(v)));
      return btoa(unescape(encodeURIComponent(v)));
    } catch { return "Invalid Base64 input."; }
  }
  if (t.includes("url") && t.includes("encode")) return encodeURIComponent(v);
  if (t.includes("url") && t.includes("decode")) {
    try { return decodeURIComponent(v); } catch { return "Invalid URL-encoded input."; }
  }

  const ns = numbers(v);
  if (t.includes("softmax") && ns.length) {
    const max = Math.max(...ns); const exps = ns.map((x) => Math.exp(x - max)); const sum = exps.reduce((a, b) => a + b, 0);
    return `Softmax: [${exps.map((x) => (x / sum).toFixed(6)).join(", ")}]`;
  }
  if (t.includes("sigmoid") && ns.length) return ns.map((x) => `sigmoid(${x}) = ${(1 / (1 + Math.exp(-x))).toFixed(6)}`).join("\n");
  if (t.includes("relu") && ns.length) return ns.map((x) => `ReLU(${x}) = ${Math.max(0, x)}`).join("\n");
  if (t.includes("mean squared error") && ns.length >= 2) {
    const half = Math.floor(ns.length / 2); const a = ns.slice(0, half); const b = ns.slice(half, half * 2);
    const mse = a.reduce((s, x, i) => s + (x - b[i]) ** 2, 0) / a.length;
    return `MSE: ${mse.toFixed(6)}`;
  }
  if (t.includes("mean absolute error") && ns.length >= 2) {
    const half = Math.floor(ns.length / 2); const a = ns.slice(0, half); const b = ns.slice(half, half * 2);
    const mae = a.reduce((s, x, i) => s + Math.abs(x - b[i]), 0) / a.length;
    return `MAE: ${mae.toFixed(6)}`;
  }
  if (t.includes("rmse") && ns.length >= 2) {
    const half = Math.floor(ns.length / 2); const a = ns.slice(0, half); const b = ns.slice(half, half * 2);
    const mse = a.reduce((s, x, i) => s + (x - b[i]) ** 2, 0) / a.length;
    return `RMSE: ${Math.sqrt(mse).toFixed(6)}`;
  }
  if (t.includes("jaccard") && ns.length === 0) {
    const [a, b] = v.split("|").map((x) => new Set(x.split(",").map((s) => s.trim()).filter(Boolean)));
    if (a && b) { const inter = [...a].filter((x) => b.has(x)).length; const union = new Set([...a, ...b]).size; return `Jaccard Similarity: ${union ? (inter / union).toFixed(6) : "0.000000"}`; }
  }
  if (t.includes("levenshtein")) {
    const [a, b] = v.split("|");
    if (a !== undefined && b !== undefined) {
      const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
      for (let i = 1; i <= a.length; i++) { const cur = [i]; for (let j = 1; j <= b.length; j++) cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); for (let j = 0; j <= b.length; j++) prev[j] = cur[j]; }
      return `Levenshtein Distance: ${prev[b.length]}`;
    }
  }
  if (t.includes("min-max") && ns.length) { const min = Math.min(...ns); const max = Math.max(...ns); const d = max - min || 1; return ns.map((x) => ((x - min) / d).toFixed(6)).join(", "); }
  if (t.includes("z-score") && ns.length) { const mean = ns.reduce((a,b)=>a+b,0)/ns.length; const sd = Math.sqrt(ns.reduce((s,x)=>s+(x-mean)**2,0)/ns.length)||1; return ns.map((x)=>( (x-mean)/sd ).toFixed(6)).join(", "); }
  if (t.includes("moving average") && ns.length >= 2) { const window = Math.max(1, Math.min(3, ns.length)); return ns.map((_,i)=>ns.slice(Math.max(0,i-window+1),i+1).reduce((a,b)=>a+b,0)/Math.min(window,i+1)).map((x)=>x.toFixed(4)).join(", "); }
  if (t.includes("uptime") && ns.length) { const percent = Math.min(100, Math.max(0, ns[0])); return `For 30 days, ${percent}% uptime allows ${(30 * 24 * 60 * (100-percent) / 100).toFixed(2)} minutes of downtime.`; }

  if (t.includes("synthetic data") || t.includes("mock users")) {
    const rows = ["id,name,email", ...Array.from({ length: Math.min(10, Math.max(1, ns[0] || 5)) }, (_, i) => `${i + 1},User ${i + 1},user${i + 1}@example.com`)];
    return rows.join("\n");
  }

  return codeTemplate(title, v);
};

export const repairDynamicTool = (tool: DynamicTool): DynamicTool => {
  if (!isPlaceholderId(tool.id)) return tool;
  return {
    ...tool,
    description: `${tool.description.replace(/Generated compliant configuration output\.?|production runtime\.?|Result computed successfully with high precision\.?/gi, "").trim()} Generates a title-specific, inspectable result instead of a simulated success message.`,
    run: (value: string, value2?: string) => repairedRun(tool.title, value2 ? `${value}\n${value2}` : value),
  };
};
