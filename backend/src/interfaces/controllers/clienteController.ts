import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getClientes = async (req: Request, res: Response) => {
  try {
    const clientes = await prisma.cliente.findMany({
      include: {
        agencia: true,
        maquinas: true,
        contactos: true,
      },
    });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching clientes' });
  }
};

export const createCliente = async (req: Request, res: Response) => {
  try {
    const { nombre, tipo, direccion, agenciaId } = req.body;
    const cliente = await prisma.cliente.create({
      data: {
        nombre,
        tipo,
        direccion,
        agenciaId,
      },
    });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Error creating cliente' });
  }
};

export const getClienteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: {
        agencia: true,
        maquinas: true,
        contratos: true,
        tickets: true,
        contactos: true,
      },
    });
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente not found' });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cliente' });
  }
};

export const updateCliente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { nombre, tipo, direccion, agenciaId } = req.body;
    const cliente = await prisma.cliente.update({
      where: { id },
      data: {
        nombre,
        tipo,
        direccion,
        agenciaId,
      },
    });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Error updating cliente' });
  }
};

export const deleteCliente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await prisma.cliente.delete({
      where: { id },
    });
    res.json({ message: 'Cliente deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting cliente' });
  }
};