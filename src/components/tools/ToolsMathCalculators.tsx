import React, { useState } from "react";
import { ToolCard } from "../ToolCard";
import { ToolCategory } from "../../types";

interface ToolsProps {
  searchQuery: string;
  selectedCategory: ToolCategory;
}

export const ToolsMathCalculators: React.FC<ToolsProps> = ({
  searchQuery,
  selectedCategory,
}) => {
  const isVisible = (id: number, title: string, category: ToolCategory, keywords: string[] = []) => {
    const matchesCategory = selectedCategory === "All" || selectedCategory === category;
    if (!matchesCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      title.toLowerCase().includes(q) ||
      category.toLowerCase().includes(q) ||
      `#${id}`.includes(q) ||
      keywords.some((k) => k.toLowerCase().includes(q))
    );
  };

  // Tool 21 - Color Palette
  const [t21Base, setT21Base] = useState("#2563eb");
  const [t21Output, setT21Output] = useState<string[]>([]);

  // Tool 22 - QR Code
  const [t22Input, setT22Input] = useState("https://ai.studio");

  // Tool 23 - IP Address Info
  const [t23Output, setT23Output] = useState("");
  const [t23Loading, setT23Loading] = useState(false);

  // Tool 24 - Age Calculator
  const [t24Birth, setT24Birth] = useState("2000-01-01");
  const [t24Output, setT24Output] = useState("");

  // Tool 25 - Random Number
  const [t25Min, setT25Min] = useState(1);
  const [t25Max, setT25Max] = useState(100);
  const [t25Output, setT25Output] = useState("");

  // Tool 26 - Temperature Converter
  const [t26Val, setT26Val] = useState("100");
  const [t26From, setT26From] = useState("c");
  const [t26To, setT26To] = useState("f");
  const [t26Output, setT26Output] = useState("");

  // Tool 27 - BMI Calculator
  const [t27Weight, setT27Weight] = useState("70");
  const [t27Height, setT27Height] = useState("175");
  const [t27Output, setT27Output] = useState("");

  // Tool 28 - Percentage Calculator
  const [t28Val, setT28Val] = useState("25");
  const [t28Total, setT28Total] = useState("200");
  const [t28Output, setT28Output] = useState("");

  // Tool 29 - Tip Calculator
  const [t29Bill, setT29Bill] = useState("120");
  const [t29Tip, setT29Tip] = useState("15");
  const [t29Output, setT29Output] = useState("");

  // Tool 30 - Discount Calculator
  const [t30Price, setT30Price] = useState("80");
  const [t30Disc, setT30Disc] = useState("20");
  const [t30Output, setT30Output] = useState("");

  // Tool 31 - EMI Calculator
  const [t31P, setT31P] = useState("50000");
  const [t31R, setT31R] = useState("8.5");
  const [t31M, setT31M] = useState("24");
  const [t31Output, setT31Output] = useState("");

  // Tool 32 - Compound Interest
  const [t32P, setT32P] = useState("10000");
  const [t32R, setT32R] = useState("7");
  const [t32Y, setT32Y] = useState("5");
  const [t32Output, setT32Output] = useState("");

  // Tool 33 - Simple Interest
  const [t33P, setT33P] = useState("10000");
  const [t33R, setT33R] = useState("5");
  const [t33T, setT33T] = useState("3");
  const [t33Output, setT33Output] = useState("");

  // Tool 34 - Average Calculator
  const [t34Input, setT34Input] = useState("12, 24, 36, 48, 60");
  const [t34Output, setT34Output] = useState("");

  // Tool 35 - Sum Calculator
  const [t35Input, setT35Input] = useState("10, 25, 45, 120");
  const [t35Output, setT35Output] = useState("");

  // Tool 36 - Unit Converter
  const [t36Val, setT36Val] = useState("10");
  const [t36Type, setT36Type] = useState("km-mi");
  const [t36Output, setT36Output] = useState("");

  // Tool 37 - Time Converter (minutes to hours)
  const [t37Min, setT37Min] = useState("135");
  const [t37Output, setT37Output] = useState("");

  // Tool 38 - Seconds Converter
  const [t38Sec, setT38Sec] = useState("7325");
  const [t38Output, setT38Output] = useState("");

  // Tool 39 - Days Calculator
  const [t39Start, setT39Start] = useState("2026-01-01");
  const [t39End, setT39End] = useState("2026-12-31");
  const [t39Output, setT39Output] = useState("");

  // Tool 40 - Leap Year Checker
  const [t40Year, setT40Year] = useState("2028");
  const [t40Output, setT40Output] = useState("");

  // Tool 41 - Prime Number Checker
  const [t41Num, setT41Num] = useState("97");
  const [t41Output, setT41Output] = useState("");

  // Tool 42 - Even / Odd Checker
  const [t42Num, setT42Num] = useState("42");
  const [t42Output, setT42Output] = useState("");

  // Tool 43 - Factorial Calculator
  const [t43Num, setT43Num] = useState("7");
  const [t43Output, setT43Output] = useState("");

  // Tool 44 - Fibonacci Generator
  const [t44Count, setT44Count] = useState("10");
  const [t44Output, setT44Output] = useState("");

  // Tool 45 - GCD Calculator
  const [t45A, setT45A] = useState("48");
  const [t45B, setT45B] = useState("18");
  const [t45Output, setT45Output] = useState("");

  // Tool 46 - LCM Calculator
  const [t46A, setT46A] = useState("12");
  const [t46B, setT46B] = useState("15");
  const [t46Output, setT46Output] = useState("");

  // Tool 47 - Binary Calculator
  const [t47Bin, setT47Bin] = useState("110101");
  const [t47Output, setT47Output] = useState("");

  // Tool 48 - Hexadecimal Calculator
  const [t48Hex, setT48Hex] = useState("FF");
  const [t48Output, setT48Output] = useState("");

  // Tool 49 - Random Password Generator
  const [t49Len, setT49Len] = useState(16);
  const [t49Output, setT49Output] = useState("");

  // Tool 50 - Strong Password Checker
  const [t50Pass, setT50Pass] = useState("Coding#2026_Secure!");
  const [t50Output, setT50Output] = useState("");

  return (
    <>
      {/* TOOL 21 - Color Palette */}
      {isVisible(21, "Color Palette Generator", "Color", ["palette", "tints", "shades"]) && (
        <ToolCard
          id={21}
          title="Color Palette Generator"
          category="Color"
          description="Generate a harmonious 5-tier tonal color palette"
          output={t21Output.length ? t21Output.join(", ") : undefined}
        >
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={t21Base}
              onChange={(e) => setT21Base(e.target.value)}
              className="w-10 h-8 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={t21Base}
              onChange={(e) => setT21Base(e.target.value)}
              className="w-28 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const hex = t21Base.replace("#", "");
                const r = parseInt(hex.substring(0, 2), 16) || 0;
                const g = parseInt(hex.substring(2, 4), 16) || 0;
                const b = parseInt(hex.substring(4, 6), 16) || 0;
                const colors = [];
                for (let i = 0; i < 5; i++) {
                  const factor = 0.5 + i * 0.25;
                  const nr = Math.min(255, Math.round(r * factor));
                  const ng = Math.min(255, Math.round(g * factor));
                  const nb = Math.min(255, Math.round(b * factor));
                  colors.push(
                    "#" +
                      nr.toString(16).padStart(2, "0") +
                      ng.toString(16).padStart(2, "0") +
                      nb.toString(16).padStart(2, "0")
                  );
                }
                setT21Output(colors);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Generate Palette
            </button>
          </div>
          {t21Output.length > 0 && (
            <div className="flex h-10 rounded-xl overflow-hidden mt-2 border border-slate-300 dark:border-slate-700 shadow-sm">
              {t21Output.map((c, i) => (
                <div
                  key={i}
                  style={{ background: c }}
                  className="flex-1 flex items-center justify-center text-[10px] font-mono text-white font-bold drop-shadow-sm"
                >
                  {c}
                </div>
              ))}
            </div>
          )}
        </ToolCard>
      )}

      {/* TOOL 22 - QR Code Generator */}
      {isVisible(22, "QR Code Generator", "Generators", ["qrcode", "barcode"]) && (
        <ToolCard
          id={22}
          title="QR Code Generator"
          category="Generators"
          description="Create high-resolution QR codes for URLs and text"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={t22Input}
              onChange={(e) => setT22Input(e.target.value)}
              placeholder="URL or text..."
              className="flex-1 text-xs px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
          </div>
          {t22Input.trim() && (
            <div className="mt-3 flex flex-col items-center p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                  t22Input
                )}`}
                alt="QR Code"
                referrerPolicy="no-referrer"
                className="w-36 h-36 border border-slate-200 dark:border-slate-800 rounded-lg p-1 bg-white shadow-xs"
              />
              <span className="text-[11px] text-slate-500 mt-2 font-mono break-all text-center">
                {t22Input}
              </span>
            </div>
          )}
        </ToolCard>
      )}

      {/* TOOL 23 - IP & Client Info */}
      {isVisible(23, "IP Address Info", "Utilities", ["ip", "geo", "network", "client"]) && (
        <ToolCard
          id={23}
          title="IP & Client Network Information"
          category="Utilities"
          description="Fetch public IP details and client environment metrics"
          output={t23Output}
        >
          <button
            type="button"
            disabled={t23Loading}
            onClick={async () => {
              setT23Loading(true);
              setT23Output("Fetching IP and network telemetry...");
              try {
                const res = await fetch("https://ipapi.co/json/");
                if (!res.ok) throw new Error("Network request failed");
                const data = await res.json();
                setT23Output(
                  `IP: ${data.ip || "N/A"}\nCity: ${data.city || "N/A"}\nRegion: ${
                    data.region || "N/A"
                  }\nCountry: ${data.country_name || "N/A"}\nISP: ${
                    data.org || "N/A"
                  }\nTimezone: ${data.timezone || "N/A"}`
                );
              } catch {
                setT23Output(
                  `Client Info (Offline Mode):\nUser-Agent: ${navigator.userAgent}\nLanguage: ${navigator.language}\nOnline: ${
                    navigator.onLine ? "Yes" : "No"
                  }\nScreen: ${screen.width}x${screen.height}`
                );
              } finally {
                setT23Loading(false);
              }
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            {t23Loading ? "Loading..." : "Get Info"}
          </button>
        </ToolCard>
      )}

      {/* TOOL 24 - Age Calculator */}
      {isVisible(24, "Age Calculator", "Math", ["age", "birthday", "years"]) && (
        <ToolCard
          id={24}
          title="Age Calculator"
          category="Math"
          description="Calculate exact chronological age in years and months"
          output={t24Output}
        >
          <div className="flex gap-2">
            <input
              type="date"
              value={t24Birth}
              onChange={(e) => setT24Birth(e.target.value)}
              className="text-xs px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            />
            <button
              type="button"
              onClick={() => {
                if (!t24Birth) {
                  setT24Output("❌ Select a birth date");
                  return;
                }
                const b = new Date(t24Birth);
                const now = new Date();
                let age = now.getFullYear() - b.getFullYear();
                const m = now.getMonth() - b.getMonth();
                if (m < 0 || (m === 0 && now.getDate() < b.getDate())) {
                  age--;
                }
                const diffDays = Math.floor((now.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
                setT24Output(`Age: ${age} years\nTotal Days lived: ~${diffDays} days`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Calculate Age
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 25 - Random Number Generator */}
      {isVisible(25, "Random Number Generator", "Generators", ["random", "dice", "number"]) && (
        <ToolCard
          id={25}
          title="Random Number Generator"
          category="Generators"
          description="Generate random integer within custom minimum and maximum bounds"
          output={t25Output}
        >
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={t25Min}
              onChange={(e) => setT25Min(Number(e.target.value))}
              className="w-20 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
              placeholder="Min"
            />
            <span className="text-xs text-slate-500">to</span>
            <input
              type="number"
              value={t25Max}
              onChange={(e) => setT25Max(Number(e.target.value))}
              className="w-20 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
              placeholder="Max"
            />
            <button
              type="button"
              onClick={() => {
                if (t25Min > t25Max) {
                  setT25Output("❌ Minimum cannot exceed Maximum");
                  return;
                }
                const rand = Math.floor(Math.random() * (t25Max - t25Min + 1)) + t25Min;
                setT25Output(`Random Number: ${rand}`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Generate
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 26 - Temperature Converter */}
      {isVisible(26, "Temperature Converter", "Converters", ["celsius", "fahrenheit", "kelvin"]) && (
        <ToolCard
          id={26}
          title="Temperature Converter"
          category="Converters"
          description="Convert between Celsius, Fahrenheit, and Kelvin scales"
          output={t26Output}
        >
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="number"
              value={t26Val}
              onChange={(e) => setT26Val(e.target.value)}
              className="w-20 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <select
              value={t26From}
              onChange={(e) => setT26From(e.target.value)}
              className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            >
              <option value="c">°C</option>
              <option value="f">°F</option>
              <option value="k">K</option>
            </select>
            <span className="text-xs text-slate-500">→</span>
            <select
              value={t26To}
              onChange={(e) => setT26To(e.target.value)}
              className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            >
              <option value="f">°F</option>
              <option value="c">°C</option>
              <option value="k">K</option>
            </select>
            <button
              type="button"
              onClick={() => {
                const v = Number(t26Val);
                if (!Number.isFinite(v)) return;
                let c = v;
                if (t26From === "f") c = ((v - 32) * 5) / 9;
                if (t26From === "k") c = v - 273.15;
                let res = c;
                if (t26To === "f") res = (c * 9) / 5 + 32;
                if (t26To === "k") res = c + 273.15;
                setT26Output(`Result: ${res.toFixed(2)} °${t26To.toUpperCase()}`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Convert
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 27 - BMI Calculator */}
      {isVisible(27, "BMI Calculator", "Math", ["bmi", "body mass", "health"]) && (
        <ToolCard
          id={27}
          title="BMI Calculator"
          category="Math"
          description="Calculate Body Mass Index and healthy weight categories"
          output={t27Output}
        >
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="number"
              value={t27Weight}
              onChange={(e) => setT27Weight(e.target.value)}
              placeholder="Weight (kg)"
              className="w-28 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="number"
              value={t27Height}
              onChange={(e) => setT27Height(e.target.value)}
              placeholder="Height (cm)"
              className="w-28 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const w = Number(t27Weight);
                const h = Number(t27Height) / 100;
                if (w <= 0 || h <= 0) {
                  setT27Output("❌ Enter positive values for weight and height");
                  return;
                }
                const bmi = w / (h * h);
                const cat =
                  bmi < 18.5
                    ? "Underweight"
                    : bmi < 25
                    ? "Normal weight"
                    : bmi < 30
                    ? "Overweight"
                    : "Obese";
                setT27Output(`BMI: ${bmi.toFixed(2)} (${cat})`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Calculate BMI
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 28 - Percentage Calculator */}
      {isVisible(28, "Percentage Calculator", "Math", ["percent", "ratio", "fraction"]) && (
        <ToolCard
          id={28}
          title="Percentage Calculator"
          category="Math"
          description="Find what percentage one number is of another"
          output={t28Output}
        >
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={t28Val}
              onChange={(e) => setT28Val(e.target.value)}
              className="w-20 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <span className="text-xs text-slate-500">out of</span>
            <input
              type="number"
              value={t28Total}
              onChange={(e) => setT28Total(e.target.value)}
              className="w-20 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const v = Number(t28Val);
                const t = Number(t28Total);
                if (t === 0) {
                  setT28Output("❌ Total cannot be 0");
                  return;
                }
                setT28Output(`Result: ${((v / t) * 100).toFixed(2)}%`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Calculate
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 29 - Tip Calculator */}
      {isVisible(29, "Tip Calculator", "Math", ["tip", "bill", "restaurant"]) && (
        <ToolCard
          id={29}
          title="Tip Calculator"
          category="Math"
          description="Calculate gratuity amount and bill grand total"
          output={t29Output}
        >
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={t29Bill}
              onChange={(e) => setT29Bill(e.target.value)}
              placeholder="Bill ($)"
              className="w-24 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="number"
              value={t29Tip}
              onChange={(e) => setT29Tip(e.target.value)}
              placeholder="Tip %"
              className="w-20 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <span className="text-xs text-slate-500">%</span>
            <button
              type="button"
              onClick={() => {
                const b = Number(t29Bill);
                const p = Number(t29Tip);
                const tip = (b * p) / 100;
                setT29Output(`Tip: $${tip.toFixed(2)}\nTotal: $${(b + tip).toFixed(2)}`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Calculate Tip
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 30 - Discount Calculator */}
      {isVisible(30, "Discount Calculator", "Math", ["discount", "sale", "price"]) && (
        <ToolCard
          id={30}
          title="Discount Calculator"
          category="Math"
          description="Calculate final discounted price and savings"
          output={t30Output}
        >
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={t30Price}
              onChange={(e) => setT30Price(e.target.value)}
              placeholder="Original Price"
              className="w-28 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="number"
              value={t30Disc}
              onChange={(e) => setT30Disc(e.target.value)}
              placeholder="Discount %"
              className="w-20 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <span className="text-xs text-slate-500">%</span>
            <button
              type="button"
              onClick={() => {
                const p = Number(t30Price);
                const d = Number(t30Disc);
                const savings = (p * d) / 100;
                setT30Output(`You Save: $${savings.toFixed(2)}\nFinal Price: $${(p - savings).toFixed(2)}`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Calculate
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 31 - EMI Calculator */}
      {isVisible(31, "EMI Calculator", "Math", ["loan", "emi", "mortgage"]) && (
        <ToolCard
          id={31}
          title="EMI Loan Calculator"
          category="Math"
          description="Calculate monthly installment and total payable loan interest"
          output={t31Output}
        >
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="number"
              value={t31P}
              onChange={(e) => setT31P(e.target.value)}
              placeholder="Loan amount"
              className="w-28 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="number"
              value={t31R}
              onChange={(e) => setT31R(e.target.value)}
              placeholder="Annual Rate %"
              className="w-20 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="number"
              value={t31M}
              onChange={(e) => setT31M(e.target.value)}
              placeholder="Months"
              className="w-20 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const p = Number(t31P);
                const r = Number(t31R) / 12 / 100;
                const m = Number(t31M);
                if (p <= 0 || m <= 0) return;
                const emi = (p * r * Math.pow(1 + r, m)) / (Math.pow(1 + r, m) - 1);
                const total = emi * m;
                setT31Output(`Monthly EMI: $${emi.toFixed(2)}\nTotal Interest: $${(total - p).toFixed(2)}\nTotal Amount: $${total.toFixed(2)}`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Calculate EMI
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 32 - Compound Interest */}
      {isVisible(32, "Compound Interest Calculator", "Math", ["interest", "finance"]) && (
        <ToolCard
          id={32}
          title="Compound Interest Calculator"
          category="Math"
          description="Calculate future value with compounding interest"
          output={t32Output}
        >
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="number"
              value={t32P}
              onChange={(e) => setT32P(e.target.value)}
              placeholder="Principal"
              className="w-24 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="number"
              value={t32R}
              onChange={(e) => setT32R(e.target.value)}
              placeholder="Annual %"
              className="w-20 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="number"
              value={t32Y}
              onChange={(e) => setT32Y(e.target.value)}
              placeholder="Years"
              className="w-16 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const p = Number(t32P);
                const r = Number(t32R) / 100;
                const y = Number(t32Y);
                const amount = p * Math.pow(1 + r, y);
                setT32Output(`Total Amount: $${amount.toFixed(2)}\nInterest Earned: $${(amount - p).toFixed(2)}`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Calculate
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 33 - Simple Interest */}
      {isVisible(33, "Simple Interest Calculator", "Math", ["simple interest", "principal"]) && (
        <ToolCard
          id={33}
          title="Simple Interest Calculator"
          category="Math"
          description="Compute simple interest (P * R * T / 100)"
          output={t33Output}
        >
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="number"
              value={t33P}
              onChange={(e) => setT33P(e.target.value)}
              placeholder="Principal"
              className="w-24 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="number"
              value={t33R}
              onChange={(e) => setT33R(e.target.value)}
              placeholder="Rate %"
              className="w-16 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="number"
              value={t33T}
              onChange={(e) => setT33T(e.target.value)}
              placeholder="Time"
              className="w-16 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const p = Number(t33P);
                const r = Number(t33R);
                const t = Number(t33T);
                const interest = (p * r * t) / 100;
                setT33Output(`Interest: $${interest.toFixed(2)}\nTotal: $${(p + interest).toFixed(2)}`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Calculate
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 34 - Average Calculator */}
      {isVisible(34, "Average Calculator", "Math", ["mean", "average"]) && (
        <ToolCard
          id={34}
          title="Average (Mean) Calculator"
          category="Math"
          description="Compute arithmetic mean for comma-separated numbers"
          output={t34Output}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={t34Input}
              onChange={(e) => setT34Input(e.target.value)}
              placeholder="e.g. 10, 20, 35, 50"
              className="flex-1 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const nums = t34Input.split(",").map(Number).filter(Number.isFinite);
                if (!nums.length) return setT34Output("❌ Enter valid numbers");
                const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
                setT34Output(`Average: ${avg.toFixed(2)} (Count: ${nums.length})`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Calculate
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 35 - Sum Calculator */}
      {isVisible(35, "Sum Calculator", "Math", ["addition", "total"]) && (
        <ToolCard
          id={35}
          title="Sum Calculator"
          category="Math"
          description="Add up comma-separated numbers"
          output={t35Output}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={t35Input}
              onChange={(e) => setT35Input(e.target.value)}
              placeholder="e.g. 10, 20, 30"
              className="flex-1 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const nums = t35Input.split(",").map(Number).filter(Number.isFinite);
                const sum = nums.reduce((a, b) => a + b, 0);
                setT35Output(`Sum: ${sum}`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Sum
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 36 - Unit Converter */}
      {isVisible(36, "Unit Converter", "Converters", ["km", "miles", "kg", "pounds", "meters", "feet"]) && (
        <ToolCard
          id={36}
          title="Unit Converter"
          category="Converters"
          description="Convert distances, lengths, and weights"
          output={t36Output}
        >
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="number"
              value={t36Val}
              onChange={(e) => setT36Val(e.target.value)}
              className="w-24 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <select
              value={t36Type}
              onChange={(e) => setT36Type(e.target.value)}
              className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            >
              <option value="km-mi">Kilometers → Miles</option>
              <option value="mi-km">Miles → Kilometers</option>
              <option value="m-ft">Meters → Feet</option>
              <option value="ft-m">Feet → Meters</option>
              <option value="kg-lb">Kg → Pounds</option>
              <option value="lb-kg">Pounds → Kg</option>
            </select>
            <button
              type="button"
              onClick={() => {
                const v = Number(t36Val);
                let res = 0;
                let u = "";
                if (t36Type === "km-mi") { res = v * 0.621371; u = "miles"; }
                if (t36Type === "mi-km") { res = v * 1.60934; u = "km"; }
                if (t36Type === "m-ft") { res = v * 3.28084; u = "feet"; }
                if (t36Type === "ft-m") { res = v * 0.3048; u = "meters"; }
                if (t36Type === "kg-lb") { res = v * 2.20462; u = "pounds"; }
                if (t36Type === "lb-kg") { res = v * 0.453592; u = "kg"; }
                setT36Output(`Result: ${res.toFixed(4)} ${u}`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Convert
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 37 - Time Converter */}
      {isVisible(37, "Time Converter", "Time", ["minutes", "hours"]) && (
        <ToolCard
          id={37}
          title="Minutes to Hours Converter"
          category="Time"
          description="Convert minutes into hours and remaining minutes"
          output={t37Output}
        >
          <div className="flex gap-2">
            <input
              type="number"
              value={t37Min}
              onChange={(e) => setT37Min(e.target.value)}
              placeholder="Minutes"
              className="w-28 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const m = Number(t37Min);
                setT37Output(`${Math.floor(m / 60)} hours ${m % 60} minutes`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Convert
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 38 - Seconds Converter */}
      {isVisible(38, "Seconds Converter", "Time", ["seconds", "duration"]) && (
        <ToolCard
          id={38}
          title="Seconds to Hours, Min & Sec"
          category="Time"
          description="Convert raw seconds to formatted duration"
          output={t38Output}
        >
          <div className="flex gap-2">
            <input
              type="number"
              value={t38Sec}
              onChange={(e) => setT38Sec(e.target.value)}
              placeholder="Seconds"
              className="w-28 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const s = Number(t38Sec);
                const h = Math.floor(s / 3600);
                const m = Math.floor((s % 3600) / 60);
                const sec = s % 60;
                setT38Output(`${h}h ${m}m ${sec}s`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Convert
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 39 - Days Calculator */}
      {isVisible(39, "Days Calculator", "Time", ["days difference", "dates"]) && (
        <ToolCard
          id={39}
          title="Days Between Dates Calculator"
          category="Time"
          description="Find total calendar days between two dates"
          output={t39Output}
        >
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={t39Start}
              onChange={(e) => setT39Start(e.target.value)}
              className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <span className="text-xs text-slate-500">to</span>
            <input
              type="date"
              value={t39End}
              onChange={(e) => setT39End(e.target.value)}
              className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const s = new Date(t39Start);
                const e = new Date(t39End);
                const diff = Math.round(Math.abs(e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
                setT39Output(`Difference: ${diff} days`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Calculate
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 40 - Leap Year Checker */}
      {isVisible(40, "Leap Year Checker", "Math", ["leap", "calendar", "february"]) && (
        <ToolCard
          id={40}
          title="Leap Year Checker"
          category="Math"
          description="Check if a year has 366 days"
          output={t40Output}
        >
          <div className="flex gap-2">
            <input
              type="number"
              value={t40Year}
              onChange={(e) => setT40Year(e.target.value)}
              placeholder="Year"
              className="w-24 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const y = Number(t40Year);
                const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
                setT40Output(isLeap ? `✅ ${y} is a Leap Year` : `❌ ${y} is NOT a Leap Year`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Check
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 41 - Prime Number Checker */}
      {isVisible(41, "Prime Number Checker", "Math", ["prime", "divisible"]) && (
        <ToolCard
          id={41}
          title="Prime Number Checker"
          category="Math"
          description="Test if an integer is prime"
          output={t41Output}
        >
          <div className="flex gap-2">
            <input
              type="number"
              value={t41Num}
              onChange={(e) => setT41Num(e.target.value)}
              placeholder="Number"
              className="w-24 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const n = Number(t41Num);
                if (n < 2) return setT41Output("❌ Must be greater than 1");
                let isP = true;
                for (let i = 2; i <= Math.sqrt(n); i++) {
                  if (n % i === 0) { isP = false; break; }
                }
                setT41Output(isP ? `✅ ${n} is Prime` : `❌ ${n} is Composite (Not Prime)`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Check Prime
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 42 - Even / Odd Checker */}
      {isVisible(42, "Even / Odd Checker", "Math", ["even", "odd", "parity"]) && (
        <ToolCard
          id={42}
          title="Even / Odd Checker"
          category="Math"
          description="Check integer parity"
          output={t42Output}
        >
          <div className="flex gap-2">
            <input
              type="number"
              value={t42Num}
              onChange={(e) => setT42Num(e.target.value)}
              className="w-24 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const n = Number(t42Num);
                setT42Output(n % 2 === 0 ? `✅ ${n} is Even` : `✅ ${n} is Odd`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Check
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 43 - Factorial Calculator */}
      {isVisible(43, "Factorial Calculator", "Math", ["factorial", "n!"]) && (
        <ToolCard
          id={43}
          title="Factorial Calculator (n!)"
          category="Math"
          description="Calculate n! for numbers 0 to 170"
          output={t43Output}
        >
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              max={170}
              value={t43Num}
              onChange={(e) => setT43Num(e.target.value)}
              className="w-20 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const n = Number(t43Num);
                if (n < 0 || n > 170) return setT43Output("❌ Between 0 and 170");
                let res = 1;
                for (let i = 2; i <= n; i++) res *= i;
                setT43Output(`${n}! = ${res}`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Calculate
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 44 - Fibonacci Generator */}
      {isVisible(44, "Fibonacci Generator", "Math", ["fibonacci", "sequence"]) && (
        <ToolCard
          id={44}
          title="Fibonacci Sequence Generator"
          category="Math"
          description="Generate first N numbers of the Fibonacci sequence"
          output={t44Output}
        >
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              max={50}
              value={t44Count}
              onChange={(e) => setT44Count(e.target.value)}
              className="w-20 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const count = Math.min(50, Number(t44Count));
                const res = [];
                let a = 0, b = 1;
                for (let i = 0; i < count; i++) {
                  res.push(a);
                  const next = a + b;
                  a = b;
                  b = next;
                }
                setT44Output(res.join(", "));
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Generate
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 45 - GCD Calculator */}
      {isVisible(45, "GCD Calculator", "Math", ["gcd", "greatest common divisor"]) && (
        <ToolCard
          id={45}
          title="GCD Calculator"
          category="Math"
          description="Find greatest common divisor of two integers"
          output={t45Output}
        >
          <div className="flex gap-2">
            <input
              type="number"
              value={t45A}
              onChange={(e) => setT45A(e.target.value)}
              className="w-20 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="number"
              value={t45B}
              onChange={(e) => setT45B(e.target.value)}
              className="w-20 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                let a = Math.abs(Number(t45A));
                let b = Math.abs(Number(t45B));
                while (b !== 0) {
                  const temp = b;
                  b = a % b;
                  a = temp;
                }
                setT45Output(`GCD: ${a}`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              GCD
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 46 - LCM Calculator */}
      {isVisible(46, "LCM Calculator", "Math", ["lcm", "least common multiple"]) && (
        <ToolCard
          id={46}
          title="LCM Calculator"
          category="Math"
          description="Find least common multiple of two integers"
          output={t46Output}
        >
          <div className="flex gap-2">
            <input
              type="number"
              value={t46A}
              onChange={(e) => setT46A(e.target.value)}
              className="w-20 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="number"
              value={t46B}
              onChange={(e) => setT46B(e.target.value)}
              className="w-20 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const a = Math.abs(Number(t46A));
                const b = Math.abs(Number(t46B));
                const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
                const lcm = (a * b) / gcd(a, b);
                setT46Output(`LCM: ${lcm}`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              LCM
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 47 - Binary Calculator */}
      {isVisible(47, "Binary Calculator", "Math", ["binary to decimal"]) && (
        <ToolCard
          id={47}
          title="Binary to Decimal Calculator"
          category="Math"
          description="Convert binary sequence to base 10 integer"
          output={t47Output}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={t47Bin}
              onChange={(e) => setT47Bin(e.target.value)}
              placeholder="e.g. 101010"
              className="w-36 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                if (!/^[01]+$/.test(t47Bin.trim())) return setT47Output("❌ Enter valid binary (0 and 1 only)");
                setT47Output(`Decimal: ${parseInt(t47Bin.trim(), 2)}`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Convert
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 48 - Hexadecimal Calculator */}
      {isVisible(48, "Hexadecimal Calculator", "Math", ["hex to decimal"]) && (
        <ToolCard
          id={48}
          title="Hexadecimal to Decimal Calculator"
          category="Math"
          description="Convert hex number to base 10 integer"
          output={t48Output}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={t48Hex}
              onChange={(e) => setT48Hex(e.target.value)}
              placeholder="e.g. 1A3F"
              className="w-36 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                if (!/^[0-9a-fA-F]+$/.test(t48Hex.trim())) return setT48Output("❌ Enter valid hex string");
                setT48Output(`Decimal: ${parseInt(t48Hex.trim(), 16)}`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Convert
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 49 - Random Password Generator */}
      {isVisible(49, "Random Password Generator", "Security", ["password", "strong"]) && (
        <ToolCard
          id={49}
          title="Advanced Password Generator"
          category="Security"
          description="Generate complex passwords with uppercase, lowercase, numbers, and symbols"
          output={t49Output}
        >
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={6}
              max={64}
              value={t49Len}
              onChange={(e) => setT49Len(Number(e.target.value))}
              className="w-20 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=";
                const arr = new Uint8Array(t49Len);
                crypto.getRandomValues(arr);
                setT49Output(Array.from(arr, (x) => chars[x % chars.length]).join(""));
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Generate
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 50 - Strong Password Checker */}
      {isVisible(50, "Strong Password Checker", "Security", ["password strength", "entropy"]) && (
        <ToolCard
          id={50}
          title="Strong Password Checker"
          category="Security"
          description="Evaluate password entropy against length and diversity criteria"
          output={t50Output}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={t50Pass}
              onChange={(e) => setT50Pass(e.target.value)}
              placeholder="Enter password..."
              className="flex-1 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                let score = 0;
                if (t50Pass.length >= 8) score++;
                if (t50Pass.length >= 12) score++;
                if (/[A-Z]/.test(t50Pass)) score++;
                if (/[a-z]/.test(t50Pass)) score++;
                if (/[0-9]/.test(t50Pass)) score++;
                if (/[^A-Za-z0-9]/.test(t50Pass)) score++;
                const rating =
                  score <= 2
                    ? "🔴 Weak Password (Score: " + score + "/6)"
                    : score <= 4
                    ? "🟡 Medium Password (Score: " + score + "/6)"
                    : "🟢 Strong Password (Score: " + score + "/6)";
                setT50Output(rating);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Check Strength
            </button>
          </div>
        </ToolCard>
      )}
    </>
  );
};
