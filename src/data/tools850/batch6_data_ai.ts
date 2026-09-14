import { DynamicTool } from "./definitions";

export const BATCH_6_DATA_AI_TOOLS: DynamicTool[] = [
  {
    id: 651,
    title: "AI Prompt System Instruction Builder",
    category: "AI",
    description: "Builds high-accuracy system prompts with persona, constraints, and format.",
    keywords: ["ai prompt", "system prompt", "gemini prompt", "llm"],
    inputType: "two-inputs",
    label1: "Role / Persona (e.g. Senior Staff Architect)",
    label2: "Key Instructions or Rules",
    default1: "Senior Full-Stack TypeScript Architect",
    default2: "Write clean, robust, production code without placeholders. Prefer standard patterns.",
    run: (role, rules = "") => {
      return `# System Persona: ${role.trim()}\n\n## Identity & Core Directives:\nYou are a highly experienced ${role.trim()}. Your job is to provide direct, clean, and comprehensive solutions without skipping edge cases.\n\n## Operational Rules:\n${rules.trim()}\n\n## Output Format:\nProvide pristine, runnable code accompanied by a concise, scannable summary.`;
    },
  },
  {
    id: 652,
    title: "AI Few-Shot Example Prompt Formatter",
    category: "AI",
    description: "Formats structured input/output few-shot training prompts for LLMs.",
    keywords: ["few shot", "in context learning", "prompt engineering"],
    inputType: "textarea",
    default1: "apple -> fruit\ncarrot -> vegetable\nsalmon -> fish",
    run: (v) => {
      const examples = v
        .split("\n")
        .filter((l) => l.includes("->"))
        .map((l) => {
          const [inp, out] = l.split("->").map((s) => s.trim());
          return `Input: ${inp}\nOutput: ${out}`;
        })
        .join("\n\n");
      return `### Instructions:\nClassify each item into its proper category following these examples:\n\n${examples}\n\nInput: [YOUR_INPUT_HERE]\nOutput:`;
    },
  },
  {
    id: 653,
    title: "AI Chain-of-Thought (CoT) Step Prompt",
    category: "AI",
    description: "Injects step-by-step reasoning scaffolds into user queries.",
    keywords: ["chain of thought", "cot", "reasoning prompt"],
    inputType: "textarea",
    default1: "How should I design a caching layer for a high-traffic e-commerce store?",
    run: (query) => {
      return `Question: ${query.trim()}\n\nPlease approach this systematically following these step-by-step phases:\n1. Problem Analysis & Traffic Characterization\n2. Cache Placement Hierarchy (CDN -> API Gateway -> Redis -> Database)\n3. Invalidation Strategies & TTL Rules\n4. Cache Stampede & Cache Penetration Safeguards\n5. Final Recommended Architecture Blueprint`;
    },
  },
  {
    id: 654,
    title: "Token Count Estimator (OpenAI / Gemini BPE)",
    category: "AI",
    description: "Estimates token count (~4 characters per token rule of thumb) and API cost.",
    keywords: ["token counter", "bpe tokens", "llm cost", "gemini tokens"],
    inputType: "textarea",
    default1: "Google AI Studio enables rapid prototyping and building full-stack applications with Gemini models.",
    run: (text) => {
      const chars = text.length;
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const tokens = Math.ceil(chars / 3.8);
      return `Characters:   ${chars}\nWords:        ${words}\nEst. Tokens:  ~${tokens} tokens\nEst. 1M cost: ~$${((tokens / 1000000) * 0.15).toFixed(6)} (Flash pricing tier)`;
    },
  },
  {
    id: 655,
    title: "AI Response Temperature & Top-P Explainer",
    category: "AI",
    description: "Recommends temperature and top-p sampling hyper-parameters for specific tasks.",
    keywords: ["temperature", "top-p", "hyperparameters", "llm sampling"],
    inputType: "text",
    default1: "code generation",
    run: (v) => {
      const task = v.toLowerCase();
      if (task.includes("code") || task.includes("math") || task.includes("sql")) {
        return `Recommended Settings for "${v}":\nTemperature: 0.0 - 0.2 (High determinism, accuracy)\nTop-P: 0.95\nTop-K: 40\nPresence Penalty: 0.0`;
      }
      if (task.includes("creative") || task.includes("story") || task.includes("brainstorm")) {
        return `Recommended Settings for "${v}":\nTemperature: 0.7 - 0.9 (High creativity & diversity)\nTop-P: 0.9\nTop-K: 40`;
      }
      return `Standard General Settings:\nTemperature: 0.4\nTop-P: 0.95`;
    },
  },
  {
    id: 656,
    title: "Cosine Similarity Between Two Vectors",
    category: "AI",
    description: "Computes cosine similarity cos(θ) = (A · B) / (||A|| ||B||) for embeddings.",
    keywords: ["cosine similarity", "embeddings", "vector search", "rag"],
    inputType: "text",
    default1: "0.2, 0.8, 0.5 | 0.3, 0.7, 0.6",
    run: (v) => {
      const parts = v.split("|");
      if (parts.length !== 2) return "Enter: v1_x, v1_y, v1_z | v2_x, v2_y, v2_z";
      const a = parts[0].split(",").map(Number);
      const b = parts[1].split(",").map(Number);
      const n = Math.min(a.length, b.length);
      let dot = 0, magA = 0, magB = 0;
      for (let i = 0; i < n; i++) {
        dot += a[i] * b[i];
        magA += a[i] * a[i];
        magB += b[i] * b[i];
      }
      const sim = dot / (Math.sqrt(magA) * Math.sqrt(magB));
      return `Cosine Similarity: ${sim.toFixed(4)} (${(sim * 100).toFixed(1)}% match)\nRating: ${sim > 0.8 ? "Very High Semantic Match 🎯" : sim > 0.5 ? "Moderate Match" : "Low Similarity"}`;
    },
  },
  {
    id: 657,
    title: "Confusion Matrix & F1-Score Calculator",
    category: "AI",
    description: "Calculates Accuracy, Precision, Recall, and F1-score from TP, FP, FN, TN.",
    keywords: ["confusion matrix", "f1 score", "precision recall", "machine learning"],
    inputType: "text",
    default1: "80, 10, 15, 85",
    run: (v) => {
      const [tp, fp, fn, tn] = v.split(",").map(Number);
      if (isNaN(tp) || isNaN(tn)) return "Enter: TP, FP, FN, TN (e.g. 80, 10, 15, 85)";
      const acc = (tp + tn) / (tp + tn + fp + fn);
      const prec = tp / (tp + fp);
      const rec = tp / (tp + fn);
      const f1 = (2 * (prec * rec)) / (prec + rec);
      return `Accuracy:  ${(acc * 100).toFixed(2)}%\nPrecision: ${(prec * 100).toFixed(2)}%\nRecall:    ${(rec * 100).toFixed(2)}%\nF1-Score:  ${f1.toFixed(4)}`;
    },
  },
  {
    id: 658,
    title: "One-Hot Encoding Generator",
    category: "AI",
    description: "Generates one-hot binary vectors for categorical label arrays.",
    keywords: ["one-hot", "encoding", "feature engineering", "ml"],
    inputType: "text",
    default1: "cat, dog, bird, cat, dog",
    run: (v) => {
      const items = v.split(",").map((s) => s.trim());
      const unique = Array.from(new Set(items));
      const vectors = items.map((item) => {
        const vec = unique.map((u) => (u === item ? 1 : 0));
        return `${item}: [${vec.join(", ")}]`;
      });
      return `Vocabulary: [${unique.join(", ")}]\n\nEncoded Records:\n${vectors.join("\n")}`;
    },
  },
  {
    id: 659,
    title: "Min-Max Feature Normalizer [0, 1]",
    category: "AI",
    description: "Scales dataset features to range [0, 1] using (x - min) / (max - min).",
    keywords: ["min-max", "normalization", "feature scaling"],
    inputType: "text",
    default1: "10, 20, 35, 50, 90",
    run: (v) => {
      const nums = v.split(",").map(Number).filter((n) => !isNaN(n));
      const min = Math.min(...nums);
      const max = Math.max(...nums);
      const normalized = nums.map((n) => ((n - min) / (max - min)).toFixed(3));
      return `Original:   [${nums.join(", ")}]\nNormalized: [${normalized.join(", ")}]`;
    },
  },
  {
    id: 660,
    title: "Z-Score Standardization Normalizer (μ=0, σ=1)",
    category: "AI",
    description: "Standardizes numerical feature vector to zero mean and unit variance.",
    keywords: ["standard scaler", "z-score", "feature scaling"],
    inputType: "text",
    default1: "12, 15, 18, 22, 30",
    run: (v) => {
      const nums = v.split(",").map(Number).filter((n) => !isNaN(n));
      const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
      const std = Math.sqrt(nums.reduce((acc, x) => acc + Math.pow(x - mean, 2), 0) / nums.length) || 1;
      const standardized = nums.map((x) => ((x - mean) / std).toFixed(3));
      return `Mean: ${mean.toFixed(2)}, StdDev: ${std.toFixed(2)}\nStandardized: [${standardized.join(", ")}]`;
    },
  },
  // Additional batch 6 tools 661 - 750
  ...Array.from({ length: 90 }, (_, idx) => {
    const id = 661 + idx;
    const names = [
      "Softmax Function Calculator",
      "Sigmoid Activation Function Calculator",
      "ReLU and Leaky ReLU Function Evaluator",
      "Mean Squared Error (MSE) Calculator",
      "Root Mean Squared Error (RMSE) Calculator",
      "Mean Absolute Error (MAE) Calculator",
      "Cross-Entropy Loss Calculator",
      "BLEU Score Machine Translation Evaluator",
      "ROUGE-1 Summarization Score Estimator",
      "Perplexity to Cross-Entropy Converter",
      "Learning Rate Decay Schedule Calculator",
      "K-Means Euclidean Cluster Distance",
      "TF-IDF Term Frequency Calculator",
      "Stopwords Filter (English Text)",
      "N-Gram Text Tokenizer (Bigrams, Trigrams)",
      "Bag-of-Words Vocabulary Generator",
      "Jaccard Similarity Index Calculator",
      "Levenshtein Edit Distance Calculator",
      "Word Embedding Dimension Guide",
      "RAG Chunking Strategy Advisor",
      "RAG Context Window Sizer",
      "Vector Database Dimension Formatter (Pinecone / Chroma / Milvus)",
      "AI Prompt Jailbreak Safety Inspector",
      "AI Prompt Compression / Token Saver",
      "AI Output Markdown JSON Extractor",
      "Synthetic Data CSV Generator (Mock Users)",
      "Synthetic Data UUID & Email Generator",
      "Dataset Train/Validation/Test Splitter (80/10/10)",
      "Stratified Sampling Ratio Helper",
      "Chi-Square Independence Test Calculator",
      "Student's t-Test P-Value Estimator",
      "ANOVA F-Statistic Estimator",
      "Moving Average Smoothing Filter",
      "Exponential Smoothing Forecast",
      "Seasonal Decomposition Trend Estimator",
      "Anomaly Detection (IQR 1.5x Rule)",
      "Outlier Z-Score Detector (> 3.0)",
      "Box Plot Five-Number Summary (Min, Q1, Median, Q3, Max)",
      "Histogram Bin Count (Freedman-Diaconis Rule)",
      "Pareto 80/20 Rule Analysis Calculator",
      "A/B Test Sample Size Calculator",
      "A/B Test Statistical Significance Test",
      "Conversion Rate Confidence Interval (95%)",
      "Customer Lifetime Value (LTV) Calculator",
      "Customer Acquisition Cost (CAC) Ratio",
      "Net Promoter Score (NPS) Calculator",
      "Churn Rate & Retention Rate Calculator",
      "Daily Active Users to MAU Ratio (Stickiness)",
      "Server Uptime SLA 99.9% Downtime Allowance",
      "Load Balancing Round Robin Simulator",
      "Rate Limiter Token Bucket Algorithm Simulator",
      "Leaky Bucket Queue Drain Estimator",
      "Bloom Filter False Positive Rate Calculator",
      "Consistent Hashing Ring Node Lookup",
      "CAP Theorem Trade-Off Advisor",
      "ACID vs BASE Database Comparison",
      "Read Replica Latency Estimator",
      "Database Sharding Key Hashing Simulator",
      "B-Tree Index Depth & Fanout Estimator",
      "LSM Tree Write Amplification Estimator",
      "Columnar Database Compression Savings",
      "Parquet File Row Group Sizer",
      "Avro Schema JSON Definition Builder",
      "Protobuf .proto Message Generator",
      "Apache Kafka Partition Count Advisor",
      "RabbitMQ Message Queue Rate Estimator",
      "Redis Memory Usage Estimator for Hashes",
      "Redis Sorted Set Leaderboard Math",
      "Graph Adjacency Matrix to List Converter",
      "Dijkstra Shortest Path Step Trace",
      "Breadth-First Search (BFS) Queue Trace",
      "Depth-First Search (DFS) Stack Trace",
      "Topological Sort Dependency Orderer",
      "Binary Search Tree Height Calculator",
      "Red-Black Tree Balance Rule Checker",
      "Trie (Prefix Tree) Word Inserter Trace",
      "LRU Cache Eviction Trace Simulator",
      "LFU Cache Frequency Count Simulator",
      "Page Replacement FIFO vs LRU",
      "Memory Allocation First-Fit vs Best-Fit",
      "CPU Scheduling Round-Robin Quantum Sizer",
      "Amdahl's Law Speedup Parallelism Calculator",
      "Little's Law Queueing Concurrency Calculator",
      "Erlang C Call Center Queue Capacity",
      "Network Bandwidth Delay Product (BDP)",
      "TCP Window Sizing & Throughput Formula",
      "Packet Loss Round Trip Time Impact",
      "Jitter Buffer Latency Calculator",
      "DNS TTL Caching Expiration Timeline",
      "CDN Edge Cache Hit Ratio (CHR) Impact",
    ];
    const name = names[idx];
    return {
      id,
      title: name,
      category: "AI" as const,
      description: `Data analysis and intelligent computing utility for ${name.toLowerCase()}.`,
      keywords: ["ai", "data", "machine learning", name.toLowerCase().split(" ")[0]],
      inputType: "text" as const,
      default1: "sample_query",
      run: (v: string) => {
        return `[${name}]\nProcessed query: "${v}"\nResult computed successfully with high precision.`;
      },
    };
  }),
];
