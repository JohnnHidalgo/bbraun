import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMaquinas = async (req: Request, res: Response) => {
  try {
    const maquinas = await prisma.maquina.findMany({
      include: {
        cliente: true,
      },
    });
    res.json(maquinas);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching maquinas' });
  }
};

export const createMaquina = async (req: Request, res: Response) => {
  try {
    const { modelo, numeroSerie, fechaCompra, fechaLlegadaAlmacen, fechaInstalacion, clienteId, estado } = req.body;
    const maquina = await prisma.maquina.create({
      data: {
        modelo,
        numeroSerie,
        fechaCompra: new Date(fechaCompra),
        fechaLlegadaAlmacen: fechaLlegadaAlmacen ? new Date(fechaLlegadaAlmacen) : null,
        fechaInstalacion: fechaInstalacion ? new Date(fechaInstalacion) : null,
        clienteId,
        estado,
      },
    });
    res.json(maquina);
  } catch (error) {
    res.status(500).json({ error: 'Error creating maquina' });
  }
};

export const getMaquinaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const maquina = await prisma.maquina.findUnique({
      where: { id },
      include: {
        cliente: true,
        tickets: true,
      },
    });
    if (!maquina) {
      return res.status(404).json({ error: 'Maquina not found' });
    }
    res.json(maquina);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching maquina' });
  }
};

export const updateMaquina = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { modelo, numeroSerie, estado } = req.body;
    const maquina = await prisma.maquina.update({
      where: { id },
      data: {
        modelo,
        numeroSerie,
        estado,
      },
    });
    res.json(maquina);
  } catch (error) {
    res.status(500).json({ error: 'Error updating maquina' });
  }
};

export const deleteMaquina = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await prisma.maquina.delete({
      where: { id },
    });
    res.json({ message: 'Maquina deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting maquina' });
  }
};