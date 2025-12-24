import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { generateSlug } from '../utils/slug.utils';

export class PlatformsController {
  static async create(req: Request, res: Response) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Nome da plataforma é obrigatório.' });
      }

      const slug = generateSlug(name);

      const platformExists = await prisma.platform.findFirst({
        where: { slug: slug }
      });

      if (platformExists) {
        return res.status(409).json({ error: 'Plataforma já cadastrada.' });
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

  // GET /platforms
  static async list(req: Request, res: Response) {
    try {
      const platforms = await prisma.platform.findMany({
        orderBy: { name: 'asc' }
      });
      return res.json(platforms);
    } catch (error) {
      console.error('Erro ao listar plataformas:', error);
      return res.status(500).json({ error: 'Erro ao buscar plataformas.' });
    }
  }
}