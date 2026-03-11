"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUsuario = exports.getUsuarios = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUsuarios = async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany();
        res.json(usuarios);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching usuarios' });
    }
};
exports.getUsuarios = getUsuarios;
const createUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol, region } = req.body;
        const usuario = await prisma.usuario.create({
            data: { nombre, email, password, rol, region },
        });
        res.json(usuario);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating usuario' });
    }
};
exports.createUsuario = createUsuario;
//# sourceMappingURL=usuarioController.js.map