const express = require("express");
const sharp = require("sharp");

const app = express();
app.use(express.json({ limit: "10mb" }));

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post("/merge-logo", async (req, res) => {
  try {
    const { baseImage, logoImage } = req.body;

    const baseBuffer = Buffer.from(baseImage, "base64");
    const logoBuffer = Buffer.from(logoImage, "base64");

    // Resize logo relative to base image (important)
    const metadata = await sharp(baseBuffer).metadata();

    const LOGO_WIDTH = Math.floor(metadata.width * 0.25);
    const PADDING = Math.floor(metadata.width * 0.05);

    const resizedLogo = await sharp(logoBuffer)
      .resize(LOGO_WIDTH)
      .toBuffer();

    const output = await sharp(baseBuffer)
      .composite([
        {
          input: resizedLogo,
          top: PADDING,   // top-left corner
          left: PADDING
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
