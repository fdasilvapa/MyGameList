import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import gameRoutes from "./routes/games.routes";
import libraryRoutes from "./routes/library.routes";
import platformsRoutes from './routes/platforms.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// --- ROTAS DA APLICAÇÃO ---
app.use("/auth", authRoutes);
app.use("/games", gameRoutes);
app.use("/library", libraryRoutes);
app.use('/platforms', platformsRoutes);


app.get("/", (req, res) => {
  res.json({ message: "Backend Gamer operante! 🚀" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
