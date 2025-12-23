import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes"; // <--- 1. Importe as rotas aqui

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// --- ROTAS DA APLICAÇÃO ---
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend Gamer operante! 🚀" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
