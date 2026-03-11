import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        cliente: true,
        maquina: true,
        tecnico: true,
      },
    });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tickets' });
  }
};

export const createTicket = async (req: Request, res: Response) => {
  try {
    const { tipo, clienteId, maquinaId, prioridad, descripcion, fechaSolicitud } = req.body;
    const ticket = await prisma.ticket.create({
      data: {
        tipo,
        estado: 'abierto',
        clienteId,
        maquinaId,
        prioridad,
        descripcion,
        ...(fechaSolicitud && { fechaSolicitud: new Date(fechaSolicitud) }),
      },
    });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Error creating ticket' });
  }
};

export const getTicketById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        cliente: true,
        maquina: true,
        tecnico: true,
        visitas: true,
        encuestas: true,
      },
    });
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching ticket' });
  }
};

export const updateTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { estado, tecnicoId, prioridad } = req.body;
    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        estado,
        tecnicoId,
        prioridad,
      },
    });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Error updating ticket' });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await prisma.ticket.delete({
      where: { id },
    });
    res.json({ message: 'Ticket deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting ticket' });
  }
};