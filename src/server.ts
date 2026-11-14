
import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import bcrypt from "bcrypt";
import pg from "pg";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
const sessionSecret = process.env.SESSION_SECRET;

if (!databaseUrl) {
  throw new Error("DATABASE_URL saknas");
}

if (!sessionSecret) {
  throw new Error("SESSION_SECRET saknas");
}

const app = express();
const { Pool } = pg;

const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  app.set("trust proxy", 1);
}

// PostgreSQL connection
const pool = new Pool({
  connectionString: databaseUrl
});


// Middleware
app.use(express.json());

// PostgreSQL session store
const PgSession = connectPgSimple(session);

app.use(
  session({
    store: new PgSession({
      pool,
      createTableIfMissing: true
    }),
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000
}
  })
);

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Alla fält måste fyllas i"
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email`,
      [username, email, passwordHash]
    );

    const user = result.rows[0];

    // Create session after registration
    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).json({
          message: "Kunde inte skapa session"
        });
      }

      req.session.userId = user.id;

      req.session.save((err) => {
        if (err) {
          return res.status(500).json({
            message: "Kunde inte spara session"
          });
        }

        return res.status(201).json({ user });
      });
    });

  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      return res.status(409).json({
        message: "Användarnamnet eller e-postadressen används redan"
      });
    }

    console.error(error);
    res.status(500).json({
      message: "Något gick fel"
    });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `SELECT id, username, email, password_hash
       FROM users
       WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({
        message: "Fel e-post eller lösenord"
      });
    }

    // Prevent session fixation
    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).json({
          message: "Kunde inte skapa session"
        });
      }

      req.session.userId = user.id;

      req.session.save((err) => {
        if (err) {
          return res.status(500).json({
            message: "Kunde inte spara session"
          });
        }

        return res.json({
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          }
        });
      });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Något gick fel"
    });
  }
});

// Check current user
app.get("/api/auth/me", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        user: null
      });
    }

    const result = await pool.query(
      `SELECT id, username, email
       FROM users
       WHERE id = $1`,
      [req.session.userId]
    );

    if (!result.rows[0]) {
      return res.status(401).json({ user: null });
    }

    res.json({
      user: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      message: "Något gick fel"
    });
  }
});

// Logout
app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        message: "Kunde inte logga ut"
      });
    }

    res.clearCookie("connect.sid");
    res.json({ message: "Utloggad" });
  });
});

// Serve React frontend
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendPath = path.resolve(__dirname, "../dist");

app.use(express.static(frontendPath));

// Unknown API routes
app.use("/api", (_req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

// React frontend fallback (Express 5)
app.get("/{*splat}", (_req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});