import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to FlimHall API!");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "flimhall-api"
  });
});

export default app;