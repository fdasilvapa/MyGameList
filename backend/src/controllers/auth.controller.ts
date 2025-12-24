import { Request, Response } from "express";
import { prisma } from "../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

      // Criar usuário no banco
      const user = await prisma.user.create({
        data: {
          username,
          email,
          passwordHash: hashedPassword,
          currentXp: 0,
          currentLevel: 1,
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

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // 1. Verifica se usuário existe
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: "Credenciais inválidas." });
      }

      // 2. Compara a senha enviada com o Hash do banco
      const isValuePassword = await bcrypt.compare(password, user.passwordHash);

      if (!isValuePassword) {
        return res.status(400).json({ error: "Credenciais inválidas." });
      }

      // 3. Gera o Token JWT
      const secret = process.env.JWT_SECRET || "chave_secreta_padrao";
      const token = jwt.sign(
        { id: user.id, username: user.username },
        secret,
        { expiresIn: "1d" } // Expira em 1 dia
      );

      // 4. Retorna dados + token
      return res.status(200).json({
        message: "Login realizado com sucesso!",
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno no login." });
    }
  }

}
