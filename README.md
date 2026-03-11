# Sistema de Mantenimiento BBRAUN - Droguería INTI

## Arquitectura del Sistema

### Backend (Node.js + Express + Prisma + PostgreSQL)
- **Clean Architecture**: Separación en capas (Entities, Use Cases, Interface Adapters, Frameworks & Drivers)
- **Autenticación**: JWT
- **ORM**: Prisma
- **Base de Datos**: PostgreSQL

### Frontend (React + Vite + Material UI)
- **Clean Architecture**: Componentes, hooks, servicios, contextos
- **UI**: Material UI para interfaz limpia y corporativa
- **Estado**: Context API para gestión de estado

## Esquema de Base de Datos

### Entidades Principales
- Usuarios (Administrador, Técnico, Cliente)
- Clientes (Hospitales, Clínicas)
- Máquinas (BBRAUN)
- Contratos
- Tickets (Mantenimiento Preventivo/Correctivo)
- Visitas
- Repuestos
- Inventario por Cliente
- Encuestas de Satisfacción

## API REST Endpoints

### Autenticación
- POST /api/auth/login
- POST /api/auth/register

### Usuarios
- GET /api/usuarios
- POST /api/usuarios
- PUT /api/usuarios/:id
- DELETE /api/usuarios/:id

### Clientes
- GET /api/clientes
- POST /api/clientes
- PUT /api/clientes/:id
- DELETE /api/clientes/:id

### Máquinas
- GET /api/maquinas
- POST /api/maquinas
- PUT /api/maquinas/:id
- DELETE /api/maquinas/:id

### Tickets
- GET /api/tickets
- POST /api/tickets
- PUT /api/tickets/:id
- DELETE /api/tickets/:id

### Visitas
- GET /api/visitas
- POST /api/visitas
- PUT /api/visitas/:id

### Repuestos
- GET /api/repuestos
- POST /api/repuestos
- PUT /api/repuestos/:id

## Flujo de un Ticket de Mantenimiento

1. **Creación del Ticket**
   - Cliente reporta falla (correctivo) o sistema agenda preventivo
   - POST /api/tickets con datos del ticket

2. **Asignación**
   - Administrador asigna técnico según región
   - PUT /api/tickets/:id con tecnicoId

3. **Visita del Técnico**
   - Técnico registra visita
   - POST /api/visitas con detalles de la visita
   - Registra repuestos utilizados (POST /api/uso-repuestos)

4. **Cierre del Ticket**
   - Técnico marca ticket como cerrado
   - PUT /api/tickets/:id con estado 'cerrado'

5. **Encuesta de Satisfacción**
   - Cliente recibe email para completar encuesta
   - POST /api/encuestas con calificación y comentarios

## Instalación y Configuración

### Backend
```bash
cd backend
npm install
# Configurar .env con DATABASE_URL
npx prisma migrate dev
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Roles y Permisos

- **Administrador**: Acceso total
- **Técnico BBRAUN**: Gestiona tickets asignados, registra visitas
- **Cliente**: Solicita mantenimiento, ve historial

## Próximos Pasos

- Implementar autenticación completa
- Agregar validaciones y middlewares
- Crear más componentes de UI
- Implementar reportes
- Agregar notificaciones por email
- Testing unitario e integración