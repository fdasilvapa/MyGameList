import { Request, Response } from "express";
import { prisma } from "../config/db";

export class UsersController {
  // PATCH /users/profile
  // Atualiza Bio e Avatar do usuário logado
  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { bio, avatarUrl } = req.body;

      if (bio && bio.length > 500) {
        return res
          .status(400)
          .json({ error: "A bio deve ter no máximo 500 caracteres." });
      }

      const updatedUser = await prisma.user.update({
        where: { id: Number(userId) },
        data: {
          bio, // Se for undefined, o Prisma ignora
          avatarUrl, // Se for undefined, o Prisma ignora
        },
        // Retornamos apenas dados seguros
        select: {
          id: true,
          username: true,
          email: true,
          bio: true,
          avatarUrl: true,
        },
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      return res.status(500).json({ error: "Erro ao atualizar perfil." });
    }
  }

  // GET /users/:username
  // Perfil Público
  static async getProfile(req: Request, res: Response) {
    try {
      const { username } = req.params;

      const user = await prisma.user.findUnique({
        where: { username: username },
        select: {
          id: true,
          username: true,
          avatarUrl: true,
          bio: true,
          currentLevel: true,
          currentXp: true,
          createdAt: true,

          // VITRINE: Os últimos 3 jogos modificados
          library: {
            take: 3,
            orderBy: { updatedAt: "desc" },
            include: {
              game: {
                select: { title: true, coverUrl: true, slug: true },
              },
              platform: {
                select: { name: true, slug: true },
              },
            },
          },

          // Contagem de seguidores
          _count: {
            select: {
              followedBy: true,
              following: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      return res.status(500).json({ error: "Erro ao buscar perfil." });
    }
  }
}
