import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateContacts() {
  console.log('Iniciando migración de contactos...');

  try {
    // Obtener todos los clientes
    const clientes = await prisma.cliente.findMany();

    console.log(`Encontrados ${clientes.length} clientes totales`);

    // Filtrar clientes que tienen datos de contacto
    const clientesConContacto = clientes.filter(cliente =>
      cliente.nombreContacto && cliente.telefonoContacto
    );

    console.log(`Encontrados ${clientesConContacto.length} clientes con datos de contacto`);

    for (const cliente of clientesConContacto) {
      // Verificar que los campos no sean null
      if (!cliente.nombreContacto || !cliente.telefonoContacto) {
        console.log(`Cliente ${cliente.nombre} tiene datos incompletos, saltando...`);
        continue;
      }

      // Crear contacto principal para cada cliente
      await prisma.contacto.create({
        data: {
          clienteId: cliente.id,
          nombre: cliente.nombreContacto,
          telefono: cliente.telefonoContacto,
          esPrincipal: true, // Marcar como principal
          cargo: 'Contacto Principal' // Valor por defecto
        }
      });

      console.log(`Migrado contacto para cliente: ${cliente.nombre}`);
    }

    console.log('Migración de contactos completada exitosamente');

  } catch (error) {
    console.error('Error durante la migración:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la migración
migrateContacts()
  .then(() => {
    console.log('Script de migración finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error en el script de migración:', error);
    process.exit(1);
  });