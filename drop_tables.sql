-- Script SQL para eliminar todas las tablas de la base de datos bbraun_db
-- Ejecutar con precaución: esto eliminará todas las tablas y datos

-- Eliminar tablas en orden inverso a las dependencias para evitar errores de foreign keys
DROP TABLE IF EXISTS "encuestas_satisfaccion" CASCADE;
DROP TABLE IF EXISTS "inventario_clientes" CASCADE;
DROP TABLE IF EXISTS "uso_repuestos" CASCADE;
DROP TABLE IF EXISTS "repuestos" CASCADE;
DROP TABLE IF EXISTS "visitas" CASCADE;
DROP TABLE IF EXISTS "tickets" CASCADE;
DROP TABLE IF EXISTS "contratos" CASCADE;
DROP TABLE IF EXISTS "maquinas" CASCADE;
DROP TABLE IF EXISTS "contactos" CASCADE;
DROP TABLE IF EXISTS "clientes" CASCADE;
DROP TABLE IF EXISTS "agencias" CASCADE;
DROP TABLE IF EXISTS "usuarios" CASCADE;