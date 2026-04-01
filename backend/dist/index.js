"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("./infrastructure/middleware/authMiddleware");
const authRoutes_1 = __importDefault(require("./interfaces/routes/authRoutes"));
const usuarioRoutes_1 = __importDefault(require("./interfaces/routes/usuarioRoutes"));
const clienteRoutes_1 = __importDefault(require("./interfaces/routes/clienteRoutes"));
const maquinaRoutes_1 = __importDefault(require("./interfaces/routes/maquinaRoutes"));
const ticketRoutes_1 = __importDefault(require("./interfaces/routes/ticketRoutes"));
const visitaRoutes_1 = __importDefault(require("./interfaces/routes/visitaRoutes"));
const repuestoRoutes_1 = __importDefault(require("./interfaces/routes/repuestoRoutes"));
const contactoRoutes_1 = __importDefault(require("./interfaces/routes/contactoRoutes"));
const inventarioRoutes_1 = __importDefault(require("./interfaces/routes/inventarioRoutes"));
const agenciaRoutes_1 = __importDefault(require("./interfaces/routes/agenciaRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json());
// Auth routes (public)
app.use('/api/auth', authRoutes_1.default);
// Protected routes
app.use('/api/usuarios', authMiddleware_1.authMiddleware, usuarioRoutes_1.default);
app.use('/api/clientes', authMiddleware_1.authMiddleware, clienteRoutes_1.default);
app.use('/api/maquinas', authMiddleware_1.authMiddleware, maquinaRoutes_1.default);
app.use('/api/tickets', authMiddleware_1.authMiddleware, ticketRoutes_1.default);
app.use('/api/visitas', authMiddleware_1.authMiddleware, visitaRoutes_1.default);
app.use('/api/repuestos', authMiddleware_1.authMiddleware, repuestoRoutes_1.default);
app.use('/api/contactos', authMiddleware_1.authMiddleware, contactoRoutes_1.default);
app.use('/api/inventarios', authMiddleware_1.authMiddleware, inventarioRoutes_1.default);
app.use('/api/agencias', authMiddleware_1.authMiddleware, agenciaRoutes_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map