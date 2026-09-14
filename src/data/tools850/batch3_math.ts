import { DynamicTool } from "./definitions";

export const BATCH_3_MATH_TOOLS: DynamicTool[] = [
  {
    id: 351,
    title: "Greatest Common Divisor (GCD / HCF)",
    category: "Math",
    description: "Calculates the greatest common divisor between two integers (Euclidean algorithm).",
    keywords: ["gcd", "hcf", "divisor", "euclidean"],
    inputType: "two-inputs",
    label1: "Number A",
    label2: "Number B",
    default1: "48",
    default2: "18",
    run: (aStr, bStr = "18") => {
      let a = Math.abs(parseInt(aStr, 10) || 1);
      let b = Math.abs(parseInt(bStr, 10) || 1);
      while (b) {
        const t = b;
        b = a % b;
        a = t;
      }
      return `GCD: ${a}`;
    },
  },
  {
    id: 352,
    title: "Least Common Multiple (LCM)",
    category: "Math",
    description: "Calculates the smallest common multiple of two integers.",
    keywords: ["lcm", "multiple", "math"],
    inputType: "two-inputs",
    label1: "Number A",
    label2: "Number B",
    default1: "12",
    default2: "15",
    run: (aStr, bStr = "15") => {
      const a = Math.abs(parseInt(aStr, 10) || 1);
      const b = Math.abs(parseInt(bStr, 10) || 1);
      const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
      const lcm = (a * b) / gcd(a, b);
      return `LCM: ${lcm}`;
    },
  },
  {
    id: 353,
    title: "Prime Number Checker & Next Prime",
    category: "Math",
    description: "Tests if a number is prime and finds the next consecutive prime.",
    keywords: ["prime", "primality", "prime checker"],
    inputType: "number",
    default1: "97",
    run: (v) => {
      const n = parseInt(v, 10);
      if (isNaN(n) || n < 2) return `${v} is NOT prime.`;
      function isPrime(num: number): boolean {
        if (num < 2) return false;
        if (num === 2 || num === 3) return true;
        if (num % 2 === 0 || num % 3 === 0) return false;
        for (let i = 5; i * i <= num; i += 6) {
          if (num % i === 0 || num % (i + 2) === 0) return false;
        }
        return true;
      }
      const prime = isPrime(n);
      let next = n + 1;
      while (!isPrime(next)) next++;
      return `${n} is ${prime ? "a PRIME number! ✅" : "a COMPOSITE number (not prime). ❌"}\nNext prime after ${n} is ${next}.`;
    },
  },
  {
    id: 354,
    title: "Prime Factorization Calculator",
    category: "Math",
    description: "Decomposes a number into its prime factors with powers.",
    keywords: ["prime factors", "factorization", "factors"],
    inputType: "number",
    default1: "360",
    run: (v) => {
      let n = parseInt(v, 10);
      if (isNaN(n) || n < 2) return "Enter integer >= 2";
      const factors: Record<number, number> = {};
      for (let d = 2; d * d <= n; d++) {
        while (n % d === 0) {
          factors[d] = (factors[d] || 0) + 1;
          n /= d;
        }
      }
      if (n > 1) factors[n] = (factors[n] || 0) + 1;
      const formatted = Object.entries(factors)
        .map(([base, p]) => (p > 1 ? `${base}^${p}` : `${base}`))
        .join(" × ");
      return `Prime Factors: ${formatted}`;
    },
  },
  {
    id: 355,
    title: "Factorial Calculator (N!)",
    category: "Math",
    description: "Calculates the exact factorial value using BigInt.",
    keywords: ["factorial", "n!", "combinatorics"],
    inputType: "number",
    default1: "20",
    run: (v) => {
      const n = parseInt(v, 10);
      if (isNaN(n) || n < 0 || n > 100) return "Enter number between 0 and 100";
      let res = BigInt(1);
      for (let i = 2; i <= n; i++) res *= BigInt(i);
      return `${n}! = ${res.toString()}`;
    },
  },
  {
    id: 356,
    title: "Permutations Calculator (nPr)",
    category: "Math",
    description: "Calculates permutations nPr = n! / (n - r)!.",
    keywords: ["npr", "permutations", "combinatorics"],
    inputType: "two-inputs",
    label1: "Total Items (n)",
    label2: "Chosen Items (r)",
    default1: "10",
    default2: "3",
    run: (nStr, rStr = "3") => {
      const n = parseInt(nStr, 10) || 0;
      const r = parseInt(rStr, 10) || 0;
      if (r > n || n < 0 || r < 0) return "Invalid: requires 0 <= r <= n";
      let res = BigInt(1);
      for (let i = n - r + 1; i <= n; i++) res *= BigInt(i);
      return `P(${n}, ${r}) = ${res.toString()}`;
    },
  },
  {
    id: 357,
    title: "Combinations Calculator (nCr)",
    category: "Math",
    description: "Calculates combinations nCr = n! / (r! * (n - r)!).",
    keywords: ["ncr", "combinations", "binomial"],
    inputType: "two-inputs",
    label1: "Total Items (n)",
    label2: "Chosen Items (r)",
    default1: "10",
    default2: "3",
    run: (nStr, rStr = "3") => {
      const n = parseInt(nStr, 10) || 0;
      const r = parseInt(rStr, 10) || 0;
      if (r > n || n < 0 || r < 0) return "Invalid: requires 0 <= r <= n";
      let num = BigInt(1);
      let den = BigInt(1);
      for (let i = 1; i <= r; i++) {
        num *= BigInt(n - i + 1);
        den *= BigInt(i);
      }
      return `C(${n}, ${r}) = ${(num / den).toString()}`;
    },
  },
  {
    id: 358,
    title: "Quadratic Equation Solver (ax² + bx + c = 0)",
    category: "Math",
    description: "Finds real or complex roots of quadratic formula.",
    keywords: ["quadratic", "roots", "discriminant"],
    inputType: "text",
    default1: "1, -5, 6",
    run: (v) => {
      const parts = v.split(",").map(Number);
      if (parts.length < 3) return "Enter coefficients: a, b, c (e.g. 1, -5, 6)";
      const [a, b, c] = parts;
      if (a === 0) return "a cannot be 0 for quadratic equation.";
      const disc = b * b - 4 * a * c;
      if (disc > 0) {
        const x1 = (-b + Math.sqrt(disc)) / (2 * a);
        const x2 = (-b - Math.sqrt(disc)) / (2 * a);
        return `Discriminant: ${disc}\nRoot 1 (x₁): ${x1}\nRoot 2 (x₂): ${x2}`;
      } else if (disc === 0) {
        const x = -b / (2 * a);
        return `Single Real Root: x = ${x}`;
      } else {
        const real = (-b / (2 * a)).toFixed(3);
        const imag = (Math.sqrt(-disc) / (2 * a)).toFixed(3);
        return `Complex Roots:\nx₁ = ${real} + ${imag}i\nx₂ = ${real} - ${imag}i`;
      }
    },
  },
  {
    id: 359,
    title: "Linear Equation Solver (ax + b = c)",
    category: "Math",
    description: "Solves simple linear equations for variable x.",
    keywords: ["linear equation", "solve for x", "algebra"],
    inputType: "text",
    default1: "2, 4, 10",
    run: (v) => {
      const parts = v.split(",").map(Number);
      if (parts.length < 3) return "Enter: a, b, c for ax + b = c";
      const [a, b, c] = parts;
      if (a === 0) return "a cannot be 0";
      const x = (c - b) / a;
      return `${a}x + ${b} = ${c}\nx = ${x}`;
    },
  },
  {
    id: 360,
    title: "Fibonacci Sequence Generator",
    category: "Math",
    description: "Generates the first N terms of the Fibonacci sequence.",
    keywords: ["fibonacci", "sequence", "numbers"],
    inputType: "number",
    default1: "15",
    run: (v) => {
      const n = Math.min(50, Math.max(1, parseInt(v, 10) || 10));
      const fib: bigint[] = [BigInt(0), BigInt(1)];
      for (let i = 2; i < n; i++) fib.push(fib[i - 1] + fib[i - 2]);
      return fib.slice(0, n).map((x) => x.toString()).join(", ");
    },
  },
  {
    id: 361,
    title: "Arithmetic Progression (AP) Calculator",
    category: "Math",
    description: "Calculates N-th term and sum of arithmetic series.",
    keywords: ["arithmetic progression", "ap series", "nth term"],
    inputType: "text",
    default1: "2, 3, 10",
    run: (v) => {
      const [a, d, n] = v.split(",").map(Number);
      if (isNaN(a) || isNaN(d) || isNaN(n)) return "Enter: a (first), d (diff), n (terms)";
      const an = a + (n - 1) * d;
      const sn = (n / 2) * (2 * a + (n - 1) * d);
      return `First Term (a): ${a}\nCommon Diff (d): ${d}\nTerms (n): ${n}\n\nN-th Term: ${an}\nSum of ${n} terms: ${sn}`;
    },
  },
  {
    id: 362,
    title: "Geometric Progression (GP) Calculator",
    category: "Math",
    description: "Calculates N-th term and sum of geometric series.",
    keywords: ["geometric progression", "gp series", "ratio"],
    inputType: "text",
    default1: "3, 2, 8",
    run: (v) => {
      const [a, r, n] = v.split(",").map(Number);
      if (isNaN(a) || isNaN(r) || isNaN(n)) return "Enter: a (first), r (ratio), n (terms)";
      const an = a * Math.pow(r, n - 1);
      const sn = r === 1 ? a * n : (a * (1 - Math.pow(r, n))) / (1 - r);
      return `N-th Term: ${an}\nSum of ${n} terms: ${sn}`;
    },
  },
  {
    id: 363,
    title: "Mean / Average Calculator",
    category: "Math",
    description: "Calculates statistical mean (average) of a comma-separated list of numbers.",
    keywords: ["mean", "average", "statistics"],
    inputType: "text",
    default1: "10, 25, 40, 85, 120",
    run: (v) => {
      const nums = v.split(",").map(Number).filter((n) => !isNaN(n));
      if (!nums.length) return "Enter numbers separated by comma";
      const sum = nums.reduce((acc, x) => acc + x, 0);
      return `Count: ${nums.length}\nSum: ${sum}\nMean: ${(sum / nums.length).toFixed(4)}`;
    },
  },
  {
    id: 364,
    title: "Median Calculator",
    category: "Math",
    description: "Finds the middle numerical value in an ordered dataset.",
    keywords: ["median", "middle number", "statistics"],
    inputType: "text",
    default1: "15, 3, 9, 22, 1, 8",
    run: (v) => {
      const nums = v.split(",").map(Number).filter((n) => !isNaN(n)).sort((a, b) => a - b);
      if (!nums.length) return "Enter numbers";
      const mid = Math.floor(nums.length / 2);
      const median = nums.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
      return `Sorted: [${nums.join(", ")}]\nMedian: ${median}`;
    },
  },
  {
    id: 365,
    title: "Mode Calculator",
    category: "Math",
    description: "Finds the most frequently occurring value in the dataset.",
    keywords: ["mode", "most frequent", "statistics"],
    inputType: "text",
    default1: "1, 2, 2, 3, 4, 4, 4, 5",
    run: (v) => {
      const nums = v.split(",").map(Number).filter((n) => !isNaN(n));
      const counts: Record<number, number> = {};
      let maxCount = 0;
      nums.forEach((n) => {
        counts[n] = (counts[n] || 0) + 1;
        if (counts[n] > maxCount) maxCount = counts[n];
      });
      const modes = Object.entries(counts)
        .filter(([_, c]) => c === maxCount)
        .map(([n]) => n);
      return `Mode: ${modes.join(", ")} (Frequency: ${maxCount})`;
    },
  },
  {
    id: 366,
    title: "Range & Midrange Calculator",
    category: "Math",
    description: "Calculates the range (Max - Min) and midrange of numbers.",
    keywords: ["range", "midrange", "min max"],
    inputType: "text",
    default1: "12, 45, 67, 89, 23, 5",
    run: (v) => {
      const nums = v.split(",").map(Number).filter((n) => !isNaN(n));
      const min = Math.min(...nums);
      const max = Math.max(...nums);
      return `Min: ${min}\nMax: ${max}\nRange: ${max - min}\nMidrange: ${(max + min) / 2}`;
    },
  },
  {
    id: 367,
    title: "Variance & Standard Deviation",
    category: "Math",
    description: "Computes population and sample standard deviation and variance.",
    keywords: ["standard deviation", "variance", "dispersion"],
    inputType: "text",
    default1: "10, 12, 23, 23, 16, 23, 21, 16",
    run: (v) => {
      const nums = v.split(",").map(Number).filter((n) => !isNaN(n));
      const n = nums.length;
      if (n < 2) return "Enter at least 2 numbers";
      const mean = nums.reduce((acc, x) => acc + x, 0) / n;
      const sqDiffs = nums.map((x) => Math.pow(x - mean, 2));
      const popVar = sqDiffs.reduce((a, b) => a + b, 0) / n;
      const sampleVar = sqDiffs.reduce((a, b) => a + b, 0) / (n - 1);
      return `Mean: ${mean.toFixed(2)}\nPop Variance: ${popVar.toFixed(4)}\nPop Std Dev:   ${Math.sqrt(popVar).toFixed(4)}\nSample Std Dev: ${Math.sqrt(sampleVar).toFixed(4)}`;
    },
  },
  {
    id: 368,
    title: "Percentage Calculator (X% of Y)",
    category: "Math",
    description: "Calculates what X percent of Y is.",
    keywords: ["percentage", "percent", "pct"],
    inputType: "two-inputs",
    label1: "Percentage (X%)",
    label2: "Total Value (Y)",
    default1: "15",
    default2: "250",
    run: (xStr, yStr = "250") => {
      const x = parseFloat(xStr) || 0;
      const y = parseFloat(yStr) || 0;
      const result = (x / 100) * y;
      return `${x}% of ${y} = ${result.toFixed(2)}`;
    },
  },
  {
    id: 369,
    title: "Percentage Increase / Decrease",
    category: "Math",
    description: "Calculates the percentage change between original and new value.",
    keywords: ["percentage increase", "percentage decrease", "growth rate"],
    inputType: "two-inputs",
    label1: "Initial Value",
    label2: "Final Value",
    default1: "100",
    default2: "135",
    run: (origStr, newStr = "135") => {
      const orig = parseFloat(origStr) || 1;
      const final = parseFloat(newStr) || 1;
      const diff = final - orig;
      const pct = (diff / orig) * 100;
      return `Difference: ${diff >= 0 ? "+" : ""}${diff}\nPercentage Change: ${pct >= 0 ? "+" : ""}${pct.toFixed(2)}% (${pct >= 0 ? "Increase" : "Decrease"})`;
    },
  },
  {
    id: 370,
    title: "Fraction to Decimal Converter",
    category: "Math",
    description: "Converts fractions (e.g. 7/8 or 3 1/2) into decimal values.",
    keywords: ["fraction to decimal", "numerator", "denominator"],
    inputType: "text",
    default1: "7/8",
    run: (v) => {
      const parts = v.trim().split("/");
      if (parts.length === 2) {
        const num = parseFloat(parts[0]);
        const den = parseFloat(parts[1]);
        if (den === 0) return "Cannot divide by 0";
        return `${v} = ${(num / den).toFixed(6).replace(/\.?0+$/, "")}`;
      }
      return "Format: numerator/denominator (e.g. 5/16)";
    },
  },
  {
    id: 371,
    title: "Decimal to Fraction Simplifier",
    category: "Math",
    description: "Converts decimal number (e.g. 0.375) into simplified fraction (3/8).",
    keywords: ["decimal to fraction", "simplify fraction"],
    inputType: "number",
    default1: "0.375",
    run: (v) => {
      const x = parseFloat(v) || 0;
      let len = (v.split(".")[1] || "").length;
      let den = Math.pow(10, len);
      let num = Math.round(x * den);
      const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
      const common = gcd(num, den);
      return `${v} = ${num / common}/${den / common}`;
    },
  },
  {
    id: 372,
    title: "Simple Interest Quick Calculator",
    category: "Math",
    description: "Calculates simple interest: I = P * r * t.",
    keywords: ["simple interest", "loan interest", "banking"],
    inputType: "text",
    default1: "10000, 5, 3",
    run: (v) => {
      const [p, r, t] = v.split(",").map(Number);
      if (isNaN(p) || isNaN(r) || isNaN(t)) return "Enter: Principal, Rate%, Time(years)";
      const interest = (p * r * t) / 100;
      return `Principal: $${p.toLocaleString()}\nInterest:  $${interest.toLocaleString()}\nTotal:     $${(p + interest).toLocaleString()}`;
    },
  },
  {
    id: 373,
    title: "Compound Interest Formula Calculator",
    category: "Math",
    description: "Calculates annual compound interest A = P(1 + r/n)^(nt).",
    keywords: ["compound interest", "future value", "investing"],
    inputType: "text",
    default1: "5000, 7, 10, 12",
    run: (v) => {
      const [p, r, t, n = 12] = v.split(",").map(Number);
      if (isNaN(p) || isNaN(r) || isNaN(t)) return "Enter: Principal, Rate%, Years, CompoundsPerYear(default 12)";
      const rate = r / 100;
      const amount = p * Math.pow(1 + rate / n, n * t);
      return `Principal: $${p.toLocaleString()}\nFuture Total: $${amount.toFixed(2)}\nInterest Earned: $${(amount - p).toFixed(2)}`;
    },
  },
  {
    id: 374,
    title: "Loan EMI / Mortgage Calculator",
    category: "Math",
    description: "Calculates monthly EMI and total interest for mortgages or auto loans.",
    keywords: ["emi", "mortgage", "loan", "monthly payment"],
    inputType: "text",
    default1: "300000, 6.5, 30",
    run: (v) => {
      const [p, r, years] = v.split(",").map(Number);
      if (isNaN(p) || isNaN(r) || isNaN(years)) return "Enter: Principal, AnnualRate%, Years";
      const monthlyRate = r / 100 / 12;
      const months = years * 12;
      const emi = (p * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
      const totalPay = emi * months;
      return `Monthly EMI: $${emi.toFixed(2)}\nTotal Payment: $${totalPay.toFixed(2)}\nTotal Interest: $${(totalPay - p).toFixed(2)}`;
    },
  },
  {
    id: 375,
    title: "Rule of 72 Doubling Time Calculator",
    category: "Math",
    description: "Estimates how many years an investment takes to double at rate R%.",
    keywords: ["rule of 72", "doubling time", "investing"],
    inputType: "number",
    default1: "8",
    run: (v) => {
      const rate = parseFloat(v) || 0;
      if (rate <= 0) return "Rate must be > 0";
      const years = 72 / rate;
      const exact = Math.log(2) / Math.log(1 + rate / 100);
      return `Rule of 72: ~${years.toFixed(1)} years to double\nExact Math: ~${exact.toFixed(2)} years`;
    },
  },
  {
    id: 376,
    title: "Return on Investment (ROI) Calculator",
    category: "Math",
    description: "Calculates ROI percentage and net profit.",
    keywords: ["roi", "return on investment", "finance"],
    inputType: "two-inputs",
    label1: "Initial Investment",
    label2: "Final Return Value",
    default1: "5000",
    default2: "8500",
    run: (invStr, retStr = "8500") => {
      const inv = parseFloat(invStr) || 1;
      const ret = parseFloat(retStr) || 1;
      const gain = ret - inv;
      const roi = (gain / inv) * 100;
      return `Net Gain: $${gain.toFixed(2)}\nROI: ${roi.toFixed(2)}%`;
    },
  },
  {
    id: 377,
    title: "Break-Even Point Calculator",
    category: "Math",
    description: "Calculates units needed to sell to cover fixed and variable costs.",
    keywords: ["break even", "economics", "units to sell"],
    inputType: "text",
    default1: "10000, 50, 20",
    run: (v) => {
      const [fixed, price, variable] = v.split(",").map(Number);
      if (isNaN(fixed) || isNaN(price) || isNaN(variable)) return "Enter: Fixed Costs, Price Per Unit, Variable Cost Per Unit";
      const margin = price - variable;
      if (margin <= 0) return "Price must be greater than variable cost";
      const units = Math.ceil(fixed / margin);
      return `Contribution Margin: $${margin} per unit\nBreak-Even Units: ${units.toLocaleString()} units\nBreak-Even Revenue: $${(units * price).toLocaleString()}`;
    },
  },
  {
    id: 378,
    title: "Sales Tax & VAT Gross/Net Calculator",
    category: "Math",
    description: "Calculates tax amount, gross, and net values from tax percentage.",
    keywords: ["sales tax", "vat", "gross net tax"],
    inputType: "two-inputs",
    label1: "Net Amount",
    label2: "Tax Rate % (e.g. 8.25)",
    default1: "150",
    default2: "8.25",
    run: (netStr, rateStr = "8.25") => {
      const net = parseFloat(netStr) || 0;
      const rate = parseFloat(rateStr) || 0;
      const tax = (net * rate) / 100;
      return `Net:       $${net.toFixed(2)}\nTax (${rate}%): $${tax.toFixed(2)}\nGross:     $${(net + tax).toFixed(2)}`;
    },
  },
  {
    id: 379,
    title: "Tip & Bill Splitter",
    category: "Math",
    description: "Calculates tip amount and divides total evenly among diners.",
    keywords: ["tip calculator", "split bill", "restaurant tip"],
    inputType: "text",
    default1: "120, 18, 4",
    run: (v) => {
      const [bill, tipPct, people] = v.split(",").map(Number);
      if (isNaN(bill) || isNaN(tipPct) || isNaN(people) || people <= 0) return "Enter: Bill, Tip%, People";
      const tip = (bill * tipPct) / 100;
      const total = bill + tip;
      return `Tip Total: $${tip.toFixed(2)}\nBill Total: $${total.toFixed(2)}\nPer Person (${people} people): $${(total / people).toFixed(2)}`;
    },
  },
  {
    id: 380,
    title: "Salary Hourly to Annual Converter",
    category: "Math",
    description: "Converts hourly rate to annual, monthly, and bi-weekly salary.",
    keywords: ["salary", "hourly to annual", "compensation"],
    inputType: "number",
    default1: "45",
    run: (v) => {
      const hourly = parseFloat(v) || 0;
      const annual = hourly * 40 * 52;
      return `Hourly:    $${hourly.toFixed(2)}/hr\nWeekly:    $${(hourly * 40).toFixed(2)}\nBi-Weekly: $${(hourly * 80).toFixed(2)}\nMonthly:   $${(annual / 12).toFixed(2)}\nAnnual:    $${annual.toLocaleString()}/yr`;
    },
  },
  {
    id: 381,
    title: "Length Unit Converter",
    category: "Math",
    description: "Converts meters to feet, inches, yards, miles, and kilometers.",
    keywords: ["meters", "feet", "miles", "length"],
    inputType: "number",
    default1: "100",
    run: (v) => {
      const m = parseFloat(v) || 0;
      return `${m} Meters =\n${(m * 3.28084).toFixed(2)} Feet\n${(m * 39.3701).toFixed(2)} Inches\n${(m * 1.09361).toFixed(2)} Yards\n${(m / 1000).toFixed(3)} Kilometers\n${(m / 1609.34).toFixed(4)} Miles`;
    },
  },
  {
    id: 382,
    title: "Mass / Weight Unit Converter",
    category: "Math",
    description: "Converts kilograms to pounds, ounces, grams, and stones.",
    keywords: ["kilograms", "pounds", "weight", "mass"],
    inputType: "number",
    default1: "75",
    run: (v) => {
      const kg = parseFloat(v) || 0;
      return `${kg} Kilograms (kg) =\n${(kg * 2.20462).toFixed(2)} Pounds (lbs)\n${(kg * 35.274).toFixed(2)} Ounces (oz)\n${kg * 1000} Grams (g)\n${(kg / 6.35029).toFixed(2)} Stones`;
    },
  },
  {
    id: 383,
    title: "Speed Unit Converter",
    category: "Math",
    description: "Converts km/h to mph, m/s, and knots.",
    keywords: ["speed", "kmh", "mph", "knots"],
    inputType: "number",
    default1: "100",
    run: (v) => {
      const kmh = parseFloat(v) || 0;
      return `${kmh} km/h =\n${(kmh * 0.621371).toFixed(2)} mph (miles/hour)\n${(kmh / 3.6).toFixed(2)} m/s (meters/sec)\n${(kmh * 0.539957).toFixed(2)} knots`;
    },
  },
  {
    id: 384,
    title: "Area Unit Converter",
    category: "Math",
    description: "Converts square meters to square feet, acres, and hectares.",
    keywords: ["area", "sq ft", "acres", "hectares"],
    inputType: "number",
    default1: "1000",
    run: (v) => {
      const sq = parseFloat(v) || 0;
      return `${sq} sq meters =\n${(sq * 10.7639).toFixed(2)} sq feet\n${(sq / 4046.86).toFixed(4)} acres\n${(sq / 10000).toFixed(4)} hectares`;
    },
  },
  {
    id: 385,
    title: "Volume Unit Converter",
    category: "Math",
    description: "Converts liters to US gallons, fluid ounces, and milliliters.",
    keywords: ["volume", "liters", "gallons", "liquid"],
    inputType: "number",
    default1: "5",
    run: (v) => {
      const l = parseFloat(v) || 0;
      return `${l} Liters =\n${(l * 0.264172).toFixed(2)} US Gallons\n${(l * 33.814).toFixed(1)} Fluid Ounces\n${l * 1000} Milliliters`;
    },
  },
  {
    id: 386,
    title: "Pressure Unit Converter",
    category: "Math",
    description: "Converts bar to PSI, Pascal, and Atmospheres.",
    keywords: ["pressure", "psi", "bar", "pascal"],
    inputType: "number",
    default1: "2.5",
    run: (v) => {
      const bar = parseFloat(v) || 0;
      return `${bar} Bar =\n${(bar * 14.5038).toFixed(2)} PSI\n${bar * 100000} Pascals (Pa)\n${(bar * 0.986923).toFixed(3)} Atmospheres (atm)`;
    },
  },
  {
    id: 387,
    title: "Energy Unit Converter",
    category: "Math",
    description: "Converts Joules to Calories, Kilowatt-hours (kWh), and BTUs.",
    keywords: ["energy", "joules", "kwh", "calories"],
    inputType: "number",
    default1: "1000000",
    run: (v) => {
      const j = parseFloat(v) || 0;
      return `${j.toLocaleString()} Joules =\n${(j / 4184).toFixed(2)} kcal (food calories)\n${(j / 3.6e6).toFixed(4)} kWh\n${(j / 1055.06).toFixed(2)} BTU`;
    },
  },
  {
    id: 388,
    title: "Power Unit Converter",
    category: "Math",
    description: "Converts Watts to Kilowatts and Mechanical Horsepower.",
    keywords: ["power", "watts", "horsepower"],
    inputType: "number",
    default1: "746",
    run: (v) => {
      const w = parseFloat(v) || 0;
      return `${w} Watts =\n${(w / 1000).toFixed(3)} Kilowatts (kW)\n${(w / 745.7).toFixed(2)} Horsepower (hp)`;
    },
  },
  {
    id: 389,
    title: "Angle: Degrees to Radians & Gradians",
    category: "Math",
    description: "Converts angle degrees to radians (rad) and gradians (grad).",
    keywords: ["degrees to radians", "radians", "gradians"],
    inputType: "number",
    default1: "180",
    run: (v) => {
      const deg = parseFloat(v) || 0;
      const rad = (deg * Math.PI) / 180;
      const grad = (deg * 200) / 180;
      return `${deg}° =\n${rad.toFixed(4)} rad (${(deg / 180).toFixed(2)}π rad)\n${grad.toFixed(2)} grad`;
    },
  },
  {
    id: 390,
    title: "Trigonometry (Sin, Cos, Tan)",
    category: "Math",
    description: "Computes sine, cosine, and tangent for angle in degrees.",
    keywords: ["trig", "sine", "cosine", "tangent"],
    inputType: "number",
    default1: "45",
    run: (v) => {
      const deg = parseFloat(v) || 0;
      const rad = (deg * Math.PI) / 180;
      return `Angle: ${deg}°\nSin: ${Math.sin(rad).toFixed(4)}\nCos: ${Math.cos(rad).toFixed(4)}\nTan: ${Math.tan(rad).toFixed(4)}`;
    },
  },
  {
    id: 391,
    title: "Logarithm Calculator (log10, log2, ln)",
    category: "Math",
    description: "Computes base-10, binary base-2, and natural logarithms.",
    keywords: ["logarithm", "log2", "log10", "ln"],
    inputType: "number",
    default1: "1024",
    run: (v) => {
      const x = parseFloat(v);
      if (isNaN(x) || x <= 0) return "Input must be > 0";
      return `log₂(x):  ${Math.log2(x).toFixed(4)}\nlog₁₀(x): ${Math.log10(x).toFixed(4)}\nln(x):    ${Math.log(x).toFixed(4)}`;
    },
  },
  {
    id: 392,
    title: "Nth Root Calculator (√)",
    category: "Math",
    description: "Calculates the N-th root of number (e.g. cube root of 27).",
    keywords: ["nth root", "cube root", "square root"],
    inputType: "two-inputs",
    label1: "Number (x)",
    label2: "Root Degree (n)",
    default1: "27",
    default2: "3",
    run: (xStr, nStr = "3") => {
      const x = parseFloat(xStr) || 0;
      const n = parseFloat(nStr) || 1;
      const root = Math.pow(x, 1 / n);
      return `${n}√${x} = ${root.toFixed(4)}`;
    },
  },
  {
    id: 393,
    title: "Matrix 2x2 Determinant",
    category: "Math",
    description: "Calculates determinant det(A) = ad - bc for 2x2 matrix.",
    keywords: ["matrix determinant", "2x2 matrix", "linear algebra"],
    inputType: "text",
    default1: "4, 3, 2, 1",
    run: (v) => {
      const [a, b, c, d] = v.split(",").map(Number);
      if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) return "Enter 4 numbers: a, b, c, d";
      const det = a * d - b * c;
      return `Matrix:\n[${a}  ${b}]\n[${c}  ${d}]\n\nDeterminant: ${det}`;
    },
  },
  {
    id: 394,
    title: "Matrix 3x3 Determinant",
    category: "Math",
    description: "Calculates determinant of 3x3 matrix via Laplace expansion.",
    keywords: ["matrix 3x3", "determinant", "laplace"],
    inputType: "text",
    default1: "1, 2, 3, 0, 4, 5, 1, 0, 6",
    run: (v) => {
      const nums = v.split(",").map(Number);
      if (nums.length < 9) return "Enter 9 numbers: a,b,c, d,e,f, g,h,i";
      const [a, b, c, d, e, f, g, h, i] = nums;
      const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
      return `Determinant = ${det}`;
    },
  },
  {
    id: 395,
    title: "2D Vector Dot Product & Magnitude",
    category: "Math",
    description: "Calculates vector dot product (A · B) and Euclidean length.",
    keywords: ["vector dot", "magnitude", "2d vector"],
    inputType: "text",
    default1: "3, 4, 1, 2",
    run: (v) => {
      const [x1, y1, x2, y2] = v.split(",").map(Number);
      if (isNaN(x1) || isNaN(y1)) return "Enter: x1, y1, x2, y2";
      const dot = x1 * x2 + y1 * y2;
      const mag1 = Math.sqrt(x1 * x1 + y1 * y1);
      const mag2 = Math.sqrt(x2 * x2 + y2 * y2);
      return `Dot Product (A · B): ${dot}\n|A|: ${mag1.toFixed(3)}\n|B|: ${mag2.toFixed(3)}`;
    },
  },
  {
    id: 396,
    title: "Aspect Ratio Scaler",
    category: "Math",
    description: "Calculates target width or height while preserving aspect ratio.",
    keywords: ["aspect ratio", "resize", "resolution"],
    inputType: "text",
    default1: "1920, 1080, 800",
    run: (v) => {
      const [w1, h1, w2] = v.split(",").map(Number);
      if (isNaN(w1) || isNaN(h1) || isNaN(w2)) return "Enter: OrigWidth, OrigHeight, TargetWidth";
      const h2 = Math.round((h1 / w1) * w2);
      return `Original: ${w1} × ${h1}\nTarget:   ${w2} × ${h2} (16:9 equivalent)`;
    },
  },
  {
    id: 397,
    title: "Golden Ratio Dimension Calculator",
    category: "Math",
    description: "Calculates golden ratio proportions (φ ≈ 1.618) from base dimension.",
    keywords: ["golden ratio", "phi", "typography scale"],
    inputType: "number",
    default1: "500",
    run: (v) => {
      const n = parseFloat(v) || 0;
      const phi = 1.61803398875;
      return `Base: ${n}\nSmaller segment (A / φ): ${(n / phi).toFixed(2)}\nLarger segment (A × φ):  ${(n * phi).toFixed(2)}`;
    },
  },
  {
    id: 398,
    title: "Body Mass Index (BMI) & Category",
    category: "Math",
    description: "Calculates BMI from weight (kg) and height (cm).",
    keywords: ["bmi", "body mass index", "health"],
    inputType: "two-inputs",
    label1: "Weight (kg)",
    label2: "Height (cm)",
    default1: "70",
    default2: "175",
    run: (wStr, hStr = "175") => {
      const w = parseFloat(wStr) || 0;
      const hM = (parseFloat(hStr) || 170) / 100;
      const bmi = w / (hM * hM);
      let cat = "Normal weight";
      if (bmi < 18.5) cat = "Underweight";
      else if (bmi >= 25 && bmi < 30) cat = "Overweight";
      else if (bmi >= 30) cat = "Obesity";
      return `BMI: ${bmi.toFixed(1)}\nCategory: ${cat}`;
    },
  },
  {
    id: 399,
    title: "Screen DPI / PPI Calculator",
    category: "Math",
    description: "Calculates pixels per inch from width, height, and diagonal size.",
    keywords: ["dpi", "ppi", "screen resolution"],
    inputType: "text",
    default1: "1920, 1080, 24",
    run: (v) => {
      const [w, h, diag] = v.split(",").map(Number);
      if (isNaN(w) || isNaN(h) || isNaN(diag)) return "Enter: Width, Height, Diagonal(inches)";
      const ppi = Math.sqrt(w * w + h * h) / diag;
      return `PPI: ${ppi.toFixed(1)} pixels per inch`;
    },
  },
  {
    id: 400,
    title: "Viewport (vw/vh) to Pixels Calculator",
    category: "Math",
    description: "Converts CSS vw and vh units into px for given screen size.",
    keywords: ["vw to px", "vh to px", "viewport"],
    inputType: "text",
    default1: "50vw, 1920",
    run: (v) => {
      const [val, screen] = v.split(",").map((s) => parseFloat(s.trim()));
      if (isNaN(val) || isNaN(screen)) return "Enter: e.g. 50, 1920";
      return `${val}vw of ${screen}px = ${(val / 100) * screen}px`;
    },
  },
  {
    id: 401,
    title: "Target Frame Rate & Frame Time (ms)",
    category: "Math",
    description: "Calculates frame budget in milliseconds for game/render loops (e.g. 60 FPS -> 16.6ms).",
    keywords: ["fps to ms", "frame budget", "refresh rate"],
    inputType: "number",
    default1: "60",
    run: (v) => {
      const fps = parseFloat(v) || 60;
      return `${fps} FPS = ${(1000 / fps).toFixed(2)} ms per frame`;
    },
  },
  {
    id: 402,
    title: "Audio File Size Calculator",
    category: "Math",
    description: "Estimates uncompressed WAV file size: SampleRate × Bits × Channels × Duration.",
    keywords: ["audio size", "sample rate", "audio bitrate"],
    inputType: "text",
    default1: "44100, 16, 2, 180",
    run: (v) => {
      const [rate, bits, ch, sec] = v.split(",").map(Number);
      if (isNaN(rate) || isNaN(sec)) return "Enter: SampleRate(Hz), Bits, Channels, Duration(sec)";
      const bytes = (rate * (bits / 8) * ch * sec);
      return `Raw Audio Size: ${(bytes / (1024 * 1024)).toFixed(2)} MB (${Math.round(bytes / 1024)} KB)`;
    },
  },
  {
    id: 403,
    title: "Video Bitrate & Bandwidth Calculator",
    category: "Math",
    description: "Estimates video file size from bitrate in Mbps and duration.",
    keywords: ["video bitrate", "video file size", "streaming"],
    inputType: "two-inputs",
    label1: "Bitrate (Mbps)",
    label2: "Duration (minutes)",
    default1: "5",
    default2: "60",
    run: (rateStr, minStr = "60") => {
      const mbps = parseFloat(rateStr) || 5;
      const min = parseFloat(minStr) || 60;
      const totalMB = (mbps * min * 60) / 8;
      return `Estimated Size: ${(totalMB / 1024).toFixed(2)} GB (${Math.round(totalMB)} MB)`;
    },
  },
  {
    id: 404,
    title: "Modulo Arithmetic Calculator (A mod B)",
    category: "Math",
    description: "Computes quotient and remainder for integer division.",
    keywords: ["modulo", "remainder", "mod"],
    inputType: "two-inputs",
    label1: "Dividend (A)",
    label2: "Divisor (B)",
    default1: "29",
    default2: "6",
    run: (aStr, bStr = "6") => {
      const a = parseInt(aStr, 10) || 0;
      const b = parseInt(bStr, 10) || 1;
      return `${a} mod ${b} = ${((a % b) + b) % b}\nQuotient: ${Math.floor(a / b)}`;
    },
  },
  {
    id: 405,
    title: "Bitwise Operators Simulator",
    category: "Math",
    description: "Evaluates bitwise AND, OR, XOR, NOT, and shifts between two integers.",
    keywords: ["bitwise", "and", "or", "xor", "shift"],
    inputType: "two-inputs",
    label1: "Number A",
    label2: "Number B",
    default1: "12",
    default2: "10",
    run: (aStr, bStr = "10") => {
      const a = parseInt(aStr, 10) || 0;
      const b = parseInt(bStr, 10) || 0;
      return `A & B (AND): ${a & b}\nA | B (OR):  ${a | b}\nA ^ B (XOR): ${a ^ b}\n~A (NOT):    ${~a}\nA << 1 (LShift): ${a << 1}\nA >> 1 (RShift): ${a >> 1}`;
    },
  },
  {
    id: 406,
    title: "Two's Complement Integer Calculator",
    category: "Math",
    description: "Shows 8-bit, 16-bit, and 32-bit two's complement binary representation.",
    keywords: ["two's complement", "signed binary", "negative binary"],
    inputType: "number",
    default1: "-5",
    run: (v) => {
      const n = parseInt(v, 10) || 0;
      const b8 = (n & 0xff).toString(2).padStart(8, "0");
      const b16 = (n & 0xffff).toString(2).padStart(16, "0");
      const b32 = (n >>> 0).toString(2).padStart(32, "0");
      return `Value: ${n}\n8-bit:  ${b8}\n16-bit: ${b16}\n32-bit: ${b32}`;
    },
  },
  {
    id: 407,
    title: "Hamming Distance Calculator",
    category: "Math",
    description: "Measures differing bit positions between two binary strings.",
    keywords: ["hamming distance", "error correction", "bit flips"],
    inputType: "two-inputs",
    label1: "Binary String 1",
    label2: "Binary String 2",
    default1: "1011101",
    default2: "1001001",
    run: (s1, s2 = "") => {
      let dist = 0;
      const len = Math.max(s1.length, s2.length);
      const p1 = s1.padStart(len, "0");
      const p2 = s2.padStart(len, "0");
      for (let i = 0; i < len; i++) {
        if (p1[i] !== p2[i]) dist++;
      }
      return `Hamming Distance: ${dist} bits differing`;
    },
  },
  {
    id: 408,
    title: "Random Number in Custom Range",
    category: "Math",
    description: "Generates cryptographically random integer in [Min, Max].",
    keywords: ["random range", "rng", "random integer"],
    inputType: "two-inputs",
    label1: "Min Value",
    label2: "Max Value",
    default1: "1",
    default2: "100",
    run: (minStr, maxStr = "100") => {
      const min = parseInt(minStr, 10) || 1;
      const max = parseInt(maxStr, 10) || 100;
      const rand = Math.floor(Math.random() * (max - min + 1)) + min;
      return `Random Value [${min}, ${max}]: ${rand}`;
    },
  },
  {
    id: 409,
    title: "Dice Roll Simulator (d4, d6, d20)",
    category: "Math",
    description: "Rolls tabletop RPG dice with modifiers (e.g. 2d6+3 or 1d20).",
    keywords: ["dice roll", "d20", "rpg dice", "d6"],
    inputType: "text",
    default1: "2d6+3",
    run: (v) => {
      const match = v.match(/^(\d+)d(\d+)(?:([+-])(\d+))?$/i);
      if (!match) return "Enter e.g. 2d6+3, 1d20, 3d8-2";
      const count = parseInt(match[1], 10);
      const sides = parseInt(match[2], 10);
      const sign = match[3] || "+";
      const mod = parseInt(match[4] || "0", 10);
      const rolls: number[] = [];
      let total = 0;
      for (let i = 0; i < count; i++) {
        const r = Math.floor(Math.random() * sides) + 1;
        rolls.push(r);
        total += r;
      }
      total += sign === "+" ? mod : -mod;
      return `Rolls: [${rolls.join(", ")}]\nModifier: ${sign}${mod}\nTotal: ${total}`;
    },
  },
  {
    id: 410,
    title: "Circle Dimensions Calculator",
    category: "Math",
    description: "Calculates area, circumference, and diameter from radius.",
    keywords: ["circle area", "circumference", "geometry"],
    inputType: "number",
    default1: "7",
    run: (v) => {
      const r = parseFloat(v) || 0;
      return `Radius: ${r}\nDiameter: ${(2 * r).toFixed(2)}\nCircumference: ${(2 * Math.PI * r).toFixed(4)}\nArea: ${(Math.PI * r * r).toFixed(4)}`;
    },
  },
  {
    id: 411,
    title: "Sphere Volume & Surface Area",
    category: "Math",
    description: "Calculates volume (4/3 π r³) and surface area (4 π r²).",
    keywords: ["sphere volume", "surface area", "3d geometry"],
    inputType: "number",
    default1: "5",
    run: (v) => {
      const r = parseFloat(v) || 0;
      const vol = (4 / 3) * Math.PI * Math.pow(r, 3);
      const area = 4 * Math.PI * Math.pow(r, 2);
      return `Volume: ${vol.toFixed(3)}\nSurface Area: ${area.toFixed(3)}`;
    },
  },
  {
    id: 412,
    title: "Cylinder Volume & Surface Area",
    category: "Math",
    description: "Calculates volume and surface area from radius and height.",
    keywords: ["cylinder", "volume", "cylinder area"],
    inputType: "two-inputs",
    label1: "Radius (r)",
    label2: "Height (h)",
    default1: "4",
    default2: "10",
    run: (rStr, hStr = "10") => {
      const r = parseFloat(rStr) || 0;
      const h = parseFloat(hStr) || 0;
      const vol = Math.PI * r * r * h;
      const area = 2 * Math.PI * r * h + 2 * Math.PI * r * r;
      return `Volume: ${vol.toFixed(2)}\nTotal Surface Area: ${area.toFixed(2)}`;
    },
  },
  {
    id: 413,
    title: "Pythagorean Theorem Calculator",
    category: "Math",
    description: "Calculates hypotenuse c = √(a² + b²) for right triangles.",
    keywords: ["pythagorean", "hypotenuse", "triangle"],
    inputType: "two-inputs",
    label1: "Side A",
    label2: "Side B",
    default1: "3",
    default2: "4",
    run: (aStr, bStr = "4") => {
      const a = parseFloat(aStr) || 0;
      const b = parseFloat(bStr) || 0;
      const c = Math.sqrt(a * a + b * b);
      return `Hypotenuse (c): ${c.toFixed(4)}`;
    },
  },
  {
    id: 414,
    title: "Distance Between Two 2D Points",
    category: "Math",
    description: "Calculates Euclidean distance d = √((x2-x1)² + (y2-y1)²).",
    keywords: ["distance", "2d points", "euclidean"],
    inputType: "text",
    default1: "0, 0, 3, 4",
    run: (v) => {
      const [x1, y1, x2, y2] = v.split(",").map(Number);
      if (isNaN(x1) || isNaN(y2)) return "Enter: x1, y1, x2, y2";
      const dist = Math.hypot(x2 - x1, y2 - y1);
      return `Distance: ${dist.toFixed(4)}`;
    },
  },
  {
    id: 415,
    title: "Slope & Y-Intercept of a Line",
    category: "Math",
    description: "Finds line equation y = mx + b passing through two coordinates.",
    keywords: ["slope", "y-intercept", "line equation"],
    inputType: "text",
    default1: "1, 2, 3, 6",
    run: (v) => {
      const [x1, y1, x2, y2] = v.split(",").map(Number);
      if (isNaN(x1) || isNaN(y2)) return "Enter: x1, y1, x2, y2";
      if (x2 === x1) return "Vertical Line: x = " + x1;
      const m = (y2 - y1) / (x2 - x1);
      const b = y1 - m * x1;
      return `Slope (m): ${m}\nY-Intercept (b): ${b}\nEquation: y = ${m}x + ${b}`;
    },
  },
  {
    id: 416,
    title: "Ohm's Law Calculator (V, I, R, P)",
    category: "Math",
    description: "Computes Voltage, Current, Resistance, or Power in electrical circuits.",
    keywords: ["ohms law", "voltage", "current", "resistance"],
    inputType: "two-inputs",
    label1: "Voltage (V) or 0 if unknown",
    label2: "Resistance (R in Ohms)",
    default1: "12",
    default2: "4",
    run: (vStr, rStr = "4") => {
      const v = parseFloat(vStr) || 0;
      const r = parseFloat(rStr) || 1;
      const i = v / r;
      const p = v * i;
      return `Current (I): ${i.toFixed(3)} Amperes\nPower (P):   ${p.toFixed(2)} Watts`;
    },
  },
  {
    id: 417,
    title: "LED Resistor Calculator",
    category: "Math",
    description: "Calculates current limiting resistor R = (Vsupply - Vled) / Iled.",
    keywords: ["led resistor", "electronics", "circuit"],
    inputType: "text",
    default1: "5, 2.0, 20",
    run: (v) => {
      const [vSupp, vLed, iLedMa] = v.split(",").map(Number);
      if (isNaN(vSupp) || isNaN(vLed) || isNaN(iLedMa)) return "Enter: SupplyVoltage(V), LedForwardVoltage(V), Current(mA)";
      const r = (vSupp - vLed) / (iLedMa / 1000);
      return `Required Resistor: ${Math.round(r)} Ω (Ohms)`;
    },
  },
  {
    id: 418,
    title: "Resistors in Parallel & Series",
    category: "Math",
    description: "Calculates total equivalent resistance for series and parallel circuits.",
    keywords: ["resistors", "parallel series", "electronics"],
    inputType: "text",
    default1: "100, 200, 300",
    run: (v) => {
      const r = v.split(",").map(Number).filter((n) => n > 0);
      if (!r.length) return "Enter resistor values in Ohms";
      const series = r.reduce((a, b) => a + b, 0);
      const parallel = 1 / r.reduce((acc, x) => acc + 1 / x, 0);
      return `Series Total:   ${series.toFixed(2)} Ω\nParallel Total: ${parallel.toFixed(2)} Ω`;
    },
  },
  {
    id: 419,
    title: "Margin vs Markup Calculator",
    category: "Math",
    description: "Calculates profit margin % and markup % based on cost and selling price.",
    keywords: ["margin", "markup", "profit percentage"],
    inputType: "two-inputs",
    label1: "Cost Price ($)",
    label2: "Selling Price ($)",
    default1: "60",
    default2: "100",
    run: (costStr, sellStr = "100") => {
      const cost = parseFloat(costStr) || 1;
      const sell = parseFloat(sellStr) || 1;
      const profit = sell - cost;
      const margin = (profit / sell) * 100;
      const markup = (profit / cost) * 100;
      return `Profit: $${profit.toFixed(2)}\nProfit Margin: ${margin.toFixed(2)}%\nMarkup:        ${markup.toFixed(2)}%`;
    },
  },
  {
    id: 420,
    title: "Discount & Final Price Calculator",
    category: "Math",
    description: "Calculates savings and final price after coupon discount.",
    keywords: ["discount", "coupon", "sale price"],
    inputType: "two-inputs",
    label1: "Original Price",
    label2: "Discount %",
    default1: "80",
    default2: "25",
    run: (pStr, dStr = "25") => {
      const p = parseFloat(pStr) || 0;
      const d = parseFloat(dStr) || 0;
      const savings = (p * d) / 100;
      return `You Save: $${savings.toFixed(2)}\nFinal Price: $${(p - savings).toFixed(2)}`;
    },
  },
  {
    id: 421,
    title: "Fuel Economy MPG to L/100km",
    category: "Math",
    description: "Converts US Miles Per Gallon (MPG) to Liters per 100km.",
    keywords: ["mpg to l100km", "fuel economy", "mileage"],
    inputType: "number",
    default1: "30",
    run: (v) => {
      const mpg = parseFloat(v) || 1;
      const l100km = 235.214583 / mpg;
      return `${mpg} MPG = ${l100km.toFixed(2)} L/100km`;
    },
  },
  {
    id: 422,
    title: "Speed of Sound & Distance Estimator",
    category: "Math",
    description: "Estimates distance from lightning flash to thunder clap (343 m/s).",
    keywords: ["speed of sound", "lightning distance", "acoustics"],
    inputType: "number",
    default1: "5",
    run: (v) => {
      const sec = parseFloat(v) || 0;
      const meters = sec * 343;
      return `Delay: ${sec} seconds =\nDistance: ~${(meters / 1000).toFixed(2)} km (~${(meters / 1609.34).toFixed(2)} miles)`;
    },
  },
  {
    id: 423,
    title: "Compound Annual Growth Rate (CAGR)",
    category: "Math",
    description: "Calculates the CAGR rate over specified number of years.",
    keywords: ["cagr", "growth rate", "investing"],
    inputType: "text",
    default1: "10000, 25000, 5",
    run: (v) => {
      const [start, end, years] = v.split(",").map(Number);
      if (isNaN(start) || isNaN(end) || isNaN(years)) return "Enter: Initial, Final, Years";
      const cagr = (Math.pow(end / start, 1 / years) - 1) * 100;
      return `CAGR: ${cagr.toFixed(2)}% per year`;
    },
  },
  {
    id: 424,
    title: "Cost of Delay (WSJF) Calculator",
    category: "Math",
    description: "Calculates Weighted Shortest Job First for Agile prioritization.",
    keywords: ["wsjf", "cost of delay", "agile prioritization"],
    inputType: "text",
    default1: "8, 5, 3, 5",
    run: (v) => {
      const [userVal, timeCrit, riskRed, jobSize] = v.split(",").map(Number);
      if (isNaN(userVal) || isNaN(jobSize) || jobSize <= 0) return "Enter: UserValue, TimeCriticality, RiskReduction, JobSize";
      const cod = userVal + timeCrit + riskRed;
      const wsjf = cod / jobSize;
      return `Cost of Delay: ${cod}\nWSJF Score:    ${wsjf.toFixed(2)}`;
    },
  },
  {
    id: 425,
    title: "Sprint Velocity & Capacity Estimator",
    category: "Math",
    description: "Estimates team sprint story points capacity based on developers and days.",
    keywords: ["velocity", "scrum capacity", "sprint points"],
    inputType: "text",
    default1: "5, 10, 6",
    run: (v) => {
      const [devs, days, focus] = v.split(",").map(Number);
      if (isNaN(devs) || isNaN(days)) return "Enter: TeamMembers, SprintDays, HoursPerDay(e.g. 6)";
      const hours = devs * days * (focus || 6);
      return `Available Hours: ${hours} hrs\nApprox Story Points: ~${Math.round(hours / 8)} pts`;
    },
  },
  {
    id: 426,
    title: "Fibonacci Story Points Planning Helper",
    category: "Math",
    description: "Snaps raw task hours into nearest Planning Poker Fibonacci estimate (1, 2, 3, 5, 8, 13, 21).",
    keywords: ["story points", "planning poker", "scrum"],
    inputType: "number",
    default1: "7",
    run: (v) => {
      const h = parseFloat(v) || 0;
      const fib = [1, 2, 3, 5, 8, 13, 21, 34];
      const closest = fib.reduce((prev, curr) => (Math.abs(curr - h) < Math.abs(prev - h) ? curr : prev));
      return `Raw Hours: ${h}\nRecommended Story Point: ${closest}`;
    },
  },
  {
    id: 427,
    title: "Z-Score Normal Distribution Calculator",
    category: "Math",
    description: "Calculates Z = (X - μ) / σ for a normal distribution curve.",
    keywords: ["z-score", "normal distribution", "statistics"],
    inputType: "text",
    default1: "85, 75, 10",
    run: (v) => {
      const [x, mean, std] = v.split(",").map(Number);
      if (isNaN(x) || isNaN(mean) || isNaN(std)) return "Enter: Value(x), Mean(μ), StdDev(σ)";
      const z = (x - mean) / std;
      return `Z-Score: ${z.toFixed(3)} (${z >= 0 ? "+" : ""}${z.toFixed(2)} standard deviations from mean)`;
    },
  },
  {
    id: 428,
    title: "Pearson Correlation Coefficient (r)",
    category: "Math",
    description: "Measures linear correlation between two datasets X and Y.",
    keywords: ["correlation", "pearson r", "statistics"],
    inputType: "text",
    default1: "1,2,3,4,5 | 2,4,5,4,5",
    run: (v) => {
      const parts = v.split("|");
      if (parts.length !== 2) return "Enter: x1,x2,x3 | y1,y2,y3";
      const x = parts[0].split(",").map(Number);
      const y = parts[1].split(",").map(Number);
      const n = Math.min(x.length, y.length);
      const mx = x.reduce((a, b) => a + b, 0) / n;
      const my = y.reduce((a, b) => a + b, 0) / n;
      let num = 0, denX = 0, denY = 0;
      for (let i = 0; i < n; i++) {
        const dx = x[i] - mx;
        const dy = y[i] - my;
        num += dx * dy;
        denX += dx * dx;
        denY += dy * dy;
      }
      const r = num / (Math.sqrt(denX) * Math.sqrt(denY));
      return `Pearson r: ${r.toFixed(4)} (${r > 0.7 ? "Strong positive correlation" : r < -0.7 ? "Strong negative" : "Moderate/Weak"})`;
    },
  },
  {
    id: 429,
    title: "Coin Flip Probability Simulator (N Flips)",
    category: "Math",
    description: "Simulates N coin flips and outputs heads vs tails ratio.",
    keywords: ["coin flip", "heads tails", "probability"],
    inputType: "number",
    default1: "100",
    run: (v) => {
      const n = Math.min(10000, Math.max(1, parseInt(v, 10) || 100));
      let heads = 0;
      for (let i = 0; i < n; i++) if (Math.random() < 0.5) heads++;
      const tails = n - heads;
      return `Total Flips: ${n}\nHeads: ${heads} (${((heads / n) * 100).toFixed(1)}%)\nTails: ${tails} (${((tails / n) * 100).toFixed(1)}%)`;
    },
  },
  {
    id: 430,
    title: "Midpoint of Line Segment",
    category: "Math",
    description: "Calculates coordinate midpoint ((x1+x2)/2, (y1+y2)/2).",
    keywords: ["midpoint", "geometry", "coordinates"],
    inputType: "text",
    default1: "2, 4, 8, 10",
    run: (v) => {
      const [x1, y1, x2, y2] = v.split(",").map(Number);
      if (isNaN(x1) || isNaN(y2)) return "Enter: x1, y1, x2, y2";
      return `Midpoint: (${(x1 + x2) / 2}, ${(y1 + y2) / 2})`;
    },
  },
  {
    id: 431,
    title: "Triangle Area (Heron's Formula)",
    category: "Math",
    description: "Calculates area of triangle from 3 side lengths: A = √(s(s-a)(s-b)(s-c)).",
    keywords: ["herons formula", "triangle area", "sides"],
    inputType: "text",
    default1: "5, 6, 7",
    run: (v) => {
      const [a, b, c] = v.split(",").map(Number);
      if (isNaN(a) || isNaN(b) || isNaN(c)) return "Enter sides: a, b, c";
      const s = (a + b + c) / 2;
      const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      return `Semi-perimeter (s): ${s}\nArea: ${area.toFixed(3)}`;
    },
  },
  {
    id: 432,
    title: "Battery Life & Runtime Estimator",
    category: "Math",
    description: "Calculates operating hours from battery capacity (mAh) and load current (mA).",
    keywords: ["battery life", "mah", "runtime"],
    inputType: "two-inputs",
    label1: "Battery Capacity (mAh)",
    label2: "Device Current Draw (mA)",
    default1: "2500",
    default2: "150",
    run: (mahStr, maStr = "150") => {
      const mah = parseFloat(mahStr) || 1000;
      const ma = parseFloat(maStr) || 100;
      const hours = (mah * 0.85) / ma; // 85% rule of thumb efficiency
      return `Estimated Runtime: ~${hours.toFixed(1)} hours (~${(hours / 24).toFixed(1)} days)`;
    },
  },
  {
    id: 433,
    title: "Capacitors in Series & Parallel",
    category: "Math",
    description: "Calculates total capacitance for series and parallel networks.",
    keywords: ["capacitors", "capacitance", "farads"],
    inputType: "text",
    default1: "10, 20, 30",
    run: (v) => {
      const c = v.split(",").map(Number).filter((n) => n > 0);
      if (!c.length) return "Enter capacitance values in µF";
      const parallel = c.reduce((a, b) => a + b, 0);
      const series = 1 / c.reduce((acc, x) => acc + 1 / x, 0);
      return `Parallel Total: ${parallel.toFixed(2)} µF\nSeries Total:   ${series.toFixed(2)} µF`;
    },
  },
  {
    id: 434,
    title: "Inflation Purchasing Power Calculator",
    category: "Math",
    description: "Estimates future eroded purchasing power given annual inflation rate.",
    keywords: ["inflation", "purchasing power", "cpi"],
    inputType: "text",
    default1: "1000, 3.5, 10",
    run: (v) => {
      const [amt, rate, years] = v.split(",").map(Number);
      if (isNaN(amt) || isNaN(rate)) return "Enter: Amount, InflationRate%, Years";
      const futureCost = amt * Math.pow(1 + rate / 100, years);
      const realValue = amt / Math.pow(1 + rate / 100, years);
      return `Today: $${amt}\nFuture equivalent needed in ${years} yrs: $${futureCost.toFixed(2)}\nPurchasing power of $${amt} in ${years} yrs: $${realValue.toFixed(2)}`;
    },
  },
  {
    id: 435,
    title: "Bandwidth Throughput Calculator (MB/s vs Mbps)",
    category: "Math",
    description: "Converts network megabits to practical disk write megabytes.",
    keywords: ["mbps to mbs", "bandwidth", "throughput"],
    inputType: "number",
    default1: "1000",
    run: (v) => {
      const mbps = parseFloat(v) || 0;
      return `${mbps} Mbps (Megabits) =\n${(mbps / 8).toFixed(2)} MB/s (Megabytes/sec)\n${((mbps / 8) * 3600 / 1024).toFixed(2)} GB per hour`;
    },
  },
  {
    id: 436,
    title: "Bitmask Flag Checker & Setter",
    category: "Math",
    description: "Tests whether bit flags are enabled in bitmask integer.",
    keywords: ["bitmask", "flag checker", "bitwise flag"],
    inputType: "two-inputs",
    label1: "Current Bitmask",
    label2: "Flag to Check (e.g. 4)",
    default1: "7",
    default2: "4",
    run: (maskStr, flagStr = "4") => {
      const mask = parseInt(maskStr, 10) || 0;
      const flag = parseInt(flagStr, 10) || 1;
      const isSet = (mask & flag) === flag;
      return `Mask: ${mask} (binary: ${mask.toString(2)})\nFlag: ${flag} (binary: ${flag.toString(2)})\n\nIs Flag Active? ${isSet ? "YES ✅" : "NO ❌"}\nWith Flag Set:   ${mask | flag}\nWith Flag Unset: ${mask & ~flag}`;
    },
  },
  {
    id: 437,
    title: "Water Intake Daily Calculator",
    category: "Math",
    description: "Estimates recommended daily water consumption based on weight.",
    keywords: ["water intake", "hydration", "health"],
    inputType: "number",
    default1: "70",
    run: (v) => {
      const kg = parseFloat(v) || 70;
      const liters = kg * 0.035;
      return `Weight: ${kg} kg\nRecommended Daily Water: ~${liters.toFixed(2)} Liters (~${Math.round(liters * 4.2)} standard glasses)`;
    },
  },
  {
    id: 438,
    title: "Basal Metabolic Rate (BMR) Estimator",
    category: "Math",
    description: "Calculates baseline resting calories using Mifflin-St Jeor equation.",
    keywords: ["bmr", "calories", "metabolism"],
    inputType: "text",
    default1: "70, 175, 28, male",
    run: (v) => {
      const [w, h, age, gender = "male"] = v.split(",").map((s) => s.trim());
      const weight = parseFloat(w) || 70;
      const height = parseFloat(h) || 175;
      const a = parseFloat(age) || 30;
      const isMale = gender.toLowerCase().includes("m");
      const bmr = 10 * weight + 6.25 * height - 5 * a + (isMale ? 5 : -161);
      return `Estimated BMR: ${Math.round(bmr)} calories/day (Resting burn)`;
    },
  },
  {
    id: 439,
    title: "Resistor Color Code Calculator (4-Band)",
    category: "Math",
    description: "Translates 4 color bands into resistance value in Ohms.",
    keywords: ["resistor color code", "4-band resistor", "electronics"],
    inputType: "text",
    default1: "brown, black, red, gold",
    run: (v) => {
      const colors: Record<string, number> = {
        black: 0, brown: 1, red: 2, orange: 3, yellow: 4,
        green: 5, blue: 6, violet: 7, gray: 8, white: 9,
      };
      const bands = v.toLowerCase().split(",").map((s) => s.trim());
      if (bands.length < 3) return "Enter 3-4 bands: e.g. brown, black, red, gold";
      const d1 = colors[bands[0]] ?? 1;
      const d2 = colors[bands[1]] ?? 0;
      const mul = colors[bands[2]] ?? 2;
      const ohms = (d1 * 10 + d2) * Math.pow(10, mul);
      return `Resistance: ${ohms >= 1000 ? ohms / 1000 + " kΩ" : ohms + " Ω"} ±5%`;
    },
  },
  {
    id: 440,
    title: "Download Speed Benchmark Estimator",
    category: "Math",
    description: "Estimates download time across common connection tiers (10M, 100M, 1G).",
    keywords: ["download speed", "broadband", "gigabit"],
    inputType: "number",
    default1: "50",
    run: (v) => {
      const gb = parseFloat(v) || 1;
      const tiers = [
        ["10 Mbps ADSL", 1.25],
        ["100 Mbps Fast", 12.5],
        ["500 Mbps Fiber", 62.5],
        ["1 Gbps Gigabit", 125],
      ];
      return tiers
        .map(([name, mbS]) => {
          const sec = (gb * 1024) / (mbS as number);
          const min = (sec / 60).toFixed(1);
          return `${name}: ~${min} min (${Math.round(sec)}s)`;
        })
        .join("\n");
    },
  },
  {
    id: 441,
    title: "Distance Between Two 3D Coordinates",
    category: "Math",
    description: "Calculates spatial distance d = √((x2-x1)² + (y2-y1)² + (z2-z1)²).",
    keywords: ["3d distance", "spatial coordinates", "vectors"],
    inputType: "text",
    default1: "1, 2, 3, 4, 6, 8",
    run: (v) => {
      const [x1, y1, z1, x2, y2, z2] = v.split(",").map(Number);
      if (isNaN(z2)) return "Enter: x1, y1, z1, x2, y2, z2";
      const d = Math.hypot(x2 - x1, y2 - y1, z2 - z1);
      return `3D Euclidean Distance: ${d.toFixed(4)}`;
    },
  },
  {
    id: 442,
    title: "3D Vector Cross Product",
    category: "Math",
    description: "Computes perpendicular vector A × B in 3D space.",
    keywords: ["cross product", "3d vector", "normal vector"],
    inputType: "text",
    default1: "1, 0, 0, 0, 1, 0",
    run: (v) => {
      const [x1, y1, z1, x2, y2, z2] = v.split(",").map(Number);
      if (isNaN(z2)) return "Enter: a_x, a_y, a_z, b_x, b_y, b_z";
      const cx = y1 * z2 - z1 * y2;
      const cy = z1 * x2 - x1 * z2;
      const cz = x1 * y2 - y1 * x2;
      return `Cross Product (A × B): (${cx}, ${cy}, ${cz})`;
    },
  },
  {
    id: 443,
    title: "Degrees Minutes Seconds to Decimal Angle",
    category: "Math",
    description: "Converts angle coordinates (D° M' S\") into pure decimal degrees.",
    keywords: ["dms to decimal", "astronomy angle", "surveying"],
    inputType: "text",
    default1: "45, 30, 0",
    run: (v) => {
      const [d, m, s] = v.split(",").map(Number);
      if (isNaN(d)) return "Enter: Degrees, Minutes, Seconds";
      return `Decimal Angle: ${(d + (m || 0) / 60 + (s || 0) / 3600).toFixed(6)}°`;
    },
  },
  {
    id: 444,
    title: "Binomial Probability Calculator",
    category: "Math",
    description: "Computes probability of exactly k successes in n trials with success rate p.",
    keywords: ["binomial", "probability", "statistics"],
    inputType: "text",
    default1: "10, 3, 0.5",
    run: (v) => {
      const [n, k, p] = v.split(",").map(Number);
      if (isNaN(n) || isNaN(k) || isNaN(p)) return "Enter: n(trials), k(successes), p(rate 0-1)";
      function comb(total: number, pick: number): number {
        let res = 1;
        for (let i = 1; i <= pick; i++) res = (res * (total - i + 1)) / i;
        return res;
      }
      const prob = comb(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
      return `P(X = ${k}) = ${(prob * 100).toFixed(2)}% (${prob.toFixed(5)})`;
    },
  },
  {
    id: 445,
    title: "Modular Exponentiation (A^B mod C)",
    category: "Math",
    description: "Calculates large power modulo for RSA cryptography using BigInt.",
    keywords: ["modular exponentiation", "rsa math", "crypto math"],
    inputType: "text",
    default1: "7, 560, 561",
    run: (v) => {
      const [aStr, bStr, cStr] = v.split(",").map((s) => s.trim());
      try {
        let base = BigInt(aStr);
        let exp = BigInt(bStr);
        const mod = BigInt(cStr);
        let res = BigInt(1);
        base = base % mod;
        while (exp > BigInt(0)) {
          if (exp % BigInt(2) === BigInt(1)) res = (res * base) % mod;
          exp = exp / BigInt(2);
          base = (base * base) % mod;
        }
        return `Result: ${res.toString()}`;
      } catch (e: any) {
        return "Enter: Base, Exponent, Modulus (e.g. 7, 560, 561)";
      }
    },
  },
  {
    id: 446,
    title: "Byte Offset & Memory Address Aligner",
    category: "Math",
    description: "Aligns memory address to 4-byte, 8-byte, or 16-byte boundary.",
    keywords: ["memory alignment", "byte offset", "c programming"],
    inputType: "two-inputs",
    label1: "Current Address / Offset",
    label2: "Alignment (e.g. 4, 8, 16)",
    default1: "1025",
    default2: "8",
    run: (addrStr, alignStr = "8") => {
      const addr = parseInt(addrStr, 10) || 0;
      const align = parseInt(alignStr, 10) || 8;
      const aligned = (addr + (align - 1)) & ~(align - 1);
      return `Address: ${addr} (0x${addr.toString(16)})\nAligned to ${align}-byte: ${aligned} (0x${aligned.toString(16)})\nPadding Bytes: ${aligned - addr}`;
    },
  },
  {
    id: 447,
    title: "Hypotenuse & Angle Trigonometry Solver",
    category: "Math",
    description: "Solves opposite and adjacent legs from hypotenuse and angle in degrees.",
    keywords: ["hypotenuse", "sohcahtoa", "right triangle"],
    inputType: "two-inputs",
    label1: "Hypotenuse Length",
    label2: "Angle (degrees)",
    default1: "10",
    default2: "30",
    run: (hypStr, degStr = "30") => {
      const hyp = parseFloat(hypStr) || 0;
      const deg = parseFloat(degStr) || 0;
      const rad = (deg * Math.PI) / 180;
      const opp = hyp * Math.sin(rad);
      const adj = hyp * Math.cos(rad);
      return `Opposite Leg: ${opp.toFixed(3)}\nAdjacent Leg: ${adj.toFixed(3)}`;
    },
  },
  {
    id: 448,
    title: "Parallelogram Area & Perimeter",
    category: "Math",
    description: "Calculates area (base × height) and perimeter of parallelogram.",
    keywords: ["parallelogram", "geometry area"],
    inputType: "text",
    default1: "10, 6, 8",
    run: (v) => {
      const [base, side, height] = v.split(",").map(Number);
      if (isNaN(base) || isNaN(height)) return "Enter: Base, Side, Height";
      return `Area: ${base * height}\nPerimeter: ${2 * (base + (side || base))}`;
    },
  },
  {
    id: 449,
    title: "Trapezoid Area Calculator",
    category: "Math",
    description: "Calculates area = ((a + b) / 2) × h for a trapezoid.",
    keywords: ["trapezoid", "trapezium area", "geometry"],
    inputType: "text",
    default1: "8, 12, 5",
    run: (v) => {
      const [a, b, h] = v.split(",").map(Number);
      if (isNaN(a) || isNaN(b) || isNaN(h)) return "Enter: Base1, Base2, Height";
      return `Trapezoid Area: ${(((a + b) / 2) * h).toFixed(2)}`;
    },
  },
  {
    id: 450,
    title: "Cone Volume & Slant Height",
    category: "Math",
    description: "Calculates cone volume (1/3 π r² h) and slant height s = √(r² + h²).",
    keywords: ["cone volume", "slant height", "geometry"],
    inputType: "two-inputs",
    label1: "Radius (r)",
    label2: "Height (h)",
    default1: "3",
    default2: "4",
    run: (rStr, hStr = "4") => {
      const r = parseFloat(rStr) || 0;
      const h = parseFloat(hStr) || 0;
      const vol = (1 / 3) * Math.PI * r * r * h;
      const slant = Math.hypot(r, h);
      return `Volume: ${vol.toFixed(3)}\nSlant Height: ${slant.toFixed(3)}`;
    },
  },
];
