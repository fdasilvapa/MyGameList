import { Request, Response } from "express";
import { prisma } from "../config/db";

// Utilitário local (pode ser movido para utils/slug.ts no futuro)
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export class GamesController {
  // 1. Listar todos os jogos
  static async list(req: Request, res: Response) {
    try {
      const games = await prisma.game.findMany({
        orderBy: { title: "asc" },
      });

      return res.status(200).json(games);
    } catch (error) {
      console.error("Erro ao listar jogos:", error);
      return res
        .status(500)
        .json({ error: "Erro interno ao buscar catálogo." });
    }
  }

  // 2. Criar jogo
  static async create(req: Request, res: Response) {
    try {
      const { title, coverUrl, releaseYear, description } = req.body;

      if (!title || !releaseYear) {
        return res
          .status(400)
          .json({ error: "Título e Ano são obrigatórios." });
      }

      const slug = generateSlug(title);

      const gameExists = await prisma.game.findUnique({
        where: { externalId: slug },
      });

      const slugCheck = await prisma.game.findFirst({
        where: { slug: slug },
      });

      if (slugCheck) {
        return res
          .status(409)
          .json({ error: "Já existe um jogo com esse título (slug)." });
      }

      const newGame = await prisma.game.create({
        data: {
          title,
          slug,
          externalId: slug, // Usando o slug como ID externo por enquanto
          coverUrl,
          releaseYear: Number(releaseYear),
        },
      });

      return res.status(201).json(newGame);
    } catch (error) {
      console.error("Erro ao criar jogo:", error);
      return res.status(500).json({ error: "Erro interno ao criar jogo." });
    }
  }
}
