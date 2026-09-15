// General Utilities for Coding Super Hub's 1,000-tool registry

export function safeBase64Encode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

export function safeBase64Decode(str: string): string {
  const normalized = str.trim();
  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function generateUUIDv4(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function textToSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function decodeJWTToken(token: string): { header: any; payload: any; isExpired?: boolean } {
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT token format (expected 3 parts separated by dots)");
  }

  const decodePart = (part: string) => {
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    if (base64.length % 4 === 1) {
      throw new Error("Invalid JWT Base64 segment");
    }
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return JSON.parse(decoded);
  };

  const header = decodePart(parts[0]);
  const payload = decodePart(parts[1]);

  let isExpired: boolean | undefined = undefined;
  if (payload && typeof payload.exp === "number") {
    isExpired = Date.now() >= payload.exp * 1000;
  }

  return { header, payload, isExpired };
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace("#", "").trim();
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) return null;
  const n = parseInt(cleanHex, 16);
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  };
}

export function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    const val = v / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1) || { r: 255, g: 255, b: 255 };
  const rgb2 = hexToRgb(hex2) || { r: 0, g: 0, b: 0 };
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function sortJsonKeys(obj: any): any {
  if (Array.isArray(obj)) return obj.map(sortJsonKeys);
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj)
      .sort()
      .reduce((res: Record<string, any>, key: string) => {
        res[key] = sortJsonKeys(obj[key]);
        return res;
      }, {});
  }
  return obj;
}

export function jsonToCsv(jsonInput: any[] | string): string {
  let jsonArray: any[];
  if (typeof jsonInput === "string") {
    try {
      jsonArray = JSON.parse(jsonInput);
    } catch {
      throw new Error("Invalid JSON string. Please provide a valid JSON array.");
    }
  } else {
    jsonArray = jsonInput;
  }
  if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
    throw new Error("Input must be a non-empty array of objects");
  }
  const headers = Array.from(new Set(jsonArray.flatMap((item) => (typeof item === "object" && item !== null ? Object.keys(item) : []))));
  const escapeCell = (val: any) => `"${String(val ?? "").replace(/"/g, '""')}"`;

  const headerRow = headers.map(escapeCell).join(",");
  const rows = jsonArray.map((row) =>
    headers.map((h) => escapeCell(row ? row[h] : "")).join(",")
  );
  return [headerRow, ...rows].join("\n");
}

export function csvToJson(csvText: string): any[] {
  const lines = csvText.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) {
    throw new Error("CSV must include a header and at least one data row");
  }

  const parseLine = (line: string) => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
    if (inQuotes) throw new Error("Malformed CSV: unclosed quoted field");
    result.push(current);
    return result;
  };

  const headers = parseLine(lines[0]);
  if (headers.length === 0 || headers.some((h) => !h.trim())) {
    throw new Error("CSV header contains an empty column name");
  }
  return lines.slice(1).map((line) => {
    const values = parseLine(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] ?? "";
    });
    return obj;
  });
}

export const HTTP_STATUS_CODES: Record<number, string> = {
  100: "Continue",
  101: "Switching Protocols",
  200: "OK",
  201: "Created",
  202: "Accepted",
  204: "No Content",
  301: "Moved Permanently",
  302: "Found",
  304: "Not Modified",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  413: "Payload Too Large",
  415: "Unsupported Media Type",
  422: "Unprocessable Entity",
  429: "Too Many Requests",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
};

export {
  rot13,
  rot47,
  caesarCipher,
  textToMorse as morseEncode,
  morseToText as morseDecode,
} from "./crypto";

export function textToBinaryString(text: string): string {
  return Array.from(new TextEncoder().encode(text))
    .map((b) => b.toString(2).padStart(8, "0"))
    .join(" ");
}

export function binaryStringToText(binaryStr: string): string {
  const tokens = binaryStr.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return "";
  if (tokens.some((bin) => !/^[01]{1,8}$/.test(bin))) {
    throw new Error("Invalid binary input: use 1-8 bit binary groups separated by spaces");
  }
  const bytes = new Uint8Array(tokens.map((bin) => parseInt(bin, 2)));
  return new TextDecoder().decode(bytes);
}

export function stringToHex(text: string): string {
  return Array.from(new TextEncoder().encode(text))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");
}

export function hexToString(hexStr: string): string {
  const clean = hexStr.replace(/\s+/g, "");
  if (!clean) return "";
  if (!/^[0-9A-Fa-f]+$/.test(clean) || clean.length % 2 !== 0) {
    throw new Error("Invalid hexadecimal input: use complete byte pairs");
  }
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.substring(i, i + 2), 16);
  }
  return new TextDecoder().decode(bytes);
}

export function safeStorageGet(key: string): string | null {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {
    // Gracefully handle iframe or restricted cookie exceptions
  }
  return null;
}

export function safeStorageSet(key: string, value: string): void {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // Gracefully handle iframe or restricted storage exceptions
  }
}

export function safeStorageRemove(key: string): void {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // Gracefully handle restricted storage exceptions
  }
}

export async function safeCopyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback to execCommand if navigator.clipboard is rejected or restricted
  }

  try {
    if (typeof document !== "undefined") {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.top = "0";
      textarea.style.left = "0";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      return success;
    }
  } catch {
    // fallback failed
  }
  return false;
}
