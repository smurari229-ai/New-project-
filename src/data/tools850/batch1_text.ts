import { DynamicTool } from "./definitions";

export const BATCH_1_TEXT_TOOLS: DynamicTool[] = [
  {
    id: 151,
    title: "PascalCase Converter",
    category: "Text",
    description: "Converts text, snake_case, or kebab-case into PascalCase.",
    keywords: ["pascalcase", "casing", "naming", "camel"],
    inputType: "text",
    default1: "hello_world developer super hub",
    run: (v) =>
      v
        .split(/[\s_\-]+/)
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(""),
  },
  {
    id: 152,
    title: "CONSTANT_CASE Converter",
    category: "Text",
    description: "Converts text to uppercase screaming snake case (CONSTANT_CASE).",
    keywords: ["constant", "screaming snake", "uppercase", "enum"],
    inputType: "text",
    default1: "api rate limit exceeded",
    run: (v) =>
      v
        .trim()
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        .replace(/[\s\-]+/g, "_")
        .toUpperCase(),
  },
  {
    id: 153,
    title: "dot.case Converter",
    category: "Text",
    description: "Converts text into dot-separated format (e.g. config keys).",
    keywords: ["dotcase", "properties", "i18n", "json path"],
    inputType: "text",
    default1: "database connection timeout ms",
    run: (v) =>
      v
        .trim()
        .toLowerCase()
        .replace(/[\s_\-]+/g, "."),
  },
  {
    id: 154,
    title: "path/case Converter",
    category: "Text",
    description: "Converts strings to forward slash path format.",
    keywords: ["path", "url", "directory", "route"],
    inputType: "text",
    default1: "src components developer tools hub",
    run: (v) =>
      v
        .trim()
        .toLowerCase()
        .replace(/[\s_\-]+/g, "/"),
  },
  {
    id: 155,
    title: "Sentence case Converter",
    category: "Text",
    description: "Capitalizes the first letter of each sentence cleanly.",
    keywords: ["sentence", "grammar", "capitalize", "typography"],
    inputType: "textarea",
    default1: "hello world. this is a developer tool! are you ready?",
    run: (v) =>
      v.replace(/(^\s*|\.\s*|\?\s*|!\s*)([a-z])/g, (_, p, c) => p + c.toUpperCase()),
  },
  {
    id: 156,
    title: "Alternating cAsE Converter",
    category: "Text",
    description: "Converts text into aLtErNaTiNg mocking case.",
    keywords: ["spongebob", "alternating", "meme", "case"],
    inputType: "text",
    default1: "this is completely working",
    run: (v) =>
      v
        .split("")
        .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
        .join(""),
  },
  {
    id: 157,
    title: "Invert / Toggle Case",
    category: "Text",
    description: "Swaps all uppercase letters to lowercase and vice versa.",
    keywords: ["toggle", "invert", "flip case", "opposite"],
    inputType: "text",
    default1: "Hello World 123 JavaScript",
    run: (v) =>
      v
        .split("")
        .map((c) =>
          c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
        )
        .join(""),
  },
  {
    id: 158,
    title: "Reverse Characters",
    category: "Text",
    description: "Reverses all characters in the string backwards.",
    keywords: ["reverse", "flip", "backwards", "palindrome"],
    inputType: "text",
    default1: "Antigravity Coding Super Hub",
    run: (v) => v.split("").reverse().join(""),
  },
  {
    id: 159,
    title: "Reverse Words in Sentence",
    category: "Text",
    description: "Reverses the order of words while preserving characters.",
    keywords: ["reverse words", "sentence order", "word flip"],
    inputType: "text",
    default1: "one two three four five",
    run: (v) => v.trim().split(/\s+/).reverse().join(" "),
  },
  {
    id: 160,
    title: "Morse Code Encoder",
    category: "Text",
    description: "Converts text to international Morse code dots and dashes.",
    keywords: ["morse", "telegraph", "dots dashes", "signal"],
    inputType: "text",
    default1: "SOS HELP",
    run: (v) => {
      const map: Record<string, string> = {
        A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.",
        H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.",
        O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-",
        V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..", "0": "-----",
        "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....",
        "6": "-....", "7": "--...", "8": "---..", "9": "----.", " ": "/",
      };
      return v
        .toUpperCase()
        .split("")
        .map((c) => map[c] || c)
        .join(" ");
    },
  },
  {
    id: 161,
    title: "Morse Code Decoder",
    category: "Text",
    description: "Translates Morse code back to readable Latin characters.",
    keywords: ["morse decode", "translate", "telegraph"],
    inputType: "text",
    default1: "... --- ...",
    run: (v) => {
      const rev: Record<string, string> = {
        ".-": "A", "-...": "B", "-.-.": "C", "-..": "D", ".": "E", "..-.": "F",
        "--.": "G", "....": "H", "..": "I", ".---": "J", "-.-": "K", ".-..": "L",
        "--": "M", "-.": "N", "---": "O", ".--.": "P", "--.-": "Q", ".-.": "R",
        "...": "S", "-": "T", "..-": "U", "...-": "V", ".--": "W", "-..-": "X",
        "-.--": "Y", "--..": "Z", "-----": "0", ".----": "1", "..---": "2",
        "...--": "3", "....-": "4", ".....": "5", "-....": "6", "--...": "7",
        "---..": "8", "----.": "9", "/": " ",
      };
      return v
        .trim()
        .split(/\s+/)
        .map((code) => rev[code] || "?")
        .join("");
    },
  },
  {
    id: 162,
    title: "ROT13 Text Cipher",
    category: "Text",
    description: "Rotates letters by 13 positions (symmetric cipher).",
    keywords: ["rot13", "caesar", "obfuscate", "spoilers"],
    inputType: "textarea",
    default1: "The secret password is supersecure",
    run: (v) =>
      v.replace(/[a-zA-Z]/g, (c) => {
        const base = c <= "Z" ? 65 : 97;
        return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
      }),
  },
  {
    id: 163,
    title: "ROT47 ASCII Cipher",
    category: "Text",
    description: "Rotates all printable ASCII characters by 47 positions.",
    keywords: ["rot47", "ascii rotate", "obfuscation"],
    inputType: "text",
    default1: "Coding Super Hub 2026!",
    run: (v) =>
      v
        .split("")
        .map((c) => {
          const code = c.charCodeAt(0);
          if (code >= 33 && code <= 126) {
            return String.fromCharCode(33 + ((code - 33 + 47) % 94));
          }
          return c;
        })
        .join(""),
  },
  {
    id: 164,
    title: "Caesar Cipher (+/- N shift)",
    category: "Text",
    description: "Shifts letters by a custom offset (shift 1 to 25).",
    keywords: ["caesar", "shift cipher", "crypto", "ancient"],
    inputType: "two-inputs",
    label1: "Text to Encrypt",
    label2: "Shift (e.g. 3)",
    default1: "Hello World",
    default2: "3",
    run: (v, shiftVal = "3") => {
      const shift = (parseInt(shiftVal, 10) || 3) % 26;
      return v.replace(/[a-zA-Z]/g, (c) => {
        const base = c <= "Z" ? 65 : 97;
        return String.fromCharCode(
          ((c.charCodeAt(0) - base + shift + 26) % 26) + base
        );
      });
    },
  },
  {
    id: 165,
    title: "Leetspeak (1337) Generator",
    category: "Text",
    description: "Converts text into hacker leetspeak substitution.",
    keywords: ["1337", "leet", "hacker", "gamer"],
    inputType: "text",
    default1: "developer superpowers unlocked",
    run: (v) => {
      const leetMap: Record<string, string> = {
        a: "4", A: "4", e: "3", E: "3", i: "1", I: "1", o: "0", O: "0",
        s: "5", S: "5", t: "7", T: "7", b: "8", B: "8", g: "9", G: "9",
      };
      return v
        .split("")
        .map((c) => leetMap[c] || c)
        .join("");
    },
  },
  {
    id: 166,
    title: "Remove All Whitespace",
    category: "Text",
    description: "Strips all spaces, tabs, and line breaks completely.",
    keywords: ["whitespace", "strip spaces", "compact", "nospaces"],
    inputType: "textarea",
    default1: "  c o d i n g   s u p e r   h u b  \n  1 5 0   t o o l s ",
    run: (v) => v.replace(/\s+/g, ""),
  },
  {
    id: 167,
    title: "Remove Empty Lines",
    category: "Text",
    description: "Eliminates all blank and whitespace-only lines.",
    keywords: ["empty lines", "clean text", "blank rows"],
    inputType: "textarea",
    default1: "Line 1\n\n\nLine 2\n\nLine 3",
    run: (v) =>
      v
        .split("\n")
        .filter((l) => l.trim().length > 0)
        .join("\n"),
  },
  {
    id: 168,
    title: "Deduplicate Lines",
    category: "Text",
    description: "Filters out all duplicate lines while keeping first occurrences.",
    keywords: ["dedupe", "unique lines", "remove duplicates"],
    inputType: "textarea",
    default1: "apple\nbanana\napple\norange\nbanana\ngrape",
    run: (v) => {
      const lines = v.split("\n");
      const unique = Array.from(new Set(lines));
      return `Total Lines: ${lines.length} | Unique: ${unique.length}\n\n` + unique.join("\n");
    },
  },
  {
    id: 169,
    title: "Sort Lines Alphabetically (A-Z)",
    category: "Text",
    description: "Sorts text lines in ascending alphabetical order.",
    keywords: ["sort", "alphabetical", "a-z", "lines"],
    inputType: "textarea",
    default1: "Zebra\nApple\nMonkey\nCat\nBanana",
    run: (v) =>
      v
        .split("\n")
        .sort((a, b) => a.localeCompare(b))
        .join("\n"),
  },
  {
    id: 170,
    title: "Sort Lines Descending (Z-A)",
    category: "Text",
    description: "Sorts text lines in reverse alphabetical order.",
    keywords: ["sort reverse", "z-a", "descending"],
    inputType: "textarea",
    default1: "Zebra\nApple\nMonkey\nCat\nBanana",
    run: (v) =>
      v
        .split("\n")
        .sort((a, b) => b.localeCompare(a))
        .join("\n"),
  },
  {
    id: 171,
    title: "Sort Lines by Length",
    category: "Text",
    description: "Sorts lines from shortest to longest line.",
    keywords: ["sort length", "shortest", "longest"],
    inputType: "textarea",
    default1: "Supercalifragilistic\nHi\nCoding Hub\nA",
    run: (v) =>
      v
        .split("\n")
        .sort((a, b) => a.length - b.length)
        .join("\n"),
  },
  {
    id: 172,
    title: "Shuffle Lines Randomly",
    category: "Text",
    description: "Randomizes the order of all lines (Fisher-Yates shuffle).",
    keywords: ["shuffle", "randomize", "order"],
    inputType: "textarea",
    default1: "1. Python\n2. TypeScript\n3. Rust\n4. Go\n5. Java",
    run: (v) => {
      const arr = v.split("\n");
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr.join("\n");
    },
  },
  {
    id: 173,
    title: "Add Line Numbers",
    category: "Text",
    description: "Prepends 1-based sequential line numbers to each line.",
    keywords: ["line numbers", "gutter", "code lines"],
    inputType: "textarea",
    default1: "function test() {\n  return true;\n}",
    run: (v) =>
      v
        .split("\n")
        .map((l, i) => `${(i + 1).toString().padStart(3, " ")} | ${l}`)
        .join("\n"),
  },
  {
    id: 174,
    title: "Prefix & Suffix Each Line",
    category: "Text",
    description: "Wraps each line with a custom prefix and suffix.",
    keywords: ["prefix", "suffix", "wrap lines", "quotes"],
    inputType: "two-inputs",
    label1: "Lines",
    label2: "Prefix / Suffix (e.g. ' -> ,)",
    default1: "item1\nitem2\nitem3",
    default2: "'",
    run: (v, wrap = "'") =>
      v
        .split("\n")
        .map((l) => `${wrap}${l}${wrap}`)
        .join("\n"),
  },
  {
    id: 175,
    title: "Trim Each Line",
    category: "Text",
    description: "Removes leading and trailing whitespace from every line individually.",
    keywords: ["trim", "strip", "clean lines"],
    inputType: "textarea",
    default1: "   hello   \n   world   \n   spaces   ",
    run: (v) =>
      v
        .split("\n")
        .map((l) => l.trim())
        .join("\n"),
  },
  {
    id: 176,
    title: "Text to ASCII Character Codes",
    category: "Text",
    description: "Converts each character into its decimal ASCII / Unicode code point.",
    keywords: ["ascii", "char code", "codepoint"],
    inputType: "text",
    default1: "Hello",
    run: (v) =>
      v
        .split("")
        .map((c) => c.charCodeAt(0))
        .join(", "),
  },
  {
    id: 177,
    title: "ASCII Character Codes to Text",
    category: "Text",
    description: "Converts comma-separated ASCII numbers back to text.",
    keywords: ["ascii to text", "fromcharcode", "decode"],
    inputType: "text",
    default1: "72, 101, 108, 108, 111",
    run: (v) =>
      v
        .split(/[\s,]+/)
        .filter(Boolean)
        .map((n) => String.fromCharCode(parseInt(n, 10) || 0))
        .join(""),
  },
  {
    id: 178,
    title: "Text to Binary String (8-bit)",
    category: "Text",
    description: "Translates text into 8-bit space-separated binary bytes.",
    keywords: ["text to binary", "0101", "bytes"],
    inputType: "text",
    default1: "Code",
    run: (v) =>
      v
        .split("")
        .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
        .join(" "),
  },
  {
    id: 179,
    title: "Binary String to Text",
    category: "Text",
    description: "Decodes 8-bit binary numbers back into plain text.",
    keywords: ["binary to text", "0101 to text", "decode binary"],
    inputType: "text",
    default1: "01000011 01101111 01100100 01100101",
    run: (v) =>
      v
        .trim()
        .split(/\s+/)
        .map((bin) => String.fromCharCode(parseInt(bin, 2) || 0))
        .join(""),
  },
  {
    id: 180,
    title: "Text to Hexadecimal Bytes",
    category: "Text",
    description: "Converts string characters into hex bytes (e.g. 48 65 6c 6c 6f).",
    keywords: ["text to hex", "hex bytes", "hexadecimal"],
    inputType: "text",
    default1: "Hello",
    run: (v) =>
      v
        .split("")
        .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(" "),
  },
  {
    id: 181,
    title: "Hexadecimal Bytes to Text",
    category: "Text",
    description: "Converts hex byte strings back into characters.",
    keywords: ["hex to text", "decode hex", "unhex"],
    inputType: "text",
    default1: "48 65 6c 6c 6f",
    run: (v) =>
      v
        .trim()
        .split(/[\s:]+/)
        .map((h) => String.fromCharCode(parseInt(h, 16) || 0))
        .join(""),
  },
  {
    id: 182,
    title: "Text to Octal (Base 8)",
    category: "Text",
    description: "Converts characters to 3-digit octal codes.",
    keywords: ["octal", "base 8", "text to octal"],
    inputType: "text",
    default1: "Dev",
    run: (v) =>
      v
        .split("")
        .map((c) => c.charCodeAt(0).toString(8).padStart(3, "0"))
        .join(" "),
  },
  {
    id: 183,
    title: "Octal to Text",
    category: "Text",
    description: "Decodes 3-digit octal numbers back to string characters.",
    keywords: ["octal to text", "decode octal"],
    inputType: "text",
    default1: "104 145 166",
    run: (v) =>
      v
        .trim()
        .split(/\s+/)
        .map((o) => String.fromCharCode(parseInt(o, 8) || 0))
        .join(""),
  },
  {
    id: 184,
    title: "Unicode Escape Converter (\\uXXXX)",
    category: "Text",
    description: "Escapes non-ASCII characters to \\uXXXX Unicode syntax.",
    keywords: ["unicode escape", "\\u", "json unicode"],
    inputType: "text",
    default1: "Coding Super Hub 🚀 印度",
    run: (v) =>
      v
        .split("")
        .map((c) => {
          const code = c.charCodeAt(0);
          return code > 127
            ? "\\u" + code.toString(16).padStart(4, "0")
            : c;
        })
        .join(""),
  },
  {
    id: 185,
    title: "Unicode Unescape",
    category: "Text",
    description: "Unescapes \\uXXXX sequences back into native UTF characters.",
    keywords: ["unescape", "decode unicode", "\\u"],
    inputType: "text",
    default1: "Hello \\u0041\\u0042\\u0043",
    run: (v) => v.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))),
  },
  {
    id: 186,
    title: "Strip HTML Tags",
    category: "Text",
    description: "Removes all HTML markup and leaves clean plain text.",
    keywords: ["strip html", "remove tags", "clean html"],
    inputType: "textarea",
    default1: "<div class='card'><h1>Title</h1><p>Welcome to <b>Super Hub</b></p></div>",
    run: (v) => v.replace(/<[^>]*>/g, ""),
  },
  {
    id: 187,
    title: "Strip Markdown Formatting",
    category: "Text",
    description: "Strips bold, italics, links, headings, and code blocks from Markdown.",
    keywords: ["strip markdown", "plain text", "clean md"],
    inputType: "textarea",
    default1: "# Heading\nThis is **bold** and *italic* with [Link](https://ai.studio).",
    run: (v) =>
      v
        .replace(/#+\s+/g, "")
        .replace(/(\*\*|__)(.*?)\1/g, "$2")
        .replace(/(\*|_)(.*?)\1/g, "$2")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/`{1,3}[^`\n]+`{1,3}/g, ""),
  },
  {
    id: 188,
    title: "Extract All Email Addresses",
    category: "Text",
    description: "Scans text and extracts all valid email addresses.",
    keywords: ["extract emails", "regex emails", "scraper"],
    inputType: "textarea",
    default1: "Contact us at support@example.com or sales.dept@company.org for help.",
    run: (v) => {
      const matches = v.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
      return matches.length
        ? `Found ${matches.length} email(s):\n` + Array.from(new Set(matches)).join("\n")
        : "No email addresses found.";
    },
  },
  {
    id: 189,
    title: "Extract All URLs & Links",
    category: "Text",
    description: "Finds and extracts all http/https web links in the text.",
    keywords: ["extract urls", "find links", "url scraper"],
    inputType: "textarea",
    default1: "Check out https://google.com and https://ai.studio/build right now!",
    run: (v) => {
      const matches = v.match(/https?:\/\/[^\s"'<>]+/g) || [];
      return matches.length
        ? `Found ${matches.length} URL(s):\n` + Array.from(new Set(matches)).join("\n")
        : "No URLs found.";
    },
  },
  {
    id: 190,
    title: "Extract All Phone Numbers",
    category: "Text",
    description: "Extracts international and local phone number patterns.",
    keywords: ["extract phone", "telephone", "mobile numbers"],
    inputType: "textarea",
    default1: "Call +1-800-555-0199 or (555) 234-5678 for details.",
    run: (v) => {
      const matches = v.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g) || [];
      return matches.length
        ? `Found ${matches.length} phone number(s):\n` + matches.join("\n")
        : "No phone numbers found.";
    },
  },
  {
    id: 191,
    title: "Extract All Hashtags (#tags)",
    category: "Text",
    description: "Extracts all social media hashtags from text.",
    keywords: ["hashtags", "twitter", "instagram", "tags"],
    inputType: "textarea",
    default1: "Building modern apps with #React #TypeScript and #TailwindCSS!",
    run: (v) => {
      const matches = v.match(/#[a-zA-Z0-9_]+/g) || [];
      return matches.length
        ? `Found ${matches.length} hashtag(s):\n` + Array.from(new Set(matches)).join(" ")
        : "No hashtags found.";
    },
  },
  {
    id: 192,
    title: "Extract Mentions (@user)",
    category: "Text",
    description: "Extracts all user handles (@username) mentioned in text.",
    keywords: ["mentions", "usernames", "handles", "social"],
    inputType: "textarea",
    default1: "Thanks to @dan_abramov and @addyosmani for inspiring this.",
    run: (v) => {
      const matches = v.match(/@[a-zA-Z0-9_]+/g) || [];
      return matches.length
        ? `Found ${matches.length} mention(s):\n` + Array.from(new Set(matches)).join("\n")
        : "No mentions found.";
    },
  },
  {
    id: 193,
    title: "Extract All Numbers & Digits",
    category: "Text",
    description: "Filters and pulls out all numerical values and floats.",
    keywords: ["extract numbers", "digits", "integers", "floats"],
    inputType: "textarea",
    default1: "Total price is $199.99 with 15% discount for 3 items.",
    run: (v) => {
      const matches = v.match(/-?\d+(?:\.\d+)?/g) || [];
      return matches.length
        ? `Found ${matches.length} number(s):\n` + matches.join(", ")
        : "No numbers found.";
    },
  },
  {
    id: 194,
    title: "Remove All Punctuation",
    category: "Text",
    description: "Strips periods, commas, exclamation marks, and symbols.",
    keywords: ["remove punctuation", "strip symbols", "clean text"],
    inputType: "text",
    default1: "Hello, world! Are you ready? (Yes, 100% ready.)",
    run: (v) => v.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'<>@+]/g, ""),
  },
  {
    id: 195,
    title: "Count Vowels and Consonants",
    category: "Text",
    description: "Analyzes vowel (a, e, i, o, u) vs consonant distribution.",
    keywords: ["vowels", "consonants", "phonetics", "count"],
    inputType: "text",
    default1: "Antigravity Coding Super Hub",
    run: (v) => {
      const vowels = (v.match(/[aeiou]/gi) || []).length;
      const consonants = (v.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length;
      const digits = (v.match(/\d/g) || []).length;
      const spaces = (v.match(/\s/g) || []).length;
      return `Vowels: ${vowels}\nConsonants: ${consonants}\nDigits: ${digits}\nSpaces: ${spaces}\nTotal Chars: ${v.length}`;
    },
  },
  {
    id: 196,
    title: "Palindrome Phrase Tester",
    category: "Text",
    description: "Checks if a word or phrase reads the same backward and forward.",
    keywords: ["palindrome", "racecar", "check", "reverse"],
    inputType: "text",
    default1: "A man, a plan, a canal: Panama",
    run: (v) => {
      const clean = v.toLowerCase().replace(/[^a-z0-9]/g, "");
      const rev = clean.split("").reverse().join("");
      const isPal = clean.length > 0 && clean === rev;
      return isPal
        ? `✅ YES! It is a palindrome!\nNormalized: "${clean}"\nReversed:   "${rev}"`
        : `❌ NO, not a palindrome.\nNormalized: "${clean}"\nReversed:   "${rev}"`;
    },
  },
  {
    id: 197,
    title: "Anagram Words Comparator",
    category: "Text",
    description: "Determines if two phrases contain exact same letters in different order.",
    keywords: ["anagram", "word puzzle", "letters"],
    inputType: "two-inputs",
    label1: "Word/Phrase 1",
    label2: "Word/Phrase 2",
    default1: "listen",
    default2: "silent",
    run: (w1, w2 = "") => {
      const c1 = w1.toLowerCase().replace(/[^a-z0-9]/g, "").split("").sort().join("");
      const c2 = w2.toLowerCase().replace(/[^a-z0-9]/g, "").split("").sort().join("");
      const isAna = c1.length > 0 && c1 === c2;
      return isAna
        ? `✅ YES, they are anagrams!\nSorted 1: "${c1}"\nSorted 2: "${c2}"`
        : `❌ NO, not anagrams.\nSorted 1: "${c1}"\nSorted 2: "${c2}"`;
    },
  },
  {
    id: 198,
    title: "Character Frequency Counter",
    category: "Text",
    description: "Counts occurrences of each unique character in descending order.",
    keywords: ["character frequency", "histogram", "letter count"],
    inputType: "textarea",
    default1: "developer tools",
    run: (v) => {
      const counts: Record<string, number> = {};
      for (const char of v) {
        counts[char] = (counts[char] || 0) + 1;
      }
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([c, count]) => `'${c === " " ? "<space>" : c === "\n" ? "<newline>" : c}': ${count}`)
        .join("\n");
    },
  },
  {
    id: 199,
    title: "Word Frequency & Density Analyzer",
    category: "Text",
    description: "Analyzes top repeated words in the text.",
    keywords: ["word frequency", "word count", "density"],
    inputType: "textarea",
    default1: "code fast code clean code smart coding super hub",
    run: (v) => {
      const words = v.toLowerCase().match(/\b[a-z0-9_]+\b/g) || [];
      const counts: Record<string, number> = {};
      for (const w of words) counts[w] = (counts[w] || 0) + 1;
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([w, count]) => `${w}: ${count}`)
        .join("\n");
    },
  },
  {
    id: 200,
    title: "Flesch Reading Ease Score",
    category: "Text",
    description: "Computes readability score (0 to 100) from very difficult to very easy.",
    keywords: ["flesch", "readability", "score", "grade"],
    inputType: "textarea",
    default1: "The quick brown fox jumps over the lazy dog. Reading is easy when sentences are clear.",
    run: (v) => {
      const words = (v.match(/\b\w+\b/g) || []).length || 1;
      const sentences = (v.match(/[.!?]+/g) || []).length || 1;
      const syllablesHeuristic = Math.round(words * 1.4);
      const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllablesHeuristic / words);
      const clamped = Math.min(100, Math.max(0, Math.round(score)));
      let grade = "Standard / High School";
      if (clamped >= 90) grade = "Very Easy (5th grade)";
      else if (clamped >= 80) grade = "Easy (6th grade)";
      else if (clamped >= 70) grade = "Fairly Easy (7th grade)";
      else if (clamped >= 60) grade = "Standard (8th-9th grade)";
      else if (clamped >= 50) grade = "Fairly Difficult (10th-12th grade)";
      else if (clamped >= 30) grade = "Difficult (College)";
      else grade = "Very Difficult (Graduate)";
      return `Flesch Score: ${clamped}/100\nLevel: ${grade}\nTotal Words: ${words} | Sentences: ${sentences}`;
    },
  },
  {
    id: 201,
    title: "Truncate String with Ellipsis",
    category: "Text",
    description: "Cuts text to maximum length and appends ellipsis cleanly.",
    keywords: ["truncate", "ellipsis", "shorten", "max length"],
    inputType: "two-inputs",
    label1: "Text",
    label2: "Max Length (e.g. 20)",
    default1: "Coding Super Hub is an all-in-one developer toolbox.",
    default2: "25",
    run: (v, maxStr = "25") => {
      const max = parseInt(maxStr, 10) || 25;
      return v.length > max ? v.slice(0, max) + "..." : v;
    },
  },
  {
    id: 202,
    title: "String Pad Start / End",
    category: "Text",
    description: "Pads text with characters to achieve fixed target length.",
    keywords: ["padstart", "padend", "padding", "fixed width"],
    inputType: "two-inputs",
    label1: "Text",
    label2: "Target Length & Char (e.g. 10, 0)",
    default1: "42",
    default2: "10, 0",
    run: (v, config = "10, 0") => {
      const [lenStr, char = "0"] = config.split(",").map((s) => s.trim());
      const len = parseInt(lenStr, 10) || 10;
      return `Pad Start: ${v.padStart(len, char)}\nPad End:   ${v.padEnd(len, char)}`;
    },
  },
  {
    id: 203,
    title: "Repeat String N Times",
    category: "Text",
    description: "Repeats a string with an optional custom separator.",
    keywords: ["repeat", "string multiplier", "multiply"],
    inputType: "two-inputs",
    label1: "Text to Repeat",
    label2: "Times & Separator (e.g. 5, -)",
    default1: "SuperHub",
    default2: "5, -",
    run: (v, config = "5, -") => {
      const [nStr, sep = "-"] = config.split(",").map((s) => s.trim());
      const n = Math.min(100, Math.max(1, parseInt(nStr, 10) || 3));
      return Array(n).fill(v).join(sep);
    },
  },
  {
    id: 204,
    title: "Chunk / Split String by Size",
    category: "Text",
    description: "Divides long text into uniform fixed-size character blocks.",
    keywords: ["chunk", "split by size", "blocks"],
    inputType: "two-inputs",
    label1: "Text",
    label2: "Block Size (e.g. 4)",
    default1: "1234567890ABCDEF",
    default2: "4",
    run: (v, sizeStr = "4") => {
      const size = Math.max(1, parseInt(sizeStr, 10) || 4);
      const chunks = v.match(new RegExp(`.{1,${size}}`, "g")) || [];
      return chunks.join(" ");
    },
  },
  {
    id: 205,
    title: "NATO Phonetic Alphabet Speller",
    category: "Text",
    description: "Spells out text in Alfa, Bravo, Charlie aeronautical phonetic words.",
    keywords: ["nato", "phonetic", "spelling", "aviation"],
    inputType: "text",
    default1: "SUPER HUB",
    run: (v) => {
      const nato: Record<string, string> = {
        A: "Alfa", B: "Bravo", C: "Charlie", D: "Delta", E: "Echo", F: "Foxtrot",
        G: "Golf", H: "Hotel", I: "India", J: "Juliett", K: "Kilo", L: "Lima",
        M: "Mike", N: "November", O: "Oscar", P: "Papa", Q: "Quebec", R: "Romeo",
        S: "Sierra", T: "Tango", U: "Uniform", V: "Victor", W: "Whiskey", X: "X-ray",
        Y: "Yankee", Z: "Zulu", " ": "(space)",
      };
      return v
        .toUpperCase()
        .split("")
        .map((c) => nato[c] || c)
        .join(" ");
    },
  },
  {
    id: 206,
    title: "Upside Down Text Generator",
    category: "Text",
    description: "Flips text 180 degrees using inverted Unicode characters.",
    keywords: ["upside down", "flip text", "reverse"],
    inputType: "text",
    default1: "Hello World",
    run: (v) => {
      const flip: Record<string, string> = {
        a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ",
        i: "ᴉ", j: "ɾ", k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d",
        q: "b", r: "ɹ", s: "s", t: "ʇ", u: "n", v: "ʌ", w: "ʍ", x: "x",
        y: "ʎ", z: "z", A: "∀", B: "𐐒", C: "Ɔ", D: "ᗡ", E: "Ǝ", F: "Ⅎ",
        G: "⅁", H: "H", I: "I", J: "ſ", K: "ʞ", L: "˥", M: "W", N: "N",
        O: "O", P: "Ԁ", Q: "Ό", R: "ᴚ", S: "S", T: "⊥", U: "∩", V: "Λ",
        W: "M", X: "X", Y: "⅄", Z: "Z", "?": "¿", "!": "¡", ".": "˙",
      };
      return v
        .split("")
        .reverse()
        .map((c) => flip[c] || c)
        .join("");
    },
  },
  {
    id: 207,
    title: "Bubble / Circled Text Generator",
    category: "Text",
    description: "Converts characters to circled Unicode letters (ⓐⓑⓒ).",
    keywords: ["bubble text", "circled", "unicode", "aesthetic"],
    inputType: "text",
    default1: "Coding Super Hub",
    run: (v) =>
      v
        .split("")
        .map((c) => {
          const code = c.charCodeAt(0);
          if (code >= 65 && code <= 90) return String.fromCodePoint(0x24b6 + (code - 65));
          if (code >= 97 && code <= 122) return String.fromCodePoint(0x24d0 + (code - 97));
          if (code >= 49 && code <= 57) return String.fromCodePoint(0x2460 + (code - 49));
          if (code === 48) return "⓪";
          return c;
        })
        .join(""),
  },
  {
    id: 208,
    title: "Fraktur / Gothic Text Converter",
    category: "Text",
    description: "Transforms Latin characters to Old English / Fraktur typography.",
    keywords: ["fraktur", "gothic", "old english", "fancy text"],
    inputType: "text",
    default1: "Super Hub",
    run: (v) => {
      const frakturMap: Record<string, string> = {
        A: "𝔄", B: "𝔅", C: "ℭ", D: "𝔇", E: "𝔈", F: "𝔉", G: "𝔊", H: "ℌ",
        I: "ℑ", J: "𝔍", K: "𝔎", L: "𝔏", M: "𝔐", N: "𝔑", O: "𝔒", P: "𝔓",
        Q: "𝔔", R: "ℜ", S: "𝔖", T: "𝔗", U: "𝔘", V: "𝔙", W: "𝔚", X: "𝔛",
        Y: "𝔜", Z: "ℨ", a: "𝔞", b: "𝔟", c: "𝔠", d: "𝔡", e: "𝔢", f: "𝔣",
        g: "𝔤", h: "𝔥", i: "𝔦", j: "𝔧", k: "𝔨", l: "𝔩", m: "𝔪", n: "𝔫",
        o: "𝔬", p: "𝔭", q: "𝔮", r: "𝔯", s: "𝔰", t: "𝔱", u: "𝔲", v: "𝔳",
        w: "𝔴", x: "𝔵", y: "𝔶", z: "𝔷",
      };
      return v
        .split("")
        .map((c) => frakturMap[c] || c)
        .join("");
    },
  },
  {
    id: 209,
    title: "Zalgo / Glitch Text Generator",
    category: "Text",
    description: "Appends chaotic combining Unicode diacritics for a creepy/glitch effect.",
    keywords: ["zalgo", "glitch text", "corrupted", "combining mark"],
    inputType: "text",
    default1: "Antigravity",
    run: (v) => {
      const zalgoUp = ["\u030d", "\u030e", "\u0304", "\u0305", "\u033f", "\u0311", "\u0306"];
      const zalgoDown = ["\u0316", "\u0317", "\u0318", "\u0319", "\u031c", "\u0320", "\u0324"];
      return v
        .split("")
        .map((c) => {
          if (c === " ") return c;
          const up = zalgoUp[Math.floor(Math.random() * zalgoUp.length)];
          const down = zalgoDown[Math.floor(Math.random() * zalgoDown.length)];
          return c + up + down;
        })
        .join("");
    },
  },
  {
    id: 210,
    title: "Remove Accents / Diacritics",
    category: "Text",
    description: "Normalizes accented Latin characters (é, ü, ñ, ç -> e, u, n, c).",
    keywords: ["accents", "diacritics", "normalize", "nfd"],
    inputType: "text",
    default1: "Crème brûlée, café au lait, niño, façade",
    run: (v) => v.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
  },
  {
    id: 211,
    title: "Find & Replace All",
    category: "Text",
    description: "Replaces all occurrences of a search string with replacement.",
    keywords: ["replace", "substitute", "find replace"],
    inputType: "two-inputs",
    label1: "Text",
    label2: "Find -> Replace (format: old => new)",
    default1: "The cat sat on the mat with another cat.",
    default2: "cat => dog",
    run: (v, pattern = "cat => dog") => {
      const [from, to = ""] = pattern.split("=>").map((s) => s.trim());
      if (!from) return v;
      return v.split(from).join(to);
    },
  },
  {
    id: 212,
    title: "Levenshtein Distance Calculator",
    category: "Text",
    description: "Calculates the minimum single-character edits required between two words.",
    keywords: ["levenshtein", "distance", "similarity", "edit distance"],
    inputType: "two-inputs",
    label1: "Word 1",
    label2: "Word 2",
    default1: "kitten",
    default2: "sitting",
    run: (s, t = "") => {
      const d: number[][] = [];
      const m = s.length;
      const n = t.length;
      for (let i = 0; i <= m; i++) d[i] = [i];
      for (let j = 0; j <= n; j++) d[0][j] = j;
      for (let j = 1; j <= n; j++) {
        for (let i = 1; i <= m; i++) {
          const cost = s[i - 1] === t[j - 1] ? 0 : 1;
          d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        }
      }
      const dist = d[m][n];
      const maxLen = Math.max(m, n) || 1;
      const similarity = ((1 - dist / maxLen) * 100).toFixed(1);
      return `Edit Distance: ${dist}\nSimilarity: ${similarity}%`;
    },
  },
  {
    id: 213,
    title: "Jaccard Word Similarity",
    category: "Text",
    description: "Calculates the Jaccard similarity index between two sentences.",
    keywords: ["jaccard", "similarity", "nlp", "intersection"],
    inputType: "two-inputs",
    label1: "Sentence 1",
    label2: "Sentence 2",
    default1: "coding super hub for developers",
    default2: "super tools hub for programmers",
    run: (s1, s2 = "") => {
      const set1 = new Set(s1.toLowerCase().match(/\b\w+\b/g) || []);
      const set2 = new Set(s2.toLowerCase().match(/\b\w+\b/g) || []);
      const intersection = new Set([...set1].filter((x) => set2.has(x)));
      const union = new Set([...set1, ...set2]);
      const sim = union.size ? (intersection.size / union.size) * 100 : 0;
      return `Jaccard Similarity: ${sim.toFixed(1)}%\nCommon words: ${Array.from(intersection).join(", ") || "none"}`;
    },
  },
  {
    id: 214,
    title: "Soundex Phonetic Code Generator",
    category: "Text",
    description: "Encodes names by pronunciation according to US Census Soundex standard.",
    keywords: ["soundex", "phonetic", "name matching"],
    inputType: "text",
    default1: "Robert",
    run: (v) => {
      const name = v.toUpperCase().replace(/[^A-Z]/g, "");
      if (!name) return "";
      const map: Record<string, string> = {
        B: "1", F: "1", P: "1", V: "1",
        C: "2", G: "2", J: "2", K: "2", Q: "2", S: "2", X: "2", Z: "2",
        D: "3", T: "3", L: "4", M: "5", N: "5", R: "6",
      };
      let res = name[0];
      let prev = map[name[0]] || "0";
      for (let i = 1; i < name.length && res.length < 4; i++) {
        const curr = map[name[i]] || "0";
        if (curr !== "0" && curr !== prev) {
          res += curr;
        }
        prev = curr;
      }
      return res.padEnd(4, "0");
    },
  },
  {
    id: 215,
    title: "Metaphone Phonetic Code",
    category: "Text",
    description: "Produces approximate phonetic code for English pronunciation.",
    keywords: ["metaphone", "phonetic", "soundex", "nlp"],
    inputType: "text",
    default1: "Developer",
    run: (v) => {
      let s = v.toUpperCase().replace(/[^A-Z]/g, "");
      s = s.replace(/KN|GN|PN|AE|WR/, (m) => m[1]);
      s = s.replace(/MB$/, "M");
      s = s.replace(/SCH/, "SK");
      s = s.replace(/CIA|CH/, "X");
      s = s.replace(/C/, "S");
      s = s.replace(/DGE|DGY|DGI/, "J");
      s = s.replace(/TH/, "0");
      s = s.replace(/PH/, "F");
      return s.slice(0, 5) || "NULL";
    },
  },
  {
    id: 216,
    title: "Text to Snake_Case",
    category: "Text",
    description: "Converts human text into snake_case format.",
    keywords: ["snake_case", "python", "variable", "format"],
    inputType: "text",
    default1: "User profile settings active 2026",
    run: (v) =>
      v
        .trim()
        .toLowerCase()
        .replace(/[\s\-]+/g, "_"),
  },
  {
    id: 217,
    title: "Text to Kebab-Case",
    category: "Text",
    description: "Converts text into dash-separated kebab-case format.",
    keywords: ["kebab-case", "lisp-case", "css class", "slug"],
    inputType: "text",
    default1: "Hero Section Header Title",
    run: (v) =>
      v
        .trim()
        .toLowerCase()
        .replace(/[\s_]+/g, "-"),
  },
  {
    id: 218,
    title: "Join Lines with Custom Delimiter",
    category: "Text",
    description: "Merges multiline text into single line using custom delimiter.",
    keywords: ["join lines", "delimiter", "single line", "csv join"],
    inputType: "two-inputs",
    label1: "Lines",
    label2: "Delimiter (e.g. , or |)",
    default1: "first\nsecond\nthird\nfourth",
    default2: ", ",
    run: (v, d = ", ") => v.split("\n").filter(Boolean).join(d),
  },
  {
    id: 219,
    title: "Split String by Custom Delimiter",
    category: "Text",
    description: "Splits delimited string into individual lines.",
    keywords: ["split", "explode", "break lines"],
    inputType: "two-inputs",
    label1: "Delimited Text",
    label2: "Delimiter (e.g. ; or ,)",
    default1: "apple;banana;cherry;date",
    default2: ";",
    run: (v, d = ";") => v.split(d).join("\n"),
  },
  {
    id: 220,
    title: "Count Paragraphs & Sentences",
    category: "Text",
    description: "Accurately calculates total paragraphs, sentences, words, and characters.",
    keywords: ["paragraphs", "sentences", "stats", "metrics"],
    inputType: "textarea",
    default1: "First paragraph contains two sentences. Here is the second sentence.\n\nSecond paragraph starts here! And finishes nicely.",
    run: (v) => {
      const paras = v.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
      const sentences = (v.match(/[.!?]+(?:\s+|$)/g) || []).length || 1;
      const words = (v.match(/\b\S+\b/g) || []).length;
      const chars = v.length;
      return `Paragraphs: ${paras}\nSentences:   ${sentences}\nWords:       ${words}\nCharacters:  ${chars}`;
    },
  },
  {
    id: 221,
    title: "Regex String Escaper",
    category: "Text",
    description: "Escapes all special regex characters so string can be safely used in RegExp.",
    keywords: ["regex escape", "regexp", "safety"],
    inputType: "text",
    default1: "https://example.com/api?id=10&name=[John.Doe]*",
    run: (v) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  },
  {
    id: 222,
    title: "SQL String Literal Escaper",
    category: "Text",
    description: "Escapes single quotes and backslashes for SQL literals.",
    keywords: ["sql escape", "quotes", "sql injection"],
    inputType: "text",
    default1: "O'Reilly's Books & Software\\Tools",
    run: (v) => v.replace(/['\\]/g, (c) => (c === "'" ? "''" : "\\\\")),
  },
  {
    id: 223,
    title: "JSON String Escaper",
    category: "Text",
    description: "Escapes quotes, newlines, and control characters for JSON values.",
    keywords: ["json escape", "json stringify", "quotes"],
    inputType: "textarea",
    default1: 'Line 1: "Hello"\nLine 2: Tab\tHere',
    run: (v) => JSON.stringify(v),
  },
  {
    id: 224,
    title: "HTML / XML Special Chars Escaper",
    category: "Text",
    description: "Escapes &, <, >, \", and ' to HTML entity codes.",
    keywords: ["html escape", "htmlspecialchars", "xss"],
    inputType: "text",
    default1: '<script>alert("XSS & fun")</script>',
    run: (v) =>
      v
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;"),
  },
  {
    id: 225,
    title: "Full-Width (Zenkaku) Text Converter",
    category: "Text",
    description: "Converts half-width alphanumeric characters to Japanese Zenkaku full-width.",
    keywords: ["zenkaku", "full-width", "japanese typography"],
    inputType: "text",
    default1: "Hello 123",
    run: (v) =>
      v
        .split("")
        .map((c) => {
          const code = c.charCodeAt(0);
          if (code >= 33 && code <= 126) return String.fromCharCode(code + 0xfee0);
          if (code === 32) return "\u3000";
          return c;
        })
        .join(""),
  },
  {
    id: 226,
    title: "Half-Width (Hankaku) Text Converter",
    category: "Text",
    description: "Converts Zenkaku full-width characters back to standard half-width.",
    keywords: ["hankaku", "half-width", "ascii"],
    inputType: "text",
    default1: "Ｈｅｌｌｏ　１２３",
    run: (v) =>
      v
        .split("")
        .map((c) => {
          const code = c.charCodeAt(0);
          if (code >= 0xff01 && code <= 0xff5e) return String.fromCharCode(code - 0xfee0);
          if (code === 0x3000) return " ";
          return c;
        })
        .join(""),
  },
  {
    id: 227,
    title: "Lorem Ipsum Paragraphs Generator",
    category: "Text",
    description: "Generates custom count of standard placeholder Latin paragraphs.",
    keywords: ["lorem ipsum", "dummy text", "placeholder"],
    inputType: "number",
    default1: "2",
    run: (nStr) => {
      const n = Math.min(10, Math.max(1, parseInt(nStr, 10) || 2));
      const p =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
      return Array(n).fill(p).join("\n\n");
    },
  },
  {
    id: 228,
    title: "Lorem Ipsum Sentence Generator",
    category: "Text",
    description: "Generates quick placeholder sentences for UI mockups.",
    keywords: ["lorem", "sentence", "placeholder"],
    inputType: "number",
    default1: "3",
    run: (nStr) => {
      const n = Math.min(20, Math.max(1, parseInt(nStr, 10) || 3));
      const s = [
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
        "Curabitur pretium tincidunt lacus, vitae scelerisque ante porta vel.",
        "Phasellus ultrices nulla quis nibh. Quisque a lectus.",
        "Donec consectetuer ligula vulputate sem tristique cursus.",
      ];
      const res: string[] = [];
      for (let i = 0; i < n; i++) res.push(s[i % s.length]);
      return res.join(" ");
    },
  },
  {
    id: 229,
    title: "Syllable Counter (Heuristic)",
    category: "Text",
    description: "Estimates total syllable count across English words.",
    keywords: ["syllables", "phonetics", "poetic meter"],
    inputType: "text",
    default1: "Supercalifragilisticexpialidocious developer",
    run: (v) => {
      const words = v.toLowerCase().match(/\b[a-z]+\b/g) || [];
      let total = 0;
      for (const w of words) {
        if (w.length <= 3) {
          total += 1;
          continue;
        }
        let clean = w.replace(/(?:[^laeiouy]|ed|es|e)$/, "");
        clean = clean.replace(/^y/, "");
        const matches = clean.match(/[aeiouy]{1,2}/g);
        total += matches ? matches.length : 1;
      }
      return `Total Words: ${words.length}\nEstimated Syllables: ${total}`;
    },
  },
  {
    id: 230,
    title: "Average Word Length Calculator",
    category: "Text",
    description: "Calculates the average number of characters per word.",
    keywords: ["average length", "word size", "statistics"],
    inputType: "textarea",
    default1: "Coding Super Hub delivers powerful developer tools instantly.",
    run: (v) => {
      const words: string[] = v.match(/\b\w+\b/g) || [];
      if (!words.length) return "No words found.";
      const totalChars = words.reduce((acc: number, w: string) => acc + w.length, 0);
      return `Word Count: ${words.length}\nTotal Letters: ${totalChars}\nAverage Word Length: ${(totalChars / words.length).toFixed(2)} characters`;
    },
  },
  {
    id: 231,
    title: "Longest Word Finder",
    category: "Text",
    description: "Identifies the longest word in the text with length.",
    keywords: ["longest word", "max word", "text analysis"],
    inputType: "textarea",
    default1: "Build phenomenal full-stack applications with exceptional speed.",
    run: (v) => {
      const words = v.match(/\b\w+\b/g) || [];
      if (!words.length) return "No words found.";
      const sorted = [...words].sort((a, b) => b.length - a.length);
      return `Longest Word: "${sorted[0]}" (${sorted[0].length} letters)`;
    },
  },
  {
    id: 232,
    title: "Shortest Word Finder",
    category: "Text",
    description: "Finds the shortest word in the provided text.",
    keywords: ["shortest word", "min word", "analysis"],
    inputType: "textarea",
    default1: "Build phenomenal applications with a great speed.",
    run: (v) => {
      const words = v.match(/\b\w+\b/g) || [];
      if (!words.length) return "No words found.";
      const sorted = [...words].sort((a, b) => a.length - b.length);
      return `Shortest Word: "${sorted[0]}" (${sorted[0].length} letter)`;
    },
  },
  {
    id: 233,
    title: "Unique Words Extractor",
    category: "Text",
    description: "Extracts an alphabetical list of all distinct unique words.",
    keywords: ["unique words", "vocabulary", "word list"],
    inputType: "textarea",
    default1: "to be or not to be that is the question",
    run: (v) => {
      const words = v.toLowerCase().match(/\b[a-z0-9_]+\b/g) || [];
      const set = Array.from(new Set(words)).sort();
      return `Total Unique: ${set.length}\n\n` + set.join(", ");
    },
  },
  {
    id: 234,
    title: "Duplicate Words Finder",
    category: "Text",
    description: "Flags all words that appear more than once.",
    keywords: ["duplicate words", "repeated words", "proofreading"],
    inputType: "textarea",
    default1: "The cat in the hat saw the cat and a bird.",
    run: (v) => {
      const words = v.toLowerCase().match(/\b[a-z0-9_]+\b/g) || [];
      const counts: Record<string, number> = {};
      for (const w of words) counts[w] = (counts[w] || 0) + 1;
      const dupes = Object.entries(counts).filter(([_, c]) => c > 1);
      return dupes.length
        ? `Found ${dupes.length} duplicate word(s):\n` +
            dupes.map(([w, c]) => `"${w}": ${c} times`).join("\n")
        : "No duplicate words detected!";
    },
  },
  {
    id: 235,
    title: "Invisible Unicode Characters Stripper",
    category: "Text",
    description: "Removes zero-width spaces (ZWSP, ZWNJ, BOM) that break code syntax.",
    keywords: ["zero width", "invisible", "bom", "clean code"],
    inputType: "textarea",
    default1: "Clean\u200BText\uFEFFWithout\u200DHidden\u200CChars",
    run: (v) => {
      const clean = v.replace(/[\u200B-\u200D\uFEFF\u00A0\u2028\u2029]/g, "");
      const removed = v.length - clean.length;
      return `Removed ${removed} invisible character(s).\n\nCleaned Result:\n${clean}`;
    },
  },
  {
    id: 236,
    title: "Text to Braille Simulator",
    category: "Text",
    description: "Converts alphanumeric characters into Unicode Braille characters.",
    keywords: ["braille", "accessibility", "dots", "tactile"],
    inputType: "text",
    default1: "Super Hub",
    run: (v) => {
      const brailleMap: Record<string, string> = {
        a: "⠁", b: "⠃", c: "⠉", d: "⠙", e: "⠑", f: "⠋", g: "⠛", h: "⠓",
        i: "⠊", j: "⠚", k: "⠅", l: "⠇", m: "⠍", n: "⠝", o: "⠕", p: "⠏",
        q: "⠟", r: "⠗", s: "⠎", t: "⠞", u: "⠥", v: "⠧", w: "⠺", x: "⠭",
        y: "⠽", z: "⠵", " ": " ",
      };
      return v
        .toLowerCase()
        .split("")
        .map((c) => brailleMap[c] || c)
        .join("");
    },
  },
  {
    id: 237,
    title: "Small Caps Text Generator",
    category: "Text",
    description: "Generates small capital Unicode letters (ᴀʙᴄᴅᴇ).",
    keywords: ["small caps", "petite caps", "typography"],
    inputType: "text",
    default1: "Super Coding Hub",
    run: (v) => {
      const map: Record<string, string> = {
        a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ", h: "ʜ",
        i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ",
        q: "ǫ", r: "ʀ", s: "ꜱ", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x",
        y: "ʏ", z: "ᴢ",
      };
      return v
        .toLowerCase()
        .split("")
        .map((c) => map[c] || c)
        .join("");
    },
  },
  {
    id: 238,
    title: "Strikethrough Text Generator",
    category: "Text",
    description: "Applies combining strikethrough lines across text (t̶e̶x̶t̶).",
    keywords: ["strikethrough", "cross out", "combining"],
    inputType: "text",
    default1: "Old price $99 Now $0",
    run: (v) => v.split("").join("\u0336") + "\u0336",
  },
  {
    id: 239,
    title: "Underline Text Generator (Combining Chars)",
    category: "Text",
    description: "Creates underlined plain text using Unicode combining low lines.",
    keywords: ["underline", "combining line", "rich text"],
    inputType: "text",
    default1: "Important Announcement",
    run: (v) => v.split("").join("\u0332") + "\u0332",
  },
  {
    id: 240,
    title: "Slash-Through Text Generator",
    category: "Text",
    description: "Renders diagonal slash combining character across text.",
    keywords: ["slash", "cancel", "strikethrough"],
    inputType: "text",
    default1: "Cancelled Feature",
    run: (v) => v.split("").join("\u0338") + "\u0338",
  },
  {
    id: 241,
    title: "Zero-Width Steganography Obfuscator",
    category: "Text",
    description: "Hides secret binary text inside zero-width spaces within normal text.",
    keywords: ["steganography", "hidden message", "zero width"],
    inputType: "two-inputs",
    label1: "Public Cover Text",
    label2: "Secret Hidden Message",
    default1: "Welcome to Coding Super Hub",
    default2: "SECRET42",
    run: (cover, secret = "TOPSECRET") => {
      const bin = secret
        .split("")
        .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
        .join("");
      const zw = bin
        .split("")
        .map((b) => (b === "1" ? "\u200B" : "\u200C"))
        .join("");
      return cover.slice(0, 3) + zw + cover.slice(3) + " [Message embedded invisibly]";
    },
  },
  {
    id: 242,
    title: "Zero-Width Steganography Unmasker",
    category: "Text",
    description: "Extracts secret zero-width messages embedded in text.",
    keywords: ["reveal hidden", "steganography decode"],
    inputType: "textarea",
    default1: "Paste text with hidden zero-width spaces here",
    run: (v) => {
      const zw = v.match(/[\u200B\u200C]/g) || [];
      if (!zw.length) return "No hidden zero-width message found in this text.";
      const bin = zw.map((c) => (c === "\u200B" ? "1" : "0")).join("");
      const bytes = bin.match(/.{8}/g) || [];
      const text = bytes.map((b) => String.fromCharCode(parseInt(b, 2))).join("");
      return `Extracted ${zw.length} bits:\nSecret: "${text}"`;
    },
  },
  {
    id: 243,
    title: "Word Wrap at Column Width",
    category: "Text",
    description: "Hard-wraps paragraphs at specific column limit (e.g. 80 chars).",
    keywords: ["word wrap", "column width", "hard wrap"],
    inputType: "two-inputs",
    label1: "Text to Wrap",
    label2: "Width (e.g. 40)",
    default1: "Coding Super Hub gives developers 1,000 tools for high-velocity software engineering.",
    default2: "30",
    run: (v, widthStr = "30") => {
      const w = Math.max(10, parseInt(widthStr, 10) || 30);
      const regex = new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, "g");
      return v.replace(regex, "$1\n");
    },
  },
  {
    id: 244,
    title: "Indent / Outdent Lines",
    category: "Text",
    description: "Adds or removes 2 or 4 spaces of indentation from every line.",
    keywords: ["indent", "outdent", "tab", "spacing"],
    inputType: "two-inputs",
    label1: "Code / Lines",
    label2: "Indent Spaces (e.g. 2 or -2)",
    default1: "const x = 10;\nconst y = 20;\nreturn x + y;",
    default2: "2",
    run: (v, spStr = "2") => {
      const sp = parseInt(spStr, 10) || 2;
      if (sp >= 0) {
        const pad = " ".repeat(sp);
        return v
          .split("\n")
          .map((l) => pad + l)
          .join("\n");
      } else {
        const cut = Math.abs(sp);
        return v
          .split("\n")
          .map((l) => (l.startsWith(" ".repeat(cut)) ? l.slice(cut) : l.trimStart()))
          .join("\n");
      }
    },
  },
  {
    id: 245,
    title: "Capitalize First Letter of Every Sentence",
    category: "Text",
    description: "Ensures sentence starters are capitalized properly.",
    keywords: ["sentence capitalization", "proofreading"],
    inputType: "textarea",
    default1: "here is line one. here is line two! and line three?",
    run: (v) => v.replace(/(^|[.!?]\s+)([a-z])/g, (_, p, c) => p + c.toUpperCase()),
  },
  {
    id: 246,
    title: "Title Case (AP Stylebook Heuristic)",
    category: "Text",
    description: "Capitalizes major words while keeping minor words (a, the, in, of) lowercase.",
    keywords: ["ap style", "title case", "headlines"],
    inputType: "text",
    default1: "the lord of the rings and the return of the king",
    run: (v) => {
      const minor = new Set(["a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to", "from", "by", "in", "of"]);
      return v
        .split(/\s+/)
        .map((w, i) => {
          const lower = w.toLowerCase();
          if (i > 0 && minor.has(lower)) return lower;
          return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join(" ");
    },
  },
  {
    id: 247,
    title: "Clean Multiple Consecutive Spaces",
    category: "Text",
    description: "Collapses all instances of 2+ spaces into a single space.",
    keywords: ["clean spaces", "multiple spaces", "normalize spaces"],
    inputType: "textarea",
    default1: "Too    many     spaces      between    words.",
    run: (v) => v.replace(/[^\S\r\n]+/g, " "),
  },
  {
    id: 248,
    title: "Convert Tabs to Spaces",
    category: "Text",
    description: "Converts tab characters (\\t) to 2 or 4 spaces.",
    keywords: ["tabs to spaces", "detab", "indentation"],
    inputType: "two-inputs",
    label1: "Code with Tabs",
    label2: "Spaces per Tab (e.g. 2 or 4)",
    default1: "\tconst a = 1;\n\t\tconst b = 2;",
    default2: "2",
    run: (v, spStr = "2") => {
      const sp = Math.max(1, parseInt(spStr, 10) || 2);
      return v.replace(/\t/g, " ".repeat(sp));
    },
  },
  {
    id: 249,
    title: "Convert Spaces to Tabs",
    category: "Text",
    description: "Replaces leading groups of 2 or 4 spaces with tabs.",
    keywords: ["spaces to tabs", "entab", "tabify"],
    inputType: "two-inputs",
    label1: "Code with Spaces",
    label2: "Spaces per Tab (e.g. 2 or 4)",
    default1: "  const a = 1;\n    const b = 2;",
    default2: "2",
    run: (v, spStr = "2") => {
      const sp = Math.max(1, parseInt(spStr, 10) || 2);
      const regex = new RegExp(`^((?:${" ".repeat(sp)})+)`, "gm");
      return v.replace(regex, (m) => "\t".repeat(m.length / sp));
    },
  },
  {
    id: 250,
    title: "Text Length & Reading Time Estimate",
    category: "Text",
    description: "Calculates reading and speaking time based on average human speeds.",
    keywords: ["reading time", "speaking time", "wpm"],
    inputType: "textarea",
    default1: "Coding Super Hub provides an integrated developer workspace with real-time compilation, extensive toolsets, and contextual AI assistance for engineering teams around the world.",
    run: (v) => {
      const words = (v.match(/\b\S+\b/g) || []).length;
      const readingMinutes = words / 200;
      const speakingMinutes = words / 130;
      return `Word Count: ${words}\nSilent Reading Time: ~${Math.ceil(readingMinutes * 60)} seconds (${readingMinutes.toFixed(1)} min)\nSpeaking Time:       ~${Math.ceil(speakingMinutes * 60)} seconds (${speakingMinutes.toFixed(1)} min)`;
    },
  },
];
