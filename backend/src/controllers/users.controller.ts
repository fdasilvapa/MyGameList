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

  // POST /users/:id/follow
  // Seguir um usuário
  static async followUser(req: Request, res: Response) {
    try {
      const followerId = (req as any).user.id; // Eu (quem está logado)
      const followingId = Number(req.params.id); // Quem eu quero seguir

      if (followerId === followingId) {
        return res
          .status(400)
          .json({ error: "Você não pode seguir a si mesmo." });
      }

      // Verifica se o usuário alvo existe
      const targetUser = await prisma.user.findUnique({
        where: { id: followingId },
      });
      if (!targetUser) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      // Verifica se já segue (para evitar erro de chave duplicada no banco)
      const alreadyFollowing = await prisma.follows.findUnique({
        where: {
          followerId_followingId: {
            // Nome automático da PK composta gerada pelo Prisma
            followerId,
            followingId,
          },
        },
      });

      if (alreadyFollowing) {
        return res.status(409).json({ error: "Você já segue este usuário." });
      }

      // Cria a relação
      await prisma.follows.create({
        data: {
          followerId,
          followingId,
        },
      });

      return res
        .status(201)
        .json({ message: `Agora você segue ${targetUser.username}.` });
    } catch (error) {
      console.error("Erro ao seguir:", error);
      return res.status(500).json({ error: "Erro ao tentar seguir usuário." });
    }
  }

  // DELETE /users/:id/follow (ou /unfollow)
  // Deixar de seguir
  static async unfollowUser(req: Request, res: Response) {
    try {
      const followerId = (req as any).user.id;
      const followingId = Number(req.params.id);

      // Tenta deletar a relação diretamente
      // Se não existir, o Prisma lança um erro, então usamos try/catch ou verificamos antes
      // Vamos verificar antes para dar uma mensagem amigável
      const relation = await prisma.follows.findUnique({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });

      if (!relation) {
        return res.status(400).json({ error: "Você não segue este usuário." });
      }

      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });

      return res.status(200).json({ message: "Deixou de seguir com sucesso." });
    } catch (error) {
      console.error("Erro ao deixar de seguir:", error);
      return res.status(500).json({ error: "Erro ao deixar de seguir." });
    }
  }
}
