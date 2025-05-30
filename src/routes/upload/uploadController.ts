import multer from "multer";
import { Request, Response } from "express";

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

export const uploadProductImage = [
  upload.single("image"),
  (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).send("No file uploaded");
    }
    const file = req.file as Express.Multer.File | undefined;
    res.status(200).json({ filename: file?.filename, path: file?.path });
  },
];
