import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import qrcode from "qrcode";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(dirname, "..", "public")));

const VALID_EC = ["L", "M", "Q", "H"];

app.get("/qr", async (req, res) => {
  const text = String(req.query.text || "").trim();
  if (!text) {
    return res.status(400).json({ error: "text is required" });
  }

  const size = Math.min(Math.max(Number(req.query.size) || 300, 100), 1000);
  const dark = String(req.query.dark || "#17181c");
  const light = String(req.query.light || "#ffffff");
  const format = req.query.format === "svg" ? "svg" : "png";
  const ec = VALID_EC.includes(String(req.query.ec).toUpperCase()) ? String(req.query.ec).toUpperCase() : "M";
  const options = {
    margin: 2,
    errorCorrectionLevel: ec,
    color: { dark, light },
  };

  try {
    if (format === "svg") {
      const svg = await qrcode.toString(text, { ...options, type: "svg", width: size });
      return res.type("svg").send(svg);
    }
    const png = await qrcode.toBuffer(text, { ...options, width: size });
    res.type("png").send(png);
  } catch {
    res.status(400).json({ error: "could not generate a qr for that input" });
  }
});

const runDirect = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

export default app;

export { app };

if (runDirect) {
  app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
  });
}