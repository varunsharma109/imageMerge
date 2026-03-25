import express from "express";
import sharp from "sharp";

const app = express();
app.use(express.json({ limit: "10mb" }));

app.post("/merge-logo", async (req, res) => {
  try {
    const { baseImage, logoImage } = req.body;

    const baseBuffer = Buffer.from(baseImage, "base64");
    const logoBuffer = Buffer.from(logoImage, "base64");

    const resizedLogo = await sharp(logoBuffer)
      .resize(200)
      .toBuffer();

    const output = await sharp(baseBuffer)
      .composite([
        {
          input: resizedLogo,
          top: 20,
          left: 20
        }
      ])
      .png()
      .toBuffer();

    res.json({
      image: output.toString("base64")
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running"));
