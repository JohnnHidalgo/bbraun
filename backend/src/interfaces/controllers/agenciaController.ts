import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAgencias = async (req: Request, res: Response) => {
  try {
    const agencias = await prisma.agencia.findMany();
    res.json(agencias);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching agencias' });
  }
};

export const getAgenciaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const agencia = await prisma.agencia.findUnique({
      where: { id },
    });
    if (!agencia) {
      return res.status(404).json({ error: 'Agencia not found' });
    }
    res.json(agencia);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching agencia' });
  }
};

export const createAgencia = async (req: Request, res: Response) => {
  try {
    const { ageCentro, ageOficina, ageCodigo, ageNombre } = req.body;
    const agencia = await prisma.agencia.create({
      data: {
        ageCentro,
        ageOficina,
        ageCodigo,
        ageNombre,
      },
    });
    res.json(agencia);
  } catch (error) {
    res.status(500).json({ error: 'Error creating agencia' });
  }
};

export const updateAgencia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { ageCentro, ageOficina, ageCodigo, ageNombre } = req.body;
    const agencia = await prisma.agencia.update({
      where: { id },
      data: {
        ageCentro,
        ageOficina,
        ageCodigo,
        ageNombre,
      },
    });
    res.json(agencia);
  } catch (error) {
    res.status(500).json({ error: 'Error updating agencia' });
  }
};

export const deleteAgencia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await prisma.agencia.delete({
      where: { id },
    });
    res.json({ message: 'Agencia deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting agencia' });
  }
};
