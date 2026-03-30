# Integración con Microsoft Entra ID (Azure AD)

## Descripción

Este sistema ahora requiere autenticación con correos institucionales mediante **Microsoft Entra ID** (anteriormente Azure AD). Los usuarios deben iniciar sesión con sus cuentas organizacionales de B. Braun.

## Requisitos de Configuración

### 1. Registrar la aplicación en Azure Portal

1. Ve a [Azure Portal](https://portal.azure.com)
2. Selecciona **Azure Active Directory** (o **Entra ID**)
3. Ve a **Registros de aplicaciones** > **Nuevo registro**
4. Completa los campos:
   - **Nombre**: `B. Braun - Sistema de Gestión`
   - **Tipos de cuenta admitidos**: Selecciona según tu organización
   - **URI de redirección**: 
     - Tipo: Web
     - URL: `http://localhost:3000/api/auth/callback` (desarrollo)
     - URL: `https://tudominio.com/api/auth/callback` (producción)

### 2. Obtener credenciales

Después de crear el registro:

1. Ve a **Certificados y secretos**
2. Crea un **Nuevo secreto de cliente**
   - Descripción: `Backend Secret`
   - Expira en: 24 meses
3. **Copia y guarda** el valor del secreto (no podrás verlo de nuevo)
4. Ve a **Información general** y copia:
   - **ID de aplicación (cliente)**
   - **ID del directorio (inquilino)**

### 3. Configurar permisos API

1. En el registro, ve a **Permisos de API**
2. Haz clic en **Agregar una permiso** > **Microsoft Graph**
3. Selecciona **Permisos delegados** y busca:
   - `User.Read`
   - `Mail.Read`
4. Haz clic en **Agregar permisos**

### 4. Agregar variables de entorno

En el archivo `.env` del backend:

```env
MICROSOFT_CLIENT_ID=<ID de aplicación>
MICROSOFT_CLIENT_SECRET=<Valor del secreto>
MICROSOFT_TENANT_ID=<ID del directorio>
MICROSOFT_REDIRECT_URI=http://localhost:3000/api/auth/callback
JWT_SECRET=<Genera una clave segura>
```

## Flujo de Autenticación

1. **Usuario abre la app** → Redirigido a `/login`
2. **Click en "Iniciar Sesión con Microsoft"** → Abre el login de Microsoft
3. **Usuario autentica** → Microsoft redirige a `/api/auth/callback` con código
4. **Backend valida código** → Obtiene token de acceso
5. **Backend consulta Microsoft Graph** → Obtiene datos del usuario
6. **Backend crea/actualiza usuario** → Genera JWT
7. **Frontend recibe JWT** → Lo guarda en `localStorage`
8. **Usuario accede al sistema** → Incluye JWT en cada solicitud

## Rutas de Autenticación

### GET `/api/auth/microsoft-login-url`
Obtiene la URL de login de Microsoft.

**Respuesta:**
```json
{
  "authUrl": "https://login.microsoftonline.com/..."
}
```

### GET `/api/auth/callback?code=...`
Valida el código de autorización y retorna JWT.

**Respuesta exitosa:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": "cmmxsrq10000043k6wef0gcev",
    "nombre": "Juan Pérez",
    "email": "juan@bbraun.com",
    "rol": "Tecnico"
  }
}
```

### GET `/api/auth/me`
Obtiene el usuario actual (requiere token en header).

**Header requerido:**
```
Authorization: Bearer <token>
```

### POST `/api/auth/logout`
Cierra sesión del usuario.

## Migración de Datos

Para usuarios existentes que ya tienen contraseña:

1. El campo `password` ahora es opcional
2. El nuevo campo `azureId` almacena el ID único de Microsoft
3. Los usuarios existentes pueden continuar con contraseña hasta migrar a Microsoft
4. Cuando un usuario inicia sesión con Microsoft, se asigna automáticamente su `azureId`

## Variables de Entorno Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `MICROSOFT_CLIENT_ID` | ID de la aplicación en Azure | `a1b2c3d4-e5f6-...` |
| `MICROSOFT_CLIENT_SECRET` | Secreto de la aplicación | `aB~cD.eF1234567890...` |
| `MICROSOFT_TENANT_ID` | ID del directorio | `12a345bc-6de7-...` |
| `MICROSOFT_REDIRECT_URI` | URL de redirección | `http://localhost:3000/api/auth/callback` |
| `JWT_SECRET` | Clave para firmar JWT | Genera una clave segura |
| `JWT_EXPIRES_IN` | Expiración del token | `24h` |
| `FRONTEND_URL` | URL del frontend para CORS | `http://localhost:5173` |

## Desarrollo Local

1. Copia `.env.example` a `.env`
2. Rellena con tus credenciales de Azure
3. Ejecuta migraciones de Prisma:
   ```bash
   npm run prisma:migrate
   ```
4. Inicia el backend: `npm run dev`
5. Inicia el frontend: `npm run dev`
6. Abre `http://localhost:5173` → Serás redirigido a `/login`

## Solución de Problemas

### "Invalid redirect URI"
- Verifica que `MICROSOFT_REDIRECT_URI` coincida exactamente con lo configurado en Azure
- Incluye el protocolo (http:// o https://)

### "CORS error"
- Asegúrate de que `FRONTEND_URL` está configurado correctamente en `.env`
- Verifica que el frontend hace las solicitudes a la URL correcta del backend

### "Token expirado"
- El JWT expira después del tiempo configurado en `JWT_EXPIRES_IN`
- Implementa refresh tokens para sesiones más largas (futuro)

## Seguridad

- **Nunca** commits `.env` con credenciales reales al repositorio
- Usa `.env.example` como template
- Agrega `.env` a `.gitignore`
- Rota el `JWT_SECRET` periódicamente en producción
- Usa HTTPS en producción
- Expira tokens según política de seguridad de la organización

## Contacto

Para problemas con la integración, contacta al equipo de TI de B. Braun.
