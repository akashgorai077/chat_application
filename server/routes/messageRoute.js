import express from "express";
import { isAuthenticated } from "../middlewares/authMiddlware.js";
import { sendMessage, getMessage, sendMediaMessage } from "../controllers/messageController.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { errorHandler } from "../utilities/errorHandlerUtility.js";
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
});

router.post("/send/:receiverId", isAuthenticated, sendMessage);
router.post(
  "/send-media/:receiverId",
  isAuthenticated,
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (!err) return next();
      const message =
        err?.code === "LIMIT_FILE_SIZE"
          ? "File too large (max 25MB)"
          : err?.message || "Unable to upload file";
      return next(new errorHandler(message, 400));
    });
  },
  sendMediaMessage
);
router.get("/get-messages/:otherParticipantId", isAuthenticated, getMessage);

export default router;
