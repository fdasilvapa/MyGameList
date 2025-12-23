import { Request, Response } from 'express';
// Importe a instância do prisma que você configurou em config/db.ts
// Certifique-se que o export lá seja 'export const db = ...' ou 'prisma'
import { db } from '../config/db'; 

// Utilitário simples para gerar slugs (ex: "God of War" -> "god-of-war")
// Em produção, bibliotecas como 'slugify' são mais robustas.
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/[\s_-]+/g, '-') // Substitui espaços por hifens
    .replace(/^-+|-+$/g, ''); // Remove hifens do começo/fim
};

// 1. Listar todos os jogos (Catálogo)
export const listGames = async (req: Request, res: Response) => {
  try {
    const games = await db.game.findMany({
      orderBy: {
        title: 'asc', // Ordena alfabeticamente
      },
      // Se quiser selecionar apenas campos específicos:
      // select: { id: true, title: true, coverUrl: true }
    });

    return res.status(200).json(games);
  } catch (error) {
    console.error('Erro ao listar jogos:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar catálogo de jogos.' });
  }
};

// 2. Criar um novo jogo
export const createGame = async (req: Request, res: Response) => {
  try {
    // Desestruturação segura do body
    const { title, coverUrl, releaseYear, description } = req.body;

    // Validação básica (Senior Tip: No futuro usaremos Zod para isso)
    if (!title || !releaseYear) {
      return res.status(400).json({ error: 'Título e Ano de Lançamento são obrigatórios.' });
    }

    // Gera o slug automaticamente
    const slug = generateSlug(title);

    // Verifica se já existe um jogo com esse slug para evitar erro de duplicidade
    const gameExists = await db.game.findUnique({
      where: { slug: slug }
    });

    if (gameExists) {
      return res.status(409).json({ error: 'Já existe um jogo cadastrado com esse título/slug.' });
    }

    // Criação no Banco
    const newGame = await db.game.create({
      data: {
        title,
        slug,
        coverUrl,
        releaseYear: Number(releaseYear), // Garante que seja número
        description
      },
    });

    return res.status(201).json(newGame);
  } catch (error) {
    console.error('Erro ao criar jogo:', error);
    return res.status(500).json({ error: 'Erro interno ao criar o jogo.' });
  }
};