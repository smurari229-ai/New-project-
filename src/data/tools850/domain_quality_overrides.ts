import { DynamicTool } from "./definitions";

function utf8Bytes(input: string): number[] { return Array.from(new TextEncoder().encode(input)); }
function rotr(x: number, n: number) { return (x >>> n) | (x << (32 - n)); }
const K256 = [
  0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
  0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
  0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
  0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
  0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
  0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
  0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb3,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
  0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2,
];
function sha256Bytes(input: number[]): number[] {
  const byteLength = input.length;
  const padLength = byteLength % 64 < 56 ? 64 : 128;
  const padded = input.slice();
  padded.push(0x80);
  while (padded.length % 64 !== 56) padded.push(0);

  const bitLengthHigh = Math.floor(byteLength / 0x20000000);
  const bitLengthLow = byteLength << 3;
  padded.push(
    (bitLengthHigh >>> 24) & 0xff,
    (bitLengthHigh >>> 16) & 0xff,
    (bitLengthHigh >>> 8) & 0xff,
    bitLengthHigh & 0xff,
    (bitLengthLow >>> 24) & 0xff,
    (bitLengthLow >>> 16) & 0xff,
    (bitLengthLow >>> 8) & 0xff,
    bitLengthLow & 0xff,
  );

  const state = new Int32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ]);
  const words = new Int32Array(64);

  for (let offset = 0; offset < padded.length; offset += 64) {
    let [a, b, c, d, e, f, g, h] = state;

    for (let i = 0; i < 16; i++) {
      const j = offset + i * 4;
      words[i] = ((padded[j] & 0xff) << 24) |
        ((padded[j + 1] & 0xff) << 16) |
        ((padded[j + 2] & 0xff) << 8) |
        (padded[j + 3] & 0xff);
    }

    for (let i = 16; i < 64; i++) {
      let u = words[i - 2];
      const s1 = (u >>> 17 | u << 15) ^ (u >>> 19 | u << 13) ^ (u >>> 10);
      u = words[i - 15];
      const s0 = (u >>> 7 | u << 25) ^ (u >>> 18 | u << 14) ^ (u >>> 3);
      words[i] = (s1 + words[i - 7] | 0) + (s0 + words[i - 16] | 0);
    }

    for (let i = 0; i < 64; i++) {
      const s1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
      const ch = (e & f) ^ (~e & g);
      const t1 = (((s1 + ch) | 0) + (h + ((K256[i] + words[i]) | 0) | 0)) | 0;
      const s0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (s0 + maj) | 0;

      h = g; g = f; f = e; e = (d + t1) | 0;
      d = c; c = b; b = a; a = (t1 + t2) | 0;
    }

    state[0] = (state[0] + a) | 0;
    state[1] = (state[1] + b) | 0;
    state[2] = (state[2] + c) | 0;
    state[3] = (state[3] + d) | 0;
    state[4] = (state[4] + e) | 0;
    state[5] = (state[5] + f) | 0;
    state[6] = (state[6] + g) | 0;
    state[7] = (state[7] + h) | 0;
  }

  return Array.from(state).flatMap((value) => {
    const n = value >>> 0;
    return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
  });
}
function hex(bytes:number[]){return bytes.map(b=>b.toString(16).padStart(2,"0")).join("");}
function b64url(bytes:number[]){return btoa(String.fromCharCode(...bytes)).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"");}
function hmacSha256(key:number[], data:number[]):number[]{
  if(key.length>64) key=sha256Bytes(key); key=key.slice(); while(key.length<64) key.push(0);
  const o=key.map(x=>x^0x5c), i=key.map(x=>x^0x36); return sha256Bytes(o.concat(sha256Bytes(i.concat(data))));
}
function randomInt(max:number){ if(max<=0) return 0; const buf=new Uint32Array(1); const limit=Math.floor(0x100000000/max)*max; do{crypto.getRandomValues(buf);}while(buf[0]>=limit); return buf[0]%max; }
function randomPassphrase(count:number, alphabet:string[]){const picked:string[]=[];for(let i=0;i<count;i++)picked.push(alphabet[randomInt(alphabet.length)]);return picked;}
function crc32Bytes(input:number[]){let crc=0xffffffff;for(const byte of input){crc^=byte;for(let k=0;k<8;k++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return (crc^0xffffffff)>>>0;}

export function applyDomainQualityOverrides(tools: DynamicTool[]): DynamicTool[] {
  return tools.map((tool) => {
    if (tool.id === 458) return {...tool, description:"Generates an HTTP Basic Authorization header using UTF-8-safe Base64 encoding.", run:(user,pass="")=>{const bytes=new TextEncoder().encode(`${user}:${pass}`);return `Authorization: Basic ${btoa(String.fromCharCode(...bytes))}`;}};
    if (tool.id === 471) return {...tool, title:"Memorable Passphrase Generator (Cryptographic Random)", description:"Generates memorable passphrases using cryptographically secure browser randomness. This is inspired by Diceware but does not implement an official Diceware word list.", run:(v)=>{const words=["quantum","falcon","orbit","crystal","matrix","beacon","aurora","summit","cipher","vector","galaxy","harbor","zenith","canyon","voyage","timber","shadow","breeze","radiant","thunder","cobalt","glacier","prism","shield"];const count=Math.min(8,Math.max(3,parseInt(v,10)||4));return `Passphrase:\n${randomPassphrase(count,words).join("-")}-${randomInt(90)+10}`;}};
    if (tool.id === 474) return {...tool, description:"Computes the standard cryptographic SHA-256 digest in hexadecimal using a local implementation.", run:(v)=>`SHA-256:\n${hex(sha256Bytes(utf8Bytes(v)))}`};
    if (tool.id === 475) return {...tool, title:"MD5 Hash Demo (Non-cryptographic)", description:"Demonstrates the MD5 concept but does not claim to calculate a standards-compliant MD5 digest. MD5 is obsolete for security use.", run:(v)=>{let h=0;for(const c of v)h=(Math.imul(h,31)+c.charCodeAt(0))>>>0;return `MD5 demo fingerprint (NOT an MD5 digest):\n${h.toString(16).padStart(8,"0")}\n\nUse SHA-256 or a modern password-hashing algorithm for security.`;}};
    if (tool.id === 476) return {...tool, description:"Computes the standard CRC-32 checksum using the ISO 3309 polynomial.", run:(v)=>{const value=crc32Bytes(utf8Bytes(v));return `CRC32 Hex: 0x${value.toString(16).toUpperCase().padStart(8,"0")}\nInteger:   ${value}`;}};
    if (tool.id === 484) return {...tool, description:"Generates a NanoID-style identifier using cryptographically secure browser randomness.", run:(lenStr,alpha="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_")=>{const len=Math.min(64,Math.max(5,parseInt(lenStr,10)||21));const alphabet=alpha||"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";let res="";for(let i=0;i<len;i++)res+=alphabet[randomInt(alphabet.length)];return `NanoID-style ID (${len} chars):\n${res}`;}};
    if (tool.id === 481) return {...tool, title:"TOTP Code Simulator (Non-cryptographic)", description:"Shows the TOTP time window and a clearly labeled demo code; not a standards-compliant cryptographic TOTP implementation.", run:(v)=>{const step=Math.floor(Date.now()/30000);let h=0;for(const c of `${v}:${step}`)h=(Math.imul(h,31)+c.charCodeAt(0))>>>0;return `Demo secret: ${v}\nDemo code: ${(h%1000000).toString().padStart(6,"0")}\nValid for next: ${30-(Math.floor(Date.now()/1000)%30)} seconds\n\nNOTE: Demo only — use a real RFC 6238 library for authentication.`;}};
    if (tool.id === 483) return {...tool, title:"UUID v5 Namespace Name Template", description:"Explains the UUID v5 inputs without pretending to calculate SHA-1 in the browser tool runner.", run:(ns,name="")=>`UUID v5 inputs:\nNamespace: ${ns.trim() || "dns"}\nName: ${name}\n\nUUID v5 requires SHA-1(namespace_bytes + UTF-8(name)) with version 5 and RFC 4122 variant bits. Use a standards-compliant UUID library to compute the final UUID.`};
    if (tool.id === 518) return {...tool, description:"Generates a random PKCE verifier and computes its S256 challenge with SHA-256.", run:()=>{const arr=new Uint8Array(32);crypto.getRandomValues(arr);const verifier=b64url(Array.from(arr));const challenge=b64url(sha256Bytes(utf8Bytes(verifier)));return `code_verifier:\n${verifier}\n\ncode_challenge:\n${challenge}\n\ncode_challenge_method: S256`;}};
    if (tool.id === 497) return {...tool, title:"Webhook HMAC-SHA256 Signature Generator", description:"Computes an HMAC-SHA256 hex signature for a raw webhook body and secret.", run:(body,secret="")=>{const sig=hex(hmacSha256(utf8Bytes(secret),utf8Bytes(body)));return `HMAC-SHA256:\n${sig}\n\nVerification: Recompute this value on the receiver using the same secret.`;}};
    if (tool.id === 517) return {...tool, title:"JWK Structure Template", description:"Generates a clearly labeled RSA JWK structure template; it does not generate real RSA key material.", run:(kid)=>JSON.stringify({kty:"RSA",use:"sig",alg:"RS256",kid:kid.trim()||"key-1",n:"<base64url RSA modulus>",e:"AQAB"},null,2)};
    if (tool.id === 500) return {...tool, title:"Security Headers Checklist Template", description:"Generates a checklist template; it does not inspect the current website or claim a real security score.", run:()=>`Security Headers Checklist (template):\n[ ] Strict-Transport-Security (HSTS)\n[ ] Content-Security-Policy (CSP)\n[ ] X-Content-Type-Options (nosniff)\n[ ] X-Frame-Options\n[ ] Referrer-Policy\n[ ] Permissions-Policy\n\nNo score is calculated because this offline tool does not inspect a live response.`};
    if (tool.id === 493) return {...tool, title:"SSH Key Fingerprint Command Helper", description:"Provides the OpenSSH command to calculate a real SHA-256 public-key fingerprint instead of returning a hardcoded fingerprint.", run:(v)=>`Input key: ${v}\n\nRun locally with OpenSSH:\nssh-keygen -lf <public-key-file> -E sha256`};
    if (tool.id === 516) return {...tool, title:".htpasswd Generator Template", description:"Generates a secure command template; it does not fake a password hash in the browser.", run:(user,pass="")=>`Username: ${user}\nPassword length: ${pass.length}\n\nRecommended command:\nhtpasswd -nB ${user}\n\nThe bcrypt hash must be generated by a real bcrypt implementation.`};
    if (tool.id === 494) return {...tool, title:"DNS Record Template Generator", description:"Generates editable DNS record templates without inventing live IP addresses or verification tokens.", run:(host,target="")=>`; A Record (replace with your real IP)\n${host}   300   IN   A       <IPv4_ADDRESS>\n\n; CNAME Record\n${host}   300   IN   CNAME   ${target || "<target.example.com>"}.\n\n; TXT Verification (replace with your provider token)\n${host} 300 IN TXT "<verification-token>"`};
    if (tool.id === 487) return {...tool, title:"SRI HTML Template Generator", description:"Generates an SRI script-tag template and clearly marks the digest as a placeholder requiring a real SHA-384 calculation.", run:()=>`<script\n  src="https://cdn.example.com/lib.js"\n  integrity="sha384-<calculate-real-sha384-of-the-exact-resource>"\n  crossorigin="anonymous"\n></script>`};
    return tool;
  });
}
