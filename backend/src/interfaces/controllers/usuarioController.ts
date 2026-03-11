import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching usuarios' });
  }
};

export const createUsuario = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password, rol, region } = req.body;
    const usuario = await prisma.usuario.create({
      data: { nombre, email, password, rol, region },
    });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error creating usuario' });
  }
};