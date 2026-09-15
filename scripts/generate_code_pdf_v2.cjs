const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const ROOT_FILES = [
  "metadata.json",
  "package.json",
  "tsconfig.json",
  "vite.config.ts",
  "vercel.json",
  "render.yaml",
  ".env.example",
  "index.html",
  "README.md",
  "server.ts",
];

const SOURCE_DIRS = ["api", "scripts", "src", ".github/workflows"];
const ALLOWED_EXTENSIONS = new Set([
  ".cjs", ".js", ".jsx", ".mjs", ".ts", ".tsx", ".css", ".html",
  ".json", ".md", ".yml", ".yaml",
]);

function collectFiles() {
  const files = new Set();
  for (const file of ROOT_FILES) {
    if (fs.existsSync(file) && fs.statSync(file).isFile()) files.add(file);
  }

  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!["node_modules", "dist", ".git"].includes(entry.name)) walk(full);
      } else if (ALLOWED_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        files.add(full.replaceAll(path.sep, "/"));
      }
    }
  };

  SOURCE_DIRS.forEach(walk);
  return [...files].sort();
}

function generateCodePDF(outputPath) {
  const files = collectFiles();
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 40, bottom: 40, left: 36, right: 36 },
      bufferPages: true,
      autoFirstPage: false,
    });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    doc.addPage();
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    doc.rect(0, 0, pageWidth, 175).fill("#0f172a");
    doc.fillColor("#60a5fa").font("Helvetica-Bold").fontSize(13).text("CODING SUPER HUB", 36, 45, { characterSpacing: 2 });
    doc.fillColor("#fff").font("Helvetica-Bold").fontSize(25).text("Current Source Codebase", 36, 68);
    doc.fillColor("#94a3b8").font("Helvetica").fontSize(10.5).text("Automatically generated from the source tree during the production build", 36, 105);
    doc.fillColor("#38bdf8").font("Helvetica-Bold").fontSize(9.5).text(`${files.length} SOURCE FILES  •  1,000-TOOL HUB  •  GEMINI AI INTEGRATION`, 36, 125);

    const metaTop = 205;
    doc.roundedRect(36, metaTop, pageWidth - 72, 110, 8).strokeColor("#cbd5e1").lineWidth(1).stroke();
    doc.rect(36, metaTop, pageWidth - 72, 28).fill("#f1f5f9");
    doc.fillColor("#1e293b").font("Helvetica-Bold").fontSize(11).text("SOURCE SNAPSHOT", 48, metaTop + 8);
    doc.font("Helvetica").fontSize(9).fillColor("#0f172a");
    doc.text(`Files included: ${files.length}`, 48, metaTop + 40);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 48, metaTop + 58);
    doc.text("Runtime: React + Vite + Vercel API + Gemini", 48, metaTop + 76);

    let y = metaTop + 140;
    doc.font("Helvetica-Bold").fontSize(13).fillColor("#0f172a").text("FILE MANIFEST", 36, y);
    y += 20;
    for (const [idx, file] of files.entries()) {
      if (y > pageHeight - 55) { doc.addPage(); y = 45; }
      doc.font("Courier-Bold").fontSize(7.5).fillColor("#2563eb").text(String(idx + 1), 40, y);
      doc.font("Courier").fontSize(7.5).fillColor("#0f172a").text(file, 62, y, { width: pageWidth - 135, lineBreak: false });
      y += 13;
    }

    for (const [fileIdx, file] of files.entries()) {
      const content = fs.readFileSync(file, "utf8");
      const lines = content.split("\n");
      doc.addPage();
      let currentY = 40;
      doc.roundedRect(36, currentY, pageWidth - 72, 40, 6).fill("#0f172a");
      doc.fillColor("#60a5fa").font("Helvetica-Bold").fontSize(8.5).text(`FILE [${fileIdx + 1}/${files.length}]`, 48, currentY + 8);
      doc.fillColor("#fff").font("Courier-Bold").fontSize(10.5).text(file, 48, currentY + 22);
      currentY += 50;

      const lineHeight = 10.5;
      for (const [lineIdx, raw] of lines.entries()) {
        if (currentY + lineHeight > pageHeight - 40) {
          doc.addPage();
          currentY = 40;
          doc.rect(36, currentY, pageWidth - 72, 16).fill("#f1f5f9");
          doc.font("Courier-Bold").fontSize(7.5).fillColor("#475569").text(`${file} (continued)`, 44, currentY + 4);
          currentY += 22;
        }
        doc.rect(36, currentY - 1, 30, lineHeight).fill("#f8fafc");
        doc.font("Courier").fontSize(6.8).fillColor("#94a3b8").text(String(lineIdx + 1), 38, currentY, { width: 24, align: "right" });
        const safeLine = raw.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").slice(0, 150);
        doc.font("Courier").fontSize(6.8).fillColor("#0f172a").text(safeLine, 72, currentY, { width: pageWidth - 108, lineBreak: false });
        currentY += lineHeight;
      }
    }

    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      if (i > 0) {
        doc.strokeColor("#e2e8f0").lineWidth(0.5).moveTo(36, 26).lineTo(pageWidth - 36, 26).stroke();
        doc.font("Helvetica").fontSize(7).fillColor("#94a3b8").text("Coding Super Hub — Current Source Codebase", 36, 17);
      }
      doc.strokeColor("#e2e8f0").lineWidth(0.5).moveTo(36, pageHeight - 26).lineTo(pageWidth - 36, pageHeight - 26).stroke();
      doc.font("Helvetica").fontSize(7).fillColor("#94a3b8").text(`Generated ${new Date().toISOString().split("T")[0]}`, 36, pageHeight - 20);
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#475569").text(`Page ${i + 1} of ${range.count}`, pageWidth - 100, pageHeight - 20, { align: "right" });
    }

    doc.end();
    stream.on("finish", () => resolve({ totalPages: range.count, files: files.length, path: outputPath }));
    stream.on("error", reject);
  });
}

const output = path.join(process.cwd(), "public", "CodingSuperHub_Complete_SourceCode.pdf");
fs.mkdirSync(path.dirname(output), { recursive: true });
console.log("Generating current codebase PDF:", output);
generateCodePDF(output)
  .then((result) => {
    const size = fs.statSync(result.path).size;
    console.log(`Success: ${result.files} files, ${result.totalPages} pages, ${(size / 1024 / 1024).toFixed(2)} MB`);
  })
  .catch((error) => {
    console.error("Failed to generate codebase PDF:", error);
    process.exit(1);
  });
