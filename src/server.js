import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import qrcode from "qrcode";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(dirname, "..", "public")));

app.get("/qr", async (req, res) => {
  const text = String(req.query.text || "").trim();
  if (!text) {
    return res.status(400).json({ error: "text is required" });
  }

  const size = Math.min(Math.max(Number(req.query.size) || 300, 100), 1000);
  const dark = String(req.query.dark || "#17181c");
  const light = String(req.query.light || "#ffffff");

  try {
    const png = await qrcode.toBuffer(text, {
      width: size,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark, light },
    });
    res.type("png").send(png);
  } catch {
    res.status(400).json({ error: "could not generate a qr for that input" });
  }
});

if (!process.env.TEST_MODE) {
  app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
  });
}

export { app };