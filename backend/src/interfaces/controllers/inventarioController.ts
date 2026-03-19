import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getInventarios = async (req: Request, res: Response) => {
  try {
    const inventarios = await prisma.inventarioCliente.findMany({
      include: {
        cliente: true,
        repuesto: true,
      },
    });
    res.json(inventarios);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching inventarios' });
  }
};

export const getInventariosByCliente = async (req: Request, res: Response) => {
  try {
    const { clienteId } = req.params as { clienteId: string };
    const inventarios = await prisma.inventarioCliente.findMany({
      where: { clienteId },
      include: {
        repuesto: true,
      },
    });

    // Map inventory items to include the inventario id on the repuesto object for easier editing
    const repuestosWithInventory = inventarios.map((inv) => ({
      ...inv.repuesto,
      cantidad: inv.cantidad,
      inventarioId: inv.id,
    }));

    res.json(repuestosWithInventory);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching inventarios for cliente' });
  }
};

export const getInventarioById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const inventario = await prisma.inventarioCliente.findUnique({
      where: { id },
      include: {
        cliente: true,
        repuesto: true,
      },
    });
    if (!inventario) {
      return res.status(404).json({ error: 'Inventario not found' });
    }
    res.json(inventario);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching inventario' });
  }
};

export const createInventario = async (req: Request, res: Response) => {
  try {
    const { clienteId, repuestoId, cantidad } = req.body;
    if (!clienteId || !repuestoId || typeof cantidad !== 'number') {
      return res.status(400).json({ error: 'clienteId, repuestoId and cantidad are required' });
    }

    // Upsert to avoid duplicates (cliente + repuesto unique constraint)
    const inventario = await prisma.inventarioCliente.upsert({
      where: {
        clienteId_repuestoId: {
          clienteId,
          repuestoId,
        },
      },
      update: {
        cantidad,
      },
      create: {
        clienteId,
        repuestoId,
        cantidad,
      },
    });

    res.json(inventario);
  } catch (error) {
    res.status(500).json({ error: 'Error creating/updating inventario' });
  }
};

export const updateInventario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { cantidad } = req.body;

    if (typeof cantidad !== 'number') {
      return res.status(400).json({ error: 'cantidad is required and must be a number' });
    }

    const inventario = await prisma.inventarioCliente.update({
      where: { id },
      data: {
        cantidad,
      },
    });
    res.json(inventario);
  } catch (error) {
    res.status(500).json({ error: 'Error updating inventario' });
  }
};

export const deleteInventario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await prisma.inventarioCliente.delete({
      where: { id },
    });
    res.json({ message: 'Inventario deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting inventario' });
  }
};
