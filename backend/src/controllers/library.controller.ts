import { Request, Response } from "express";
import { prisma } from "../config/db";

export class LibraryController {
  // GET /library
  // Lista todos os jogos da biblioteca do usuário logado
  static async getLibrary(req: Request, res: Response) {
    try {
      // O ID vem do AuthMiddleware que injetou no body
      const { userId } = req.body;

      const library = await prisma.gameStatus.findMany({
        where: { userId: Number(userId) },
        include: {
          game: true, // Traz os detalhes do jogo (capa, título, etc)
        },
        orderBy: { updatedAt: "desc" }, // Opcional: Traz os modificados recentemente primeiro
      });

      return res.status(200).json(library);
    } catch (error) {
      console.error("Erro na biblioteca:", error);
      return res.status(500).json({ error: "Erro ao carregar biblioteca." });
    }
  }

  // POST /library
  // Adiciona um jogo à biblioteca
  static async addGame(req: Request, res: Response) {
    try {
      // Pega o userId do token (middleware) e os dados do jogo do corpo da req
      const { userId, gameId, status, hoursPlayed } = req.body;

      if (!gameId) {
        return res.status(400).json({ error: "ID do jogo é obrigatório." });
      }

      // 1. Verifica se o jogo existe no catálogo global
      const game = await prisma.game.findUnique({
        where: { id: Number(gameId) },
      });

      if (!game) {
        return res.status(404).json({ error: "Jogo não encontrado." });
      }

      // 2. Verifica se já está na biblioteca deste usuário específico
      const existingEntry = await prisma.gameStatus.findUnique({
        where: {
          userId_gameId: {
            userId: Number(userId),
            gameId: Number(gameId),
          },
        },
      });

      if (existingEntry) {
        return res
          .status(409)
          .json({ error: "Jogo já está na sua biblioteca." });
      }

      // 3. Adiciona
      const newEntry = await prisma.gameStatus.create({
        data: {
          userId: Number(userId),
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
  // Atualiza status ou horas jogadas de um item específico
  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params; // ID do registro na tabela GameStatus
      const { userId, status, hoursPlayed } = req.body; // userId vem do Token

      // 1. SEGURANÇA: Verificar se esse registro pertence ao usuário logado
      const entry = await prisma.gameStatus.findFirst({
        where: {
          id: Number(id),
          userId: Number(userId),
        },
      });

      if (!entry) {
        return res
          .status(404)
          .json({
            error: "Registro não encontrado ou você não tem permissão.",
          });
      }

      // 2. Atualiza
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