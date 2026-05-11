
import dotenv from "dotenv";
dotenv.config();

// ---------- Imports ----------
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import connectDb from "./db/connection1.js";
import { app as socketApp, server } from "./socket/socket.js";

// ---------- Express app ----------
const app = socketApp;
const PORT = process.env.PORT || 5111;

// ---------- Database connection ----------
connectDb();

// ---------- CORS configuration ----------
const isProd = process.env.NODE_ENV === "production";
const productionURL =
  process.env.CLIENT_URL || "https://chatapp-yr2n.onrender.com";

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("🌐 Incoming Origin:", origin);

      // Allow Postman / mobile apps / requests with no origin
      if (!origin) {
        return callback(null, true);
      }

      // Allow localhost ports for local multi-tab/multi-browser testing
      if (/^http:\/\/localhost:\d+$/.test(origin)) {
        return callback(null, true);
      }

      // Allow deployed frontend in production
      if (origin === productionURL) {
        return callback(null, true);
      }

      console.error("❌ CORS blocked for:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ---------- Middleware ----------
app.use(express.json());
app.use(cookieParser());

// ---------- Static uploads ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------- API routes ----------
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";

app.use("/api/v1/users", userRoute);
app.use("/api/v1/message", messageRoute);

// ---------- Error middleware ----------
import { errorMiddlware } from "./middlewares/errorMiddlware.js";
app.use(errorMiddlware);

// ---------- Serve React frontend ----------
const frontendPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ---------- Start server ----------
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`🌍 Mode: ${process.env.NODE_ENV || "development"}`);
  console.log(`✅ Production URL: ${productionURL}`);
});
