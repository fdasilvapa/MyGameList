import { Request, Response } from 'express';
import { prisma } from '../config/db';

export class LibraryController {

  static async getLibrary(req: Request, res: Response) {
    try {
      // --- BLOCO DE AUTH (AGUARDANDO FELIPE) ---
      // TODO: Quando o middleware de auth estiver pronto, descomente a linha abaixo e remova o hardcoded.
      // const userId = req.user?.id; // ou (req as any).user.id dependendo da tipagem
      const userId = 1; 
      // -----------------------------------------

      const library = await prisma.gameStatus.findMany({
        where: { userId },
        include: {
          game: true,
          platform: true
        },
        orderBy: { updatedAt: 'desc' }
      });

      return res.status(200).json(library);
    } catch (error) {
      console.error('Erro ao buscar biblioteca:', error);
      return res.status(500).json({ error: 'Erro interno ao carregar biblioteca.' });
    }
  }

  static async addEntry(req: Request, res: Response) {
    try {
      // --- BLOCO DE AUTH (AGUARDANDO FELIPE) ---
      // TODO: Substituir pelo ID do token JWT
      // const userId = req.user?.id;
      const userId = 1;
      // -----------------------------------------

      const { gameId, platformId, status, hoursPlayed } = req.body;

      if (!gameId || !platformId) {
        return res.status(400).json({ error: 'ID do jogo e ID da plataforma são obrigatórios.' });
      }

      // ... (Restante do código de validação continua igual) ...

      // Verifica se já está na biblioteca
      const existingEntry = await prisma.gameStatus.findUnique({
        where: {
          userId_gameId: { // Atenção: Confirme se seu schema.prisma tem @@unique([userId, gameId])
             userId,
             gameId: Number(gameId)
          }
        }
      });

      if (existingEntry) {
        return res.status(409).json({ error: 'Este jogo já está na sua biblioteca.' });
      }

      const newEntry = await prisma.gameStatus.create({
        data: {
          userId,
          gameId: Number(gameId),
          platformId: Number(platformId),
          status: status || 'PLAN_TO_PLAY',
          hoursPlayed: Number(hoursPlayed) || 0
        },
        include: { game: true, platform: true }
      });

      return res.status(201).json(newEntry);

    } catch (error) {
      console.error('Erro ao adicionar jogo à biblioteca:', error);
      return res.status(500).json({ error: 'Erro interno ao salvar registro.' });
    }
  }

  static async updateEntry(req: Request, res: Response) {
    try {
      // --- BLOCO DE AUTH (AGUARDANDO FELIPE) ---
      // const userId = req.user?.id;
      const userId = 1;
      // -----------------------------------------
      
      const { id } = req.params;
      const { status, hoursPlayed } = req.body;

      const entry = await prisma.gameStatus.findFirst({
        where: {
          id: Number(id),
          userId: userId // Garante que só edita se for dono
        }
      });

      if (!entry) {
        return res.status(404).json({ error: 'Registro não encontrado ou acesso negado.' });
      }

      const updatedEntry = await prisma.gameStatus.update({
        where: { id: Number(id) },
        data: {
          status: status || undefined,
          hoursPlayed: hoursPlayed ? Number(hoursPlayed) : undefined
        }
      });

      return res.status(200).json(updatedEntry);

    } catch (error) {
      console.error('Erro ao atualizar registro:', error);
      return res.status(500).json({ error: 'Erro interno ao atualizar.' });
    }
  }
}