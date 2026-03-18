"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTicket = exports.updateTicket = exports.getTicketById = exports.createTicket = exports.getTickets = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getTickets = async (req, res) => {
    try {
        const tickets = await prisma.ticket.findMany({
            include: {
                cliente: true,
                maquina: true,
                tecnico: true,
            },
        });
        res.json(tickets);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching tickets' });
    }
};
exports.getTickets = getTickets;
const createTicket = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating ticket' });
    }
};
exports.createTicket = createTicket;
const getTicketById = async (req, res) => {
    try {
        const { id } = req.params;
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
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching ticket' });
    }
};
exports.getTicketById = getTicketById;
const updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
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
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating ticket' });
    }
};
exports.updateTicket = updateTicket;
const deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.ticket.delete({
            where: { id },
        });
        res.json({ message: 'Ticket deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting ticket' });
    }
};
exports.deleteTicket = deleteTicket;
//# sourceMappingURL=ticketController.js.map