import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getVisitas = async (req: Request, res: Response) => {
  try {
    const visitas = await prisma.visita.findMany({
      include: {
        ticket: true,
        tecnico: true,
        usoRepuestos: true,
      },
    });
    res.json(visitas);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching visitas' });
  }
};

export const createVisita = async (req: Request, res: Response) => {
  try {
    const { ticketId, tecnicoId, fechaVisita, horasTrabajo, descripcionTrabajo, resultado } = req.body;
    const visita = await prisma.visita.create({
      data: {
        ticketId,
        tecnicoId,
        fechaVisita: new Date(fechaVisita),
        horasTrabajo,
        descripcionTrabajo,
        resultado,
      },
    });
    res.json(visita);
  } catch (error) {
    res.status(500).json({ error: 'Error creating visita' });
  }
};

export const getVisitaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const visita = await prisma.visita.findUnique({
      where: { id },
      include: {
        ticket: true,
        tecnico: true,
        usoRepuestos: {
          include: {
            repuesto: true,
          },
        },
      },
    });
    if (!visita) {
      return res.status(404).json({ error: 'Visita not found' });
    }
    res.json(visita);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching visita' });
  }
};

export const updateVisita = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { horasTrabajo, descripcionTrabajo, resultado } = req.body;
    const visita = await prisma.visita.update({
      where: { id },
      data: {
        horasTrabajo,
        descripcionTrabajo,
        resultado,
      },
    });
    res.json(visita);
  } catch (error) {
    res.status(500).json({ error: 'Error updating visita' });
  }
};

export const deleteVisita = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await prisma.visita.delete({
      where: { id },
    });
    res.json({ message: 'Visita deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting visita' });
  }
};