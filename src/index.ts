import express, { json, urlencoded } from "express";
import productsRouter from "./routes/products";
import uploadRouter from "./routes/upload";
import categoriesRouter from "./routes/categories";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);

app.listen(3000, () => {
  console.log("Aplikacija radi na portu: 3000!");
});
