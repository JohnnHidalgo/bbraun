"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVisita = exports.updateVisita = exports.getVisitaById = exports.createVisita = exports.getVisitas = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getVisitas = async (req, res) => {
    try {
        const visitas = await prisma.visita.findMany({
            include: {
                ticket: true,
                tecnico: true,
                usoRepuestos: true,
            },
        });
        res.json(visitas);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching visitas' });
    }
};
exports.getVisitas = getVisitas;
const createVisita = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating visita' });
    }
};
exports.createVisita = createVisita;
const getVisitaById = async (req, res) => {
    try {
        const { id } = req.params;
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
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching visita' });
    }
};
exports.getVisitaById = getVisitaById;
const updateVisita = async (req, res) => {
    try {
        const { id } = req.params;
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
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating visita' });
    }
};
exports.updateVisita = updateVisita;
const deleteVisita = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.visita.delete({
            where: { id },
        });
        res.json({ message: 'Visita deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting visita' });
    }
};
exports.deleteVisita = deleteVisita;
//# sourceMappingURL=visitaController.js.map