"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInventario = exports.updateInventario = exports.createInventario = exports.getInventarioById = exports.getInventariosByCliente = exports.getInventarios = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getInventarios = async (req, res) => {
    try {
        const inventarios = await prisma.inventarioCliente.findMany({
            include: {
                cliente: true,
                repuesto: true,
            },
        });
        res.json(inventarios);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching inventarios' });
    }
};
exports.getInventarios = getInventarios;
const getInventariosByCliente = async (req, res) => {
    try {
        const { clienteId } = req.params;
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
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching inventarios for cliente' });
    }
};
exports.getInventariosByCliente = getInventariosByCliente;
const getInventarioById = async (req, res) => {
    try {
        const { id } = req.params;
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
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching inventario' });
    }
};
exports.getInventarioById = getInventarioById;
const createInventario = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating/updating inventario' });
    }
};
exports.createInventario = createInventario;
const updateInventario = async (req, res) => {
    try {
        const { id } = req.params;
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
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating inventario' });
    }
};
exports.updateInventario = updateInventario;
const deleteInventario = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.inventarioCliente.delete({
            where: { id },
        });
        res.json({ message: 'Inventario deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting inventario' });
    }
};
exports.deleteInventario = deleteInventario;
//# sourceMappingURL=inventarioController.js.map