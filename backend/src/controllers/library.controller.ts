import { Request, Response } from "express";
import { prisma } from "../config/db";

export class LibraryController {
  // GET /library
  static async getLibrary(req: Request, res: Response) {
    try {
      const userId = 1;

      const library = await prisma.gameStatus.findMany({
        where: { userId: userId },
        include: {
          game: true,
        },
      });

      return res.status(200).json(library);
    } catch (error) {
      console.error("Erro na biblioteca:", error);
      return res.status(500).json({ error: "Erro ao carregar biblioteca." });
    }
  }

  // POST /library
  static async addGame(req: Request, res: Response) {
    try {
      const userId = 1;
      const { gameId, status, hoursPlayed } = req.body;

      if (!gameId) {
        return res.status(400).json({ error: "ID do jogo é obrigatório." });
      }

      const game = await prisma.game.findUnique({
        where: { id: Number(gameId) },
      });
      if (!game) {
        return res.status(404).json({ error: "Jogo não encontrado." });
      }

      const existingEntry = await prisma.gameStatus.findUnique({
        where: {
          userId_gameId: {
            userId: userId,
            gameId: Number(gameId),
          },
        },
      });

      if (existingEntry) {
        return res.status(409).json({ error: "Jogo já está na biblioteca." });
      }

      const newEntry = await prisma.gameStatus.create({
        data: {
          userId,
          gameId: Number(gameId),
          status: status || "PLAN_TO_PLAY",
          hoursPlayed: Number(hoursPlayed) || 0,
        },
      });

      return res.status(201).json(newEntry);
    } catch (error) {
      console.error("Erro ao adicionar:", error);
      return res.status(500).json({ error: "Erro ao salvar na biblioteca." });
    }
  }

  // PATCH /library/:id
  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, hoursPlayed } = req.body;

      const updatedEntry = await prisma.gameStatus.update({
        where: { id: Number(id) },
        data: {
          status,
          hoursPlayed:
            hoursPlayed !== undefined ? Number(hoursPlayed) : undefined,
        },
      });

      return res.status(200).json(updatedEntry);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      return res.status(500).json({ error: "Erro ao atualizar status." });
    }
  }
}
