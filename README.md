# Sistema de Mantenimiento BBRAUN - Droguería INTI

## Descripción General

Sistema de gestión de mantenimiento preventivo y correctivo para equipos BBRAUN con autenticación integrada a Microsoft Entra ID.

## Características Principales

- ✅ **Autenticación con Microsoft**: Los usuarios inician sesión con sus correos institucionales
- ✅ **Gestión de Clientes**: Hospitales y clínicas
- ✅ **Control de Máquinas**: Registro y seguimiento de equipos BBRAUN
- ✅ **Sistema de Tickets**: Mantenimiento preventivo y correctivo
- ✅ **Visitas Técnicas**: Registro de intervenciones
- ✅ **Gestión de Repuestos**: Control de inventario
- ✅ **Reportes**: Análisis de mantenimiento y satisfacción

## Arquitectura del Sistema

### Backend (Node.js + Express + Prisma + PostgreSQL)
- **Clean Architecture**: Separación en capas (Entities, Use Cases, Interface Adapters, Frameworks & Drivers)
- **Autenticación**: Microsoft Entra ID + JWT
- **ORM**: Prisma con PostgreSQL
- **Middlewares**: CORS, Helmet, Morgan

### Frontend (React + Vite + Material UI)
- **Clean Architecture**: Componentes, hooks, servicios, contextos
- **UI**: Material UI para interfaz corporativa
- **Estado**: Context API
- **Rutas protegidas**: Solo usuarios autenticados

## Guía de Instalación Rápida

### 1. Configurar Microsoft Entra ID

Ver: [MICROSOFT_AUTH_SETUP.md](./MICROSOFT_AUTH_SETUP.md)

### 2. Backend

```bash
cd backend
npm install
npm run prisma:migrate
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación abrirá en `http://localhost:5173` y redirigirá a la página de login.

## Variables de Entorno Requeridas

Crear archivo `.env` en la carpeta `backend`:

```env
# Microsoft Configuration
MICROSOFT_CLIENT_ID=tu-client-id
MICROSOFT_CLIENT_SECRET=tu-client-secret
MICROSOFT_TENANT_ID=tu-tenant-id
MICROSOFT_REDIRECT_URI=http://localhost:3000/api/auth/callback

# JWT
JWT_SECRET=tu-secreto-seguro
JWT_EXPIRES_IN=24h

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/bbraun

# Server
PORT=3000
FRONTEND_URL=http://localhost:5173
```

## API REST Endpoints

### Autenticación (Pública)
- `GET /api/auth/microsoft-login-url` - Obtiene URL de login
- `GET /api/auth/callback` - Callback de Microsoft OAuth
- `POST /api/auth/logout` - Cierra sesión (con token)
- `GET /api/auth/me` - Usuario actual (con token)

### Usuarios (Protegidas)
- `GET /api/usuarios`
- `POST /api/usuarios`
- `PUT /api/usuarios/:id`
- `DELETE /api/usuarios/:id`

### Clientes (Protegidas)
- `GET /api/clientes`
- `POST /api/clientes`
- `PUT /api/clientes/:id`
- `DELETE /api/clientes/:id`

### Máquinas (Protegidas)
- `GET /api/maquinas`
- `POST /api/maquinas`
- `PUT /api/maquinas/:id`
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