import { DynamicTool } from "./definitions";

const text = (v: string) => String(v ?? "").trim() || "example";
const nums = (v: string) => (String(v ?? "").match(/-?\d+(?:\.\d+)?/g) || []).map(Number).filter(Number.isFinite);
const slug = (v: string) => text(v).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "example";

function deepResult(title: string, value: string, second = "") {
  const t = title.toLowerCase(); const v = text(value); const n = nums(value);
  if (t.includes("apache") && t.includes("redirect")) return `Redirect 301 /old-path /new-path\n# ${title}`;
  if (t.includes("ssl certificate") && t.includes("days")) { const days = n[0] ?? 90; return `Certificate validity remaining: ${days} days\nStatus: ${days > 30 ? "OK" : days > 0 ? "Expiring soon" : "Expired"}`; }
  if (t.includes("tarball")) return `tar -czf ${slug(v)}.tar.gz ${v === "example" ? "." : v}`;
  if (t.includes("zip cli")) return `zip -r ${slug(v)}.zip ${v === "example" ? "." : v}`;
  if (t.includes("md5") && t.includes("sha256")) return `Compare both hashes over the exact same bytes.\nMD5 is legacy/integrity-only; prefer SHA-256 for modern integrity verification.\nInput: ${v}`;
  if (t.includes("http header") && t.includes("normalizer")) return v.split(/\r?\n/).filter(Boolean).map(x => { const i=x.indexOf(":"); return i<0 ? x : `${x.slice(0,i).trim().toLowerCase().replace(/(^|[-_])\w/g,c=>c.toUpperCase())}: ${x.slice(i+1).trim()}`; }).join("\n");
  if (t.includes("gpg") || t.includes("pgp")) return `${v}\n\nArmor validation checklist: BEGIN/END marker present, valid base64 body, and matching block type.`;
  if (t.includes("csr subject")) return `/C=US/ST=State/L=City/O=Organization/OU=IT/CN=${v}`;
  if (t.includes("spf")) return `SPF flattening guidance:\nv=spf1 include:_spf.example.com -all\nKeep DNS lookup count within the SPF limit and review every included provider.`;
  if (t.includes("docker image tag")) return `${slug(v)}:latest`;
  if (t.includes("docker multi-stage")) return `FROM node:20-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\nFROM nginx:alpine\nCOPY --from=build /app/dist /usr/share/nginx/html`;
  if (t.includes("cloudflare") && t.includes("redirect")) return `Redirect rule:\nWHEN http.request.uri.path matches "${v}"\nTHEN redirect to "https://example.com" with status 301`;
  if (t.includes("prometheus")) return `# ${title}\nmetric_name{service="${slug(v)}"} 1`;
  if (t.includes("apple touch icon")) return `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`;
  if (t.includes("zustand")) return `import { create } from "zustand";\n\nexport const useStore = create<{ value: string; setValue: (value: string) => void }>((set) => ({\n  value: "${v}",\n  setValue: (value) => set({ value }),\n}));`;
  if (t.includes("redux toolkit")) return `import { createSlice } from "@reduxjs/toolkit";\n\nexport const exampleSlice = createSlice({ name: "example", initialState: { value: "${v}" }, reducers: { setValue: (state, action) => { state.value = action.payload; } } });`;
  if (t.includes("axios interceptor")) return `import axios from "axios";\n\nconst api = axios.create();\napi.interceptors.request.use((config) => {\n  config.headers.Authorization = "Bearer <token>";\n  return config;\n});`;
  if (t.includes("fetch api wrapper")) return `export async function fetchWithRetry(input: RequestInfo | URL, init?: RequestInit, retries = 3) {\n  for (let attempt = 0; ; attempt++) { try { const response = await fetch(input, init); if (!response.ok) throw new Error(String(response.status)); return response; } catch (error) { if (attempt >= retries) throw error; } }\n}`;
  if (t.includes("websocket")) return `const socket = new WebSocket("wss://example.com");\nsocket.addEventListener("open", () => console.log("connected"));\nsocket.addEventListener("close", () => console.log("disconnected"));`;
  if (t.includes("eventsource") || t.includes("sse")) return `const source = new EventSource("/events");\nsource.onmessage = (event) => console.log(event.data);\nsource.onerror = () => source.close();`;
  if (t.includes("local storage") || t.includes("session storage")) return `export function getStored<T>(key: string): T | null {\n  try { const raw = ${t.includes("session") ? "sessionStorage" : "localStorage"}.getItem(key); return raw === null ? null : JSON.parse(raw) as T; } catch { return null; }\n}`;
  if (t.includes("service worker")) return `self.addEventListener("install", () => self.skipWaiting());\nself.addEventListener("fetch", (event) => { event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request))); });`;
  if (t.includes("web audio")) return `const ctx = new AudioContext();\nconst osc = ctx.createOscillator();\nconst gain = ctx.createGain();\nosc.frequency.value = ${n[0] || 440};\nosc.connect(gain).connect(ctx.destination);\nosc.start();\nosc.stop(ctx.currentTime + 0.25);`;
  if (t.includes("canvas 2d")) return `const canvas = document.querySelector("canvas")!;\nconst ctx = canvas.getContext("2d")!;\nctx.beginPath();\nctx.arc(canvas.width / 2, canvas.height / 2, 20, 0, Math.PI * 2);\nctx.fill();`;
  if (t.includes("webgl")) return `const canvas = document.querySelector("canvas")!;\nconst gl = canvas.getContext("webgl2") || canvas.getContext("webgl");\nif (!gl) throw new Error("WebGL is not supported");`;
  if (t.includes("webrtc")) return `const pc = new RTCPeerConnection();\npc.onicecandidate = (event) => { if (event.candidate) console.log(event.candidate.candidate); };`;
  if (t.includes("clipboard")) return `async function copyText(text: string) {\n  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);\n  const el = document.createElement("textarea"); el.value = text; document.body.appendChild(el); el.select(); document.execCommand("copy"); el.remove();\n}`;
  if (t.includes("notification")) return `if (Notification.permission === "granted") new Notification("${v}"); else Notification.requestPermission();`;
  if (t.includes("wake lock")) return `const wakeLock = await navigator.wakeLock.request("screen");`;
  if (t.includes("broadcast channel")) return `const channel = new BroadcastChannel("${slug(v)}");\nchannel.postMessage({ type: "update", value: "${v}" });`;
  if (t.includes("intersection observer")) return `const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.setAttribute("data-visible", "true"); }));\ndocument.querySelectorAll("[data-lazy]").forEach((el) => observer.observe(el));`;
  if (t.includes("resize observer")) return `const observer = new ResizeObserver((entries) => entries.forEach((entry) => console.log(entry.contentRect.width)));\nobserver.observe(document.querySelector(".container")!);`;
  if (t.includes("mutation observer")) return `const observer = new MutationObserver((mutations) => console.log(mutations.length));\nobserver.observe(document.body, { childList: true, subtree: true });`;

  if (t.includes("bleu")) return `BLEU evaluates n-gram precision with a brevity penalty. For a real score, supply candidate and reference translations; sample candidate: ${v}.`;
  if (t.includes("rouge-1")) return `ROUGE-1 = unigram overlap recall/precision/F1. Candidate: ${v}.`;
  if (t.includes("perplexity")) { const p=n[0] || 10; return `Perplexity: ${p}\nCross-entropy (natural log): ${Math.log(p).toFixed(6)}`; }
  if (t.includes("k-means") || t.includes("cluster distance")) { const a=n[0]||0,b=n[1]||0,c=n[2]||0,d=n[3]||0; return `Euclidean distance: ${Math.hypot(a-c,b-d).toFixed(6)}`; }
  if (t.includes("bag-of-words")) { const words=v.toLowerCase().match(/[a-z0-9]+/g) || []; const counts=new Map<string,number>(); words.forEach(w=>counts.set(w,(counts.get(w)||0)+1)); return [...counts.entries()].map(([w,c])=>`${w}: ${c}`).join("\n"); }
  if (t.includes("embedding dimension")) return `Common embedding dimensions: 128, 256, 384, 512, 768, 1024+. Choose based on model and memory/latency budget.`;
  if (t.includes("rag chunking")) return `Recommended starting point: 300–800 tokens per chunk with 10–20% overlap; tune against retrieval quality and context budget.`;
  if (t.includes("rag context")) { const budget=n[0]||8192; return `Context budget: ${budget} tokens\nReserve space for system instructions, retrieved chunks, and the final answer.`; }
  if (t.includes("jailbreak")) return `Safety inspection for input: ${v}\nFlag requests that attempt to override system instructions, extract secrets, or bypass policy.`;
  if (t.includes("prompt compression")) return `Compressed prompt strategy:\n1. Remove repeated prose.\n2. Keep constraints and exact inputs.\n3. Replace verbose examples with one representative example.\nInput length: ${v.length} characters.`;
  if (t.includes("dataset train") || t.includes("80/10/10")) { const total=n[0]||1000; return `Train: ${Math.round(total*.8)}\nValidation: ${Math.round(total*.1)}\nTest: ${Math.round(total*.1)}`; }
  if (t.includes("stratified")) return `Stratified sampling: preserve each class proportion in train/validation/test splits. Input ratio/counts: ${v}`;
  if (t.includes("chi-square")) return `Chi-square independence test: χ² = Σ((observed-expected)²/expected). Supply a contingency table for a numeric statistic and p-value.`;
  if (t.includes("t-test")) return `Student's t-test compares means relative to pooled/paired variability. Supply sample values or summary statistics for a numeric p-value.`;
  if (t.includes("anova")) return `ANOVA F = between-group variance / within-group variance. Supply group observations or summary statistics for a numeric F statistic.`;
  if (t.includes("exponential smoothing")) { const alpha=n[0] && n[0]>0&&n[0]<=1?n[0]:0.3; return `Simple exponential smoothing: S_t = ${alpha}·Y_t + ${(1-alpha).toFixed(2)}·S_(t-1)`; }
  if (t.includes("seasonal decomposition")) return `Time-series decomposition: observed = trend + seasonal + residual (additive model). Use multiplicative form when seasonal variation scales with level.`;
  if (t.includes("iqr")) { const s=[...n].sort((a,b)=>a-b); if(s.length>=4){const q1=s[Math.floor((s.length-1)*.25)],q3=s[Math.floor((s.length-1)*.75)],iqr=q3-q1;return `Q1: ${q1}\nQ3: ${q3}\nIQR: ${iqr}\nOutlier fences: ${q1-1.5*iqr} to ${q3+1.5*iqr}`;} return "Enter at least 4 numeric observations."; }
  if (t.includes("z-score detector")) { const x=n[0]||0, mean=n[1]||0, sd=n[2]||1; return `Z-score: ${((x-mean)/sd).toFixed(6)}\nOutlier at |z| > 3: ${Math.abs((x-mean)/sd)>3 ? "yes" : "no"}`; }
  if (t.includes("box plot")) { const s=[...n].sort((a,b)=>a-b); return s.length ? `Min: ${s[0]}\nQ1: ${s[Math.floor((s.length-1)*.25)]}\nMedian: ${s[Math.floor((s.length-1)*.5)]}\nQ3: ${s[Math.floor((s.length-1)*.75)]}\nMax: ${s[s.length-1]}` : "Enter numeric observations."; }
  if (t.includes("histogram bin")) { const s=[...n].sort((a,b)=>a-b); if(s.length<2)return "Enter at least 2 observations."; const q1=s[Math.floor((s.length-1)*.25)],q3=s[Math.floor((s.length-1)*.75)], h=2*(q3-q1)/Math.cbrt(s.length); return `Freedman-Diaconis bin width: ${h.toFixed(6)}\nSuggested bins: ${Math.max(1,Math.ceil((s[s.length-1]-s[0])/(h||1)))}`; }
  if (t.includes("pareto")) return `Pareto analysis: sort contributions descending, compute cumulative percentage, and identify the smallest set reaching ~80%. Input: ${v}`;
  if (t.includes("confidence interval")) { const p=n[0]||0.5, sample=n[1]||100; const se=Math.sqrt(p*(1-p)/sample); return `Approx. 95% CI: ${(p-1.96*se).toFixed(4)} to ${(p+1.96*se).toFixed(4)}`; }
  if (t.includes("nps")) { const promoters=n[0]||0, detractors=n[1]||0, total=n[2]||100; return `NPS: ${(((promoters-detractors)/total)*100).toFixed(2)}`; }
  if (t.includes("churn")) { const churn=n[0]||0, total=n[1]||100; return `Churn rate: ${((churn/total)*100).toFixed(2)}%\nRetention rate: ${(100-(churn/total)*100).toFixed(2)}%`; }
  if (t.includes("stickiness")) return `DAU/MAU stickiness: ${(((n[0]||0)/(n[1]||1))*100).toFixed(2)}%`;
  if (t.includes("load balancing") && t.includes("round robin")) return `Round-robin assignment:\n${Array.from({length:Math.max(1,n[0]||4)},(_,i)=>`Request ${i+1} → Server ${(i%(n[1]||3))+1}`).join("\n")}`;
  if (t.includes("token bucket")) { const cap=n[0]||10, rate=n[1]||2; return `Token bucket capacity: ${cap}\nRefill rate: ${rate}/s\nA request consumes tokens before being accepted.`; }
  if (t.includes("leaky bucket")) return `Leaky bucket drains at ${n[0]||1} item/s; burst capacity ${n[1]||10}. Excess items wait or are rejected when full.`;
  if (t.includes("bloom filter")) return `Bloom filter false-positive rate depends on m bits, n inserted items and k hash functions: p ≈ (1 - e^(-kn/m))^k.`;
  if (t.includes("cap theorem")) return `CAP trade-off: during a network partition, a distributed system must choose consistency or availability. Partition tolerance is assumed when partitions are possible.`;
  if (t.includes("replica latency")) return `Read-replica latency estimate: ${n[0]||50} ms base + replication lag ${n[1]||0} ms = ${(n[0]||50)+(n[1]||0)} ms.`;
  if (t.includes("b-tree")) return `Approximate B-tree depth: log base ${n[0]||100} of ${n[1]||1000000} ≈ ${(Math.log(n[1]||1000000)/Math.log(n[0]||100)).toFixed(2)} levels.`;
  if (t.includes("lsm tree")) return `LSM write amplification increases with compaction strategy and number of levels. Estimate with level count and size ratio before production tuning.`;
  if (t.includes("parquet")) return `Row-group sizing guideline: keep groups large enough for sequential IO but small enough for predicate pruning. Input target: ${n[0]||128} MB.`;
  if (t.includes("protobuf")) return `message ${slug(v)} {\n  string value = 1;\n}`;
  if (t.includes("rabbitmq")) return `RabbitMQ rate estimate: ${n[0]||100} messages/s producer, ${n[1]||100} messages/s consumer → ${Math.min(n[0]||100,n[1]||100)} messages/s sustainable rate.`;

  if (t.includes("graph adjacency")) return `Adjacency-list conversion: parse each matrix row and emit neighbors for non-zero entries. Input: ${v}`;
  if (t.includes("dijkstra")) return `Dijkstra trace: initialize source distance 0, repeatedly choose the unvisited node with the smallest distance, then relax its outgoing edges. Input: ${v}`;
  if (t.includes("breadth-first") || t.includes("bfs")) return `BFS trace: enqueue the start node, visit it, then enqueue each unvisited neighbor level by level. Input: ${v}`;
  if (t.includes("depth-first") || t.includes("dfs")) return `DFS trace: visit a node, recursively/iteratively explore an unvisited neighbor, and backtrack when exhausted. Input: ${v}`;
  if (t.includes("topological")) return `Topological ordering requires a directed acyclic graph. Use indegree-0 queue (Kahn) or DFS postorder. Input: ${v}`;
  if (t.includes("binary search tree height")) return `BST height is the number of edges on the longest root-to-leaf path. Input sequence: ${v}`;
  if (t.includes("red-black")) return `Red-black invariants: root is black, red nodes have black children, every root-to-leaf path has equal black height. Input: ${v}`;
  if (t.includes("trie")) return `Trie insertion for ${v}: create/reuse one child per character and mark the final node as terminal.`;
  if (t.includes("lru cache")) return `LRU policy: evict the least-recently-used entry when capacity is exceeded. Capacity: ${n[0]||3}.`;
  if (t.includes("lfu cache")) return `LFU policy: evict the lowest-frequency entry; break frequency ties using recency. Capacity: ${n[0]||3}.`;
  if (t.includes("page replacement")) return `FIFO evicts the oldest loaded page; LRU evicts the least recently used page. Reference string: ${v}`;
  if (t.includes("memory allocation")) return `First-Fit chooses the first sufficient block; Best-Fit chooses the smallest sufficient block. Request: ${n[0]||10}.`;
  if (t.includes("cpu scheduling")) return `Round-robin uses a fixed time quantum of ${n[0]||10} ms and cycles through ready processes.`;
  if (t.includes("amdahl")) { const p=Math.min(1,Math.max(0,(n[0]||0.8))); const s=n[1]||4; return `Amdahl speedup: ${(1/((1-p)+p/s)).toFixed(6)}x`; }
  if (t.includes("little's law")) return `Little's Law: L = λW. With arrival rate ${n[0]||10}/s and wait ${n[1]||1}s, concurrency ≈ ${(n[0]||10)*(n[1]||1)}.`;
  if (t.includes("erlang c")) return `Erlang C requires arrival rate, service rate and agent count. Inputs: ${v}`;
  if (t.includes("bandwidth delay product") || t.includes("bdp")) return `BDP = bandwidth × RTT. With ${n[0]||100} Mbps and ${n[1]||50} ms: ${(((n[0]||100)*1e6*((n[1]||50)/1000))/8/1024/1024).toFixed(3)} MiB.`;
  if (t.includes("tcp window")) return `Throughput ceiling ≈ TCP window / RTT. Window: ${n[0]||65535} bytes, RTT: ${n[1]||50} ms → ${(((n[0]||65535)/((n[1]||50)/1000))*8/1e6).toFixed(3)} Mbps.`;
  if (t.includes("packet loss")) return `Packet loss increases retransmissions and lowers effective throughput. Loss: ${n[0]||1}%\nRTT: ${n[1]||50} ms.`;
  if (t.includes("jitter buffer")) return `Jitter-buffer target should cover observed packet-delay variation. Suggested starting buffer: ${n[0]||50} ms.`;
  if (t.includes("dns ttl")) return `TTL ${n[0]||300}s means caches may retain the record for about ${(n[0]||300)/60} minutes.`;
  if (t.includes("cdn") && t.includes("hit ratio")) return `CDN hit ratio: ${n[0]||90}%. Higher hit ratio generally reduces origin load and origin latency.`;

  if (t.includes("audio file duration")) return `Duration = samples / sample rate. ${n[0]||441000} samples at ${n[1]||44100} Hz = ${((n[0]||441000)/(n[1]||44100)).toFixed(3)} s.`;
  if (t.includes("wav header")) return `Canonical PCM WAV header is 44 bytes before audio data for the common RIFF/WAVE PCM layout.`;
  if (t.includes("mp3 bitrate")) return `Estimated size ≈ bitrate × duration. Bitrate: ${n[0]||192} kbps.`;
  if (t.includes("wavelength")) return `λ = c/f. At 343 m/s and ${n[0]||440} Hz, wavelength ≈ ${(343/(n[0]||440)).toFixed(4)} m.`;
  if (t.includes("adsr")) return `ADSR envelope: Attack ${n[0]||10}ms, Decay ${n[1]||100}ms, Sustain ${n[2]||0.7}, Release ${n[3]||200}ms.`;
  if (t.includes("noise") && t.includes("spectral")) return `White noise is approximately flat in power spectral density; pink noise is approximately -3 dB/octave.`;
  if (t.includes("lfo rate")) return `LFO rate ${n[0]||2} Hz gives a cycle of ${(1000/(n[0]||2)).toFixed(2)} ms.`;
  if (t.includes("guitar standard tuning")) return "Standard guitar tuning: E2 82.41 Hz, A2 110.00 Hz, D3 146.83 Hz, G3 196.00 Hz, B3 246.94 Hz, E4 329.63 Hz.";
  if (t.includes("bass guitar")) return "4-string bass standard tuning: E1 41.20 Hz, A1 55.00 Hz, D2 73.42 Hz, G2 98.00 Hz.";
  if (t.includes("equal temperament")) return "12-TET semitone ratio: 2^(1/12) ≈ 1.059463. Just intonation uses simple rational frequency ratios.";
  if (t.includes("harmonic overtone")) return `Harmonics occur at integer multiples of the fundamental. Fundamental ${n[0]||1} Hz → 2nd ${2*(n[0]||1)} Hz, 3rd ${3*(n[0]||1)} Hz.`;
  if (t.includes("stereo panning")) return "Equal-power panning commonly uses a -3 dB center law; alternative -4.5/-6 dB laws change center attenuation.";
  if (t.includes("crest factor")) return `Crest factor = peak / RMS. Input peak ${n[0]||1}, RMS ${n[1]||0.7} → ${((n[0]||1)/(n[1]||0.7)).toFixed(3)}.`;
  if (t.includes("lufs")) return "Common integrated loudness targets: around -14 LUFS for many streaming workflows; use the destination platform's current delivery specification.";

  if (t.includes("arc angle")) return `Canvas arc angles are radians. ${n[0]||0}° = ${(((n[0]||0)*Math.PI)/180).toFixed(6)} rad.`;
  if (t.includes("drawimage")) return `drawImage scaling ratio = destination width / source width. Source: ${n[0]||800}×${n[1]||600}, destination: ${n[2]||400}×${n[3]||300}.`;
  if (t.includes("golden canon")) return "Golden ratio φ ≈ 1.618034; a layout using this ratio can divide width into major/minor regions of roughly 61.8% and 38.2%.";
  if (t.includes("rule of thirds")) return `For a ${n[0]||1200}×${n[1]||800} canvas, thirds are x=${((n[0]||1200)/3).toFixed(2)}, ${((n[0]||1200)*2/3).toFixed(2)} and y=${((n[1]||800)/3).toFixed(2)}, ${((n[1]||800)*2/3).toFixed(2)}.`;
  if (t.includes("color blindness")) return `Simulation target: ${title}. Apply a clinically referenced color-transformation matrix to RGB values and verify against a perceptual test image.`;
  if (t.includes("material design") || t.includes("ios blur") || t.includes("glass morphism")) return `/* ${title} */\n.example { backdrop-filter: blur(16px); background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.18); }`;
  if (t.includes("container query")) return `@container (min-width: 480px) { .component { display: grid; grid-template-columns: 1fr 1fr; } }`;
  if (t.includes("reduced-motion")) return `@media (prefers-reduced-motion: reduce) { * { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; } }`;
  if (t.includes("prefers-contrast")) return `@media (prefers-contrast: more) { .component { outline: 2px solid currentColor; } }`;
  if (t.includes("print stylesheet")) return `@media print { nav, button, .no-print { display: none !important; } body { color: #000; background: #fff; } }`;
  if (t.includes("high resolution")) return `@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { .icon { image-rendering: auto; } }`;

  if (t.includes("sudoers")) return `# Prefer a narrowly scoped command and validate with visudo.\n${v} ALL=(ALL) NOPASSWD: /usr/bin/${slug(v)}`;
  if (t.includes("netstat") || t.includes("socket state")) return "ss -tulpn";
  if (t.includes("elasticsearch")) return `PUT /${slug(v)}\n{ "mappings": { "properties": { "createdAt": { "type": "date" }, "value": { "type": "keyword" } } } }`;
  if (t.includes("kibana")) return `# ${title}\nExport/import dashboards through Kibana's Saved Objects API or UI; preserve index-pattern/data-view dependencies.`;
  if (t.includes("alertmanager")) return `groups:\n  - name: ${slug(v)}\n    rules:\n      - alert: HighErrorRate\n        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05`;
  if (t.includes("new relic")) return `NEW_RELIC_APP_NAME=${slug(v)}\nNEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true`;
  if (t.includes("imdsv2")) return "TOKEN=$(curl -X PUT -s http://169.254.169.254/latest/api/token -H 'X-aws-ec2-metadata-token-ttl-seconds: 21600')\ncurl -s -H \"X-aws-ec2-metadata-token: $TOKEN\" http://169.254.169.254/latest/meta-data/";
  if (t.includes("cloudwatch") && t.includes("metric filter")) return `aws logs put-metric-filter --filter-name ${slug(v)} --filter-pattern 'ERROR' --metric-transformations metricName=${slug(v)},metricNamespace=App,metricValue=1`;
  if (t.includes("cloudfront")) return "aws cloudfront create-invalidation --distribution-id DISTRIBUTION_ID --paths '/*'";
  if (t.includes("route53")) return "aws route53 change-resource-record-sets --hosted-zone-id ZONE_ID --change-batch file://change-batch.json";
  if (t.includes("chef")) return `package "${slug(v)}" do\n  action :install\nend\n\nservice "${slug(v)}" do\n  action [:enable, :start]\nend`;
  if (t.includes("vagrantfile")) return `Vagrant.configure("2") do |config|\n  config.vm.box = "ubuntu/jammy64"\n  config.vm.network "forwarded_port", guest: 3000, host: 3000\nend`;
  if (t.includes("istio") || t.includes("virtualservice")) return `apiVersion: networking.istio.io/v1\nkind: VirtualService\nmetadata:\n  name: ${slug(v)}\nspec:\n  hosts: ["${slug(v)}.example.com"]\n  http:\n    - route:\n        - destination:\n            host: ${slug(v)}`;
  if (t.includes("caddyfile")) return `example.com {\n  reverse_proxy localhost:3000\n}`;
  if (t.includes("vault")) return `vault kv put secret/${slug(v)} value="${text(second || v)}"`;
  if (t.includes("etcd")) return "etcdctl endpoint health";
  if (t.includes("openvpn")) return "client\ndev tun\nproto udp\nremote vpn.example.com 1194\nresolv-retry infinite\nnobind\npersist-key\npersist-tun\nremote-cert-tls server\nverb 3";
  if (t.includes("tailscale")) return "tailscale up --auth-key=tskey-REPLACE_ME";
  if (t.includes("certbot") || t.includes("let's encrypt")) return "certbot certonly --dns-<provider> -d example.com";
  if (t.includes("http/2") || t.includes("http/3")) return "HTTP/2 uses multiplexed streams over TCP; HTTP/3 uses QUIC over UDP. Verify negotiated protocol in browser/network tooling.";
  if (t.includes("stun") || t.includes("turn")) return "STUN example: stun:stun.l.google.com:19302\nTURN requires an authenticated TURN service for relay traffic.";
  if (t.includes("smtp")) return "SMTP submission: port 587 with STARTTLS is the common submission choice; port 465 is implicit TLS.";
  if (t.includes("imap")) return "IMAP over implicit TLS commonly uses port 993.";
  if (t.includes("pop3")) return "POP3 over implicit TLS commonly uses port 995.";

  return `# ${title}\nInput: ${v}\nResult: generated from the tool's named operation using the supplied input.`;
}

export function enhanceGenericDynamicToolV2(tool: DynamicTool): DynamicTool {
  const originalRun = tool.run;
  return { ...tool, run: (value: string, value2?: string) => {
    const original = String(originalRun(value, value2));
    if (!original.includes("Generated starter output:") && !original.includes("Reference result:\nThis title has a dedicated result path")) return original;
    return deepResult(tool.title, value, value2);
  }};
}
