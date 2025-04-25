import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.resolve(__dirname, "./public")));
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views/"));

app.get("/", (req, res) => {
  res.render("dashboard");
});

app.listen(process.env.PORT, () => {
  console.log(`http server opened on ${process.env.PORT}`);
});
