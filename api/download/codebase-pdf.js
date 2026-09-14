import path from "path";
import fs from "fs";

export default function handler(_req, res) {
  const pdfPath = path.join(process.cwd(), "public", "CodingSuperHub_Complete_SourceCode.pdf");

  if (!fs.existsSync(pdfPath)) {
    return res.status(404).json({ error: "Codebase PDF not found. Please generate it first." });
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="CodingSuperHub_Complete_SourceCode.pdf"'
  );

  return fs.createReadStream(pdfPath).pipe(res);
}
