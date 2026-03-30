import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from './infrastructure/middleware/authMiddleware';
import authRoutes from './interfaces/routes/authRoutes';
import usuarioRoutes from './interfaces/routes/usuarioRoutes';
import clienteRoutes from './interfaces/routes/clienteRoutes';
import maquinaRoutes from './interfaces/routes/maquinaRoutes';
import ticketRoutes from './interfaces/routes/ticketRoutes';
import visitaRoutes from './interfaces/routes/visitaRoutes';
import repuestoRoutes from './interfaces/routes/repuestoRoutes';
import contactoRoutes from './interfaces/routes/contactoRoutes';
import inventarioRoutes from './interfaces/routes/inventarioRoutes';
import agenciaRoutes from './interfaces/routes/agenciaRoutes';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json());

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/usuarios', authMiddleware, usuarioRoutes);
app.use('/api/clientes', authMiddleware, clienteRoutes);
app.use('/api/maquinas', authMiddleware, maquinaRoutes);
app.use('/api/tickets', authMiddleware, ticketRoutes);
app.use('/api/visitas', authMiddleware, visitaRoutes);
app.use('/api/repuestos', authMiddleware, repuestoRoutes);
app.use('/api/contactos', authMiddleware, contactoRoutes);
app.use('/api/inventarios', authMiddleware, inventarioRoutes);
app.use('/api/agencias', authMiddleware, agenciaRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});