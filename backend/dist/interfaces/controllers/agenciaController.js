"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgencias = void 0;
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
//# sourceMappingURL=agenciaController.js.map