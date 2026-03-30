import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest, generateToken } from '../../infrastructure/middleware/authMiddleware';
import {
  getMicrosoftAuthUrl,
  getMicrosoftAccessToken,
  getUserInfo,
} from '../../services/microsoftAuthService';

const prisma = new PrismaClient();

export const getMicrosoftLoginUrl = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const authUrl = await getMicrosoftAuthUrl();
    res.json({ authUrl });
  } catch (error: any) {
    console.error('Error getting Microsoft login URL:', error);
    res.status(500).json({ error: 'Failed to get login URL' });
  }
};

export const handleMicrosoftCallback = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Obtener el token de acceso desde Microsoft
    const tokenResponse = await getMicrosoftAccessToken(code);
    const microsoftAccessToken = tokenResponse?.accessToken;

    if (!microsoftAccessToken) {
      return res.status(400).json({ error: 'Failed to obtain access token' });
    }

    // Obtener información del usuario desde Microsoft Graph
    const microsoftUserData = (await getUserInfo(microsoftAccessToken)) as any;

    const { mail, userPrincipalName, displayName, id: azureId } = microsoftUserData;
    const email = mail || userPrincipalName;

    if (!email) {
      return res.status(400).json({ error: 'Could not retrieve email from Microsoft' });
    }

    // Buscar o crear el usuario en la base de datos
    let usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      // Crear nuevo usuario
      usuario = await prisma.usuario.create({
        data: {
          email,
          nombre: displayName || 'Usuario',
          azureId,
          rol: 'Tecnico', // Default role - puede ser ajustado
        } as any,
      });
    } else if (!(usuario as any).azureId) {
      // Actualizar usuario existente sin azureId
      usuario = await prisma.usuario.update({
        where: { id: usuario.id },
        data: { azureId } as any,
      });
    }

    // Generar JWT token
    const jwtToken = generateToken({
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      azureId: (usuario as any).azureId || azureId,
    });

    // Redirigir al cliente con el token... ó devolver JSON
    // Opción 1: Devolver token como JSON
    res.json({
      token: jwtToken,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });

    // Opción 2 (alternativa): Redirigir al fronend con token como hash
    // res.redirect(`http://localhost:5173/?token=${jwtToken}`);
  } catch (error: any) {
    console.error('Error in Microsoft callback:', error);
    res.status(500).json({ error: 'Failed to authenticate with Microsoft' });
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response) => {
  // El logout se maneja principalmente en el cliente
  res.json({ message: 'Logged out successfully' });
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        region: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario not found' });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get current user' });
  }
};
