import { Request, Response } from "express";
import { prisma } from "../config/db";

export class LibraryController {
  
  // GET /library
  static async getLibrary(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;

      const library = await prisma.gameStatus.findMany({
        where: { userId: Number(userId) },
        include: {
          game: true,
          platform: true, 
        },
        orderBy: { updatedAt: "desc" },
      });

      return res.status(200).json(library);
    } catch (error) {
      console.error("Erro na biblioteca:", error);
      return res.status(500).json({ error: "Erro ao carregar biblioteca." });
    }
  }

  // POST /library
  static async addEntry(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id; // ID seguro do token
      
      const { gameId, platformId, status, hoursPlayed } = req.body;

      if (!gameId || !platformId) {
        return res.status(400).json({ error: "ID do jogo e Plataforma são obrigatórios." });
      }

      // Validações
      const game = await prisma.game.findUnique({ where: { id: Number(gameId) } });
      if (!game) return res.status(404).json({ error: "Jogo não encontrado." });

      const platform = await prisma.platform.findUnique({ where: { id: Number(platformId) } });
      if (!platform) return res.status(404).json({ error: "Plataforma não encontrada." });

      // Verifica duplicidade
      const existingEntry = await prisma.gameStatus.findFirst({
        where: {
            userId: Number(userId),
            gameId: Number(gameId),
            // Se seu schema permitir ter o mesmo jogo em plataformas diferentes, 
            // adicione 'platformId: Number(platformId)' aqui dentro do where.
        },
      });

      if (existingEntry) {
        return res.status(409).json({ error: "Jogo já está na sua biblioteca." });
      }

      const newEntry = await prisma.gameStatus.create({
        data: {
          userId: Number(userId),
          gameId: Number(gameId),
          platformId: Number(platformId), // Salvando a plataforma!
          status: status || "PLAN_TO_PLAY",
          hoursPlayed: Number(hoursPlayed) || 0,
        },
        include: { game: true, platform: true }
      });

      return res.status(201).json(newEntry);
    } catch (error) {
      console.error("Erro ao adicionar:", error);
      return res.status(500).json({ error: "Erro ao salvar na biblioteca." });
    }
  }

  // PATCH /library/:id
  static async updateEntry(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id; // ID seguro do token
      const { status, hoursPlayed } = req.body;

      // Garante que o registro pertence ao usuário logado
      const entry = await prisma.gameStatus.findFirst({
        where: {
          id: Number(id),
          userId: Number(userId),
        },
      });

      if (!entry) {
        return res.status(404).json({ error: "Registro não encontrado ou acesso negado." });
      }

      const updatedEntry = await prisma.gameStatus.update({
        where: { id: Number(id) },
        data: {
          status: status || undefined, // Só atualiza se enviar valor
          hoursPlayed: hoursPlayed !== undefined ? Number(hoursPlayed) : undefined,
        },
      });

      return res.status(200).json(updatedEntry);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      return res.status(500).json({ error: "Erro ao atualizar status." });
    }
  }
}