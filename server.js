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
    const LOGO_WIDTH = 150; // ~15% of 1024 → clean proportion

    const resizedLogo = await sharp(logoBuffer)
      .resize(LOGO_WIDTH)
      .toBuffer();

    const PADDING = 20; // margin from edges

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
