require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

/* 🔹 ADD THE /create ROUTE HERE */

app.post("/create", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const shortCode = Math.random().toString(36).substring(2, 8);

    const newLink = await prisma.link.create({
      data: {
        original: url,
        shortCode,
      },
    });

    res.json({
      shortUrl: `http://localhost:5000/${shortCode}`,
      data: newLink,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/analytics/:code", async (req, res) => {
  try {
    const { code } = req.params;

    const link = await prisma.link.findUnique({
      where: { shortCode: code },
    });

    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    res.json({
      shortCode: link.shortCode,
      original: link.original,
      clicks: link.clicks,
      createdAt: link.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/* 🔹 ADD REDIRECT ROUTE HERE */

app.get("/:code", async (req, res) => {
  const { code } = req.params;

  const link = await prisma.link.findUnique({
    where: { shortCode: code },
  });

  if (!link) {
    return res.status(404).json({ error: "Link not found" });
  }

  await prisma.link.update({
    where: { shortCode: code },
    data: { clicks: { increment: 1 } },
  });

  res.redirect(link.original);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});