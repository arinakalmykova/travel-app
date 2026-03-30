import express from "express";
import cors from "cors";
import multer from "multer";
import { getRoutes, addRoute, updateRoute, deleteRoute,addPoint, updatePoint, deletePoint } from "./routes.js";
import path from 'path';
import { fileURLToPath } from "url";

const PORT = 3001;
const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname,'uploads')));

const storageRoutes = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/routes");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const storagePoints = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/points");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadRoute = multer({ storage: storageRoutes });
const uploadPoint = multer({ storage: storagePoints });

app.get("/routes", (req, res) => {
  res.json(getRoutes());
});

app.post("/routes", uploadRoute.single("image"), (req, res) => {
  const { title, description } = req.body;

  const newRoute = addRoute({
    title,
    description,
    coverImage: req.file ? req.file.filename : null
  });

  res.status(201).json(newRoute);
});

app.post("/routes/:id/points", uploadPoint.single("image"), (req, res) => {
  const { title, description } = req.body;

  const newPoint = addPoint(Number(req.params.id), {
    title,
    description,
    image: req.file ? req.file.filename : null
  });

  if (!newPoint) {
    return res.status(404).json({ message: "Маршрут не найден" });
  }

  res.status(201).json(newPoint);
});

app.put("/routes/:id", (req, res) => {
  const updated = updateRoute(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Маршрут не найден" });
  res.json(updated);
});

app.delete("/routes/:id", (req, res) => {
  deleteRoute(req.params.id);
  res.json({ sucess: true });
});

app.put("/routes/:routeId/points/:pointId", (req, res) => {
  const routeId = Number(req.params.routeId);
  const pointId = Number(req.params.pointId);
  const data = req.body;

  const point = updatePoint(routeId,pointId,data);
  res.json(point);
});

app.delete("/routes/:routeId/points/:pointId", (req, res) => {
  const routeId = Number(req.params.routeId);
  const pointId = Number(req.params.pointId);

  const point = deletePoint(routeId,pointId) ;
  if (!point) return res.status(404).send("Point not found");

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
