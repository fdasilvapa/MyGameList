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

    // CORREÇÃO: Em vez de sujar o req.body, criamos o objeto user no req
    // Isso funciona para GET, POST, DELETE, tudo.
    (req as any).user = { id, username };

    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};