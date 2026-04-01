"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.logout = exports.handleMicrosoftCallback = exports.getMicrosoftLoginUrl = void 0;
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("../../infrastructure/middleware/authMiddleware");
const microsoftAuthService_1 = require("../../services/microsoftAuthService");
const prisma = new client_1.PrismaClient();
const getMicrosoftLoginUrl = async (req, res) => {
    try {
        const authUrl = await (0, microsoftAuthService_1.getMicrosoftAuthUrl)();
        res.json({ authUrl });
    }
    catch (error) {
        console.error('Error getting Microsoft login URL:', error);
        res.status(500).json({ error: 'Failed to get login URL' });
    }
};
exports.getMicrosoftLoginUrl = getMicrosoftLoginUrl;
const handleMicrosoftCallback = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code || typeof code !== 'string') {
            return res.status(400).json({ error: 'Authorization code is required' });
        }
        // Obtener el token de acceso desde Microsoft
        const tokenResponse = await (0, microsoftAuthService_1.getMicrosoftAccessToken)(code);
        const microsoftAccessToken = tokenResponse?.accessToken;
        if (!microsoftAccessToken) {
            return res.status(400).json({ error: 'Failed to obtain access token' });
        }
        // Obtener información del usuario desde Microsoft Graph
        const microsoftUserData = (await (0, microsoftAuthService_1.getUserInfo)(microsoftAccessToken));
        const { mail, userPrincipalName, displayName, id: azureId } = microsoftUserData;
        const email = mail || userPrincipalName;
        if (!email) {
            return res.status(400).json({ error: 'Could not retrieve email from Microsoft' });
        }
        // Buscar o crear el usuario en la base de datos
        let usuario = await prisma.usuario.findUnique({
            where: { email },
        });
        if (!usuario) {
            // Crear nuevo usuario
            usuario = await prisma.usuario.create({
                data: {
                    email,
                    nombre: displayName || 'Usuario',
                    azureId,
                    rol: 'Tecnico', // Default role - puede ser ajustado
                },
            });
        }
        else if (!usuario.azureId) {
            // Actualizar usuario existente sin azureId
            usuario = await prisma.usuario.update({
                where: { id: usuario.id },
                data: { azureId },
            });
        }
        // Generar JWT token
        const jwtToken = (0, authMiddleware_1.generateToken)({
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
            azureId: usuario.azureId || azureId,
        });
        // Redirigir al cliente con el token... ó devolver JSON
        // Opción 1: Devolver token como JSON
        res.json({
            token: jwtToken,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
            },
        });
        // Opción 2 (alternativa): Redirigir al fronend con token como hash
        // res.redirect(`http://localhost:5173/?token=${jwtToken}`);
    }
    catch (error) {
        console.error('Error in Microsoft callback:', error);
        res.status(500).json({ error: 'Failed to authenticate with Microsoft' });
    }
};
exports.handleMicrosoftCallback = handleMicrosoftCallback;
const logout = async (req, res) => {
    // El logout se maneja principalmente en el cliente
    res.json({ message: 'Logged out successfully' });
};
exports.logout = logout;
const getCurrentUser = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const usuario = await prisma.usuario.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                nombre: true,
                email: true,
                rol: true,
                region: true,
            },
        });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario not found' });
        }
        res.json(usuario);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get current user' });
    }
};
exports.getCurrentUser = getCurrentUser;
//# sourceMappingURL=authController.js.map