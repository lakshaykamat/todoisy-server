import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { HttpStatusCode, getDirectoryName } from "../lib/index.js";

const router = express.Router();
const __fileName = fileURLToPath(import.meta.url);
const logDirectory = path.join(getDirectoryName(__fileName), "../../logs");

router.get("/logs", async (req: Request, res: Response) => {
  fs.readdir(logDirectory, (err, files) => {
    if (err) {
      return res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: "Unable to scan log directory" });
    }
    res.json({ files });
  });
});

// Route to download or show content of a specific log file
router.get("/logs/:filename", (req: Request, res: Response) => {
  const { filename } = req.params;
  const filePath = path.join(logDirectory, filename);

  if (fs.existsSync(filePath)) {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res
          .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
          .json({ error: "Error reading the file" });
      } else {
        const userAgent = req.headers["user-agent"];

        // Check if the request is from a browser
        if (
          userAgent &&
          (userAgent.includes("Mozilla") ||
            userAgent.includes("Chrome") ||
            userAgent.includes("Safari"))
        ) {
          res.setHeader(
            "Content-Disposition",
            `attachment; filename="${filename}"`
          );
        } else {
          res.setHeader("Content-Type", "text/plain");
        }

        res.send(data);
      }
    });
  } else {
    res.status(HttpStatusCode.NOT_FOUND).json({ error: "File not found" });
  }
});
export default router;
