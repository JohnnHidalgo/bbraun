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
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json());
// Routes
app.use('/api/usuarios', usuarioRoutes_1.default);
app.use('/api/clientes', clienteRoutes_1.default);
app.use('/api/maquinas', maquinaRoutes_1.default);
app.use('/api/tickets', ticketRoutes_1.default);
app.use('/api/visitas', visitaRoutes_1.default);
app.use('/api/repuestos', repuestoRoutes_1.default);
app.use('/api/contactos', contactoRoutes_1.default);
app.use('/api/inventarios', inventarioRoutes_1.default);
app.use('/api/agencias', agenciaRoutes_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map