import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: number;
  username: string;
  iat: number;
  exp: number;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  const [, token] = authorization.split(" ");

  try {
    const secret = process.env.JWT_SECRET || "chave_secreta_padrao";
    const decoded = jwt.verify(token, secret);

    const { id, username } = decoded as TokenPayload;

    req.body.userId = id;
    // DICA: Jogar no body é uma "gambiarra" funcional rápida.
    // O ideal é estender a interface Request, mas para a Sprint 1 isso funciona.

    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};
