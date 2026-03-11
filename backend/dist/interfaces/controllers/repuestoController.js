"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRepuesto = exports.updateRepuesto = exports.getRepuestoById = exports.createRepuesto = exports.getRepuestos = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getRepuestos = async (req, res) => {
    try {
        const repuestos = await prisma.repuesto.findMany({
            include: {
                usoRepuestos: true,
            },
        });
        res.json(repuestos);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching repuestos' });
    }
};
exports.getRepuestos = getRepuestos;
const createRepuesto = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating repuesto' });
    }
};
exports.createRepuesto = createRepuesto;
const getRepuestoById = async (req, res) => {
    try {
        const { id } = req.params;
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
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching repuesto' });
    }
};
exports.getRepuestoById = getRepuestoById;
const updateRepuesto = async (req, res) => {
    try {
        const { id } = req.params;
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
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating repuesto' });
    }
};
exports.updateRepuesto = updateRepuesto;
const deleteRepuesto = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.repuesto.delete({
            where: { id },
        });
        res.json({ message: 'Repuesto deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting repuesto' });
    }
};
exports.deleteRepuesto = deleteRepuesto;
//# sourceMappingURL=repuestoController.js.map