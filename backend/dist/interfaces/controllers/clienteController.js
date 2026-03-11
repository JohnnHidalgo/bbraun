"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCliente = exports.updateCliente = exports.getClienteById = exports.createCliente = exports.getClientes = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getClientes = async (req, res) => {
    try {
        const clientes = await prisma.cliente.findMany({
            include: {
                maquinas: true,
            },
        });
        res.json(clientes);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching clientes' });
    }
};
exports.getClientes = getClientes;
const createCliente = async (req, res) => {
    try {
        const { nombre, tipo, direccion, ciudad, nombreContacto, telefonoContacto } = req.body;
        const cliente = await prisma.cliente.create({
            data: {
                nombre,
                tipo,
                direccion,
                ciudad,
                nombreContacto,
                telefonoContacto,
            },
        });
        res.json(cliente);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating cliente' });
    }
};
exports.createCliente = createCliente;
const getClienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const cliente = await prisma.cliente.findUnique({
            where: { id },
            include: {
                maquinas: true,
                contratos: true,
                tickets: true,
            },
        });
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente not found' });
        }
        res.json(cliente);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching cliente' });
    }
};
exports.getClienteById = getClienteById;
const updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, tipo, direccion, ciudad, nombreContacto, telefonoContacto } = req.body;
        const cliente = await prisma.cliente.update({
            where: { id },
            data: {
                nombre,
                tipo,
                direccion,
                ciudad,
                nombreContacto,
                telefonoContacto,
            },
        });
        res.json(cliente);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating cliente' });
    }
};
exports.updateCliente = updateCliente;
const deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.cliente.delete({
            where: { id },
        });
        res.json({ message: 'Cliente deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting cliente' });
    }
};
exports.deleteCliente = deleteCliente;
//# sourceMappingURL=clienteController.js.map