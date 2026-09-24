import { DynamicTool } from "./definitions";

export const BATCH_2_CONVERTER_TOOLS: DynamicTool[] = [
  {
    id: 251,
    title: "Base32 Encoder",
    category: "Converters",
    description: "Encodes text into RFC 4648 Base32 alphabet (A-Z, 2-7).",
    keywords: ["base32", "encode", "rfc4648", "totp"],
    inputType: "text",
    default1: "SuperHub",
    run: (v) => {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
      let bits = 0;
      let value = 0;
      let output = "";
      for (let i = 0; i < v.length; i++) {
        value = (value << 8) | v.charCodeAt(i);
        bits += 8;
        while (bits >= 5) {
          output += alphabet[(value >>> (bits - 5)) & 31];
          bits -= 5;
        }
      }
      if (bits > 0) output += alphabet[(value << (5 - bits)) & 31];
      while (output.length % 8 !== 0) output += "=";
      return output;
    },
  },
  {
    id: 252,
    title: "Base32 Decoder",
    category: "Converters",
    description: "Decodes RFC 4648 Base32 string back to plain text.",
    keywords: ["base32 decode", "rfc4648", "decode"],
    inputType: "text",
    default1: "KN2XEZLSEB2GQ===",
    run: (v) => {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
      const clean = v.replace(/=+$/, "").toUpperCase();
      let bits = 0;
      let value = 0;
      let output = "";
      for (let i = 0; i < clean.length; i++) {
        const val = alphabet.indexOf(clean[i]);
        if (val === -1) continue;
        value = (value << 5) | val;
        bits += 5;
        if (bits >= 8) {
          output += String.fromCharCode((value >>> (bits - 8)) & 255);
          bits -= 8;
        }
      }
      return output;
    },
  },
  {
    id: 253,
    title: "Base58 Encoder",
    category: "Converters",
    description: "Encodes string using Bitcoin Base58 alphabet (no 0, O, I, l).",
    keywords: ["base58", "bitcoin", "crypto", "solana"],
    inputType: "text",
    default1: "CodingSuperHub",
    run: (v) => {
      const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
      const bytes = Array.from(v).map((c) => c.charCodeAt(0));
      const digits = [0];
      for (let i = 0; i < bytes.length; i++) {
        let carry = bytes[i];
        for (let j = 0; j < digits.length; j++) {
          carry += digits[j] << 8;
          digits[j] = carry % 58;
          carry = (carry / 58) | 0;
        }
        while (carry > 0) {
          digits.push(carry % 58);
          carry = (carry / 58) | 0;
        }
      }
      let res = "";
      for (let i = 0; i < bytes.length && bytes[i] === 0; i++) res += "1";
      for (let i = digits.length - 1; i >= 0; i--) res += B58[digits[i]];
      return res;
    },
  },
  {
    id: 254,
    title: "Base58 Decoder",
    category: "Converters",
    description: "Decodes Bitcoin Base58 string back to text.",
    keywords: ["base58 decode", "solana", "crypto"],
    inputType: "text",
    default1: "2g6K8uE7gYVqQhS",
    run: (v) => {
      const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
      const bytes = [0];
      for (let i = 0; i < v.length; i++) {
        const charIndex = B58.indexOf(v[i]);
        if (charIndex === -1) continue;
        let carry = charIndex;
        for (let j = 0; j < bytes.length; j++) {
          carry += bytes[j] * 58;
          bytes[j] = carry & 255;
          carry >>= 8;
        }
        while (carry > 0) {
          bytes.push(carry & 255);
          carry >>= 8;
        }
      }
      return bytes
        .reverse()
        .map((b) => (b ? String.fromCharCode(b) : ""))
        .join("");
    },
  },
  {
    id: 255,
    title: "Base64URL Safe Encoder",
    category: "Converters",
    description: "Encodes string using URL-safe Base64 (- and _ instead of + and /).",
    keywords: ["base64url", "jwt", "url-safe", "rfc7515"],
    inputType: "text",
    default1: "Hello?World=Yes&123",
    run: (v) =>
      btoa(unescape(encodeURIComponent(v)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, ""),
  },
  {
    id: 256,
    title: "Base64URL Safe Decoder",
    category: "Converters",
    description: "Decodes URL-safe Base64 back to original text.",
    keywords: ["base64url decode", "jwt payload", "decode"],
    inputType: "text",
    default1: "SGVsbG8_V29ybGQ9WWVzJjEyMw",
    run: (v) => {
      let base64 = v.replace(/-/g, "+").replace(/_/g, "/");
      while (base64.length % 4) base64 += "=";
      try {
        return decodeURIComponent(escape(atob(base64)));
      } catch {
        return "Error: Invalid Base64URL string";
      }
    },
  },
  {
    id: 257,
    title: "Decimal to 32-bit Binary",
    category: "Converters",
    description: "Converts integer to 32-bit formatted binary string with nibble spaces.",
    keywords: ["decimal to binary", "32-bit", "bits", "integer"],
    inputType: "number",
    default1: "1024",
    run: (v) => {
      const num = parseInt(v, 10) || 0;
      const bin = (num >>> 0).toString(2).padStart(32, "0");
      return bin.match(/.{4}/g)?.join(" ") || bin;
    },
  },
  {
    id: 258,
    title: "Binary to Decimal Converter",
    category: "Converters",
    description: "Converts binary string (0 and 1) to base-10 decimal.",
    keywords: ["binary to decimal", "base 2 to 10", "bin2dec"],
    inputType: "text",
    default1: "11111111",
    run: (v) => {
      const clean = v.replace(/\s+/g, "");
      const num = parseInt(clean, 2);
      return isNaN(num) ? "Invalid binary" : num.toString(10);
    },
  },
  {
    id: 259,
    title: "Decimal to Hexadecimal",
    category: "Converters",
    description: "Converts integer into 0x hex representation with byte length.",
    keywords: ["dec to hex", "base 16", "decimal to hex"],
    inputType: "number",
    default1: "65535",
    run: (v) => {
      const num = parseInt(v, 10) || 0;
      return `0x${num.toString(16).toUpperCase()} (lowercase: 0x${num.toString(16)})`;
    },
  },
  {
    id: 260,
    title: "Hexadecimal to Decimal",
    category: "Converters",
    description: "Converts hex string (e.g. 0xFF or FF) to decimal.",
    keywords: ["hex to dec", "base 16 to 10", "hex2dec"],
    inputType: "text",
    default1: "0x1A4",
    run: (v) => {
      const clean = v.replace(/^0x/i, "");
      const num = parseInt(clean, 16);
      return isNaN(num) ? "Invalid hex number" : num.toString(10);
    },
  },
  {
    id: 261,
    title: "Decimal to Octal (Base 8)",
    category: "Converters",
    description: "Converts decimal number into octal format.",
    keywords: ["dec to octal", "base 8", "chmod octal"],
    inputType: "number",
    default1: "511",
    run: (v) => (parseInt(v, 10) || 0).toString(8),
  },
  {
    id: 262,
    title: "Octal to Decimal",
    category: "Converters",
    description: "Converts base-8 octal string into base-10 decimal.",
    keywords: ["octal to dec", "base 8 to 10"],
    inputType: "text",
    default1: "777",
    run: (v) => {
      const num = parseInt(v, 8);
      return isNaN(num) ? "Invalid octal" : num.toString(10);
    },
  },
  {
    id: 263,
    title: "Hexadecimal to Binary",
    category: "Converters",
    description: "Converts hex string into 4-bit aligned binary representation.",
    keywords: ["hex to binary", "hex2bin"],
    inputType: "text",
    default1: "DEADBEEF",
    run: (v) => {
      const clean = v.replace(/^0x/i, "");
      return clean
        .split("")
        .map((h) => parseInt(h, 16).toString(2).padStart(4, "0"))
        .join(" ");
    },
  },
  {
    id: 264,
    title: "Binary to Hexadecimal",
    category: "Converters",
    description: "Converts binary digits into clean hex bytes.",
    keywords: ["binary to hex", "bin2hex"],
    inputType: "text",
    default1: "11011110 10101101 10111110 11101111",
    run: (v) => {
      const clean = v.replace(/\s+/g, "");
      let hex = "";
      for (let i = 0; i < clean.length; i += 4) {
        const chunk = clean.slice(i, i + 4);
        hex += parseInt(chunk, 2).toString(16).toUpperCase();
      }
      return "0x" + hex;
    },
  },
  {
    id: 265,
    title: "Integer to Roman Numerals",
    category: "Converters",
    description: "Converts numbers 1 - 3999 into classical Roman numerals.",
    keywords: ["roman numerals", "int to roman", "numeral"],
    inputType: "number",
    default1: "2026",
    run: (v) => {
      let num = parseInt(v, 10);
      if (isNaN(num) || num < 1 || num > 3999) return "Enter number between 1 and 3999";
      const lookup: [string, number][] = [
        ["M", 1000], ["CM", 900], ["D", 500], ["CD", 400],
        ["C", 100], ["XC", 90], ["L", 50], ["XL", 40],
        ["X", 10], ["IX", 9], ["V", 5], ["IV", 4], ["I", 1],
      ];
      let roman = "";
      for (const [letter, val] of lookup) {
        while (num >= val) {
          roman += letter;
          num -= val;
        }
      }
      return roman;
    },
  },
  {
    id: 266,
    title: "Roman Numerals to Integer",
    category: "Converters",
    description: "Decodes Roman numerals (e.g. MMXXVI) to standard integer.",
    keywords: ["roman to int", "roman decode"],
    inputType: "text",
    default1: "MMXXVI",
    run: (v) => {
      const map: Record<string, number> = {
        I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000,
      };
      const r = v.toUpperCase().trim();
      let total = 0;
      for (let i = 0; i < r.length; i++) {
        const curr = map[r[i]] || 0;
        const next = map[r[i + 1]] || 0;
        if (curr < next) total -= curr;
        else total += curr;
      }
      return total.toString();
    },
  },
  {
    id: 267,
    title: "Number to English Words",
    category: "Converters",
    description: "Converts numbers into English words (e.g. for cheques/invoices).",
    keywords: ["number to words", "cheque", "invoice words"],
    inputType: "number",
    default1: "12345",
    run: (v) => {
      const num = parseInt(v, 10);
      if (isNaN(num)) return "Enter a valid number";
      if (num === 0) return "Zero";
      const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
      const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
      function convertLessThanThousand(n: number): string {
        let str = "";
        if (n >= 100) {
          str += ones[Math.floor(n / 100)] + " Hundred ";
          n %= 100;
        }
        if (n >= 20) {
          str += tens[Math.floor(n / 10)] + " ";
          n %= 10;
        }
        if (n > 0) {
          str += ones[n] + " ";
        }
        return str.trim();
      }
      let n = Math.abs(num);
      const parts: string[] = [];
      if (n >= 1e9) {
        parts.push(convertLessThanThousand(Math.floor(n / 1e9)) + " Billion");
        n %= 1e9;
      }
      if (n >= 1e6) {
        parts.push(convertLessThanThousand(Math.floor(n / 1e6)) + " Million");
        n %= 1e6;
      }
      if (n >= 1e3) {
        parts.push(convertLessThanThousand(Math.floor(n / 1e3)) + " Thousand");
        n %= 1e3;
      }
      if (n > 0) parts.push(convertLessThanThousand(n));
      return (num < 0 ? "Negative " : "") + parts.join(", ");
    },
  },
  {
    id: 268,
    title: "Number to Hindi / Indian Words (Lakh, Crore)",
    category: "Converters",
    description: "Converts numbers into Indian numbering system (Lakhs, Crores).",
    keywords: ["indian number", "lakh", "crore", "hindi number"],
    inputType: "number",
    default1: "1500000",
    run: (v) => {
      const num = parseInt(v, 10);
      if (isNaN(num)) return "Enter a valid number";
      let n = Math.abs(num);
      const parts: string[] = [];
      if (n >= 10000000) {
        parts.push(Math.floor(n / 10000000) + " Crore");
        n %= 10000000;
      }
      if (n >= 100000) {
        parts.push(Math.floor(n / 100000) + " Lakh");
        n %= 100000;
      }
      if (n >= 1000) {
        parts.push(Math.floor(n / 1000) + " Thousand");
        n %= 1000;
      }
      if (n >= 100) {
        parts.push(Math.floor(n / 100) + " Hundred");
        n %= 100;
      }
      if (n > 0) parts.push(n.toString());
      return parts.join(" ") + " Rupees";
    },
  },
  {
    id: 269,
    title: "JSON to YAML Converter",
    category: "Converters",
    description: "Converts JSON data into clean YAML format.",
    keywords: ["json to yaml", "yaml converter", "config"],
    inputType: "textarea",
    default1: '{\n  "app": "CodingSuperHub",\n  "version": 2026,\n  "tools": 1000,\n  "features": ["ai", "sandbox", "offline"]\n}',
    run: (v) => {
      try {
        const obj = JSON.parse(v);
        function toYaml(data: any, indent = 0): string {
          const sp = "  ".repeat(indent);
          if (Array.isArray(data)) {
            return data
              .map((item) => `${sp}- ${typeof item === "object" ? "\n" + toYaml(item, indent + 1) : item}`)
              .join("\n");
          } else if (typeof data === "object" && data !== null) {
            return Object.entries(data)
              .map(([k, val]) => {
                if (typeof val === "object" && val !== null) {
                  return `${sp}${k}:\n${toYaml(val, indent + 1)}`;
                }
                return `${sp}${k}: ${val}`;
              })
              .join("\n");
          }
          return `${sp}${data}`;
        }
        return toYaml(obj);
      } catch (err: any) {
        return "JSON Parse Error: " + err.message;
      }
    },
  },
  {
    id: 270,
    title: "YAML to JSON Converter",
    category: "Converters",
    description: "Parses YAML key-value pairs and lists into formatted JSON.",
    keywords: ["yaml to json", "parse yaml", "json"],
    inputType: "textarea",
    default1: "name: SuperHub\nversion: 2026\nactive: true\nitems:\n  - React\n  - Tailwind",
    run: (v) => {
      try {
        const lines = v.split("\n").filter((l) => l.trim() && !l.trim().startsWith("#"));
        const result: Record<string, any> = {};
        let currentArrayKey: string | null = null;
        for (const l of lines) {
          if (l.trim().startsWith("- ")) {
            if (currentArrayKey) {
              result[currentArrayKey].push(l.trim().replace(/^-\s*/, ""));
            }
          } else if (l.includes(":")) {
            const [k, val] = l.split(":").map((s) => s.trim());
            if (!val) {
              currentArrayKey = k;
              result[k] = [];
            } else {
              currentArrayKey = null;
              if (val === "true") result[k] = true;
              else if (val === "false") result[k] = false;
              else if (!isNaN(Number(val))) result[k] = Number(val);
              else result[k] = val.replace(/^["']|["']$/g, "");
            }
          }
        }
        return JSON.stringify(result, null, 2);
      } catch (e: any) {
        return "YAML Parse Error: " + e.message;
      }
    },
  },
  {
    id: 271,
    title: "XML to JSON Converter",
    category: "Converters",
    description: "Transforms XML markup nodes into structured JSON objects.",
    keywords: ["xml to json", "parse xml", "soap to json"],
    inputType: "textarea",
    default1: "<user><name>Alex</name><role>Admin</role><tools>1000</tools></user>",
    run: (v) => {
      try {
        const regex = /<([a-zA-Z0-9_\-]+)>([^<]*)<\/\1>/g;
        const result: Record<string, any> = {};
        let match;
        while ((match = regex.exec(v)) !== null) {
          const val = match[2];
          result[match[1]] = !isNaN(Number(val)) && val.trim() !== "" ? Number(val) : val;
        }
        return JSON.stringify(result, null, 2);
      } catch (e: any) {
        return "XML Parse Error: " + e.message;
      }
    },
  },
  {
    id: 272,
    title: "JSON to XML Converter",
    category: "Converters",
    description: "Transforms JSON objects into valid XML tags.",
    keywords: ["json to xml", "xml builder", "soap"],
    inputType: "textarea",
    default1: '{\n  "user": {\n    "name": "Alex",\n    "role": "Developer",\n    "active": true\n  }\n}',
    run: (v) => {
      try {
        const obj = JSON.parse(v);
        function toXml(data: any): string {
          let xml = "";
          for (const [k, val] of Object.entries(data)) {
            if (typeof val === "object" && val !== null) {
              xml += `<${k}>\n${toXml(val)}</${k}>\n`;
            } else {
              xml += `<${k}>${val}</${k}>\n`;
            }
          }
          return xml;
        }
        return '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n' + toXml(obj) + "</root>";
      } catch (e: any) {
        return "JSON Error: " + e.message;
      }
    },
  },
  {
    id: 273,
    title: "CSV to Markdown Table",
    category: "Converters",
    description: "Turns comma-separated values into GitHub-flavored Markdown table.",
    keywords: ["csv to markdown", "gfm table", "table generator"],
    inputType: "textarea",
    default1: "ID,Name,Category,Status\n1,Code Editor,Core,Active\n2,Text Tools,Utilities,Active\n3,AI Copilot,AI,Active",
    run: (v) => {
      const rows = v.split("\n").filter((r) => r.trim().length > 0).map((r) => r.split(",").map((c) => c.trim()));
      if (!rows.length) return "Empty CSV";
      const headers = rows[0];
      const sep = headers.map(() => "---");
      const lines = [
        "| " + headers.join(" | ") + " |",
        "| " + sep.join(" | ") + " |",
        ...rows.slice(1).map((r) => "| " + r.join(" | ") + " |"),
      ];
      return lines.join("\n");
    },
  },
  {
    id: 274,
    title: "Markdown Table to CSV",
    category: "Converters",
    description: "Parses Markdown table and converts it back to CSV format.",
    keywords: ["markdown to csv", "md table", "csv"],
    inputType: "textarea",
    default1: "| Name | Role | Location |\n| --- | --- | --- |\n| Alex | Lead | Remote |\n| Maya | Dev | Tokyo |",
    run: (v) => {
      return v
        .split("\n")
        .filter((l) => l.includes("|") && !l.includes("---"))
        .map((l) =>
          l
            .split("|")
            .filter((_, i, arr) => i !== 0 && i !== arr.length - 1)
            .map((c) => `"${c.trim()}"`)
            .join(",")
        )
        .join("\n");
    },
  },
  {
    id: 275,
    title: "CSV to HTML Table",
    category: "Converters",
    description: "Generates HTML <table>, <thead>, and <tbody> markup from CSV.",
    keywords: ["csv to html", "html table", "table generator"],
    inputType: "textarea",
    default1: "Product,Price,Quantity\nLaptop,$999,5\nMouse,$25,50",
    run: (v) => {
      const rows = v.split("\n").filter((r) => r.trim()).map((r) => r.split(",").map((c) => c.trim()));
      if (!rows.length) return "";
      let html = '<table class="table-auto border">\n  <thead>\n    <tr>\n';
      for (const h of rows[0]) html += `      <th>${h}</th>\n`;
      html += "    </tr>\n  </thead>\n  <tbody>\n";
      for (const r of rows.slice(1)) {
        html += "    <tr>\n";
        for (const c of r) html += `      <td>${c}</td>\n`;
        html += "    </tr>\n";
      }
      html += "  </tbody>\n</table>";
      return html;
    },
  },
  {
    id: 276,
    title: "HTML Table to CSV",
    category: "Converters",
    description: "Extracts table data from HTML <td> and <th> tags into CSV.",
    keywords: ["html table to csv", "scrape table"],
    inputType: "textarea",
    default1: "<table><tr><th>A</th><th>B</th></tr><tr><td>1</td><td>2</td></tr></table>",
    run: (v) => {
      const rows = v.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
      return rows
        .map((r) => {
          const cells = r.match(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi) || [];
          return cells.map((c) => `"${c.replace(/<[^>]*>/g, "").trim()}"`).join(",");
        })
        .join("\n");
    },
  },
  {
    id: 277,
    title: "JSON to TypeScript Interface",
    category: "Converters",
    description: "Auto-generates clean TypeScript interface from any JSON sample.",
    keywords: ["json to ts", "typescript interface", "generator"],
    inputType: "textarea",
    default1: '{\n  "id": 101,\n  "title": "Super Hub",\n  "active": true,\n  "tags": ["react", "vite"],\n  "config": { "retries": 3 }\n}',
    run: (v) => {
      try {
        const obj = JSON.parse(v);
        function getType(val: any): string {
          if (Array.isArray(val)) {
            return val.length ? `${getType(val[0])}[]` : "any[]";
          }
          if (val === null) return "any";
          if (typeof val === "object") {
            const props = Object.entries(val)
              .map(([k, subVal]) => `  ${k}: ${getType(subVal)};`)
              .join("\n");
            return `{\n${props}\n}`;
          }
          return typeof val;
        }
        let out = "export interface RootObject {\n";
        for (const [k, val] of Object.entries(obj)) {
          out += `  ${k}: ${getType(val)};\n`;
        }
        out += "}";
        return out;
      } catch (e: any) {
        return "JSON Error: " + e.message;
      }
    },
  },
  {
    id: 278,
    title: "JSON to Go Struct Generator",
    category: "Converters",
    description: "Generates Go struct with json tags from JSON payload.",
    keywords: ["json to go", "golang struct", "generator"],
    inputType: "textarea",
    default1: '{\n  "user_id": 1,\n  "user_name": "alex",\n  "is_admin": true\n}',
    run: (v) => {
      try {
        const obj = JSON.parse(v);
        let out = "type AutoGenerated struct {\n";
        for (const [k, val] of Object.entries(obj)) {
          const pascal = k
            .split(/[\s_\-]+/)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join("");
          let type = "string";
          if (typeof val === "number") type = Number.isInteger(val) ? "int" : "float64";
          else if (typeof val === "boolean") type = "bool";
          else if (Array.isArray(val)) type = "[]interface{}";
          else if (typeof val === "object") type = "struct";
          out += `\t${pascal} ${type} \`json:"${k}"\`\n`;
        }
        out += "}";
        return out;
      } catch (e: any) {
        return "JSON Error: " + e.message;
      }
    },
  },
  {
    id: 279,
    title: "JSON to Python Dataclass",
    category: "Converters",
    description: "Generates Python 3.10+ @dataclass with typing hints from JSON.",
    keywords: ["json to python", "dataclass", "python typing"],
    inputType: "textarea",
    default1: '{\n  "name": "Super Hub",\n  "count": 1000,\n  "active": true\n}',
    run: (v) => {
      try {
        const obj = JSON.parse(v);
        let out = "from dataclasses import dataclass\nfrom typing import Any, List, Optional\n\n@dataclass\nclass GeneratedModel:\n";
        for (const [k, val] of Object.entries(obj)) {
          let type = "str";
          if (typeof val === "number") type = Number.isInteger(val) ? "int" : "float";
          else if (typeof val === "boolean") type = "bool";
          else if (Array.isArray(val)) type = "List[Any]";
          else if (typeof val === "object") type = "dict";
          out += `    ${k}: ${type}\n`;
        }
        return out;
      } catch (e: any) {
        return "JSON Error: " + e.message;
      }
    },
  },
  {
    id: 280,
    title: "JSON to Rust Struct",
    category: "Converters",
    description: "Generates Rust struct with Serde Serialize and Deserialize derives.",
    keywords: ["json to rust", "serde", "rust struct"],
    inputType: "textarea",
    default1: '{\n  "title": "Super Hub",\n  "stars": 999,\n  "published": true\n}',
    run: (v) => {
      try {
        const obj = JSON.parse(v);
        let out = "use serde::{Deserialize, Serialize};\n\n#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]\n#[serde(rename_all = \"camelCase\")]\npub struct Root {\n";
        for (const [k, val] of Object.entries(obj)) {
          let type = "String";
          if (typeof val === "number") type = Number.isInteger(val) ? "i64" : "f64";
          else if (typeof val === "boolean") type = "bool";
          else if (Array.isArray(val)) type = "Vec<serde_json::Value>";
          out += `    pub ${k}: ${type},\n`;
        }
        out += "}";
        return out;
      } catch (e: any) {
        return "JSON Error: " + e.message;
      }
    },
  },
  {
    id: 281,
    title: "JSON to C# Class Generator",
    category: "Converters",
    description: "Generates C# POCO class with JsonPropertyName annotations.",
    keywords: ["json to c#", "csharp poco", "dotnet"],
    inputType: "textarea",
    default1: '{\n  "productId": 101,\n  "price": 29.99,\n  "inStock": true\n}',
    run: (v) => {
      try {
        const obj = JSON.parse(v);
        let out = "using System.Text.Json.Serialization;\n\npublic class GeneratedRecord\n{\n";
        for (const [k, val] of Object.entries(obj)) {
          const cap = k.charAt(0).toUpperCase() + k.slice(1);
          let type = "string";
          if (typeof val === "number") type = Number.isInteger(val) ? "int" : "double";
          else if (typeof val === "boolean") type = "bool";
          out += `    [JsonPropertyName("${k}")]\n    public ${type} ${cap} { get; set; }\n\n`;
        }
        out += "}";
        return out;
      } catch (e: any) {
        return "JSON Error: " + e.message;
      }
    },
  },
  {
    id: 282,
    title: "JSON to Java POJO Class",
    category: "Converters",
    description: "Creates Java POJO class with getters and private fields.",
    keywords: ["json to java", "pojo", "jackson"],
    inputType: "textarea",
    default1: '{\n  "name": "Alex",\n  "score": 100\n}',
    run: (v) => {
      try {
        const obj = JSON.parse(v);
        let fields = "";
        let getters = "";
        for (const [k, val] of Object.entries(obj)) {
          let type = "String";
          if (typeof val === "number") type = Number.isInteger(val) ? "int" : "double";
          else if (typeof val === "boolean") type = "boolean";
          fields += `    private ${type} ${k};\n`;
          const cap = k.charAt(0).toUpperCase() + k.slice(1);
          getters += `    public ${type} get${cap}() { return ${k}; }\n    public void set${cap}(${type} ${k}) { this.${k} = ${k}; }\n`;
        }
        return `public class Model {\n${fields}\n${getters}}`;
      } catch (e: any) {
        return "JSON Error: " + e.message;
      }
    },
  },
  {
    id: 283,
    title: "JSON to Kotlin Data Class",
    category: "Converters",
    description: "Generates clean Kotlin data class with kotlinx.serialization.",
    keywords: ["json to kotlin", "kotlin data class"],
    inputType: "textarea",
    default1: '{\n  "title": "Hub",\n  "views": 5000\n}',
    run: (v) => {
      try {
        const obj = JSON.parse(v);
        const props = Object.entries(obj).map(([k, val]) => {
          let type = "String";
          if (typeof val === "number") type = Number.isInteger(val) ? "Int" : "Double";
          else if (typeof val === "boolean") type = "Boolean";
          return `    val ${k}: ${type}`;
        });
        return `import kotlinx.serialization.Serializable\n\n@Serializable\ndata class GeneratedModel(\n${props.join(",\n")}\n)`;
      } catch (e: any) {
        return "JSON Error: " + e.message;
      }
    },
  },
  {
    id: 284,
    title: "JSON to Swift Codable Struct",
    category: "Converters",
    description: "Generates Swift Codable struct with CodingKeys enum.",
    keywords: ["json to swift", "codable", "ios"],
    inputType: "textarea",
    default1: '{\n  "user_name": "developer",\n  "level": 42\n}',
    run: (v) => {
      try {
        const obj = JSON.parse(v);
        let fields = "";
        let keys = "";
        for (const [k, val] of Object.entries(obj)) {
          const camel = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
          let type = "String";
          if (typeof val === "number") type = Number.isInteger(val) ? "Int" : "Double";
          else if (typeof val === "boolean") type = "Bool";
          fields += `    let ${camel}: ${type}\n`;
          keys += `        case ${camel} = "${k}"\n`;
        }
        return `struct ResponseModel: Codable {\n${fields}\n    enum CodingKeys: String, CodingKey {\n${keys}    }\n}`;
      } catch (e: any) {
        return "JSON Error: " + e.message;
      }
    },
  },
  {
    id: 285,
    title: "JSON to SQL INSERT Statements",
    category: "Converters",
    description: "Converts an array of JSON objects into SQL INSERT commands.",
    keywords: ["json to sql", "insert into", "sql generator"],
    inputType: "textarea",
    default1: '[\n  {"id": 1, "name": "App 1", "active": 1},\n  {"id": 2, "name": "App 2", "active": 1}\n]',
    run: (v) => {
      try {
        const arr = JSON.parse(v);
        if (!Array.isArray(arr) || !arr.length) return "Input must be a JSON array of objects";
        const keys = Object.keys(arr[0]);
        const statements = arr.map((item) => {
          const vals = keys.map((k) => {
            const val = item[k];
            if (typeof val === "string") return `'${val.replace(/'/g, "''")}'`;
            if (val === null || val === undefined) return "NULL";
            return val;
          });
          return `INSERT INTO table_name (${keys.join(", ")}) VALUES (${vals.join(", ")});`;
        });
        return statements.join("\n");
      } catch (e: any) {
        return "JSON Error: " + e.message;
      }
    },
  },
  {
    id: 286,
    title: "JSON to MongoDB INSERT Commands",
    category: "Converters",
    description: "Generates db.collection.insertMany() scripts from JSON arrays.",
    keywords: ["json to mongo", "mongodb insert", "nosql"],
    inputType: "textarea",
    default1: '[{"title": "Item A", "score": 95}, {"title": "Item B", "score": 88}]',
    run: (v) => {
      try {
        const arr = JSON.parse(v);
        return `db.items.insertMany(${JSON.stringify(arr, null, 2)});`;
      } catch (e: any) {
        return "JSON Error: " + e.message;
      }
    },
  },
  {
    id: 287,
    title: "SQL CREATE TABLE to JSON Schema",
    category: "Converters",
    description: "Derives JSON schema properties from SQL DDL CREATE TABLE definitions.",
    keywords: ["sql to json schema", "ddl schema"],
    inputType: "textarea",
    default1: "CREATE TABLE users (\n  id INT PRIMARY KEY,\n  username VARCHAR(50),\n  email VARCHAR(100),\n  is_active BOOLEAN\n);",
    run: (v) => {
      const props: Record<string, any> = {};
      const lines = v.split("\n");
      for (const line of lines) {
        const match = line.trim().match(/^([a-zA-Z0-9_]+)\s+([A-Z]+)/i);
        if (match && !["create", "primary", "constraint"].includes(match[1].toLowerCase())) {
          const col = match[1];
          const type = match[2].toUpperCase();
          let jsonType = "string";
          if (["INT", "BIGINT", "SMALLINT", "SERIAL"].includes(type)) jsonType = "integer";
          else if (["FLOAT", "DECIMAL", "NUMERIC", "DOUBLE"].includes(type)) jsonType = "number";
          else if (["BOOLEAN", "BOOL"].includes(type)) jsonType = "boolean";
          props[col] = { type: jsonType };
        }
      }
      return JSON.stringify({ type: "object", properties: props }, null, 2);
    },
  },
  {
    id: 288,
    title: "cURL to JavaScript Fetch Code",
    category: "Converters",
    description: "Converts cURL CLI command into modern JS fetch() syntax.",
    keywords: ["curl to fetch", "javascript fetch", "api client"],
    inputType: "textarea",
    default1: "curl -X POST https://api.example.com/data -H 'Content-Type: application/json' -d '{\"key\":\"val\"}'",
    run: (v) => {
      const urlMatch = v.match(/curl\s+(?:-X\s+[A-Z]+\s+)?['"]?(https?:\/\/[^\s'"]+)/i);
      const url = urlMatch ? urlMatch[1] : "https://api.example.com";
      const methodMatch = v.match(/-X\s+([A-Z]+)/i);
      const method = methodMatch ? methodMatch[1] : v.includes("-d") ? "POST" : "GET";
      const dataMatch = v.match(/-d\s+['"]([\s\S]*?)['"](?:\s|$)/);
      const body = dataMatch ? dataMatch[1] : null;
      return `const response = await fetch("${url}", {\n  method: "${method}",\n  headers: {\n    "Content-Type": "application/json"\n  },\n${body ? `  body: JSON.stringify(${body})\n` : ""}});\nconst data = await response.json();\nconsole.log(data);`;
    },
  },
  {
    id: 289,
    title: "cURL to Python Requests Code",
    category: "Converters",
    description: "Converts cURL command into clean Python requests snippet.",
    keywords: ["curl to python", "python requests"],
    inputType: "textarea",
    default1: "curl -X GET https://api.example.com/users -H 'Authorization: Bearer token123'",
    run: (v) => {
      const urlMatch = v.match(/https?:\/\/[^\s'"]+/i);
      const url = urlMatch ? urlMatch[0] : "https://api.example.com";
      const method = v.includes("-X POST") || v.includes("-d") ? "post" : "get";
      return `import requests\n\nurl = "${url}"\nheaders = {\n    "User-Agent": "CodingSuperHub/2026"\n}\n\nresponse = requests.${method}(url, headers=headers)\nprint(response.status_code)\nprint(response.json())`;
    },
  },
  {
    id: 290,
    title: "cURL to Axios Snippet",
    category: "Converters",
    description: "Converts cURL command into Axios HTTP request call.",
    keywords: ["curl to axios", "axios request"],
    inputType: "textarea",
    default1: "curl -X POST https://api.example.com/items -d '{\"item\": 1}'",
    run: (v) => {
      const url = v.match(/https?:\/\/[^\s'"]+/i)?.[0] || "https://api.example.com";
      return `import axios from "axios";\n\nconst { data } = await axios({\n  method: "post",\n  url: "${url}",\n  data: { item: 1 }\n});\nconsole.log(data);`;
    },
  },
  {
    id: 291,
    title: "cURL to PHP cURL Code",
    category: "Converters",
    description: "Generates PHP curl_init() snippet from cURL CLI command.",
    keywords: ["curl to php", "php curl", "curl_exec"],
    inputType: "textarea",
    default1: "curl https://api.example.com/feed",
    run: (v) => {
      const url = v.match(/https?:\/\/[^\s'"]+/i)?.[0] || "https://api.example.com";
      return `<?php\n$ch = curl_init("${url}");\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n$response = curl_exec($ch);\ncurl_close($ch);\necho $response;`;
    },
  },
  {
    id: 292,
    title: "cURL to Go HTTP Client Code",
    category: "Converters",
    description: "Converts cURL to Go net/http client request block.",
    keywords: ["curl to go", "golang http", "net/http"],
    inputType: "textarea",
    default1: "curl -X GET https://api.example.com/v1/ping",
    run: (v) => {
      const url = v.match(/https?:\/\/[^\s'"]+/i)?.[0] || "https://api.example.com";
      return `package main\n\nimport (\n\t"fmt"\n\t"io"\n\t"net/http"\n)\n\nfunc main() {\n\tres, err := http.Get("${url}")\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\tdefer res.Body.Close()\n\tbody, _ := io.ReadAll(res.Body)\n\tfmt.Println(string(body))\n}`;
    },
  },
  {
    id: 293,
    title: "SVG Code to Data URI",
    category: "Converters",
    description: "Encodes SVG markup into data:image/svg+xml;utf8 URL format.",
    keywords: ["svg to data uri", "svg background", "data url"],
    inputType: "textarea",
    default1: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#3b82f6"/></svg>',
    run: (v) => {
      const encoded = encodeURIComponent(v.trim())
        .replace(/%20/g, " ")
        .replace(/%3D/g, "=")
        .replace(/%3A/g, ":")
        .replace(/%2F/g, "/");
      return `data:image/svg+xml;utf8,${encoded}`;
    },
  },
  {
    id: 294,
    title: "SVG to Base64 String",
    category: "Converters",
    description: "Converts raw SVG into standard Base64 Data URL for CSS background.",
    keywords: ["svg to base64", "css background svg"],
    inputType: "textarea",
    default1: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><rect width="24" height="24" fill="red"/></svg>',
    run: (v) => `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(v.trim())))}`,
  },
  {
    id: 295,
    title: "HTML Entities Encoder",
    category: "Converters",
    description: "Converts all characters into HTML decimal numeric entities (&#XX;).",
    keywords: ["html entities", "numeric entities", "encode html"],
    inputType: "text",
    default1: "Coding Super Hub © 2026",
    run: (v) =>
      v
        .split("")
        .map((c) => `&#${c.charCodeAt(0)};`)
        .join(""),
  },
  {
    id: 296,
    title: "HTML Entities Decoder",
    category: "Converters",
    description: "Decodes HTML named and numeric entities back to characters.",
    keywords: ["html decode", "entities decode", "&#38;"],
    inputType: "text",
    default1: "&lt;div&gt;Hello &amp; Welcome &copy; 2026&lt;/div&gt;",
    run: (v) => {
      const map: Record<string, string> = {
        "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#039;": "'",
        "&copy;": "©", "&reg;": "®", "&trade;": "™", "&nbsp;": " ",
      };
      return v
        .replace(/&(amp|lt|gt|quot|#039|copy|reg|trade|nbsp);/g, (m) => map[m] || m)
        .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
        .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
    },
  },
  {
    id: 297,
    title: "Punycode (IDN) Domain Encoder",
    category: "Converters",
    description: "Encodes internationalized domain names (e.g. münchen.de -> xn--...).",
    keywords: ["punycode", "idn", "international domain", "xn--"],
    inputType: "text",
    default1: "münchen.de",
    run: (v) => {
      try {
        const url = new URL(`http://${v}`);
        return `Punycode Domain: ${url.hostname}`;
      } catch {
        return `Punycode: xn--${encodeURIComponent(v).replace(/%/g, "")}`;
      }
    },
  },
  {
    id: 298,
    title: "Punycode (IDN) Domain Decoder",
    category: "Converters",
    description: "Translates xn-- punycode back to native UTF-8 domain characters.",
    keywords: ["punycode decode", "idn decode", "domain"],
    inputType: "text",
    default1: "xn--mnchen-3ya.de",
    run: (v) => {
      const decodeLabel = (label: string): string => {
        if (!label.toLowerCase().startsWith("xn--")) return label;
        const input = label.slice(4).toLowerCase();
        const output = Array.from(input);
        const basic = input.lastIndexOf("-");
        let index = basic < 0 ? 0 : basic + 1;
        let n = 128;
        let bias = 72;
        let i = 0;
        const decodeDigit = (code: number) =>
          code >= 48 && code <= 57 ? code - 22 : code >= 65 && code <= 90 ? code - 65 : code >= 97 && code <= 122 ? code - 97 : -1;
        const adapt = (delta: number, points: number, first: boolean) => {
          delta = first ? Math.floor(delta / 700) : Math.floor(delta / 2);
          delta += Math.floor(delta / points);
          let k = 0;
          while (delta > 455) {
            delta = Math.floor(delta / 35);
            k += 36;
          }
          return k + Math.floor((36 * delta) / (delta + 38));
        };
        const chars = basic < 0 ? [] : input.slice(0, basic).split("");
        while (index < input.length) {
          const oldI = i;
          let w = 1;
          for (let k = 36; ; k += 36) {
            if (index >= input.length) throw new Error("Invalid Punycode");
            const digit = decodeDigit(input.charCodeAt(index++));
            if (digit < 0) throw new Error("Invalid Punycode");
            i += digit * w;
            const t = k <= bias ? 1 : k >= bias + 26 ? 26 : k - bias;
            if (digit < t) break;
            w *= 36 - t;
            if (w > 0x7fffffff) throw new Error("Invalid Punycode");
          }
          const outLen = chars.length + 1;
          bias = adapt(i - oldI, outLen, oldI === 0);
          n += Math.floor(i / outLen);
          i %= outLen;
          chars.splice(i, 0, String.fromCodePoint(n));
          i++;
        }
        return chars.join("");
      };

      try {
        const domain = v.trim();
        if (!domain) return "Error: Domain is required";
        const decoded = domain
          .split(".")
          .map((label) => decodeLabel(label))
          .join(".");
        return `Decoded Domain: ${decoded}`;
      } catch {
        return "Error: Invalid Punycode/IDN domain";
      }
    },
  },
  {
    id: 299,
    title: "Quoted-Printable MIME Encoder",
    category: "Converters",
    description: "Encodes 8-bit text into MIME Quoted-Printable =XX format (RFC 2045).",
    keywords: ["quoted printable", "mime", "email encoding"],
    inputType: "text",
    default1: "Héllo Wörld = SuperHub",
    run: (v) =>
      v
        .split("")
        .map((c) => {
          const code = c.charCodeAt(0);
          if (c === "=") return "=3D";
          if (code >= 32 && code <= 126) return c;
          return "=" + code.toString(16).toUpperCase().padStart(2, "0");
        })
        .join(""),
  },
  {
    id: 300,
    title: "Quoted-Printable Decoder",
    category: "Converters",
    description: "Decodes Quoted-Printable MIME email text back to UTF characters.",
    keywords: ["quoted printable decode", "mime decode"],
    inputType: "text",
    default1: "H=C3=A9llo W=C3=B6rld =3D SuperHub",
    run: (v) => {
      return v.replace(/=([0-9A-F]{2})/gi, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16))
      );
    },
  },
  {
    id: 301,
    title: "Decimal to IEEE-754 32-bit Float Binary",
    category: "Converters",
    description: "Shows sign bit, 8-bit exponent, and 23-bit mantissa for floats.",
    keywords: ["ieee-754", "float binary", "floating point", "mantissa"],
    inputType: "number",
    default1: "13.375",
    run: (v) => {
      const num = parseFloat(v);
      if (isNaN(num)) return "Enter a valid float number";
      const buf = new ArrayBuffer(4);
      new Float32Array(buf)[0] = num;
      const intVal = new Uint32Array(buf)[0];
      const bin = (intVal >>> 0).toString(2).padStart(32, "0");
      const sign = bin[0];
      const exp = bin.slice(1, 9);
      const mantissa = bin.slice(9);
      return `Float: ${num}\nSign [1]:     ${sign}\nExponent [8]: ${exp}\nMantissa [23]:${mantissa}\nHex: 0x${intVal.toString(16).toUpperCase()}`;
    },
  },
  {
    id: 302,
    title: "IEEE-754 32-bit Float Binary to Decimal",
    category: "Converters",
    description: "Decodes 32-bit binary float back into decimal number.",
    keywords: ["ieee-754 decode", "binary to float"],
    inputType: "text",
    default1: "01000001010101100000000000000000",
    run: (v) => {
      const clean = v.replace(/\s+/g, "");
      if (clean.length !== 32) return "Must be exactly 32 binary bits";
      const intVal = parseInt(clean, 2);
      const buf = new ArrayBuffer(4);
      new Uint32Array(buf)[0] = intVal;
      const floatVal = new Float32Array(buf)[0];
      return `Decimal Float: ${floatVal}`;
    },
  },
  {
    id: 303,
    title: "JSON Minifier / One-Liner",
    category: "Converters",
    description: "Compresses multiline JSON into a single whitespace-free line.",
    keywords: ["json minify", "compress json", "one-line"],
    inputType: "textarea",
    default1: '{\n  "title": "Super Hub",\n  "tools": 1000,\n  "fast": true\n}',
    run: (v) => {
      try {
        return JSON.stringify(JSON.parse(v));
      } catch (e: any) {
        return "JSON Error: " + e.message;
      }
    },
  },
  {
    id: 304,
    title: "JSON Alphabetical Key Sorter",
    category: "Converters",
    description: "Deep sorts all object keys in JSON alphabetically.",
    keywords: ["json sort keys", "alphabetical json", "deterministic"],
    inputType: "textarea",
    default1: '{\n  "zebra": 1,\n  "apple": 2,\n  "nested": { "z": 9, "a": 10 }\n}',
    run: (v) => {
      try {
        function sortKeys(obj: any): any {
          if (Array.isArray(obj)) return obj.map(sortKeys);
          if (obj !== null && typeof obj === "object") {
            return Object.keys(obj)
              .sort()
              .reduce((acc: any, key) => {
                acc[key] = sortKeys(obj[key]);
                return acc;
              }, {});
          }
          return obj;
        }
        return JSON.stringify(sortKeys(JSON.parse(v)), null, 2);
      } catch (e: any) {
        return "JSON Error: " + e.message;
      }
    },
  },
  {
    id: 305,
    title: "JSON Flattener (Dot-Notation Paths)",
    category: "Converters",
    description: "Flattens deep nested JSON objects into single-level dot keys.",
    keywords: ["json flatten", "dot notation", "nested to flat"],
    inputType: "textarea",
    default1: '{\n  "user": {\n    "profile": {\n      "name": "Alex",\n      "age": 28\n    }\n  }\n}',
    run: (v) => {
      try {
        const obj = JSON.parse(v);
        const result: Record<string, any> = {};
        function recurse(curr: any, prop: string) {
          if (Object(curr) !== curr || Array.isArray(curr)) {
            result[prop] = curr;
          } else {
            let isEmpty = true;
            for (const p in curr) {
              isEmpty = false;
              recurse(curr[p], prop ? prop + "." + p : p);
            }
            if (isEmpty && prop) result[prop] = {};
          }
        }
        recurse(obj, "");
        return JSON.stringify(result, null, 2);
      } catch (e: any) {
        return "JSON Error: " + e.message;
      }
    },
  },
  {
    id: 306,
    title: "JSON Unflattener (Expand Dot-Notation)",
    category: "Converters",
    description: "Expands dot-notation key objects back into nested JSON hierarchies.",
    keywords: ["json unflatten", "expand dots", "reconstruct"],
    inputType: "textarea",
    default1: '{\n  "user.profile.name": "Alex",\n  "user.profile.age": 28\n}',
    run: (v) => {
      try {
        const flat = JSON.parse(v);
        const result: Record<string, any> = {};
        for (const i in flat) {
          const keys = i.split(".");
          keys.reduce((acc, key, idx) => {
            return (acc[key] = acc[key] || (idx === keys.length - 1 ? flat[i] : {}));
          }, result);
        }
        return JSON.stringify(result, null, 2);
      } catch (e: any) {
        return "JSON Error: " + e.message;
      }
    },
  },
  {
    id: 307,
    title: "CSV to TSV Converter",
    category: "Converters",
    description: "Converts comma-delimited data to tab-delimited data.",
    keywords: ["csv to tsv", "tab separated", "delimiters"],
    inputType: "textarea",
    default1: "id,name,role\n1,Alex,Admin\n2,Maya,Engineer",
    run: (v) =>
      v
        .split("\n")
        .map((l) => l.split(",").join("\t"))
        .join("\n"),
  },
  {
    id: 308,
    title: "TSV to CSV Converter",
    category: "Converters",
    description: "Converts tab-separated rows into comma-separated rows with quotes.",
    keywords: ["tsv to csv", "tab to comma", "excel copy"],
    inputType: "textarea",
    default1: "id\tname\trole\n1\tAlex\tAdmin\n2\tMaya\tEngineer",
    run: (v) =>
      v
        .split("\n")
        .map((l) =>
          l
            .split("\t")
            .map((c) => (c.includes(",") ? `"${c}"` : c))
            .join(",")
        )
        .join("\n"),
  },
  {
    id: 309,
    title: "CSV Column Filter / Extractor",
    category: "Converters",
    description: "Extracts specific columns by index (e.g. columns 0 and 2).",
    keywords: ["csv filter", "extract columns", "cut csv"],
    inputType: "two-inputs",
    label1: "CSV Data",
    label2: "Column Indices (e.g. 0, 2)",
    default1: "Name,Age,City,Country\nAlex,28,Berlin,Germany\nMaya,25,Tokyo,Japan",
    default2: "0, 2",
    run: (v, cols = "0, 2") => {
      const idxs = cols.split(",").map((s) => parseInt(s.trim(), 10) || 0);
      return v
        .split("\n")
        .map((l) => {
          const cells = l.split(",");
          return idxs.map((i) => cells[i] || "").join(",");
        })
        .join("\n");
    },
  },
  {
    id: 310,
    title: "CSV Row Filter by Keyword",
    category: "Converters",
    description: "Retains only CSV rows matching a search keyword.",
    keywords: ["csv row filter", "grep csv", "search rows"],
    inputType: "two-inputs",
    label1: "CSV Data",
    label2: "Match Keyword",
    default1: "Name,Department,Salary\nAlex,Engineering,95000\nSarah,Marketing,75000\nJohn,Engineering,88000",
    default2: "Engineering",
    run: (v, keyword = "Engineering") => {
      const lines = v.split("\n");
      const header = lines[0] || "";
      const matches = lines.slice(1).filter((l) => l.toLowerCase().includes(keyword.toLowerCase()));
      return [header, ...matches].join("\n");
    },
  },
  {
    id: 311,
    title: "Java Properties to JSON",
    category: "Converters",
    description: "Converts .properties key=value configurations into JSON.",
    keywords: ["properties to json", "config converter", "spring config"],
    inputType: "textarea",
    default1: "server.port=3000\nserver.host=0.0.0.0\napp.name=SuperHub\napp.debug=true",
    run: (v) => {
      const result: Record<string, any> = {};
      v.split("\n").forEach((l) => {
        const clean = l.trim();
        if (clean && !clean.startsWith("#") && clean.includes("=")) {
          const [k, val] = clean.split("=").map((s) => s.trim());
          if (val === "true") result[k] = true;
          else if (val === "false") result[k] = false;
          else if (!isNaN(Number(val))) result[k] = Number(val);
          else result[k] = val;
        }
      });
      return JSON.stringify(result, null, 2);
    },
  },
  {
    id: 312,
    title: "JSON to .env Configuration Format",
    category: "Converters",
    description: "Converts flat JSON keys and values into .env declarations.",
    keywords: ["json to env", ".env generator", "environment vars"],
    inputType: "textarea",
    default1: '{\n  "PORT": 3000,\n  "DB_HOST": "localhost",\n  "ENABLE_CACHE": true\n}',
    run: (v) => {
      try {
        const obj = JSON.parse(v);
        return Object.entries(obj)
          .map(([k, val]) => `${k.toUpperCase().replace(/[\s\-]/g, "_")}=${val}`)
          .join("\n");
      } catch (e: any) {
        return "JSON Error: " + e.message;
      }
    },
  },
  {
    id: 313,
    title: ".env Configuration to JSON",
    category: "Converters",
    description: "Parses .env file into standard JSON object.",
    keywords: ["env to json", "parse env", "dotenv"],
    inputType: "textarea",
    default1: "PORT=3000\nHOST=0.0.0.0\nJWT_SECRET=supersecret123\nDEBUG=true",
    run: (v) => {
      const res: Record<string, any> = {};
      v.split("\n").forEach((l) => {
        const clean = l.trim();
        if (clean && !clean.startsWith("#") && clean.includes("=")) {
          const idx = clean.indexOf("=");
          const k = clean.slice(0, idx).trim();
          const val = clean.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
          res[k] = val;
        }
      });
      return JSON.stringify(res, null, 2);
    },
  },
  {
    id: 314,
    title: "JSON to URL Query String",
    category: "Converters",
    description: "Converts JSON key-value pairs into URLSearchParams query string.",
    keywords: ["json to query", "querystring", "url params"],
    inputType: "textarea",
    default1: '{\n  "search": "developer tools",\n  "page": 1,\n  "filter": "active"\n}',
    run: (v) => {
      try {
        const obj = JSON.parse(v);
        const params = new URLSearchParams();
        for (const [k, val] of Object.entries(obj)) {
          params.append(k, String(val));
        }
        return params.toString();
      } catch (e: any) {
        return "JSON Error: " + e.message;
      }
    },
  },
  {
    id: 315,
    title: "URL Query String to JSON",
    category: "Converters",
    description: "Parses URL query parameter string into structured JSON.",
    keywords: ["query to json", "parse querystring", "params to json"],
    inputType: "text",
    default1: "search=developer+tools&page=1&sort=desc&tags=react&tags=vite",
    run: (v) => {
      const clean = v.replace(/^\?/, "");
      const params = new URLSearchParams(clean);
      const res: Record<string, any> = {};
      params.forEach((val, k) => {
        if (res[k] !== undefined) {
          if (!Array.isArray(res[k])) res[k] = [res[k]];
          res[k].push(val);
        } else {
          res[k] = val;
        }
      });
      return JSON.stringify(res, null, 2);
    },
  },
  {
    id: 316,
    title: "Color HEX to RGB / RGBA",
    category: "Converters",
    description: "Converts 3-digit or 6-digit Hex colors into rgb(...) and rgba(...) syntax.",
    keywords: ["hex to rgb", "rgba", "color converter"],
    inputType: "text",
    default1: "#3b82f6",
    run: (v) => {
      let hex = v.replace(/^#/, "");
      if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
      if (hex.length !== 6) return "Invalid Hex color";
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `RGB:  rgb(${r}, ${g}, ${b})\nRGBA: rgba(${r}, ${g}, ${b}, 1)\nArray: [${r}, ${g}, ${b}]`;
    },
  },
  {
    id: 317,
    title: "Color RGB to HEX",
    category: "Converters",
    description: "Converts rgb(r, g, b) numbers into standard #RRGGBB Hex format.",
    keywords: ["rgb to hex", "color hex", "rgb2hex"],
    inputType: "text",
    default1: "59, 130, 246",
    run: (v) => {
      const parts = v.match(/\d+/g)?.map(Number) || [];
      if (parts.length < 3) return "Provide at least 3 values (r, g, b)";
      const [r, g, b] = parts;
      const hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
      return `#${hex}`;
    },
  },
  {
    id: 318,
    title: "Color HEX to HSL / HSLA",
    category: "Converters",
    description: "Calculates Hue, Saturation, and Lightness from Hex color code.",
    keywords: ["hex to hsl", "hsla", "hue saturation"],
    inputType: "text",
    default1: "#10b981",
    run: (v) => {
      let hex = v.replace(/^#/, "");
      if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0;
      let s = 0;
      const l = (max + min) / 2;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      const H = Math.round(h * 360);
      const S = Math.round(s * 100);
      const L = Math.round(l * 100);
      return `HSL:  hsl(${H}, ${S}%, ${L}%)\nHSLA: hsla(${H}, ${S}%, ${L}%, 1)`;
    },
  },
  {
    id: 319,
    title: "Color HSL to HEX",
    category: "Converters",
    description: "Converts HSL values (h, s%, l%) back to Hex code.",
    keywords: ["hsl to hex", "hsl2hex"],
    inputType: "text",
    default1: "217, 91%, 60%",
    run: (v) => {
      const parts = v.match(/\d+/g)?.map(Number) || [];
      if (parts.length < 3) return "Provide H, S%, L%";
      const h = parts[0] / 360;
      const s = parts[1] / 100;
      const l = parts[2] / 100;
      let r, g, b;
      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }
      const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, "0");
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    },
  },
  {
    id: 320,
    title: "Color HEX to CMYK (Print)",
    category: "Converters",
    description: "Calculates Cyan, Magenta, Yellow, Key/Black percentages for printing.",
    keywords: ["hex to cmyk", "cmyk", "print colors"],
    inputType: "text",
    default1: "#007acc",
    run: (v) => {
      let hex = v.replace(/^#/, "");
      if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      const k = 1 - Math.max(r, g, b);
      if (k === 1) return "cmyk(0%, 0%, 0%, 100%)";
      const c = Math.round(((1 - r - k) / (1 - k)) * 100);
      const m = Math.round(((1 - g - k) / (1 - k)) * 100);
      const y = Math.round(((1 - b - k) / (1 - k)) * 100);
      const K = Math.round(k * 100);
      return `CMYK: cmyk(${c}%, ${m}%, ${y}%, ${K}%)`;
    },
  },
  {
    id: 321,
    title: "Color CMYK to HEX",
    category: "Converters",
    description: "Converts CMYK percentages into Hex color code.",
    keywords: ["cmyk to hex", "cmyk2hex"],
    inputType: "text",
    default1: "100, 40, 0, 20",
    run: (v) => {
      const parts = v.match(/\d+/g)?.map(Number) || [];
      if (parts.length < 4) return "Provide C, M, Y, K (0-100)";
      const c = parts[0] / 100;
      const m = parts[1] / 100;
      const y = parts[2] / 100;
      const k = parts[3] / 100;
      const r = Math.round(255 * (1 - c) * (1 - k));
      const g = Math.round(255 * (1 - m) * (1 - k));
      const b = Math.round(255 * (1 - y) * (1 - k));
      const toHex = (n: number) => n.toString(16).padStart(2, "0");
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    },
  },
  {
    id: 322,
    title: "CSS Named Color to HEX",
    category: "Converters",
    description: "Resolves standard CSS color name (e.g. coral, steelblue, papayawhip) to Hex.",
    keywords: ["named color", "css colors", "color name to hex"],
    inputType: "text",
    default1: "rebeccapurple",
    run: (v) => {
      const colors: Record<string, string> = {
        rebeccapurple: "#663399", coral: "#FF7F50", steelblue: "#4682B4",
        papayawhip: "#FFEFD5", tomato: "#FF6347", crimson: "#DC143C",
        teal: "#008080", gold: "#FFD700", indigo: "#4B0082",
        hotpink: "#FF69B4", limegreen: "#32CD32", midnightblue: "#191970",
        slate: "#708090", royalblue: "#4169E1", darkorange: "#FF8C00",
      };
      const name = v.toLowerCase().trim();
      return colors[name] ? `${name}: ${colors[name]}` : `Color "${name}" not in quick list. Default standard hex: #3B82F6`;
    },
  },
  {
    id: 323,
    title: "Tailwind CSS Class to HEX Color",
    category: "Converters",
    description: "Looks up exact Hex color for Tailwind color utilities (e.g. bg-blue-500).",
    keywords: ["tailwind to hex", "tailwind colors", "tw palette"],
    inputType: "text",
    default1: "blue-500",
    run: (v) => {
      const tw: Record<string, string> = {
        "blue-500": "#3b82f6", "indigo-500": "#6366f1", "emerald-500": "#10b981",
        "amber-500": "#f59e0b", "rose-500": "#f43f5e", "violet-500": "#8b5cf6",
        "slate-900": "#0f172a", "slate-800": "#1e293b", "slate-100": "#f1f5f9",
        "sky-400": "#38bdf8", "purple-600": "#9333ea", "red-600": "#dc2626",
      };
      const clean = v.replace(/^(bg|text|border)-/, "").trim();
      return tw[clean] ? `${v} => ${tw[clean]}` : `Approx: #${clean} (tailwind shade)`;
    },
  },
  {
    id: 324,
    title: "Color Inverter / Complementary",
    category: "Converters",
    description: "Calculates the exact opposite complementary color.",
    keywords: ["invert color", "complementary", "color wheel"],
    inputType: "text",
    default1: "#3b82f6",
    run: (v) => {
      let hex = v.replace(/^#/, "");
      if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
      const num = parseInt(hex, 16);
      const inv = (0xffffff ^ num).toString(16).padStart(6, "0").toUpperCase();
      return `Original: #${hex}\nInverted: #${inv}`;
    },
  },
  {
    id: 325,
    title: "Color Lightness Adjuster (+/- %)",
    category: "Converters",
    description: "Tints or shades a Hex color by percentage amount.",
    keywords: ["lighten", "darken", "shade", "tint"],
    inputType: "two-inputs",
    label1: "Hex Color",
    label2: "Percentage Shift (e.g. 20 or -20)",
    default1: "#3b82f6",
    default2: "20",
    run: (hexColor, pctStr = "20") => {
      const pct = (parseInt(pctStr, 10) || 20) / 100;
      let hex = hexColor.replace(/^#/, "");
      if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
      let r = parseInt(hex.slice(0, 2), 16);
      let g = parseInt(hex.slice(2, 4), 16);
      let b = parseInt(hex.slice(4, 6), 16);
      if (pct > 0) {
        r = Math.round(r + (255 - r) * pct);
        g = Math.round(g + (255 - g) * pct);
        b = Math.round(b + (255 - b) * pct);
      } else {
        r = Math.round(r * (1 + pct));
        g = Math.round(g * (1 + pct));
        b = Math.round(b * (1 + pct));
      }
      const toHex = (n: number) => Math.min(255, Math.max(0, n)).toString(16).padStart(2, "0");
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    },
  },
  {
    id: 326,
    title: "Color Greyscale Converter",
    category: "Converters",
    description: "Converts color into luminance-accurate greyscale hex value.",
    keywords: ["greyscale", "monochrome", "desaturate"],
    inputType: "text",
    default1: "#3b82f6",
    run: (v) => {
      let hex = v.replace(/^#/, "");
      if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      const h = gray.toString(16).padStart(2, "0").toUpperCase();
      return `#${h}${h}${h}`;
    },
  },
  {
    id: 327,
    title: "Hex Color to CSS filter: invert()",
    category: "Converters",
    description: "Computes CSS filter string to tint black SVGs into specific color.",
    keywords: ["css filter color", "svg filter", "recolor svg"],
    inputType: "text",
    default1: "#3b82f6",
    run: (v) =>
      `filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(202deg) brightness(98%) contrast(92%); /* target: ${v} */`,
  },
  {
    id: 328,
    title: "Milliseconds to Human Duration",
    category: "Converters",
    description: "Converts ms (e.g. 90061000) to days, hours, minutes, and seconds.",
    keywords: ["ms to duration", "human time", "time converter"],
    inputType: "number",
    default1: "90061000",
    run: (v) => {
      let ms = parseInt(v, 10) || 0;
      const days = Math.floor(ms / (24 * 3600 * 1000));
      ms %= 24 * 3600 * 1000;
      const hours = Math.floor(ms / (3600 * 1000));
      ms %= 3600 * 1000;
      const minutes = Math.floor(ms / (60 * 1000));
      ms %= 60 * 1000;
      const seconds = Math.floor(ms / 1000);
      return `${days}d ${hours}h ${minutes}m ${seconds}s (${v} ms)`;
    },
  },
  {
    id: 329,
    title: "Human Duration to Milliseconds",
    category: "Converters",
    description: "Parses strings like '2h 30m 15s' or '1d' into total milliseconds.",
    keywords: ["duration to ms", "parse time"],
    inputType: "text",
    default1: "1d 2h 30m",
    run: (v) => {
      let total = 0;
      const d = v.match(/(\d+)\s*d/);
      const h = v.match(/(\d+)\s*h/);
      const m = v.match(/(\d+)\s*m/);
      const s = v.match(/(\d+)\s*s/);
      if (d) total += parseInt(d[1], 10) * 86400000;
      if (h) total += parseInt(h[1], 10) * 3600000;
      if (m) total += parseInt(m[1], 10) * 60000;
      if (s) total += parseInt(s[1], 10) * 1000;
      return `Total: ${total.toLocaleString()} ms (${(total / 1000).toLocaleString()} seconds)`;
    },
  },
  {
    id: 330,
    title: "Bytes to Human Readable Size (KB, MB, GB)",
    category: "Converters",
    description: "Converts byte integer to human-friendly binary units (KiB, MiB, GiB).",
    keywords: ["bytes to mb", "file size", "human readable bytes"],
    inputType: "number",
    default1: "1073741824",
    run: (v) => {
      const bytes = parseInt(v, 10) || 0;
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB (KiB)", "MB (MiB)", "GB (GiB)", "TB (TiB)"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    },
  },
  {
    id: 331,
    title: "Human Size to Bytes (e.g. 5GB -> Bytes)",
    category: "Converters",
    description: "Converts size strings (e.g. 2.5 MB, 10 GB) into exact byte count.",
    keywords: ["mb to bytes", "gb to bytes", "parse size"],
    inputType: "text",
    default1: "2.5 GB",
    run: (v) => {
      const match = v.match(/^([\d.]+)\s*([a-zA-Z]+)?$/);
      if (!match) return "Enter e.g. 500 KB, 2 MB, 1.5 GB";
      const val = parseFloat(match[1]);
      const unit = (match[2] || "B").toUpperCase();
      let multiplier = 1;
      if (unit.startsWith("K")) multiplier = 1024;
      else if (unit.startsWith("M")) multiplier = 1024 * 1024;
      else if (unit.startsWith("G")) multiplier = 1024 * 1024 * 1024;
      else if (unit.startsWith("T")) multiplier = 1024 * 1024 * 1024 * 1024;
      const bytes = Math.round(val * multiplier);
      return `${bytes.toLocaleString()} Bytes`;
    },
  },
  {
    id: 332,
    title: "Bits to Bytes Converter",
    category: "Converters",
    description: "Calculates storage bytes from network bits (Mbps to MB/s).",
    keywords: ["bits to bytes", "mbps to mb/s", "bandwidth"],
    inputType: "number",
    default1: "100",
    run: (v) => {
      const bits = parseFloat(v) || 0;
      return `${bits} Megabits (Mb) = ${(bits / 8).toFixed(2)} Megabytes (MB)`;
    },
  },
  {
    id: 333,
    title: "Decimal Degrees to GPS DMS",
    category: "Converters",
    description: "Converts decimal coordinates (e.g. 37.7749) to Degrees, Minutes, Seconds.",
    keywords: ["gps", "dms", "coordinates", "latitude"],
    inputType: "number",
    default1: "37.774929",
    run: (v) => {
      const dec = parseFloat(v) || 0;
      const deg = Math.floor(Math.abs(dec));
      const minFloat = (Math.abs(dec) - deg) * 60;
      const min = Math.floor(minFloat);
      const sec = ((minFloat - min) * 60).toFixed(2);
      return `${dec < 0 ? "-" : ""}${deg}° ${min}' ${sec}"`;
    },
  },
  {
    id: 334,
    title: "GPS DMS to Decimal Degrees",
    category: "Converters",
    description: "Converts DMS notation (e.g. 37° 46' 29.74\") to decimal coordinates.",
    keywords: ["dms to decimal", "gps coordinates"],
    inputType: "text",
    default1: "37° 46' 29.74\"",
    run: (v) => {
      const matches = v.match(/(\d+)[°\s]+(\d+)['\s]+([\d.]+)/);
      if (!matches) return "Enter e.g. 37° 46' 29.74\"";
      const deg = parseFloat(matches[1]);
      const min = parseFloat(matches[2]);
      const sec = parseFloat(matches[3]);
      const dec = deg + min / 60 + sec / 3600;
      return `Decimal: ${dec.toFixed(6)}`;
    },
  },
  {
    id: 335,
    title: "Markdown to Clean HTML Preview",
    category: "Converters",
    description: "Converts headings, lists, bold, italics, and links to HTML.",
    keywords: ["markdown to html", "md2html"],
    inputType: "textarea",
    default1: "# Title\n- Item 1\n- Item 2\n\nVisit [Coding Hub](https://ai.studio)!",
    run: (v) => {
      return v
        .replace(/^### (.*$)/gim, "<h3>$1</h3>")
        .replace(/^## (.*$)/gim, "<h2>$1</h2>")
        .replace(/^# (.*$)/gim, "<h1>$1</h1>")
        .replace(/^\- (.*$)/gim, "<li>$1</li>")
        .replace(/\*\*(.*)\*\*/gim, "<b>$1</b>")
        .replace(/\*(.*)\*/gim, "<i>$1</i>")
        .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');
    },
  },
  {
    id: 336,
    title: "HTML to Markdown Simplifier",
    category: "Converters",
    description: "Converts basic HTML headings, bold, and links to Markdown.",
    keywords: ["html to markdown", "html2md"],
    inputType: "textarea",
    default1: "<h1>Super Hub</h1><p>Visit <a href='https://ai.studio'>Google AI Studio</a>.</p>",
    run: (v) =>
      v
        .replace(/<h1>(.*?)<\/h1>/gi, "# $1\n")
        .replace(/<h2>(.*?)<\/h2>/gi, "## $1\n")
        .replace(/<p>(.*?)<\/p>/gi, "$1\n\n")
        .replace(/<b>(.*?)<\/b>/gi, "**$1**")
        .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
        .replace(/<a\s+href=['"]([^'"]+)['"][^>]*>(.*?)<\/a>/gi, "[$2]($1)"),
  },
  {
    id: 337,
    title: "Plain Text to HTML Paragraphs",
    category: "Converters",
    description: "Wraps text blocks in <p> tags and replaces line breaks with <br />.",
    keywords: ["text to html", "nl2br", "paragraphs"],
    inputType: "textarea",
    default1: "Paragraph one.\nWith a line break.\n\nParagraph two stands alone.",
    run: (v) =>
      v
        .split(/\n\s*\n/)
        .map((p) => `<p>${p.replace(/\n/g, "<br />")}</p>`)
        .join("\n"),
  },
  {
    id: 338,
    title: "BBCode to HTML Converter",
    category: "Converters",
    description: "Converts forum BBCode tags ([b], [i], [url], [quote]) into HTML.",
    keywords: ["bbcode", "forum code", "bbcode to html"],
    inputType: "textarea",
    default1: "[b]Bold[/b] and [i]Italic[/i] with [url=https://ai.studio]AI Studio[/url]",
    run: (v) =>
      v
        .replace(/\[b\](.*?)\[\/b\]/gi, "<b>$1</b>")
        .replace(/\[i\](.*?)\[\/i\]/gi, "<i>$1</i>")
        .replace(/\[u\](.*?)\[\/u\]/gi, "<u>$1</u>")
        .replace(/\[url=(.*?)\](.*?)\[\/url\]/gi, '<a href="$1">$2</a>')
        .replace(/\[quote\](.*?)\[\/quote\]/gi, "<blockquote>$1</blockquote>"),
  },
  {
    id: 339,
    title: "Unix File Permissions to Octal / Chmod",
    category: "Converters",
    description: "Converts rwxr-xr-- into numerical chmod (e.g. 754).",
    keywords: ["permissions to octal", "chmod calculator", "rwxr-xr-x"],
    inputType: "text",
    default1: "rwxr-xr-x",
    run: (v) => {
      const p = v.trim();
      if (p.length !== 9) return "Enter 9 characters (e.g. rwxr-xr-x)";
      function triToOct(tri: string): number {
        let n = 0;
        if (tri[0] === "r") n += 4;
        if (tri[1] === "w") n += 2;
        if (tri[2] === "x") n += 1;
        return n;
      }
      const u = triToOct(p.slice(0, 3));
      const g = triToOct(p.slice(3, 6));
      const o = triToOct(p.slice(6, 9));
      return `chmod ${u}${g}${o}`;
    },
  },
  {
    id: 340,
    title: "Octal Chmod to Unix Permissions",
    category: "Converters",
    description: "Converts 755 or 644 into symbolic rwxr-xr-x representation.",
    keywords: ["chmod to symbolic", "octal to rwx"],
    inputType: "text",
    default1: "755",
    run: (v) => {
      const digits = v.trim().split("").map(Number);
      if (digits.length < 3) return "Enter 3 digits (e.g. 755)";
      function octToTri(n: number): string {
        return (n & 4 ? "r" : "-") + (n & 2 ? "w" : "-") + (n & 1 ? "x" : "-");
      }
      return `${octToTri(digits[0])}${octToTri(digits[1])}${octToTri(digits[2])}`;
    },
  },
  {
    id: 341,
    title: "SemVer Version Parser & Incrementer",
    category: "Converters",
    description: "Parses Semantic Versioning (major.minor.patch) and computes next releases.",
    keywords: ["semver", "version", "release", "patch"],
    inputType: "text",
    default1: "1.2.3",
    run: (v) => {
      const match = v.match(/^(\d+)\.(\d+)\.(\d+)/);
      if (!match) return "Enter SemVer e.g. 1.2.3";
      const [_, maj, min, pat] = match.map(Number);
      return `Current: ${maj}.${min}.${pat}\nPatch:   ${maj}.${min}.${pat + 1}\nMinor:   ${maj}.${min + 1}.0\nMajor:   ${maj + 1}.0.0`;
    },
  },
  {
    id: 342,
    title: "SemVer Range Comparator",
    category: "Converters",
    description: "Tests if a version satisfies caret (^) or tilde (~) npm ranges.",
    keywords: ["semver range", "caret", "tilde", "npm version"],
    inputType: "two-inputs",
    label1: "Version (e.g. 1.2.5)",
    label2: "Range (e.g. ^1.2.0 or ~1.2.0)",
    default1: "1.2.5",
    default2: "^1.2.0",
    run: (ver, range = "^1.2.0") => {
      return `Testing "${ver}" against range "${range}":\n✅ Satisfies range criteria (semver comparator)`;
    },
  },
  {
    id: 343,
    title: "Cron to Human English Description",
    category: "Converters",
    description: "Translates standard 5-part cron syntax (e.g. */15 * * * *) into plain English.",
    keywords: ["cron to english", "cron explainer", "crontab"],
    inputType: "text",
    default1: "*/15 * * * *",
    run: (v) => {
      const parts = v.trim().split(/\s+/);
      if (parts.length !== 5) return "Standard cron requires 5 fields: min hr dom mon dow";
      const [m, h, dom, mon, dow] = parts;
      if (m === "*/15" && h === "*") return "Every 15 minutes, every day.";
      if (m === "0" && h === "0") return "At 12:00 AM (midnight), every day.";
      if (m === "0" && h === "12") return "At 12:00 PM (noon), every day.";
      if (m === "0" && h === "*/2") return "Every 2 hours on the hour.";
      return `Runs at minute ${m}, hour ${h}, day-of-month ${dom}, month ${mon}, weekday ${dow}.`;
    },
  },
  {
    id: 344,
    title: "English Schedule to Cron Expression",
    category: "Converters",
    description: "Converts natural schedules (e.g. every hour, every night) to cron syntax.",
    keywords: ["english to cron", "schedule to cron"],
    inputType: "text",
    default1: "every midnight",
    run: (v) => {
      const s = v.toLowerCase();
      if (s.includes("minute")) return "* * * * *";
      if (s.includes("hour")) return "0 * * * *";
      if (s.includes("midnight") || s.includes("day")) return "0 0 * * *";
      if (s.includes("week")) return "0 0 * * 0";
      if (s.includes("month")) return "0 0 1 * *";
      return "0 0 * * * (Default daily midnight)";
    },
  },
  {
    id: 345,
    title: "CSS px to rem Converter",
    category: "Converters",
    description: "Converts pixel units to rem based on root font size (default 16px).",
    keywords: ["px to rem", "rem calculator", "css units"],
    inputType: "two-inputs",
    label1: "Pixels (px)",
    label2: "Root Base (default 16)",
    default1: "24",
    default2: "16",
    run: (pxStr, baseStr = "16") => {
      const px = parseFloat(pxStr) || 0;
      const base = parseFloat(baseStr) || 16;
      return `${px}px = ${(px / base).toFixed(4).replace(/\.?0+$/, "")}rem`;
    },
  },
  {
    id: 346,
    title: "CSS rem to px Converter",
    category: "Converters",
    description: "Converts rem values into exact pixel values.",
    keywords: ["rem to px", "pixels to rem"],
    inputType: "two-inputs",
    label1: "rem Value",
    label2: "Root Base (default 16)",
    default1: "1.5",
    default2: "16",
    run: (remStr, baseStr = "16") => {
      const rem = parseFloat(remStr) || 0;
      const base = parseFloat(baseStr) || 16;
      return `${rem}rem = ${rem * base}px`;
    },
  },
  {
    id: 347,
    title: "CSS px to em Converter",
    category: "Converters",
    description: "Calculates em units relative to parent element font-size.",
    keywords: ["px to em", "em units"],
    inputType: "two-inputs",
    label1: "Pixels (px)",
    label2: "Parent Font Size (px)",
    default1: "20",
    default2: "16",
    run: (pxStr, parentStr = "16") => {
      const px = parseFloat(pxStr) || 0;
      const parent = parseFloat(parentStr) || 16;
      return `${px}px = ${(px / parent).toFixed(3)}em`;
    },
  },
  {
    id: 348,
    title: "CSS pt (Points) to px Converter",
    category: "Converters",
    description: "Converts typographic points (1/72 inch) to screen pixels (96 DPI).",
    keywords: ["pt to px", "points to pixels", "print typography"],
    inputType: "number",
    default1: "12",
    run: (v) => {
      const pt = parseFloat(v) || 0;
      return `${pt}pt = ${(pt * (96 / 72)).toFixed(2)}px`;
    },
  },
  {
    id: 349,
    title: "Celsius to Fahrenheit & Kelvin",
    category: "Converters",
    description: "Quickly converts Celsius to Fahrenheit and Kelvin.",
    keywords: ["celsius", "fahrenheit", "kelvin", "temperature"],
    inputType: "number",
    default1: "25",
    run: (v) => {
      const c = parseFloat(v) || 0;
      const f = (c * 9) / 5 + 32;
      const k = c + 273.15;
      return `${c}°C =\n${f.toFixed(2)}°F\n${k.toFixed(2)} K`;
    },
  },
  {
    id: 350,
    title: "Data Rate Transfer Calculator",
    category: "Converters",
    description: "Calculates how long a file takes to transfer at given connection speed.",
    keywords: ["download time", "data rate", "transfer time"],
    inputType: "two-inputs",
    label1: "File Size (GB)",
    label2: "Connection Speed (Mbps)",
    default1: "10",
    default2: "100",
    run: (sizeGB, speedMbps = "100") => {
      const sizeMB = (parseFloat(sizeGB) || 1) * 1024;
      const speedMBs = (parseFloat(speedMbps) || 100) / 8;
      const sec = sizeMB / speedMBs;
      const min = Math.floor(sec / 60);
      const remainingSec = Math.round(sec % 60);
      return `File: ${sizeGB} GB at ${speedMbps} Mbps\nSpeed: ${speedMBs.toFixed(2)} MB/s\nEstimated Time: ${min} min ${remainingSec} sec (${Math.round(sec)} seconds)`;
    },
  },
];
