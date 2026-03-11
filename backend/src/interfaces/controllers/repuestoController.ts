import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getRepuestos = async (req: Request, res: Response) => {
  try {
    const repuestos = await prisma.repuesto.findMany({
      include: {
        usoRepuestos: true,
      },
    });
    res.json(repuestos);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching repuestos' });
  }
};

export const createRepuesto = async (req: Request, res: Response) => {
  try {
    const { nombre, codigo, descripcion } = req.body;
    const repuesto = await prisma.repuesto.create({
      data: {
        nombre,
        codigo,
        descripcion,
      },
    });
    res.json(repuesto);
  } catch (error) {
    res.status(500).json({ error: 'Error creating repuesto' });
  }
};

export const getRepuestoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const repuesto = await prisma.repuesto.findUnique({
      where: { id },
      include: {
        usoRepuestos: true,
        inventarios: true,
      },
    });
    if (!repuesto) {
      return res.status(404).json({ error: 'Repuesto not found' });
    }
    res.json(repuesto);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching repuesto' });
  }
};

export const updateRepuesto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { nombre, codigo, descripcion } = req.body;
    const repuesto = await prisma.repuesto.update({
      where: { id },
      data: {
        nombre,
        codigo,
        descripcion,
      },
    });
    res.json(repuesto);
  } catch (error) {
    res.status(500).json({ error: 'Error updating repuesto' });
  }
};

export const deleteRepuesto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await prisma.repuesto.delete({
      where: { id },
    });
    res.json({ message: 'Repuesto deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting repuesto' });
  }
};

export const getRepuestosByCliente = async (req: Request, res: Response) => {
  try {
    const { clienteId } = req.params as { clienteId: string };
    const inventarios = await prisma.inventarioCliente.findMany({
      where: { clienteId },
      include: {
        repuesto: true,
      },
    });
    // Mapear a formato con cantidad
    const repuestosConCantidad = inventarios.map((inv) => ({
      ...inv.repuesto,
      cantidad: inv.cantidad,
      inventarioId: inv.id,
    }));
    res.json(repuestosConCantidad);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching repuestos para cliente' });
  }
};