import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import usuarioRoutes from './interfaces/routes/usuarioRoutes';
import clienteRoutes from './interfaces/routes/clienteRoutes';
import maquinaRoutes from './interfaces/routes/maquinaRoutes';
import ticketRoutes from './interfaces/routes/ticketRoutes';
import visitaRoutes from './interfaces/routes/visitaRoutes';
import repuestoRoutes from './interfaces/routes/repuestoRoutes';
import contactoRoutes from './interfaces/routes/contactoRoutes';
import inventarioRoutes from './interfaces/routes/inventarioRoutes';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/maquinas', maquinaRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/visitas', visitaRoutes);
app.use('/api/repuestos', repuestoRoutes);
app.use('/api/contactos', contactoRoutes);
app.use('/api/inventarios', inventarioRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});