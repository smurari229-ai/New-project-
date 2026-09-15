import { DynamicTool } from "./definitions";

const clean = (value: string) => String(value ?? "").trim();
const nums = (value: string) => (clean(value).match(/-?\d+(?:\.\d+)?/g) || []).map(Number).filter(Number.isFinite);
const safe = (value: string) => clean(value).replace(/[<>&]/g, (c) => c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&amp;");
const slug = (value: string) => clean(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "example";

function titleSpecificResult(title: string, value: string, second = "") {
  const t = title.toLowerCase();
  const v = clean(value) || "example";
  const n = nums(value);

  if (t.includes("docker compose") || t.includes("docker run")) return `# ${title}\nDocker command:\ndocker run --name ${slug(v)} ${v}\n\nCompose starter:\nservices:\n  app:\n    image: ${v}\n    restart: unless-stopped`;
  if (t.includes("dockerfile")) return `# ${title}\nFROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY . .\nCMD ["npm", "start"]`;
  if (t.includes("kubernetes") || t.includes("k8s")) {
    const name = slug(v);
    if (t.includes("service")) return `apiVersion: v1\nkind: Service\nmetadata:\n  name: ${name}\nspec:\n  selector:\n    app: ${name}\n  ports:\n    - port: 80\n      targetPort: 3000`;
    if (t.includes("ingress")) return `apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: ${name}\nspec:\n  rules:\n    - host: ${name}.example.com\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: ${name}\n                port:\n                  number: 80`;
    if (t.includes("hpa")) return `apiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: ${name}\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: ${name}\n  minReplicas: 2\n  maxReplicas: 10\n  metrics:\n    - type: Resource\n      resource:\n        name: cpu\n        target:\n          type: Utilization\n          averageUtilization: 70`;
    return `apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: ${name}\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: ${name}\n  template:\n    metadata:\n      labels:\n        app: ${name}\n    spec:\n      containers:\n        - name: ${name}\n          image: ${v}:latest\n          ports:\n            - containerPort: 3000`;
  }
  if (t.includes("react") && t.includes("hook")) return `import { useEffect, useState } from "react";\n\nexport function use${slug(v).replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase()) || "Example"}(value: string) {\n  const [state, setState] = useState(value);\n  useEffect(() => setState(value), [value]);\n  return state;\n}`;
  if (t.includes("react")) return `export function ${v.replace(/[^a-zA-Z0-9_$]/g, "") || "Example"}() {\n  return <div>${safe(v)}</div>;\n}`;
  if (t.includes("next.js")) return t.includes("route handler") ? `import { NextResponse } from "next/server";\n\nexport async function GET() {\n  return NextResponse.json({ ok: true });\n}` : `export default function Page() {\n  return <main><h1>${safe(v)}</h1></main>;\n}`;
  if (t.includes("express")) return `import express from "express";\n\nconst app = express();\napp.get("/", async (_req, res) => res.json({ ok: true }));\napp.listen(3000);`;
  if (t.includes("jest") || t.includes("vitest")) return `describe("${safe(v)}", () => {\n  it("returns the expected result", () => {\n    expect(true).toBe(true);\n  });\n});`;
  if (t.includes("playwright")) return `import { test, expect } from "@playwright/test";\n\ntest("${safe(v)}", async ({ page }) => {\n  await page.goto("/");\n  await expect(page).toHaveURL(/.*/);\n});`;
  if (t.includes("cypress")) return `describe("${safe(v)}", () => {\n  it("loads the page", () => {\n    cy.visit("/");\n    cy.document().should("exist");\n  });\n});`;
  if (t.includes("tailwind")) return `Tailwind utility suggestion for ${v}:\nflex items-center justify-between gap-4 p-4 rounded-lg`;
  if (t.includes("makefile")) return `build:\n\tnpm run build\n\ntest:\n\tnpm test\n\nclean:\n\trm -rf dist`;
  if (t.includes("github") || t.includes("git ") || t.includes("git branch")) return `# ${title}\nSuggested Git workflow:\ngit status\ngit switch -c feature/${slug(v)}\ngit add .\ngit commit -m "feat: ${slug(v)}"\ngit push -u origin HEAD`;

  if (t.includes("aws s3") || t.includes("aws cli")) return `aws s3 ${t.includes("sync") ? `sync ./ ${v.startsWith("s3://") ? v : `s3://${slug(v)}`}` : `ls ${v.startsWith("s3://") ? v : `s3://${slug(v)}`}`}`;
  if (t.includes("gcloud") || t.includes("gcp")) return `gcloud compute instances list --filter="name~'${slug(v)}'"`;
  if (t.includes("azure") || t.includes("az ")) return `az vm list --show-details --query "[].{name:name,powerState:powerState}" -o table`;
  if (t.includes("terraform")) return `terraform {\n  required_version = ">= 1.6.0"\n}\n\nvariable "name" {\n  type    = string\n  default = "${slug(v)}"\n}`;
  if (t.includes("ansible")) return `- name: ${safe(v)}\n  hosts: all\n  become: true\n  tasks:\n    - name: Ensure the service is present\n      ansible.builtin.service:\n        name: ${slug(v)}\n        state: started`;
  if (t.includes("redis")) return `SET ${slug(v)} "${safe(second || v)}"\nGET ${slug(v)}`;
  if (t.includes("mongodb")) return `db.${slug(v)}.find({}).limit(10).pretty()`;
  if (t.includes("kafka")) return `kafka-topics.sh --create --topic ${slug(v)} --partitions 3 --replication-factor 1 --bootstrap-server localhost:9092`;
  if (t.includes("linux") || t.includes("systemctl") || t.includes("crontab") || t.includes("iptables") || t.includes("ufw") || t.includes("ssh ") || t.includes("curl") || t.includes("wget") || t.includes("rsync") || t.includes("journalctl") || t.includes("sysctl") || t.includes("ulimit") || t.includes("swap file") || t.includes("ntp") || t.includes("fstab") || t.includes("lvm") || t.includes("zfs") || t.includes("btrfs") || t.includes("raid") || t.includes("nfs") || t.includes("bind zone") || t.includes("snmp") || t.includes("syslog")) {
    return `# ${title}\n${t.includes("systemctl") ? `sudo systemctl status ${slug(v)}` : t.includes("crontab") ? `0 * * * * ${v}` : t.includes("ufw") ? `sudo ufw allow ${n[0] || 80}/tcp` : t.includes("ssh") ? `ssh -L ${n[0] || 8080}:localhost:${n[1] || 3000} user@host` : t.includes("rsync") ? `rsync -av --progress ./ ${v || "user@host:/path/"}` : t.includes("curl") ? `curl -sS -o /dev/null -w '%{http_code} %{time_total}s\\n' ${v.startsWith("http") ? v : "https://example.com"}` : `echo "${safe(v)}"`}`;
  }

  if (t.includes("softmax") && n.length) { const m = Math.max(...n); const e = n.map(x => Math.exp(x-m)); const s=e.reduce((a,b)=>a+b,0); return `Softmax: [${e.map(x => (x/s).toFixed(6)).join(", ")}]`; }
  if (t.includes("sigmoid") && n.length) return n.map(x => `sigmoid(${x}) = ${(1/(1+Math.exp(-x))).toFixed(6)}`).join("\n");
  if (t.includes("relu") && n.length) return n.map(x => `ReLU(${x}) = ${Math.max(0,x)}; LeakyReLU = ${x >= 0 ? x : (0.01*x).toFixed(6)}`).join("\n");
  if ((t.includes("mean squared") || t.includes("rmse") || t.includes("mean absolute")) && n.length >= 2) { const h=Math.floor(n.length/2), a=n.slice(0,h), b=n.slice(h,h*2); const mse=a.reduce((s,x,i)=>s+(x-b[i])**2,0)/a.length; const mae=a.reduce((s,x,i)=>s+Math.abs(x-b[i]),0)/a.length; if (t.includes("rmse")) return `RMSE: ${Math.sqrt(mse).toFixed(6)}`; if (t.includes("mean absolute")) return `MAE: ${mae.toFixed(6)}`; return `MSE: ${mse.toFixed(6)}`; }
  if (t.includes("cross-entropy") && n.length) { const p=Math.min(1,Math.max(1e-12,n[0])); return `Binary cross-entropy for p=${p}: ${(-Math.log(p)).toFixed(6)}`; }
  if (t.includes("learning rate") && n.length) return `Initial learning rate: ${n[0]}\nCommon exponential decay: lr(step) = ${n[0]} * decay^step`;
  if (t.includes("tf-idf")) return `TF-IDF = TF(term, document) × log(N / DF(term))\nInput term: ${safe(v)}`;
  if (t.includes("stopwords")) return v.split(/\s+/).filter(w => !new Set(["a","an","the","and","or","is","of","to","in","for","on","with"]).has(w.toLowerCase())).join(" ");
  if (t.includes("n-gram")) { const words=v.split(/\s+/).filter(Boolean); const size=t.includes("trigram") ? 3 : 2; return Array.from({length:Math.max(0,words.length-size+1)},(_,i)=>words.slice(i,i+size).join(" ")).join("\n"); }
  if (t.includes("jaccard")) { const [a="",b=""]=v.split("|"); const A=new Set(a.split(",").map(x=>x.trim()).filter(Boolean)); const B=new Set(b.split(",").map(x=>x.trim()).filter(Boolean)); const inter=[...A].filter(x=>B.has(x)).length; const union=new Set([...A,...B]).size; return `Jaccard Similarity: ${union ? (inter/union).toFixed(6) : "0.000000"}`; }
  if (t.includes("levenshtein")) { const [a="",b=""]=v.split("|"); const prev=Array.from({length:b.length+1},(_,i)=>i); for(let i=1;i<=a.length;i++){const cur=[i];for(let j=1;j<=b.length;j++)cur[j]=Math.min(cur[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));for(let j=0;j<=b.length;j++)prev[j]=cur[j];} return `Levenshtein Distance: ${prev[b.length]}`; }
  if (t.includes("moving average") && n.length >= 2) { const w=Math.min(3,n.length); return n.map((_,i)=>n.slice(Math.max(0,i-w+1),i+1).reduce((a,b)=>a+b,0)/Math.min(w,i+1)).map(x=>x.toFixed(4)).join(", "); }
  if (t.includes("uptime") && n.length) { const p=Math.max(0,Math.min(100,n[0])); return `Uptime: ${p}%\n30-day downtime allowance: ${(30*24*60*(100-p)/100).toFixed(2)} minutes`; }
  if (t.includes("bpm")) { const bpm=n[0]||120; return `Quarter: ${(60000/bpm).toFixed(2)} ms\nEighth: ${(30000/bpm).toFixed(2)} ms\nSixteenth: ${(15000/bpm).toFixed(2)} ms`; }
  if (t.includes("decibel") || t.includes("dbfs")) { const x=n[0]||1; return t.includes("to linear") ? `Linear amplitude: ${Math.pow(10,x/20).toFixed(6)}` : `dB: ${(20*Math.log10(Math.max(x,1e-12))).toFixed(2)}`; }
  if (t.includes("nyquist")) { const rate=n[0]||44100; return `Sample rate: ${rate} Hz\nNyquist limit: ${(rate/2).toFixed(2)} Hz`; }
  if (t.includes("midi note")) { const note=n[0]||60; return `MIDI ${note}: ${(440*Math.pow(2,(note-69)/12)).toFixed(3)} Hz`; }

  if (t.includes("color harmony") || t.includes("palette") || t.includes("monochromatic") || t.includes("triadic") || t.includes("analogous") || t.includes("tetradic")) return `Palette for ${v}:\nBase: ${v}\nUse a consistent hue family, accessible contrast, and a tested text/background pairing.`;
  if (t.includes("contrast checker")) return `WCAG contrast target: 4.5:1 for normal text, 3:1 for large text and applicable UI graphics.\nInput: ${v}`;
  if (t.includes("css") || t.includes("spacing") || t.includes("breakpoint") || t.includes("media query") || t.includes("typography")) return `/* ${title} */\n.example {\n  box-sizing: border-box;\n  max-width: 100%;\n  margin: 0 auto;\n  padding: ${n[0] || 16}px;\n}`;

  return `# ${title}\nInput: ${safe(v)}\n\nReference result:\nThis title has a dedicated result path, but the supplied input needs a tool-specific parser before a deterministic production value can be claimed.`;
}

export function enhanceGenericDynamicTool(tool: DynamicTool): DynamicTool {
  const originalRun = tool.run;
  return {
    ...tool,
    run: (value: string, value2?: string) => {
      const original = String(originalRun(value, value2));
      if (!original.includes("Generated starter output:")) return original;
      return titleSpecificResult(tool.title, value, value2);
    },
  };
}
