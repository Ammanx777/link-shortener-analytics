const cors = require("cors");
const crypto = require("crypto");
const validator = require("validator");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  6
);
require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const app = express();
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    req.user = user;
    next();
  });
}

app.use(cors());
app.use(express.json());

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ error: "Valid email required" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.json({ message: "User registered successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.json({ message: "If account exists, reset link sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry: expiry,
      },
    });

    // For now we return token directly (in production send email)
    res.json({
      message: "Reset token generated",
      resetToken,
    });

  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/* 🔹 ADD THE /create ROUTE HERE */

app.post("/create", authenticateToken, async (req, res) => {
  try {
    const { url, customCode, expiresAt } = req.body;

    // Validate URL
    if (!url || !validator.isURL(url, { require_protocol: true })) {
      return res.status(400).json({
        error: "Please provide a valid URL with http or https",
      });
    }

    // Parse expiry date
    let expiryDate = null;
    if (expiresAt) {
      const parsed = new Date(expiresAt);

      if (isNaN(parsed.getTime())) {
        return res.status(400).json({ error: "Invalid expiry date" });
      }

      expiryDate = parsed;
    }

    let shortCode = customCode;
    let newLink;

    // If custom code provided
    if (customCode) {
      const valid = /^[a-zA-Z0-9_-]{3,20}$/.test(customCode);

      if (!valid) {
        return res.status(400).json({
          error: "Custom code must be 3–20 characters and alphanumeric only",
        });
      }

      const existing = await prisma.link.findUnique({
        where: { shortCode: customCode },
      });

      if (existing) {
        return res.status(400).json({
          error: "Custom code already taken",
        });
      }

      newLink = await prisma.link.create({
        data: {
          original: url,
          shortCode,
          expiresAt: expiryDate,
          userId: req.user.userId,
        },
      });

    } else {
      // Generate random code
      for (let i = 0; i < 5; i++) {
        try {
          shortCode = nanoid(6);

          newLink = await prisma.link.create({
            data: {
              original: url,
              shortCode,
              expiresAt: expiryDate,
              userId: req.user.userId,
            },
          });

          break;
        } catch (error) {
          if (error.code === "P2002") continue;
          throw error;
        }
      }
    }

    if (!newLink) {
      return res.status(500).json({
        error: "Failed to generate unique short code",
      });
    }

    res.json({
      shortUrl: `http://localhost:5000/${shortCode}`,
      data: newLink,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/analytics/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;

    const link = await prisma.link.findUnique({
      where: { shortCode },
      include: {
        clicksData: true,
      },
    });

    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    res.json(link);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/links", authenticateToken, async (req, res) => {
  try {
    const links = await prisma.link.findMany({
  where: { userId: req.user.userId },
  orderBy: { createdAt: "desc" },
});

    res.json(links);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* 🔹 ADD REDIRECT ROUTE HERE */

app.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;

    const link = await prisma.link.findUnique({
      where: { shortCode },
    });

    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    if (link.expiresAt && new Date() > link.expiresAt) {
  return res.status(410).json({ error: "Link has expired" });
}

    // Store analytics data
    await prisma.click.create({
      data: {
        linkId: link.id,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        referrer: req.headers["referer"] || null,
      },
    });

    // Increment total clicks counter
    await prisma.link.update({
      where: { id: link.id },
      data: {
        clicks: { increment: 1 },
      },
    });

    return res.redirect(link.original);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/links/:id", authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const link = await prisma.link.findUnique({
      where: { id },
    });

    if (!link || link.userId !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await prisma.link.delete({
      where: { id },
    });

    res.json({ message: "Link deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete link" });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});