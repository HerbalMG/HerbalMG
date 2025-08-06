const express = require("express");
const router = express.Router();
const multer = require("multer");
const imagekit = require("../config/imagekit");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cheerio = require("cheerio");

// Multer storage (in-memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload image with organized folders
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Get folder type from query parameter or body
    const folderType = req.query.type || req.body.type || "general";

    // Define folder mapping
    const folderMap = {
      product: "/products",
      brand: "/brands",
      doctor: "/doctors",
      banner: "/banners",
      blog: "/blogs",
      "reference-book": "/reference-books",
      disease: "/diseases",
      category: "/categories",
      user: "/users",
      general: "/general",
    };

    // Get the appropriate folder or default to general
    const folder = folderMap[folderType] || folderMap["general"];

    // Generate a unique filename with timestamp
    const timestamp = Date.now();
    const originalName = req.file.originalname || "upload";
    const fileName = `${folderType}_${timestamp}_${originalName}`;

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: fileName,
      folder: folder,
    });

    res.json({
      message: "Image uploaded successfully",
      imageUrl: result.url,
      fileId: result.fileId,
      filePath: result.filePath,
      folder: folder,
      type: folderType,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

// Add link preview endpoint for Editor.js LinkTool
router.post("/fetchUrl", async (req, res) => {
  const { url } = req.body;
  if (!url)
    return res.status(400).json({ success: 0, error: "No URL provided" });
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const getMeta = (name) =>
      $(`meta[name='${name}']`).attr("content") ||
      $(`meta[property='og:${name}']`).attr("content") ||
      $(`meta[property='twitter:${name}']`).attr("content") ||
      "";
    const title = $("title").text() || getMeta("title");
    const description = getMeta("description");
    const image = getMeta("image");
    res.json({
      success: 1,
      meta: {
        title,
        description,
        image,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: 0,
      error: "Failed to fetch link preview",
      details: err.message,
    });
  }
});

// Get images from specific folder or all images
router.get("/images", async (req, res) => {
  try {
    const folderType = req.query.type;
    const limit = parseInt(req.query.limit) || 30;

    // Define folder mapping
    const folderMap = {
      product: "/products",
      brand: "/brands",
      doctor: "/doctors",
      banner: "/banners",
      blog: "/blogs",
      "reference-book": "/reference-books",
      disease: "/diseases",
      category: "/categories",
      user: "/users",
      general: "/general",
    };

    let result;

    if (folderType && folderMap[folderType]) {
      // Get images from specific folder
      result = await imagekit.listFiles({
        path: folderMap[folderType],
        sort: "DESC_CREATED",
        limit: limit,
      });
    } else {
      // Get all images
      result = await imagekit.listFiles({
        sort: "DESC_CREATED",
        limit: limit,
      });
    }

    res.json({
      images: result,
      folder: folderType ? folderMap[folderType] : "all",
      count: result.length,
    });
  } catch (err) {
    console.error("ImageKit listFiles error:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch images", details: err.message });
  }
});

// Delete image by fileId
router.delete("/delete/:fileId", async (req, res) => {
  const fileId = req.params.fileId; // gets everything after /delete/
  try {
    const result = await imagekit.deleteFile(fileId);
    res.json({ message: "Deleted", result });
  } catch (err) {
    res.status(500).json({ error: "Delete failed", details: err });
  }
});

// Alternative delete by URL
router.post("/delete", async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ error: "Image URL is required" });
  }

  try {
    const extractImageKitFileId = require("../utils/extractImageKitFileId");
    const filePath = extractImageKitFileId(imageUrl);

    if (!filePath) {
      return res.status(400).json({ error: "Invalid ImageKit URL" });
    }

    // List files to find the file by path
    const files = await imagekit.listFiles({
      path: "/" + filePath.split("/").slice(0, -1).join("/"),
      searchQuery: `name="${filePath.split("/").pop().split(".")[0]}"`,
    });

    if (files.length > 0) {
      const result = await imagekit.deleteFile(files[0].fileId);
      res.json({ message: "Deleted", result });
    } else {
      res.status(404).json({ error: "File not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed", details: err.message });
  }
});

module.exports = router;
