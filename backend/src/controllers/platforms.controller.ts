import { Request, Response } from 'express';
import { prisma } from '../config/db';

export class PlatformsController {
  static async create(req: Request, res: Response) {
    try {
      const { name, slug } = req.body;

      if (!name || !slug) {
        return res.status(400).json({ error: 'Nome e Slug são obrigatórios.' });
      }

      const platform = await prisma.platform.create({
        data: { name, slug }
      });

      return res.status(201).json(platform);
    } catch (error) {
      console.error('Erro ao criar plataforma:', error);
      return res.status(500).json({ error: 'Erro interno.' });
    }
  }

  static async list(req: Request, res: Response) {
      const platforms = await prisma.platform.findMany();
      return res.json(platforms);
  }
}