const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const SOURCE_FILES = [
  { path: "metadata.json", desc: "AI Studio app metadata & capabilities" },
  { path: "package.json", desc: "Project manifest & dependencies" },
  { path: "tsconfig.json", desc: "TypeScript compiler configuration" },
  { path: "vite.config.ts", desc: "Vite build & server plugins setup" },
  { path: ".env.example", desc: "Environment variables documentation" },
  { path: "index.html", desc: "HTML5 application root entry point" },
  { path: "server.ts", desc: "Express + Vite backend & Gemini AI endpoints" },
  { path: "src/main.tsx", desc: "React DOM client mount point" },
  { path: "src/types.ts", desc: "Global TypeScript interfaces & enums" },
  { path: "src/index.css", desc: "Tailwind CSS imports & custom styles" },
  { path: "src/App.tsx", desc: "Master Application layout & state orchestrator" },
  { path: "src/components/Navbar.tsx", desc: "Navigation, search, category filter bar" },
  { path: "src/components/CodeEditor.tsx", desc: "Multi-language editor, runner & sandbox" },
  { path: "src/components/AIAssistant.tsx", desc: "AI Copilot chat with Markdown & Code Apply" },
  { path: "src/components/LanguageHub.tsx", desc: "45+ Programming languages explorer & starter cards" },
  { path: "src/components/ToolCard.tsx", desc: "Universal reusable tool container with copy/clear" },
  { path: "src/components/ShortcutsModal.tsx", desc: "Keyboard shortcuts cheat sheet modal" },
  { path: "src/data/languages.ts", desc: "Full catalog & starters for 45+ languages" },
  { path: "src/data/toolsMetadata.ts", desc: "Registry & metadata of all 150 dev tools" },
  { path: "src/utils/helpers.ts", desc: "Conversion, formatting, math & string utilities" },
  { path: "src/utils/crypto.ts", desc: "Hash, cipher & encoding cryptographic helpers" },
  { path: "src/components/tools/ToolsTextFormat.tsx", desc: "Tools #2 - #20 (Text, Formatting, Conversion, Hashes)" },
  { path: "src/components/tools/ToolsMathCalculators.tsx", desc: "Tools #21 - #50 (Math, Calculations, Financial, Conversion)" },
  { path: "src/components/tools/ToolsDataWeb.tsx", desc: "Tools #51 - #100 (Data, Web, CSS, JSON, SEO, Dev Cheat Sheets)" },
  { path: "src/components/tools/ToolsAdvancedDev.tsx", desc: "Tools #101 - #150 (Diff, Ciphers, Crypto, CSS & JS Snippets)" },
];

function generateCodePDF(outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 40, bottom: 40, left: 36, right: 36 },
      bufferPages: true,
      autoFirstPage: false,
    });

    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    // ==========================================
    // 1. COVER PAGE
    // ==========================================
    doc.addPage();
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // Background accent header bar
    doc.rect(0, 0, pageWidth, 180).fill("#0f172a");

    // Title & Brand
    doc.fillColor("#60a5fa").font("Helvetica-Bold").fontSize(13).text("CODING SUPER HUB", 36, 45, { characterSpacing: 2 });
    doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(26).text("Complete Source Codebase", 36, 68);
    doc.fillColor("#94a3b8").font("Helvetica").fontSize(11).text("Complete, Unabridged Technical Specification & Source Implementation", 36, 105);
    doc.fillColor("#38bdf8").font("Helvetica-Bold").fontSize(10).text("150 DEVELOPER TOOLS  •  45+ LANGUAGES  •  FULL-STACK GEMINI AI RUNNER", 36, 125);

    // Metadata Card
    const metaTop = 210;
    doc.roundedRect(36, metaTop, pageWidth - 72, 130, 8).strokeColor("#cbd5e1").lineWidth(1).stroke();
    doc.rect(36, metaTop, pageWidth - 72, 28).fill("#f1f5f9");

    doc.fillColor("#1e293b").font("Helvetica-Bold").fontSize(11).text("SYSTEM & ARCHITECTURE SPECIFICATION", 48, metaTop + 8);

    const leftCol = 48;
    const rightCol = 300;
    let rowY = metaTop + 38;

    doc.font("Helvetica-Bold").fontSize(9).fillColor("#475569").text("Application:", leftCol, rowY);
    doc.font("Helvetica").fillColor("#0f172a").text("Coding Super Hub (Online Multi-Language Hub)", leftCol + 70, rowY);

    doc.font("Helvetica-Bold").fillColor("#475569").text("Generated Date:", rightCol, rowY);
    doc.font("Helvetica").fillColor("#0f172a").text(new Date().toLocaleString(), rightCol + 85, rowY);

    rowY += 18;
    doc.font("Helvetica-Bold").fillColor("#475569").text("Architecture:", leftCol, rowY);
    doc.font("Helvetica").fillColor("#0f172a").text("Full-Stack (React 19 + Vite 6 + Express 4 + Gemini AI)", leftCol + 70, rowY);

    doc.font("Helvetica-Bold").fillColor("#475569").text("Total Files:", rightCol, rowY);
    doc.font("Helvetica").fillColor("#0f172a").text(`${SOURCE_FILES.length} Files`, rightCol + 85, rowY);

    rowY += 18;
    doc.font("Helvetica-Bold").fillColor("#475569").text("Included Tools:", leftCol, rowY);
    doc.font("Helvetica").fillColor("#0f172a").text("150 Fully Interactive Utilities (Tools #1 - #150)", leftCol + 70, rowY);

    doc.font("Helvetica-Bold").fillColor("#475569").text("AI Runtime:", rightCol, rowY);
    doc.font("Helvetica").fillColor("#0f172a").text("Google GenAI (gemini-3.8-flash)", rightCol + 85, rowY);

    rowY += 18;
    doc.font("Helvetica-Bold").fillColor("#475569").text("Styling Engine:", leftCol, rowY);
    doc.font("Helvetica").fillColor("#0f172a").text("Tailwind CSS v4 with Light/Dark Theme Support", leftCol + 70, rowY);

    doc.font("Helvetica-Bold").fillColor("#475569").text("Export Type:", rightCol, rowY);
    doc.font("Helvetica").fillColor("#0f172a").text("Complete Unabridged PDF", rightCol + 85, rowY);

    // Summary of modules
    let listY = metaTop + 155;
    doc.font("Helvetica-Bold").fontSize(13).fillColor("#0f172a").text("TABLE OF CONTENTS / MANIFEST", 36, listY);
    listY += 20;

    // Draw file index table
    doc.rect(36, listY, pageWidth - 72, 20).fill("#f8fafc");
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#334155");
    doc.text("#", 44, listY + 5);
    doc.text("File Path", 65, listY + 5);
    doc.text("Module Description", 230, listY + 5);
    doc.text("Lines", pageWidth - 75, listY + 5);

    listY += 22;

    SOURCE_FILES.forEach((f, idx) => {
      if (listY > pageHeight - 60) {
        doc.addPage();
        listY = 45;
      }
      const fullPath = path.resolve(f.path);
      let lineCount = 0;
      if (fs.existsSync(fullPath)) {
        lineCount = fs.readFileSync(fullPath, "utf8").split("\n").length;
      }

      if (idx % 2 === 1) {
        doc.rect(36, listY - 2, pageWidth - 72, 16).fill("#f8fafc");
      }

      doc.font("Helvetica-Bold").fontSize(8).fillColor("#2563eb").text(String(idx + 1), 44, listY);
      doc.font("Courier-Bold").fontSize(8).fillColor("#0f172a").text(f.path, 65, listY);
      doc.font("Helvetica").fontSize(7.5).fillColor("#475569").text(f.desc, 230, listY);
      doc.font("Courier").fontSize(8).fillColor("#64748b").text(String(lineCount), pageWidth - 75, listY);

      listY += 16;
    });

    // ==========================================
    // 2. SOURCE CODE FILES
    // ==========================================
    SOURCE_FILES.forEach((f, fileIdx) => {
      const fullPath = path.resolve(f.path);
      if (!fs.existsSync(fullPath)) return;

      const content = fs.readFileSync(fullPath, "utf8");
      const lines = content.split("\n");

      doc.addPage();
      let currentY = 40;

      // File header banner
      doc.roundedRect(36, currentY, pageWidth - 72, 40, 6).fill("#0f172a");
      doc.fillColor("#60a5fa").font("Helvetica-Bold").fontSize(9).text(`FILE [${fileIdx + 1}/${SOURCE_FILES.length}]`, 48, currentY + 8);
      doc.fillColor("#ffffff").font("Courier-Bold").fontSize(11).text(f.path, 48, currentY + 22);

      doc.fillColor("#94a3b8").font("Helvetica").fontSize(8.5).text(
        `${lines.length} lines  •  ${(content.length / 1024).toFixed(1)} KB  •  ${f.desc}`,
        240,
        currentY + 23
      );

      currentY += 50;

      // Print lines with line numbers
      const lineHeight = 10.5;
      const fontSize = 7;
      const maxContentHeight = pageHeight - 50;

      lines.forEach((lineText, lineIdx) => {
        if (currentY + lineHeight > maxContentHeight) {
          doc.addPage();
          currentY = 40;

          // Repeat subtle mini-header on continued page
          doc.rect(36, currentY, pageWidth - 72, 16).fill("#f1f5f9");
          doc.font("Courier-Bold").fontSize(7.5).fillColor("#475569").text(`${f.path} (continued)`, 44, currentY + 4);
          currentY += 22;
        }

        // Line number gutter background
        doc.rect(36, currentY - 1, 30, lineHeight).fill("#f8fafc");

        // Line number
        doc.font("Courier").fontSize(fontSize).fillColor("#94a3b8").text(String(lineIdx + 1), 38, currentY, {
          width: 24,
          align: "right",
        });

        // Code text (truncate/wrap safely)
        // Clean line text for Courier font rendering
        const safeLine = lineText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").slice(0, 140);
        doc.font("Courier").fontSize(fontSize).fillColor("#0f172a").text(safeLine, 72, currentY, {
          width: pageWidth - 108,
          lineBreak: false,
        });

        currentY += lineHeight;
      });
    });

    // ==========================================
    // 3. PAGE NUMBERING FOOTERS
    // ==========================================
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);

      if (i > 0) {
        // Top running header
        doc.strokeColor("#e2e8f0").lineWidth(0.5).moveTo(36, 26).lineTo(pageWidth - 36, 26).stroke();
        doc.font("Helvetica").fontSize(7).fillColor("#94a3b8").text("Coding Super Hub — Complete Source Codebase", 36, 17);
        doc.font("Helvetica-Bold").fontSize(7).fillColor("#64748b").text("150 Tools & Multi-Language Engine", pageWidth - 180, 17, { align: "right" });
      }

      // Bottom running footer
      doc.strokeColor("#e2e8f0").lineWidth(0.5).moveTo(36, pageHeight - 26).lineTo(pageWidth - 36, pageHeight - 26).stroke();
      doc.font("Helvetica").fontSize(7).fillColor("#94a3b8").text(`Generated: ${new Date().toISOString().split("T")[0]} | React 19 + Vite 6 + Express + Gemini AI`, 36, pageHeight - 20);
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#475569").text(`Page ${i + 1} of ${range.count}`, pageWidth - 100, pageHeight - 20, { align: "right" });
    }

    doc.end();

    writeStream.on("finish", () => {
      resolve({ totalPages: range.count, path: outputPath });
    });

    writeStream.on("error", (err) => {
      reject(err);
    });
  });
}

const outTarget = path.join(process.cwd(), "public", "CodingSuperHub_Complete_SourceCode.pdf");
console.log("Generating complete code PDF at:", outTarget);

generateCodePDF(outTarget)
  .then((res) => {
    const stat = fs.statSync(res.path);
    console.log(`✅ Success! Generated ${res.totalPages} pages.`);
    console.log(`File size: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
  })
  .catch((err) => {
    console.error("❌ Failed to generate PDF:", err);
    process.exit(1);
  });
