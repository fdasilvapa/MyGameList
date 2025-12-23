import { Request, Response } from 'express';
import { db } from '../config/db';

// Tipos para o status (poderia estar em um arquivo de types separado)
type GameStatusType = 'PLAYING' | 'COMPLETED' | 'DROPPED' | 'PLAN_TO_PLAY';

export const getLibrary = async (req: Request, res: Response) => {
  try {
    // Hardcoded userId para testes
    const userId = 1;

    const library = await db.gameStatus.findMany({
      where: {
        userId: userId
      },
      include: {
        game: true // O "Pulo do Gato": Traz os detalhes do jogo (título, capa) junto!
      }
    });

    return res.status(200).json(library);
  } catch (error) {
    console.error('Erro ao buscar biblioteca:', error);
    return res.status(500).json({ error: 'Erro ao carregar sua biblioteca.' });
  }
};

export const addGameToLibrary = async (req: Request, res: Response) => {
  try {
    const userId = 1;
    const { gameId, status, hoursPlayed } = req.body;

    if (!gameId) {
      return res.status(400).json({ error: 'ID do jogo é obrigatório.' });
    }

    // Verifica se o jogo existe
    const game = await db.game.findUnique({ where: { id: Number(gameId) } });
    if (!game) {
      return res.status(404).json({ error: 'Jogo não encontrado no catálogo.' });
    }

    // Verifica se já está na biblioteca para evitar duplicatas
    // (Assumindo que você não criou uma chave composta @@unique no schema ainda, essa verificação é vital)
    const existingEntry = await db.gameStatus.findFirst({
      where: {
        userId: userId,
        gameId: Number(gameId)
      }
    });

    if (existingEntry) {
      return res.status(409).json({ error: 'Este jogo já está na sua biblioteca.' });
    }

    const newEntry = await db.gameStatus.create({
      data: {
        userId,
        gameId: Number(gameId),
        status: status || 'PLAN_TO_PLAY', // Valor default
        hoursPlayed: Number(hoursPlayed) || 0
      }
    });

    return res.status(201).json(newEntry);

  } catch (error) {
    console.error('Erro ao adicionar jogo:', error);
    return res.status(500).json({ error: 'Erro ao adicionar jogo à biblioteca.' });
  }
};

export const updateGameStatus = async (req: Request, res: Response) => {
  try {
    const userId = 1;
    const { id } = req.params; // ID do registro na tabela GameStatus, não do Jogo!
    const { status, hoursPlayed } = req.body;

    // Atualiza apenas os campos enviados
    const updatedEntry = await db.gameStatus.update({
      where: {
        id: Number(id) 
        // Em um app real, verificaríamos se esse ID pertence ao userId 1 aqui
      },
      data: {
        status,
        hoursPlayed: hoursPlayed ? Number(hoursPlayed) : undefined
      }
    });

    return res.status(200).json(updatedEntry);
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    return res.status(500).json({ error: 'Erro ao atualizar o status do jogo.' });
  }
};