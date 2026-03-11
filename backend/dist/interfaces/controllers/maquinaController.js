"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMaquina = exports.updateMaquina = exports.getMaquinaById = exports.createMaquina = exports.getMaquinas = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getMaquinas = async (req, res) => {
    try {
        const maquinas = await prisma.maquina.findMany({
            include: {
                cliente: true,
            },
        });
        res.json(maquinas);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching maquinas' });
    }
};
exports.getMaquinas = getMaquinas;
const createMaquina = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating maquina' });
    }
};
exports.createMaquina = createMaquina;
const getMaquinaById = async (req, res) => {
    try {
        const { id } = req.params;
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
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching maquina' });
    }
};
exports.getMaquinaById = getMaquinaById;
const updateMaquina = async (req, res) => {
    try {
        const { id } = req.params;
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
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating maquina' });
    }
};
exports.updateMaquina = updateMaquina;
const deleteMaquina = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.maquina.delete({
            where: { id },
        });
        res.json({ message: 'Maquina deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting maquina' });
    }
};
exports.deleteMaquina = deleteMaquina;
//# sourceMappingURL=maquinaController.js.map