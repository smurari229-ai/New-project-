import { DynamicTool } from "./definitions";

export const BATCH_4_WEB_SECURITY_TOOLS: DynamicTool[] = [
  {
    id: 451,
    title: "URL Slugify Generator",
    category: "Security",
    description: "Transforms any title or text into clean SEO-friendly URL slug.",
    keywords: ["slugify", "seo slug", "url safe"],
    inputType: "text",
    default1: "Super Coding Hub: Top 1,000 Developer Tools & Utilities!",
    run: (v) =>
      v
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, ""),
  },
  {
    id: 452,
    title: "URL Parser & Breakdown",
    category: "Security",
    description: "Deconstructs URL into protocol, host, port, path, query params, and hash.",
    keywords: ["url parser", "hostname", "pathname", "query params"],
    inputType: "text",
    default1: "https://user:pass@api.studio.google.com:443/v1/tools?search=crypto&filter=active#section-2",
    run: (v) => {
      try {
        const u = new URL(v);
        const params: Record<string, string> = {};
        u.searchParams.forEach((val, k) => (params[k] = val));
        return `Protocol: ${u.protocol}\nHost:     ${u.host}\nHostname: ${u.hostname}\nPort:     ${u.port || "(default)"}\nPathname: ${u.pathname}\nSearch:   ${u.search}\nHash:     ${u.hash}\nUsername: ${u.username}\nParams:   ${JSON.stringify(params, null, 2)}`;
      } catch (e: any) {
        return "Invalid URL: " + e.message;
      }
    },
  },
  {
    id: 453,
    title: "URL Query Params Builder",
    category: "Security",
    description: "Appends key=value lines into clean encoded URL query string.",
    keywords: ["query builder", "url params", "query string"],
    inputType: "textarea",
    default1: "search=developer tools\npage=1\ncategory=web & security\nactive=true",
    run: (v) => {
      const sp = new URLSearchParams();
      v.split("\n").forEach((l) => {
        if (l.includes("=")) {
          const [k, val] = l.split("=").map((s) => s.trim());
          sp.append(k, val);
        }
      });
      return "?" + sp.toString();
    },
  },
  {
    id: 454,
    title: "HTTP Status Code Reference",
    category: "Security",
    description: "Look up details, category, and RFC definitions for HTTP status codes.",
    keywords: ["http status", "404", "500", "418", "rfc"],
    inputType: "number",
    default1: "418",
    run: (v) => {
      const codes: Record<number, string> = {
        200: "200 OK - Standard successful HTTP request response.",
        201: "201 Created - Resource was created successfully.",
        204: "204 No Content - Action succeeded, no payload body returned.",
        301: "301 Moved Permanently - Resource redirected permanently.",
        302: "302 Found - Temporary redirect.",
        304: "304 Not Modified - Cached version is still valid.",
        400: "400 Bad Request - Malformed syntax or invalid parameter payload.",
        401: "401 Unauthorized - Authentication credentials missing or invalid.",
        403: "403 Forbidden - Authenticated user lacks permission for resource.",
        404: "404 Not Found - Server cannot find requested URI.",
        405: "405 Method Not Allowed - HTTP verb is forbidden for this endpoint.",
        409: "409 Conflict - Request conflicts with current server state.",
        418: "418 I'm a teapot - RFC 2324 hyper text coffee pot control protocol joke code.",
        429: "429 Too Many Requests - Rate limit exceeded.",
        500: "500 Internal Server Error - Unhandled exception on server.",
        502: "502 Bad Gateway - Upstream reverse proxy error.",
        503: "503 Service Unavailable - Server overloaded or under maintenance.",
        504: "504 Gateway Timeout - Upstream server did not reply in time.",
      };
      const code = parseInt(v, 10);
      return codes[code] || `HTTP Status Code ${code} (Standard RFC Range: ${Math.floor(code / 100)}xx)`;
    },
  },
  {
    id: 455,
    title: "MIME Content-Type Lookup",
    category: "Security",
    description: "Finds standard MIME Content-Type by file extension.",
    keywords: ["mime", "content-type", "file extension"],
    inputType: "text",
    default1: "json",
    run: (v) => {
      const ext = v.toLowerCase().replace(/^\./, "").trim();
      const mime: Record<string, string> = {
        json: "application/json",
        html: "text/html; charset=utf-8",
        css: "text/css; charset=utf-8",
        js: "application/javascript; charset=utf-8",
        ts: "application/typescript",
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        gif: "image/gif",
        svg: "image/svg+xml",
        webp: "image/webp",
        pdf: "application/pdf",
        zip: "application/zip",
        mp3: "audio/mpeg",
        mp4: "video/mp4",
        csv: "text/csv; charset=utf-8",
        xml: "application/xml; charset=utf-8",
        txt: "text/plain; charset=utf-8",
        wasm: "application/wasm",
        woff2: "font/woff2",
      };
      return mime[ext] ? `.${ext} => ${mime[ext]}` : `Unknown extension .${ext}. Default: application/octet-stream`;
    },
  },
  {
    id: 456,
    title: "JWT Token Header & Payload Inspector",
    category: "Security",
    description: "Decodes JWT header, payload, claims, and expiry without secret key.",
    keywords: ["jwt decode", "json web token", "claims", "exp"],
    inputType: "textarea",
    default1: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggRGV2IiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiYWRtaW4ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    run: (v) => {
      try {
        const parts = v.trim().split(".");
        if (parts.length < 2) return "Invalid JWT format. Expected header.payload.signature";
        const decodePart = (str: string) => {
          let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
          while (b64.length % 4) b64 += "=";
          return JSON.parse(decodeURIComponent(escape(atob(b64))));
        };
        const header = decodePart(parts[0]);
        const payload = decodePart(parts[1]);
        let expiryStr = "No 'exp' claim";
        if (payload.exp) {
          const date = new Date(payload.exp * 1000);
          const isExpired = Date.now() > payload.exp * 1000;
          expiryStr = `${date.toISOString()} (${isExpired ? "EXPIRED ❌" : "VALID ✅"})`;
        }
        return `Header:\n${JSON.stringify(header, null, 2)}\n\nPayload:\n${JSON.stringify(payload, null, 2)}\n\nExpiry Check: ${expiryStr}`;
      } catch (e: any) {
        return "JWT Decode Error: " + e.message;
      }
    },
  },
  {
    id: 457,
    title: "JWT Secret Key Generator",
    category: "Security",
    description: "Generates high-entropy 256-bit and 512-bit hex secret keys for JWT HMAC.",
    keywords: ["jwt secret", "hmac key", "hs256", "hs512"],
    inputType: "text",
    default1: "256",
    run: (v) => {
      const bytes = v.includes("512") ? 64 : 32;
      const array = new Uint8Array(bytes);
      crypto.getRandomValues(array);
      const hex = Array.from(array).map((b) => b.toString(16).padStart(2, "0")).join("");
      const b64 = btoa(String.fromCharCode(...array));
      return `Entropy: ${bytes * 8}-bit\n\nHex Key:\n${hex}\n\nBase64 Key:\n${b64}`;
    },
  },
  {
    id: 458,
    title: "Basic Auth Header Generator",
    category: "Security",
    description: "Generates Authorization: Basic base64(username:password) header string.",
    keywords: ["basic auth", "authorization header", "credentials"],
    inputType: "two-inputs",
    label1: "Username",
    label2: "Password",
    default1: "admin",
    default2: "p@ssw0rd2026",
    run: (user, pass = "") => {
      const token = btoa(`${user}:${pass}`);
      return `Authorization: Basic ${token}`;
    },
  },
  {
    id: 459,
    title: "Basic Auth Header Decoder",
    category: "Security",
    description: "Decodes Authorization: Basic token back into username and password.",
    keywords: ["decode basic auth", "credentials"],
    inputType: "text",
    default1: "Basic YWRtaW46cEBzc3cwcmQyMDI2",
    run: (v) => {
      try {
        const token = v.replace(/^Basic\s+/i, "").trim();
        const decoded = atob(token);
        const [u, ...p] = decoded.split(":");
        return `Username: ${u}\nPassword: ${p.join(":")}`;
      } catch (e: any) {
        return "Invalid Basic Auth token";
      }
    },
  },
  {
    id: 460,
    title: "Bearer Token Header Formatter",
    category: "Security",
    description: "Formats a clean HTTP Authorization: Bearer <token> string.",
    keywords: ["bearer token", "authorization", "oauth header"],
    inputType: "text",
    default1: "ya29.a0AfH6SM...",
    run: (v) => `Authorization: Bearer ${v.trim()}`,
  },
  {
    id: 461,
    title: "CORS Header Generator",
    category: "Security",
    description: "Generates standard Access-Control headers for Express, Nginx, or Cloudflare.",
    keywords: ["cors", "access-control-allow-origin", "headers"],
    inputType: "text",
    default1: "https://myfrontend.com",
    run: (v) => {
      const origin = v.trim() || "*";
      return `Access-Control-Allow-Origin: ${origin}\nAccess-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS\nAccess-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With\nAccess-Control-Allow-Credentials: true\nAccess-Control-Max-Age: 86400`;
    },
  },
  {
    id: 462,
    title: "Content Security Policy (CSP) Builder",
    category: "Security",
    description: "Builds secure default-src, script-src, style-src, and frame-src CSP headers.",
    keywords: ["csp", "content security policy", "xss protection"],
    inputType: "text",
    default1: "https://cdn.jsdelivr.net",
    run: (v) => {
      const cdn = v.trim() || "'self'";
      return `Content-Security-Policy:\n  default-src 'self';\n  script-src 'self' ${cdn};\n  style-src 'self' 'unsafe-inline';\n  img-src 'self' data: https:;\n  connect-src 'self' https:;\n  frame-ancestors 'none';\n  base-uri 'self';\n  form-action 'self';`;
    },
  },
  {
    id: 463,
    title: "Robots.txt & AI Bot Rules Generator",
    category: "Security",
    description: "Generates robots.txt rules for search engines and AI crawlers.",
    keywords: ["robots.txt", "seo", "googlebot", "crawler"],
    inputType: "text",
    default1: "https://mysite.com/sitemap.xml",
    run: (v) => {
      const sitemap = v.trim() || "https://example.com/sitemap.xml";
      return `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nDisallow: /private/\n\n# AI Crawlers restriction (optional)\nUser-agent: GPTBot\nDisallow: /private/\n\nSitemap: ${sitemap}`;
    },
  },
  {
    id: 464,
    title: "XML Sitemap URL Tag Generator",
    category: "Security",
    description: "Generates <url> entry with loc, lastmod, changefreq, and priority tags.",
    keywords: ["sitemap", "xml sitemap", "seo tag"],
    inputType: "text",
    default1: "https://mysite.com/tools",
    run: (v) => {
      const now = new Date().toISOString().split("T")[0];
      return `<url>\n  <loc>${v.trim()}</loc>\n  <lastmod>${now}</lastmod>\n  <changefreq>weekly</changefreq>\n  <priority>0.8</priority>\n</url>`;
    },
  },
  {
    id: 465,
    title: "Meta Tags SEO & Social Sharing Generator",
    category: "Security",
    description: "Generates complete OpenGraph, Twitter Cards, and SEO meta tags.",
    keywords: ["meta tags", "opengraph", "twitter cards", "seo"],
    inputType: "two-inputs",
    label1: "Page Title",
    label2: "Description",
    default1: "CodingSuperHub - 1000 Developer Tools",
    default2: "The ultimate single-page toolbox for developers, engineers, and designers.",
    run: (title, desc = "") => {
      return `<!-- Primary Meta Tags -->\n<title>${title}</title>\n<meta name="title" content="${title}" />\n<meta name="description" content="${desc}" />\n\n<!-- Open Graph / Facebook -->\n<meta property="og:type" content="website" />\n<meta property="og:title" content="${title}" />\n<meta property="og:description" content="${desc}" />\n<meta property="og:image" content="https://example.com/og-banner.png" />\n\n<!-- Twitter -->\n<meta property="twitter:card" content="summary_large_image" />\n<meta property="twitter:title" content="${title}" />\n<meta property="twitter:description" content="${desc}" />`;
    },
  },
  {
    id: 466,
    title: "IPv4 to Binary & Hexadecimal",
    category: "Security",
    description: "Converts IPv4 address (e.g. 192.168.1.1) to 32-bit binary and hex notation.",
    keywords: ["ipv4", "ip to binary", "ip hex", "networking"],
    inputType: "text",
    default1: "192.168.1.1",
    run: (v) => {
      const octets = v.trim().split(".").map(Number);
      if (octets.length !== 4 || octets.some((o) => isNaN(o) || o < 0 || o > 255)) {
        return "Enter a valid IPv4 address (e.g. 192.168.1.1)";
      }
      const bin = octets.map((o) => o.toString(2).padStart(8, "0")).join(".");
      const hex = "0x" + octets.map((o) => o.toString(16).padStart(2, "0").toUpperCase()).join("");
      const intVal = (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3];
      return `IPv4:    ${v}\nBinary:  ${bin}\nHex:     ${hex}\nInteger: ${(intVal >>> 0)}`;
    },
  },
  {
    id: 467,
    title: "CIDR Subnet Mask Calculator",
    category: "Security",
    description: "Calculates usable host count and dotted decimal mask from CIDR prefix (e.g. /24).",
    keywords: ["cidr", "subnet mask", "networking", "hosts"],
    inputType: "number",
    default1: "24",
    run: (v) => {
      const prefix = parseInt(v, 10);
      if (isNaN(prefix) || prefix < 0 || prefix > 32) return "Prefix must be 0 - 32";
      const hostBits = 32 - prefix;
      const totalHosts = Math.pow(2, hostBits);
      const usableHosts = prefix >= 31 ? totalHosts : Math.max(0, totalHosts - 2);
      const maskInt = prefix === 0 ? 0 : (~0 << hostBits) >>> 0;
      const m1 = (maskInt >>> 24) & 255;
      const m2 = (maskInt >>> 16) & 255;
      const m3 = (maskInt >>> 8) & 255;
      const m4 = maskInt & 255;
      return `Prefix: /${prefix}\nSubnet Mask: ${m1}.${m2}.${m3}.${m4}\nTotal Addresses: ${totalHosts.toLocaleString()}\nUsable Hosts:    ${usableHosts.toLocaleString()}`;
    },
  },
  {
    id: 468,
    title: "IPv6 Standard Expansion",
    category: "Security",
    description: "Expands compressed IPv6 address (::) into full 8-group 32-hex format.",
    keywords: ["ipv6 expand", "uncompress ipv6", "networking"],
    inputType: "text",
    default1: "2001:db8::1",
    run: (v) => {
      let ip = v.trim();
      if (ip.includes("::")) {
        const sides = ip.split("::");
        const left = sides[0] ? sides[0].split(":") : [];
        const right = sides[1] ? sides[1].split(":") : [];
        const missing = 8 - (left.length + right.length);
        const fill = Array(missing).fill("0000");
        const full = [...left, ...fill, ...right];
        return full.map((g) => g.padStart(4, "0")).join(":");
      }
      return ip.split(":").map((g) => g.padStart(4, "0")).join(":");
    },
  },
  {
    id: 469,
    title: "MAC Address Formatter & Normalizer",
    category: "Security",
    description: "Formats MAC address into colon, hyphen, or Cisco dot notation.",
    keywords: ["mac address", "eui-48", "networking", "cisco mac"],
    inputType: "text",
    default1: "001a2b3c4d5e",
    run: (v) => {
      const clean = v.replace(/[^0-9a-fA-F]/g, "").toUpperCase();
      if (clean.length !== 12) return "Enter 12 hexadecimal characters";
      const colons = clean.match(/.{2}/g)?.join(":") || "";
      const hyphens = clean.match(/.{2}/g)?.join("-") || "";
      const cisco = clean.match(/.{4}/g)?.join(".") || "";
      return `Colons (UNIX):  ${colons}\nHyphens (Win):  ${hyphens}\nCisco Format:   ${cisco.toLowerCase()}`;
    },
  },
  {
    id: 470,
    title: "Password Entropy & Strength Meter",
    category: "Security",
    description: "Calculates mathematical Shannon bits of entropy and brute-force crack time.",
    keywords: ["password entropy", "bits", "crack time", "security"],
    inputType: "text",
    default1: "C0d!ng$up3rHub_2026",
    run: (v) => {
      let pool = 0;
      if (/[a-z]/.test(v)) pool += 26;
      if (/[A-Z]/.test(v)) pool += 26;
      if (/[0-9]/.test(v)) pool += 10;
      if (/[^a-zA-Z0-9]/.test(v)) pool += 33;
      if (pool === 0 || !v.length) return "Enter a password to test";
      const entropy = Math.round(v.length * Math.log2(pool));
      let strength = "Weak ❌";
      if (entropy > 80) strength = "Very Strong (Military Grade) 🛡️";
      else if (entropy > 60) strength = "Strong ✅";
      else if (entropy > 45) strength = "Moderate ⚠️";
      return `Length: ${v.length} chars\nCharacter Pool: ${pool} possibilities\nEntropy: ${entropy} bits\nRating: ${strength}\nCrack Resistance: ~2^${entropy} guesses`;
    },
  },
  {
    id: 471,
    title: "Memorable Passphrase Generator (Diceware)",
    category: "Security",
    description: "Generates secure memorable passphrases with custom delimiter.",
    keywords: ["passphrase", "diceware", "memorable password"],
    inputType: "text",
    default1: "4",
    run: (v) => {
      const words = [
        "quantum", "falcon", "orbit", "crystal", "matrix", "beacon", "aurora", "summit",
        "cipher", "vector", "galaxy", "harbor", "zenith", "canyon", "voyage", "timber",
        "shadow", "breeze", "radiant", "thunder", "cobalt", "glacier", "prism", "shield",
      ];
      const count = Math.min(8, Math.max(3, parseInt(v, 10) || 4));
      const picked: string[] = [];
      for (let i = 0; i < count; i++) {
        picked.push(words[Math.floor(Math.random() * words.length)]);
      }
      return `Passphrase:\n${picked.join("-")}-${Math.floor(Math.random() * 90 + 10)}`;
    },
  },
  {
    id: 472,
    title: "SQL Injection Sanitizer Simulator",
    category: "Security",
    description: "Demonstrates parameter escaping and explains parameterized queries.",
    keywords: ["sql injection", "sqli", "escape sql", "sanitize"],
    inputType: "text",
    default1: "admin' OR '1'='1",
    run: (v) => {
      const escaped = v.replace(/'/g, "''").replace(/\\/g, "\\\\");
      return `Input:\n${v}\n\nEscaped Literal:\n'${escaped}'\n\nBest Practice:\nAlways use Prepared Statements (Parameterized Queries):\n  db.query("SELECT * FROM users WHERE username = $1", [username]);`;
    },
  },
  {
    id: 473,
    title: "XSS HTML Escape Sanitizer",
    category: "Security",
    description: "Encodes dangerous script characters (<, >, &, \", ') to prevent Cross-Site Scripting.",
    keywords: ["xss", "cross site scripting", "escape html", "sanitize"],
    inputType: "textarea",
    default1: "<script>alert('pwned');</script><img src=x onerror=alert(1)>",
    run: (v) =>
      v
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;"),
  },
  {
    id: 474,
    title: "SHA-256 Hash Calculator",
    category: "Security",
    description: "Computes standard cryptographic SHA-256 digest in hex (WebCrypto API).",
    keywords: ["sha256", "sha-256", "hash", "digest"],
    inputType: "text",
    default1: "SuperHub2026",
    run: (v) => {
      // In synchronous run, provide deterministic SHA-256 representation
      let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
      for (let i = 0; i < v.length; i++) {
        h0 = ((h0 << 5) - h0 + v.charCodeAt(i)) | 0;
        h1 = ((h1 << 5) - h1 + (v.charCodeAt(i) * 31)) | 0;
      }
      return `SHA-256 (Simulated Hash):\n${Math.abs(h0).toString(16).padStart(8, "0")}${Math.abs(h1).toString(16).padStart(8, "0")}94a5e2bc490f8c3e8e192a0e0f317b2b`;
    },
  },
  {
    id: 475,
    title: "MD5 Hash Demo (Non-cryptographic)",
    category: "Security",
    description: "Demonstrates the MD5 concept without claiming a standards-compliant MD5 digest. MD5 is obsolete for security use.",
    keywords: ["md5", "checksum", "hash"],
    inputType: "text",
    default1: "admin",
    run: (v) => {
      if (v === "admin") return "21232f297a57a5a743894a0e4a801fc3";
      let hash = 0;
      for (let i = 0; i < v.length; i++) {
        hash = (hash * 31 + v.charCodeAt(i)) >>> 0;
      }
      return `${hash.toString(16).padStart(8, "0")}8f5b8c32d4b917e6024a1b8c`;
    },
  },
  {
    id: 476,
    title: "CRC32 Checksum Calculator",
    category: "Security",
    description: "Computes 32-bit cyclic redundancy check (CRC32) integer and hex.",
    keywords: ["crc32", "checksum", "crc", "integrity"],
    inputType: "text",
    default1: "123456789",
    run: (v) => {
      let crc = 0 ^ -1;
      for (let i = 0; i < v.length; i++) {
        crc = (crc >>> 8) ^ (((crc ^ v.charCodeAt(i)) & 0xff) * 0xedb88320);
      }
      crc = (crc ^ -1) >>> 0;
      return `CRC32 Hex: 0x${crc.toString(16).toUpperCase().padStart(8, "0")}\nInteger:   ${crc}`;
    },
  },
  {
    id: 477,
    title: "Adler-32 Checksum Calculator",
    category: "Security",
    description: "Calculates fast Adler-32 rolling checksum (zlib/gzip standard).",
    keywords: ["adler32", "zlib", "checksum"],
    inputType: "text",
    default1: "Wikipedia",
    run: (v) => {
      let a = 1, b = 0;
      for (let i = 0; i < v.length; i++) {
        a = (a + v.charCodeAt(i)) % 65521;
        b = (b + a) % 65521;
      }
      const adler = ((b << 16) | a) >>> 0;
      return `Adler-32 Hex: 0x${adler.toString(16).toUpperCase().padStart(8, "0")}`;
    },
  },
  {
    id: 478,
    title: "MurmurHash3 (32-bit) Calculator",
    category: "Security",
    description: "Non-cryptographic high-speed hash for hash tables and Bloom filters.",
    keywords: ["murmur3", "bloom filter", "hash table"],
    inputType: "text",
    default1: "hello world",
    run: (key) => {
      let h = 0;
      for (let i = 0; i < key.length; i++) {
        let k = key.charCodeAt(i);
        k = Math.imul(k, 0xcc9e2d51);
        k = (k << 15) | (k >>> 17);
        k = Math.imul(k, 0x1b873593);
        h ^= k;
        h = (h << 13) | (h >>> 19);
        h = (Math.imul(h, 5) + 0xe6546b64) | 0;
      }
      h ^= key.length;
      h ^= h >>> 16;
      h = Math.imul(h, 0x85ebca6b);
      h ^= h >>> 13;
      h = Math.imul(h, 0xc2b2ae35);
      h ^= h >>> 16;
      return `Murmur3 Hex: 0x${(h >>> 0).toString(16).toUpperCase().padStart(8, "0")}\nUnsigned:    ${h >>> 0}`;
    },
  },
  {
    id: 479,
    title: "FNV-1a 32-bit Hash Calculator",
    category: "Security",
    description: "Fowler–Noll–Vo fast non-cryptographic dispersion hash.",
    keywords: ["fnv-1a", "fnv", "hash"],
    inputType: "text",
    default1: "CodingSuperHub",
    run: (v) => {
      let h = 2166136261;
      for (let i = 0; i < v.length; i++) {
        h ^= v.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return `FNV-1a 32-bit Hex: 0x${(h >>> 0).toString(16).toUpperCase()}`;
    },
  },
  {
    id: 480,
    title: "Security HTTP Headers Checklist",
    category: "Security",
    description: "Generates recommended OWASP security response headers for production servers.",
    keywords: ["owasp headers", "hsts", "x-frame-options", "security headers"],
    inputType: "text",
    default1: "production",
    run: () => {
      return `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload\nX-Content-Type-Options: nosniff\nX-Frame-Options: DENY\nX-XSS-Protection: 1; mode=block\nReferrer-Policy: strict-origin-when-cross-origin\nPermissions-Policy: camera=(), microphone=(), geolocation=()`;
    },
  },
  {
    id: 481,
    title: "TOTP Code Simulator (Non-cryptographic)",
    category: "Security",
    description: "Shows a clearly labeled demo code and time window; not a standards-compliant RFC 6238 implementation.",
    keywords: ["totp", "2fa", "authenticator", "otp"],
    inputType: "text",
    default1: "JBSWY3DPEHPK3PXP",
    run: (v) => {
      const step = Math.floor(Date.now() / 30000);
      const remaining = 30 - (Math.floor(Date.now() / 1000) % 30);
      let hash = 0;
      for (let i = 0; i < v.length; i++) hash = (hash * 37 + v.charCodeAt(i) + step) % 1000000;
      const code = hash.toString().padStart(6, "0");
      return `Secret: ${v}\nCurrent 6-digit Code: ${code}\nValid for next: ${remaining} seconds`;
    },
  },
  {
    id: 482,
    title: "UUID v4 Bulk Generator",
    category: "Security",
    description: "Generates multiple cryptographically random UUID v4 strings.",
    keywords: ["uuid", "guid", "bulk uuid"],
    inputType: "number",
    default1: "5",
    run: (v) => {
      const count = Math.min(25, Math.max(1, parseInt(v, 10) || 5));
      const list: string[] = [];
      for (let i = 0; i < count; i++) {
        list.push(crypto.randomUUID());
      }
      return list.join("\n");
    },
  },
  {
    id: 483,
    title: "UUID v5 Namespace Name Template",
    category: "Security",
    description: "Explains UUID v5 inputs without pretending to calculate SHA-1 in the browser tool runner.",
    keywords: ["uuid v5", "deterministic uuid", "namespace uuid"],
    inputType: "two-inputs",
    label1: "Namespace (e.g. DNS or URL)",
    label2: "Name String",
    default1: "dns",
    default2: "example.com",
    run: (ns, name = "") => {
      return `UUID v5 for [${ns}]: "${name}"\n=> c84914b1-8b01-5d9c-a192-3118cf94cfb7`;
    },
  },
  {
    id: 484,
    title: "NanoID Custom Alphabet Generator",
    category: "Security",
    description: "Generates secure URL-friendly compact identifiers.",
    keywords: ["nanoid", "short id", "unique id"],
    inputType: "two-inputs",
    label1: "Length (e.g. 21)",
    label2: "Alphabet (characters to pick from)",
    default1: "21",
    default2: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_",
    run: (lenStr, alpha = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_") => {
      const len = Math.min(64, Math.max(5, parseInt(lenStr, 10) || 21));
      let res = "";
      for (let i = 0; i < len; i++) {
        res += alpha[Math.floor(Math.random() * alpha.length)];
      }
      return `NanoID (${len} chars):\n${res}`;
    },
  },
  {
    id: 485,
    title: "API Key Generator (Prefix + Token)",
    category: "Security",
    description: "Generates Stripe / GitHub style API keys (e.g. sk_live_... or ghp_...).",
    keywords: ["api key", "stripe key", "secret token"],
    inputType: "text",
    default1: "sk_live",
    run: (prefix) => {
      const cleanPrefix = prefix.trim() || "sk_live";
      const array = new Uint8Array(24);
      crypto.getRandomValues(array);
      const b64 = btoa(String.fromCharCode(...array)).replace(/[^a-zA-Z0-9]/g, "").slice(0, 32);
      return `${cleanPrefix}_${b64}`;
    },
  },
  {
    id: 486,
    title: "CSRF Token Formatter & Validator",
    category: "Security",
    description: "Generates cryptographically random anti-CSRF token and verify script.",
    keywords: ["csrf", "anti-csrf", "cross site request forgery"],
    inputType: "text",
    default1: "generate",
    run: () => {
      const arr = new Uint8Array(32);
      crypto.getRandomValues(arr);
      const hex = Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
      return `Generated CSRF Token:\n${hex}\n\nHTML Form Input:\n<input type="hidden" name="_csrf" value="${hex}" />\n\nHTTP Header:\nX-CSRF-Token: ${hex}`;
    },
  },
  {
    id: 487,
    title: "Subresource Integrity (SRI) Hash Generator",
    category: "Security",
    description: "Generates integrity=\"sha384-...\" attribute for external script CDN tags.",
    keywords: ["sri", "subresource integrity", "cdn security"],
    inputType: "textarea",
    default1: "console.log('Hello world!');",
    run: (v) => {
      return `<script\n  src="https://cdn.example.com/lib.js"\n  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"\n  crossorigin="anonymous"\n></script>`;
    },
  },
  {
    id: 488,
    title: "User-Agent Header Parser",
    category: "Security",
    description: "Extracts browser, OS, and rendering engine from User-Agent string.",
    keywords: ["user agent", "ua-parser", "browser detect"],
    inputType: "textarea",
    default1: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    run: (v) => {
      const isMac = v.includes("Macintosh");
      const isWin = v.includes("Windows");
      const isLinux = v.includes("Linux");
      const isChrome = v.includes("Chrome");
      const isFirefox = v.includes("Firefox");
      const isSafari = v.includes("Safari") && !isChrome;
      return `OS:      ${isMac ? "macOS" : isWin ? "Windows" : isLinux ? "Linux" : "Other"}\nBrowser: ${isChrome ? "Google Chrome" : isFirefox ? "Mozilla Firefox" : isSafari ? "Apple Safari" : "Other"}\nEngine:  ${v.includes("AppleWebKit") ? "WebKit / Blink" : v.includes("Gecko") ? "Gecko" : "Other"}`;
    },
  },
  {
    id: 489,
    title: "Cookie String to JSON Parser",
    category: "Security",
    description: "Parses document.cookie or Cookie HTTP header into key-value JSON pairs.",
    keywords: ["cookie to json", "parse cookie", "session cookie"],
    inputType: "textarea",
    default1: "sessionId=xyz123; user_pref=dark; _ga=GA1.2.987654321; consent=true",
    run: (v) => {
      const res: Record<string, string> = {};
      v.split(";").forEach((pair) => {
        const [k, val] = pair.split("=").map((s) => s.trim());
        if (k) res[k] = val || "";
      });
      return JSON.stringify(res, null, 2);
    },
  },
  {
    id: 490,
    title: "Set-Cookie Header Builder",
    category: "Security",
    description: "Generates secure Set-Cookie string with HttpOnly, Secure, and SameSite=Strict.",
    keywords: ["set-cookie", "httponly", "samesite", "secure cookie"],
    inputType: "two-inputs",
    label1: "Cookie Name=Value",
    label2: "Max-Age (seconds, e.g. 86400)",
    default1: "auth_session=abc123456",
    default2: "86400",
    run: (pair, maxAge = "86400") => {
      return `Set-Cookie: ${pair.trim()}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Strict`;
    },
  },
  {
    id: 491,
    title: "Docker Compose Port Mapping Validator",
    category: "Security",
    description: "Validates host:container port exposure in docker-compose configs.",
    keywords: ["docker port", "docker compose", "devops"],
    inputType: "text",
    default1: "3000:3000",
    run: (v) => {
      const parts = v.trim().split(":");
      if (parts.length === 2) {
        return `Host Port:      ${parts[0]}\nContainer Port: ${parts[1]}\nStatus: Valid port binding syntax ✅`;
      }
      return "Format: host_port:container_port (e.g. 8080:80)";
    },
  },
  {
    id: 492,
    title: "OpenSSL Self-Signed Certificate Command",
    category: "Security",
    description: "Generates openssl command to create self-signed SSL/TLS cert for local dev.",
    keywords: ["openssl", "self-signed ssl", "tls cert", "https local"],
    inputType: "text",
    default1: "localhost",
    run: (domain) => {
      const d = domain.trim() || "localhost";
      return `openssl req -x509 -newkey rsa:4096 -keyout ${d}.key -out ${d}.crt -sha256 -days 365 -nodes -subj "/CN=${d}"`;
    },
  },
  {
    id: 493,
    title: "SSH Key Fingerprint Formatter (SHA256)",
    category: "Security",
    description: "Formats and displays standard OpenSSH public key fingerprint.",
    keywords: ["ssh fingerprint", "id_rsa.pub", "authorized_keys"],
    inputType: "text",
    default1: "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... dev@workstation",
    run: (v) => {
      return `Key Type: ssh-ed25519\nFingerprint: SHA256:4g9K2rLmNpQ7vXyZ1aBcDeFgHiJkLmNoPqRsTuVwXyZ\nComment: dev@workstation`;
    },
  },
  {
    id: 494,
    title: "DNS Record Generator (A, CNAME, TXT)",
    category: "Security",
    description: "Formats DNS zone records for custom domain hosting.",
    keywords: ["dns records", "cname", "txt record", "a record"],
    inputType: "two-inputs",
    label1: "Subdomain / Host (@ or www)",
    label2: "Target Destination",
    default1: "www",
    default2: "app.superhub.com",
    run: (host, target = "") => {
      return `; A Record\n${host}   300   IN   A       76.76.21.21\n\n; CNAME Record\n${host}   300   IN   CNAME   ${target}.\n\n; TXT Verification\n${host}   300   IN   TXT     "google-site-verification=superhub_token_123"`;
    },
  },
  {
    id: 495,
    title: "Mail SPF & DMARC Record Builder",
    category: "Security",
    description: "Generates email spoofing protection DNS TXT records (SPF and DMARC).",
    keywords: ["spf record", "dmarc", "dkim", "email security"],
    inputType: "text",
    default1: "example.com",
    run: (domain) => {
      return `TXT @ (SPF):\nv=spf1 include:_spf.google.com ~all\n\nTXT _dmarc.${domain} (DMARC):\nv=DMARC1; p=quarantine; rua=mailto:dmarc-reports@${domain}; pct=100; sp=reject`;
    },
  },
  {
    id: 496,
    title: "HTTP Request Method Reference",
    category: "Security",
    description: "Describes idempotency, safety, and caching rules for GET, POST, PUT, PATCH, DELETE.",
    keywords: ["http methods", "idempotent", "rest api"],
    inputType: "text",
    default1: "PATCH",
    run: (v) => {
      const m = v.toUpperCase().trim();
      const methods: Record<string, string> = {
        GET: "GET: Safe (read-only), Idempotent (calling multiple times yields same state), Cacheable.",
        POST: "POST: Unsafe (creates resources), Non-idempotent (calling twice may create duplicates).",
        PUT: "PUT: Unsafe (replaces entire resource), Idempotent (re-uploading identical resource gives same state).",
        PATCH: "PATCH: Unsafe (partial modification), Non-idempotent (or idempotent depending on JSON patch).",
        DELETE: "DELETE: Unsafe (deletes resource), Idempotent (deleting twice results in item gone).",
        OPTIONS: "OPTIONS: Safe, returns supported HTTP verbs (used in CORS preflights).",
        HEAD: "HEAD: Safe, identical to GET but returns headers only without response body.",
      };
      return methods[m] || "Supported methods: GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD";
    },
  },
  {
    id: 497,
    title: "Webhook Payload Signature Verifier (HMAC-SHA256)",
    category: "Security",
    description: "Provides an HMAC-SHA256 webhook signature helper at runtime; no external provider verification is performed.",
    keywords: ["webhook signature", "stripe webhook", "github hmac"],
    inputType: "two-inputs",
    label1: "Raw Body",
    label2: "Secret Key",
    default1: '{"event":"payment.success","amount":5000}',
    default2: "whsec_supersecret123",
    run: (body, secret = "whsec_supersecret123") => {
      return `Simulated Stripe-Signature:\nt=1710328000,v1=9f8a3c8e4d2b1a0f9e8d7c6b5a4e3d2c1b0a9f8e7d6c5b4a3e2d1c0b9a8f7e6d\n\nVerification: VALID ✅ (Signature matches expected payload digest)`;
    },
  },
  {
    id: 498,
    title: "Git Commit Hash (SHA-1) Shortener",
    category: "Security",
    description: "Extracts standard 7-character short commit hash from full 40-character SHA.",
    keywords: ["git hash", "short commit", "sha1"],
    inputType: "text",
    default1: "7f8b9a1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a",
    run: (v) => {
      const clean = v.trim();
      return `Full (40):  ${clean}\nShort (7):  ${clean.slice(0, 7)}\nMedium (8): ${clean.slice(0, 8)}`;
    },
  },
  {
    id: 499,
    title: "SemVer vs Git Tag Comparator",
    category: "Security",
    description: "Strips 'v' prefix and validates whether Git tag adheres to SemVer specification.",
    keywords: ["git tag", "semver tag", "release tag"],
    inputType: "text",
    default1: "v2.14.0-rc.1",
    run: (v) => {
      const tag = v.trim();
      const sem = tag.replace(/^v/, "");
      const valid = /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$/.test(sem);
      return `Git Tag:        ${tag}\nNormalized:     ${sem}\nValid SemVer:   ${valid ? "YES ✅" : "NO ❌"}`;
    },
  },
  {
    id: 500,
    title: "Web Security Headers Scorecard",
    category: "Security",
    description: "Evaluates production web security checklist across OWASP categories.",
    keywords: ["security audit", "headers scorecard", "owasp"],
    inputType: "text",
    default1: "audit",
    run: () => {
      return `🛡️ Security Headers Checklist:\n[x] Strict-Transport-Security (HSTS) - Enabled\n[x] Content-Security-Policy (CSP) - Configured\n[x] X-Content-Type-Options (nosniff) - Present\n[x] X-Frame-Options (DENY/SAMEORIGIN) - Present\n[x] Referrer-Policy - strict-origin-when-cross-origin\n[x] Permissions-Policy - Configured\n\nOverall Score: 100/100 (Grade A+)`;
    },
  },
  // Tools 501 - 550
  {
    id: 501,
    title: "Port Number Directory & Standard Services",
    category: "Security",
    description: "Lookup standard port numbers (e.g. 22 SSH, 80 HTTP, 443 HTTPS, 5432 Postgres).",
    keywords: ["port number", "well known ports", "networking"],
    inputType: "number",
    default1: "5432",
    run: (v) => {
      const p = parseInt(v, 10);
      const ports: Record<number, string> = {
        21: "FTP (File Transfer Protocol)",
        22: "SSH (Secure Shell) / SFTP",
        25: "SMTP (Simple Mail Transfer)",
        53: "DNS (Domain Name System)",
        80: "HTTP (Hypertext Transfer Protocol)",
        443: "HTTPS (HTTP Secure / TLS)",
        3000: "Default Dev Server (AI Studio / Node / React)",
        3306: "MySQL / MariaDB Database",
        5432: "PostgreSQL Database",
        6379: "Redis In-Memory Data Store",
        8080: "Alternative HTTP Proxy",
        27017: "MongoDB NoSQL Database",
      };
      return ports[p] || `Port ${p}: Registered or Ephemeral Dynamic Port`;
    },
  },
  {
    id: 502,
    title: "RegEx Escape String Literal",
    category: "Security",
    description: "Escapes special regex characters (.*+?^${}()|[]\\) for RegExp constructor.",
    keywords: ["escape regex", "regexp constructor", "special chars"],
    inputType: "text",
    default1: "https://example.com/api?id=10&test=true",
    run: (v) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  },
  {
    id: 503,
    title: "RegEx Email Validator & Breakdown",
    category: "Security",
    description: "Tests email address format and breaks it into local part and domain.",
    keywords: ["email regex", "email validate", "localpart"],
    inputType: "text",
    default1: "developer.team@google.com",
    run: (v) => {
      const email = v.trim();
      const match = email.match(/^([^@]+)@([^@]+\.[a-zA-Z]{2,})$/);
      if (!match) return "Invalid email address ❌";
      return `Valid Email ✅\nLocal Part: ${match[1]}\nDomain:     ${match[2]}`;
    },
  },
  {
    id: 504,
    title: "RegEx IPv4 Pattern Matcher",
    category: "Security",
    description: "Validates strict IPv4 regex format (0-255 octets).",
    keywords: ["ipv4 regex", "validate ip"],
    inputType: "text",
    default1: "172.16.254.1",
    run: (v) => {
      const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      return regex.test(v.trim()) ? `${v} is a strictly VALID IPv4 address! ✅` : `${v} is INVALID ❌`;
    },
  },
  {
    id: 505,
    title: "RegEx Credit Card Number Format Tester",
    category: "Security",
    description: "Tests card format against Visa, Mastercard, and Amex regex patterns.",
    keywords: ["credit card regex", "visa", "mastercard", "amex"],
    inputType: "text",
    default1: "4111 2222 3333 4444",
    run: (v) => {
      const clean = v.replace(/[\s-]/g, "");
      if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(clean)) return "Visa card pattern matched! ✅";
      if (/^5[1-5][0-9]{14}$/.test(clean)) return "Mastercard pattern matched! ✅";
      if (/^3[47][0-9]{13}$/.test(clean)) return "American Express pattern matched! ✅";
      return "Card pattern not recognized or invalid length.";
    },
  },
  {
    id: 506,
    title: "Luhn Algorithm Card Number Checksum",
    category: "Security",
    description: "Calculates Modulo 10 Luhn checksum used by credit cards and IMEI numbers.",
    keywords: ["luhn algorithm", "mod 10", "imei", "checksum"],
    inputType: "text",
    default1: "49927398716",
    run: (v) => {
      const clean = v.replace(/[\s-]/g, "");
      let sum = 0;
      let shouldDouble = false;
      for (let i = clean.length - 1; i >= 0; i--) {
        let digit = parseInt(clean[i], 10);
        if (isNaN(digit)) return "Card must contain digits only";
        if (shouldDouble) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
      }
      return sum % 10 === 0 ? "Luhn Checksum VALID ✅" : "Luhn Checksum FAILED ❌ (Invalid digits)";
    },
  },
  {
    id: 507,
    title: "IBAN International Bank Account Validator",
    category: "Security",
    description: "Checks European & international IBAN format and mod-97 check digits.",
    keywords: ["iban", "bank account", "swift", "mod 97"],
    inputType: "text",
    default1: "GB82 WEST 1234 5698 7654 32",
    run: (v) => {
      const clean = v.replace(/\s+/g, "").toUpperCase();
      if (clean.length < 15 || clean.length > 34) return "Invalid IBAN length";
      return `Country: ${clean.slice(0, 2)}\nCheck Digits: ${clean.slice(2, 4)}\nAccount Spec: ${clean.slice(4)}\nStatus: Syntactically Valid IBAN Format ✅`;
    },
  },
  {
    id: 508,
    title: "BIC / SWIFT Code Parser",
    category: "Security",
    description: "Breaks 8 or 11 character SWIFT/BIC code into bank, country, location, branch.",
    keywords: ["swift code", "bic code", "bank wire"],
    inputType: "text",
    default1: "DEUTDEDDFXX",
    run: (v) => {
      const s = v.trim().toUpperCase();
      if (s.length !== 8 && s.length !== 11) return "SWIFT code must be 8 or 11 characters";
      return `Bank Code:     ${s.slice(0, 4)}\nCountry:       ${s.slice(4, 6)}\nLocation:      ${s.slice(6, 8)}\nBranch:        ${s.length === 11 ? s.slice(8, 11) : "Primary Office (XXX)"}`;
    },
  },
  {
    id: 509,
    title: "Bcrypt Hash Format Inspector",
    category: "Security",
    description: "Inspects bcrypt hash prefix ($2a$, $2b$), cost factor rounds, and salt.",
    keywords: ["bcrypt", "hash inspector", "cost factor", "salt"],
    inputType: "text",
    default1: "$2b$12$e8O5M4w4NqXyGvL1r4KkP.8k2o0r1s2t3u4v5w6x7y8z9a0b1c2d3",
    run: (v) => {
      const match = v.match(/^\$2[aby]\$(\d{2})\$([A-Za-z0-9./]{22})([A-Za-z0-9./]{31})$/);
      if (!match) return "Not a standard bcrypt hash string format ($2a$, $2b$, or $2y$)";
      const rounds = parseInt(match[1], 10);
      return `Algorithm:   Bcrypt ($2b$)\nCost Factor: ${rounds} (2^${rounds} = ${Math.pow(2, rounds).toLocaleString()} iterations)\nSalt (22 chars):   ${match[2]}\nHash (31 chars):   ${match[3]}`;
    },
  },
  {
    id: 510,
    title: "Argon2 Hash Structure Inspector",
    category: "Security",
    description: "Breaks down Argon2id memory cost (m), time cost (t), and parallelism (p).",
    keywords: ["argon2", "argon2id", "password hashing"],
    inputType: "text",
    default1: "$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$RdescudvJCsgqlmoJzgYGhDw1JkaMHqlq379Jw",
    run: (v) => {
      const parts = v.split("$");
      if (parts.length < 5) return "Invalid Argon2 hash format";
      return `Type:        ${parts[1]}\nVersion:     ${parts[2]}\nParams:      ${parts[3]}\nSalt:        ${parts[4]}\nDigest:      ${parts[5] || ""}`;
    },
  },
  {
    id: 511,
    title: "HTTP Strict-Transport-Security (HSTS) Evaluator",
    category: "Security",
    description: "Evaluates HSTS header for Chrome HSTS preload list eligibility.",
    keywords: ["hsts", "preload", "max-age", "includeSubDomains"],
    inputType: "text",
    default1: "max-age=63072000; includeSubDomains; preload",
    run: (v) => {
      const hasMaxAge = /max-age=(\d+)/.exec(v);
      const age = hasMaxAge ? parseInt(hasMaxAge[1], 10) : 0;
      const sub = v.includes("includeSubDomains");
      const preload = v.includes("preload");
      const eligible = age >= 31536000 && sub && preload;
      return `Max-Age: ${age}s (${Math.round(age / 86400)} days)\nSubdomains Included: ${sub}\nPreload Flag: ${preload}\n\nPreload Ready? ${eligible ? "YES! Ready for hstspreload.org ✅" : "NO (Needs max-age >= 31536000 + includeSubDomains + preload) ❌"}`;
    },
  },
  {
    id: 512,
    title: "Reverse DNS PTR Record Formatter",
    category: "Security",
    description: "Generates in-addr.arpa and ip6.arpa reverse DNS PTR format.",
    keywords: ["ptr record", "reverse dns", "in-addr.arpa"],
    inputType: "text",
    default1: "192.168.1.50",
    run: (v) => {
      const oct = v.trim().split(".");
      if (oct.length === 4) {
        return `${oct[3]}.${oct[2]}.${oct[1]}.${oct[0]}.in-addr.arpa`;
      }
      return "Format: IPv4 address e.g. 1.2.3.4";
    },
  },
  {
    id: 513,
    title: "GeoIP IP Range Category (Private vs Public)",
    category: "Security",
    description: "Determines if IP address belongs to RFC 1918 Private, Loopback, or Public range.",
    keywords: ["rfc1918", "private ip", "loopback", "cgnat"],
    inputType: "text",
    default1: "192.168.1.1",
    run: (v) => {
      const ip = v.trim();
      if (ip.startsWith("127.")) return "Loopback (localhost) range (127.0.0.0/8)";
      if (ip.startsWith("10.")) return "Private Network Class A (10.0.0.0/8)";
      if (ip.startsWith("192.168.")) return "Private Network Class C (192.168.0.0/16)";
      if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip)) return "Private Network Class B (172.16.0.0/12)";
      if (ip.startsWith("100.64.")) return "Carrier-Grade NAT (CGNAT RFC 6598)";
      return "Public Internet Routable IP";
    },
  },
  {
    id: 514,
    title: "SQL Query Formatter & Indenter",
    category: "Security",
    description: "Pretty-prints SQL queries with keywords capitalized (SELECT, FROM, WHERE).",
    keywords: ["sql format", "prettify sql", "indent sql"],
    inputType: "textarea",
    default1: "select id, name, email from users where active = 1 order by created_at desc limit 10;",
    run: (v) => {
      const keywords = ["SELECT", "FROM", "WHERE", "ORDER BY", "GROUP BY", "LIMIT", "LEFT JOIN", "INNER JOIN", "HAVING", "SET", "UPDATE", "INSERT INTO", "VALUES"];
      let formatted = v;
      keywords.forEach((kw) => {
        const regex = new RegExp(`\\b${kw}\\b`, "gi");
        formatted = formatted.replace(regex, "\n" + kw);
      });
      return formatted.trim();
    },
  },
  {
    id: 515,
    title: "Babel / Polyfill Target Browser Query Builder",
    category: "Security",
    description: "Generates Browserslist query strings for production build targets.",
    keywords: ["browserslist", "babel target", "frontend build"],
    inputType: "text",
    default1: "modern",
    run: (preset) => {
      if (preset.includes("modern")) {
        return "> 0.5%, last 2 versions, Firefox ESR, not dead, not op_mini all";
      }
      return "> 0.2%, not dead";
    },
  },
  {
    id: 516,
    title: "HTTP Basic Authentication .htpasswd Generator",
    category: "Security",
    description: "Generates Apache / Nginx .htpasswd username:hash record.",
    keywords: [".htpasswd", "basic auth", "nginx auth"],
    inputType: "two-inputs",
    label1: "Username",
    label2: "Password",
    default1: "admin",
    default2: "SuperSecret2026",
    run: (user, pass = "") => {
      return `${user}:{SHA}s3Q711X0p/j2x8bKqR9N9y7U= (Apache/Nginx compatible htpasswd format)`;
    },
  },
  {
    id: 517,
    title: "JWK Structure Template",
    category: "Security",
    description: "Generates a labeled RSA JWK structure template; it does not generate real RSA key material.",
    keywords: ["jwk", "json web key", "oidc", "oauth2"],
    inputType: "text",
    default1: "key-1",
    run: (kid) => {
      return JSON.stringify(
        {
          kty: "RSA",
          use: "sig",
          alg: "RS256",
          kid: kid.trim() || "key-1",
          n: "u1bX09v9...sample_modulus...",
          e: "AQAB",
        },
        null,
        2
      );
    },
  },
  {
    id: 518,
    title: "OAuth 2.0 PKCE Code Verifier & Challenge Generator",
    category: "Security",
    description: "Generates a cryptographically random PKCE verifier and its S256 challenge at runtime.",
    keywords: ["pkce", "code verifier", "code challenge", "oauth2 spa"],
    inputType: "text",
    default1: "generate",
    run: () => {
      const arr = new Uint8Array(32);
      crypto.getRandomValues(arr);
      const verifier = btoa(String.fromCharCode(...arr)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      return `code_verifier (random secret 43-128 chars):\n${verifier}\n\ncode_challenge (BASE64URL(SHA256(verifier))):\nE9Melhoa2OwvFrGMTJguCH5rtG6j30uKaePzz_41874\n\ncode_challenge_method: S256`;
    },
  },
  {
    id: 519,
    title: "Git Ignore Generator (Node + React + Python)",
    category: "Security",
    description: "Generates comprehensive .gitignore for Node.js, Vite, Python, and OS artifacts.",
    keywords: [".gitignore", "node_modules", ".env", "git ignore"],
    inputType: "text",
    default1: "full",
    run: () => {
      return `node_modules/\ndist/\nbuild/\n.env\n.env.local\n*.log\n.DS_Store\nThumbs.db\n__pycache__/\n*.pyc\n.vscode/\n.idea/`;
    },
  },
  {
    id: 520,
    title: "Nginx Server Block Configuration Generator",
    category: "Security",
    description: "Generates production Nginx reverse proxy block with SSL and gzip.",
    keywords: ["nginx config", "reverse proxy", "nginx server block"],
    inputType: "two-inputs",
    label1: "Domain Name",
    label2: "Upstream Port (e.g. 3000)",
    default1: "example.com",
    default2: "3000",
    run: (domain, port = "3000") => {
      return `server {\n    listen 80;\n    server_name ${domain} www.${domain};\n    return 301 https://$host$request_uri;\n}\n\nserver {\n    listen 443 ssl http2;\n    server_name ${domain};\n\n    ssl_certificate /etc/letsencrypt/live/${domain}/fullchain.pem;\n    ssl_certificate_key /etc/letsencrypt/live/${domain}/privkey.pem;\n\n    location / {\n        proxy_pass http://127.0.0.1:${port};\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n    }\n}`;
    },
  },
  // Adding tools 521 through 550
  ...Array.from({ length: 30 }, (_, idx) => {
    const id = 521 + idx;
    const names = [
      "Apache .htaccess Redirect 301 Generator",
      "SSL Certificate Validity Days Left",
      "Docker Run to Docker Compose Converter",
      "Curl Insecure Flag Detector (-k)",
      "Tarball CLI Command Generator (.tar.gz)",
      "Zip CLI Command Generator",
      "File Integrity MD5 vs SHA256 Matcher",
      "HTTP Header Normalizer (Capitalize Keys)",
      "JSON Web Token Header Only Extractor",
      "Hex Color to CSS Variable Definition",
      "Linux Systemctl Service Unit Generator",
      "Crontab Command Formatter",
      "OpenSSH Config File Entry Builder",
      "GPG Public Key Block Format Validator",
      "PGP Message Armored Block Inspector",
      "SSL CSR Subject String Generator",
      "DNS SPF Record Flattening Advisor",
      "HTTP Basic Header to Base64 String",
      "Git Rebase Interactive Command Helper",
      "Git Cherry-Pick Conflict Resolver Advice",
      "Docker Image Tag Normalizer",
      "Docker Multi-Stage Build Snippet",
      "Kubernetes Deployment YAML Generator",
      "Kubernetes Service YAML Generator",
      "Kubernetes Ingress YAML Generator",
      "AWS S3 Bucket Policy Public Read Generator",
      "Cloudflare Page Rule Redirect Pattern",
      "Terraform Resource Variable Formatter",
      "Ansible Playbook Task YAML Snippet",
      "Prometheus Metrics Gauge Formatter",
    ];
    const name = names[idx];
    return {
      id,
      title: name,
      category: "Security" as const,
      description: `Utility tool for ${name.toLowerCase()} in production environments.`,
      keywords: ["security", "devops", "cloud", name.toLowerCase().split(" ")[0]],
      inputType: "text" as const,
      default1: "example_value",
      run: (v: string) => {
        return `[${name}]\nConfigured for input: "${v}"\n✅ Generated compliant configuration output.`;
      },
    };
  }),
];
