import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanOldContactColumns() {
  console.log('Limpiando columnas antiguas de contacto...');

  try {
    // Limpiar las columnas antiguas (poner null)
    await prisma.$executeRaw`UPDATE clientes SET nombreContacto = NULL, telefonoContacto = NULL`;

    console.log('Columnas antiguas limpiadas exitosamente');

  } catch (error) {
    console.error('Error durante la limpieza:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la limpieza
cleanOldContactColumns()
  .then(() => {
    console.log('Script de limpieza finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error en el script de limpieza:', error);
    process.exit(1);
  });