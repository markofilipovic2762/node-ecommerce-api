import { Router } from "express";
import { uploadProductImage } from "./uploadController";

const router = Router();

router.post("/upload-image", uploadProductImage);

export default router;
