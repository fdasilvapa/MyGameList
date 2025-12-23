import { Request, Response } from "express";
import { prisma } from "../config/db";
import bcrypt from "bcryptjs";

export class AuthController {
  // 1. REGISTRO DE USUÁRIO
  static async register(req: Request, res: Response) {
    try {
      // Recebemos 'password' do front, mas salvaremos como 'passwordHash'
      const { username, email, password } = req.body;

      // Validação básica
      if (!email || !password || !username) {
        return res
          .status(400)
          .json({ error: "Preencha username, email e senha." });
      }

      // Verificar se usuário ou email já existem (ambos são @unique no schema)
      const userExists = await prisma.user.findFirst({
        where: {
          OR: [{ email: email }, { username: username }],
        },
      });

      if (userExists) {
        return res
          .status(400)
          .json({ error: "E-mail ou Username já estão em uso." });
      }

      // Criptografar a senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Criar usuário no banco (Usando os nomes exatos do seu Schema)
      const user = await prisma.user.create({
        data: {
          username,
          email,
          passwordHash: hashedPassword, // Mapeando para o campo correto
          currentXp: 0, // Valor default explícito (opcional, já está no schema)
          currentLevel: 1, // Valor default explícito (opcional)
        },
      });

      // Retornar sucesso (omitindo o hash da senha)
      return res.status(201).json({
        message: "Usuário criado com sucesso!",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error("Erro no registro:", error);
      return res.status(500).json({ error: "Erro interno ao criar usuário." });
    }
  }

  // O Login virá no próximo passo...
}
