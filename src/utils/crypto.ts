// Standalone MD5 Implementation
export function md5(str: string): string {
  function safeAdd(x: number, y: number): number {
    const l = (x & 0xffff) + (y & 0xffff);
    return (((x >>> 16) + (y >>> 16) + (l >>> 16)) << 16) | (l & 0xffff);
  }

  function rol(num: number, cnt: number): number {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  function cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
    return safeAdd(rol(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }

  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return cmn((b & c) | (~b & d), a, b, x, s, t);
  }

  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return cmn((b & d) | (c & ~d), a, b, x, s, t);
  }

  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }

  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  const bytes = new TextEncoder().encode(str);
  const len = bytes.length;
  const bitLen = len * 8;
  const total = (((len + 8) >>> 6) + 1) * 16;
  const x = new Uint32Array(total);

  for (let i = 0; i < len; i++) {
    x[i >> 2] |= bytes[i] << ((i % 4) * 8);
  }
  x[len >> 2] |= 0x80 << ((len % 4) * 8);
  x[total - 2] = bitLen >>> 0;
  x[total - 1] = Math.floor(bitLen / 4294967296);

  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (let i = 0; i < total; i += 16) {
    const oa = a;
    const ob = b;
    const oc = c;
    const od = d;

    a = ff(a, b, c, d, x[i + 0], 7, 0xd76aa478);
    d = ff(d, a, b, c, x[i + 1], 12, 0xe8c7b756);
    c = ff(c, d, a, b, x[i + 2], 17, 0x242070db);
    b = ff(b, c, d, a, x[i + 3], 22, 0xc1bdceee);

    a = ff(a, b, c, d, x[i + 4], 7, 0xf57c0faf);
    d = ff(d, a, b, c, x[i + 5], 12, 0x4787c62a);
    c = ff(c, d, a, b, x[i + 6], 17, 0xa8304613);
    b = ff(b, c, d, a, x[i + 7], 22, 0xfd469501);

    a = ff(a, b, c, d, x[i + 8], 7, 0x698098d8);
    d = ff(d, a, b, c, x[i + 9], 12, 0x8b44f7af);
    c = ff(c, d, a, b, x[i + 10], 17, 0xffff5bb1);
    b = ff(b, c, d, a, x[i + 11], 22, 0x895cd7be);

    a = ff(a, b, c, d, x[i + 12], 7, 0x6b901122);
    d = ff(d, a, b, c, x[i + 13], 12, 0xfd987193);
    c = ff(c, d, a, b, x[i + 14], 17, 0xa679438e);
    b = ff(b, c, d, a, x[i + 15], 22, 0x49b40821);

    a = gg(a, b, c, d, x[i + 1], 5, 0xf61e2562);
    d = gg(d, a, b, c, x[i + 6], 9, 0xc040b340);
    c = gg(c, d, a, b, x[i + 11], 14, 0x265e5a51);
    b = gg(b, c, d, a, x[i + 0], 20, 0xe9b6c7aa);

    a = gg(a, b, c, d, x[i + 5], 5, 0xd62f105d);
    d = gg(d, a, b, c, x[i + 10], 9, 0x02441453);
    c = gg(c, d, a, b, x[i + 15], 14, 0xd8a1e681);
    b = gg(b, c, d, a, x[i + 4], 20, 0xe7d3fbc8);

    a = gg(a, b, c, d, x[i + 9], 5, 0x21e1cde6);
    d = gg(d, a, b, c, x[i + 14], 9, 0xc33707d6);
    c = gg(c, d, a, b, x[i + 3], 14, 0xf4d50d87);
    b = gg(b, c, d, a, x[i + 8], 20, 0x455a14ed);

    a = gg(a, b, c, d, x[i + 13], 5, 0xa9e3e905);
    d = gg(d, a, b, c, x[i + 2], 9, 0xfcefa3f8);
    c = gg(c, d, a, b, x[i + 7], 14, 0x676f02d9);
    b = gg(b, c, d, a, x[i + 12], 20, 0x8d2a4c8a);

    a = hh(a, b, c, d, x[i + 5], 4, 0xfffa3942);
    d = hh(d, a, b, c, x[i + 8], 11, 0x8771f681);
    c = hh(c, d, a, b, x[i + 11], 16, 0x6d9d6122);
    b = hh(b, c, d, a, x[i + 14], 23, 0xfde5380c);

    a = hh(a, b, c, d, x[i + 1], 4, 0xa4beea44);
    d = hh(d, a, b, c, x[i + 4], 11, 0x4bdecfa9);
    c = hh(c, d, a, b, x[i + 7], 16, 0xf6bb4b60);
    b = hh(b, c, d, a, x[i + 10], 23, 0xbebfbc70);

    a = hh(a, b, c, d, x[i + 13], 4, 0x289b7ec6);
    d = hh(d, a, b, c, x[i + 0], 11, 0xeaa127fa);
    c = hh(c, d, a, b, x[i + 3], 16, 0xd4ef3085);
    b = hh(b, c, d, a, x[i + 6], 23, 0x04881d05);

    a = hh(a, b, c, d, x[i + 9], 4, 0xd9d4d039);
    d = hh(d, a, b, c, x[i + 12], 11, 0xe6db99e5);
    c = hh(c, d, a, b, x[i + 15], 16, 0x1fa27cf8);
    b = hh(b, c, d, a, x[i + 2], 23, 0xc4ac5665);

    a = ii(a, b, c, d, x[i + 0], 6, 0xf4292244);
    d = ii(d, a, b, c, x[i + 7], 10, 0x432aff97);
    c = ii(c, d, a, b, x[i + 14], 15, 0xab9423a7);
    b = ii(b, c, d, a, x[i + 5], 21, 0xfc93a039);

    a = ii(a, b, c, d, x[i + 12], 6, 0x655b59c3);
    d = ii(d, a, b, c, x[i + 3], 10, 0x8f0ccc92);
    c = ii(c, d, a, b, x[i + 10], 15, 0xffeff47d);
    b = ii(b, c, d, a, x[i + 1], 21, 0x85845dd1);

    a = ii(a, b, c, d, x[i + 8], 6, 0x6fa87e4f);
    d = ii(d, a, b, c, x[i + 15], 10, 0xfe2ce6e0);
    c = ii(c, d, a, b, x[i + 6], 15, 0xa3014314);
    b = ii(b, c, d, a, x[i + 13], 21, 0x4e0811a1);

    a = ii(a, b, c, d, x[i + 4], 6, 0xf7537e82);
    d = ii(d, a, b, c, x[i + 11], 10, 0xbd3af235);
    c = ii(c, d, a, b, x[i + 2], 15, 0x2ad7d2bb);
    b = ii(b, c, d, a, x[i + 9], 21, 0xeb86d391);

    a = safeAdd(a, oa);
    b = safeAdd(b, ob);
    c = safeAdd(c, oc);
    d = safeAdd(d, od);
  }

  const words = [a, b, c, d];
  let out = "";
  for (const word of words) {
    for (let i = 0; i < 4; i++) {
      out += ((word >>> (i * 8)) & 255).toString(16).padStart(2, "0");
    }
  }
  return out;
}

export const simpleMd5 = md5;

export async function subtleHash(text: string, algorithm: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512"): Promise<string> {
  const buffer = await crypto.subtle.digest(algorithm, new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const sha1Hex = (text: string) => subtleHash(text, "SHA-1");
export const sha256Hex = (text: string) => subtleHash(text, "SHA-256");
export const sha384Hex = (text: string) => subtleHash(text, "SHA-384");
export const sha512Hex = (text: string) => subtleHash(text, "SHA-512");

export async function subtleHmac(keyStr: string, message: string, hashAlgo: "SHA-256" | "SHA-512"): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(keyStr),
    { name: "HMAC", hash: hashAlgo },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const hmacSha256Hex = (key: string, msg: string) => subtleHmac(key, msg, "SHA-256");
export const hmacSha512Hex = (key: string, msg: string) => subtleHmac(key, msg, "SHA-512");

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToBytes(str: string): Uint8Array {
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function aesEncrypt(password: string, plaintext: string): Promise<string> {
  const keyHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password));
  const key = await crypto.subtle.importKey("raw", keyHash, { name: "AES-GCM" }, false, ["encrypt"]);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plaintext)
  );

  return `${bytesToBase64(iv)}.${bytesToBase64(new Uint8Array(encrypted))}`;
}

export async function aesDecrypt(password: string, packageText: string): Promise<string> {
  const parts = packageText.trim().split(".");
  if (parts.length !== 2) throw new Error("Invalid encrypted package. Expected IV.CIPHERTEXT");
  const iv = base64ToBytes(parts[0]);
  const cipher = base64ToBytes(parts[1]);
  if (iv.length !== 12) throw new Error("Invalid IV length. Expected 12 bytes.");

  const keyHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password));
  const key = await crypto.subtle.importKey("raw", keyHash, { name: "AES-GCM" }, false, ["decrypt"]);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, cipher);
  return new TextDecoder().decode(decrypted);
}

export function rot13(text: string): string {
  return text.replace(/[A-Za-z]/g, (c) => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

export function rot47(text: string): string {
  return Array.from(text)
    .map((c) => {
      const code = c.charCodeAt(0);
      return code >= 33 && code <= 126 ? String.fromCharCode(33 + ((code - 33 + 47) % 94)) : c;
    })
    .join("");
}

export function caesarCipher(text: string, shift: number, decrypt = false): string {
  const s = ((shift % 26) + 26) % 26 * (decrypt ? -1 : 1);
  return Array.from(text)
    .map((c) => {
      if (/[A-Z]/.test(c)) {
        return String.fromCharCode((((c.charCodeAt(0) - 65 + s) % 26) + 26) % 26 + 65);
      }
      if (/[a-z]/.test(c)) {
        return String.fromCharCode((((c.charCodeAt(0) - 97 + s) % 26) + 26) % 26 + 97);
      }
      return c;
    })
    .join("");
}

export const MORSE_CODE_MAP: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....",
  I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.",
  Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..", "0": "-----", "1": ".----", "2": "..---", "3": "...--",
  "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  " ": "/", ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--", "@": ".--.-."
};

export function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map((c) => MORSE_CODE_MAP[c] || c)
    .join(" ");
}

export function morseToText(morse: string): string {
  const reverseMap = Object.fromEntries(Object.entries(MORSE_CODE_MAP).map(([k, v]) => [v, k]));
  return morse
    .trim()
    .split(/\s+/)
    .map((token) => (token === "/" ? " " : reverseMap[token] || "?"))
    .join("");
}
