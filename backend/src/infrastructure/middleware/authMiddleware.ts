import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { jwtConfig } from '../../config/microsoft.config';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    nombre: string;
    azureId: string;
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as AuthenticatedRequest['user'];
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const generateToken = (user: {
  id: string;
  email: string;
  nombre: string;
  azureId: string;
}) => {
  const signOptions: SignOptions = { expiresIn: jwtConfig.expiresIn as any };
  return jwt.sign(user, jwtConfig.secret, signOptions);
};
