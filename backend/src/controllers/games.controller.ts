import { Request, Response } from "express";
import { prisma } from "../config/db";
import { generateSlug } from "../utils/slug.utils";

export class GamesController {
  static async list(req: Request, res: Response) {
    try {
      const games = await prisma.game.findMany({
        orderBy: { title: "asc" },
      });
      return res.status(200).json(games);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar catálogo." });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { title, coverUrl, releaseYear, description } = req.body;

      if (!title || !releaseYear) {
        return res
          .status(400)
          .json({ error: "Título e Ano são obrigatórios." });
      }

      const slug = generateSlug(title);

      // Verificação de duplicidade (pelo Slug ou ExternalId)
      const existingGame = await prisma.game.findFirst({
        where: { slug: slug },
      });

      if (existingGame) {
        return res.status(409).json({ error: "Jogo já cadastrado." });
      }

      const newGame = await prisma.game.create({
        data: {
          title,
          slug,
          externalId: slug,
          coverUrl,
          releaseYear: Number(releaseYear),
        },
      });

      return res.status(201).json(newGame);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar jogo." });
    }
  }
}
