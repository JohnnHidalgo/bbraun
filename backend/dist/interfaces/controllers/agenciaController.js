"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAgencia = exports.updateAgencia = exports.createAgencia = exports.getAgenciaById = exports.getAgencias = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAgencias = async (req, res) => {
    try {
        const agencias = await prisma.agencia.findMany();
        res.json(agencias);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching agencias' });
    }
};
exports.getAgencias = getAgencias;
const getAgenciaById = async (req, res) => {
    try {
        const { id } = req.params;
        const agencia = await prisma.agencia.findUnique({
            where: { id },
        });
        if (!agencia) {
            return res.status(404).json({ error: 'Agencia not found' });
        }
        res.json(agencia);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching agencia' });
    }
};
exports.getAgenciaById = getAgenciaById;
const createAgencia = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating agencia' });
    }
};
exports.createAgencia = createAgencia;
const updateAgencia = async (req, res) => {
    try {
        const { id } = req.params;
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
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating agencia' });
    }
};
exports.updateAgencia = updateAgencia;
const deleteAgencia = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.agencia.delete({
            where: { id },
        });
        res.json({ message: 'Agencia deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting agencia' });
    }
};
exports.deleteAgencia = deleteAgencia;
//# sourceMappingURL=agenciaController.js.map