import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Limpiar tablas para poder ejecutar seed múltiples veces
  await prisma.usoRepuesto.deleteMany();
  await prisma.visita.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.contrato.deleteMany();
  await prisma.inventarioCliente.deleteMany();
  await prisma.contacto.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.repuesto.deleteMany();

  console.log('🔄 Tablas limpiadas');

  // Crear Usuarios (Técnicos)
  const tecnico1 = await prisma.usuario.create({
    data: {
      nombre: 'Juan Pérez',
      email: 'juan.perez@bbraun.com',
      password: '$2b$10$dummy.hash.for.demo', // En producción usar hash real
      rol: 'Tecnico',
      region: 'La Paz'
    }
  });

  const tecnico2 = await prisma.usuario.create({
    data: {
      nombre: 'María García',
      email: 'maria.garcia@bbraun.com',
      password: '$2b$10$dummy.hash.for.demo',
      rol: 'Tecnico',
      region: 'Santa Cruz'
    }
  });

  const tecnico3 = await prisma.usuario.create({
    data: {
      nombre: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@bbraun.com',
      password: '$2b$10$dummy.hash.for.demo',
      rol: 'Tecnico',
      region: 'Cochabamba'
    }
  });

  console.log('✅ Técnicos creados');

  // Crear Clientes
  const cliente1 = await prisma.cliente.create({
    data: {
      nombre: 'Hospital Santa Cruz',
      tipo: 'Hospital',
      direccion: 'Av. Cristo Redentor 505',
      ciudad: 'Santa Cruz'
    }
  });

  const cliente2 = await prisma.cliente.create({
    data: {
      nombre: 'Clínica Los Olivos',
      tipo: 'Clínica',
      direccion: 'Calle 21 de Mayo 1478',
      ciudad: 'La Paz'
    }
  });

  const cliente3 = await prisma.cliente.create({
    data: {
      nombre: 'Hospital Viedma',
      tipo: 'Hospital',
      direccion: 'Av. Blanco Galindo Km 7',
      ciudad: 'Cochabamba'
    }
  });

  const cliente4 = await prisma.cliente.create({
    data: {
      nombre: 'Centro Médico Integral',
      tipo: 'Centro Médico',
      direccion: 'Zona Norte, Calle 5 #123',
      ciudad: 'Santa Cruz'
    }
  });

  console.log('✅ Clientes creados');

  // Crear contacto principal para cada cliente
  await prisma.contacto.create({
    data: {
      clienteId: cliente1.id,
      nombre: 'Dr. Ana López',
      cargo: 'Director Médico',
      telefono: '+591 3 1234567',
      email: 'ana.lopez@hospitalscz.com',
      esPrincipal: true
    }
  });
  await prisma.contacto.create({
    data: {
      clienteId: cliente2.id,
      nombre: 'Lic. Roberto Sánchez',
      cargo: 'Administrador',
      telefono: '+591 2 7654321',
      email: 'roberto.sanchez@clinicalosolivos.com',
      esPrincipal: true
    }
  });
  await prisma.contacto.create({
    data: {
      clienteId: cliente3.id,
      nombre: 'Dra. Patricia Morales',
      cargo: 'Jefe de Área',
      telefono: '+591 4 9876543',
      email: 'patricia.morales@hospitalviedma.com',
      esPrincipal: true
    }
  });
  await prisma.contacto.create({
    data: {
      clienteId: cliente4.id,
      nombre: 'Dr. Miguel Ángel Torres',
      cargo: 'Director Médico',
      telefono: '+591 3 5551234',
      email: 'miguel.torres@centromedico.com',
      esPrincipal: true
    }
  });

  // Crear contactos adicionales para cada cliente
  await prisma.contacto.createMany({
    data: [
      {
        clienteId: cliente1.id,
        nombre: 'Dr. Luis Fernández',
        cargo: 'Administrador de Planta',
        telefono: '+591 3 2223333',
        email: 'luis.fernandez@hospitalscz.com',
        esPrincipal: false,
      },
      {
        clienteId: cliente2.id,
        nombre: 'Sra. Elena Rojas',
        cargo: 'Front Desk',
        telefono: '+591 2 4445555',
        email: 'elena.rojas@clinicalosolivos.com',
        esPrincipal: false,
      },
      {
        clienteId: cliente3.id,
        nombre: 'Ing. Víctor Salinas',
        cargo: 'Jefe de Mantenimiento',
        telefono: '+591 4 3332221',
        email: 'victor.salinas@hospitalviedma.com',
        esPrincipal: false,
      },
      {
        clienteId: cliente4.id,
        nombre: 'Dra. Sandra Prado',
        cargo: 'Director Médico',
        telefono: '+591 3 7778888',
        email: 'sandra.prado@centromedico.com',
        esPrincipal: false,
      }
    ]
  });

  console.log('✅ Contactos adicionales creados');

  // Crear Repuestos
  const repuesto1 = await prisma.repuesto.create({
    data: {
      nombre: 'Filtro BBRAUN Dialyzer',
      codigo: 'FLT-BBR-001',
      descripcion: 'Filtro especializado para diálisis BBRAUN'
    }
  });

  const repuesto2 = await prisma.repuesto.create({
    data: {
      nombre: 'Sensor de Presión',
      codigo: 'SEN-PRS-002',
      descripcion: 'Sensor de presión para monitores BBRAUN'
    }
  });

  const repuesto3 = await prisma.repuesto.create({
    data: {
      nombre: 'Bomba Peristáltica',
      codigo: 'BOM-PER-003',
      descripcion: 'Bomba peristáltica para equipos de infusión'
    }
  });

  const repuesto4 = await prisma.repuesto.create({
    data: {
      nombre: 'Manguera Silicone',
      codigo: 'MAN-SIL-004',
      descripcion: 'Manguera de silicona médica grado alimenticio'
    }
  });

  const repuesto5 = await prisma.repuesto.create({
    data: {
      nombre: 'Transductor Ultrasónico',
      codigo: 'TRA-ULT-005',
      descripcion: 'Transductor para equipos de ultrasonido'
    }
  });

  const repuesto6 = await prisma.repuesto.create({
    data: {
      nombre: 'Panel Táctil',
      codigo: 'PAN-TAC-006',
      descripcion: 'Panel táctil de repuesto para monitores'
    }
  });

  const repuesto7 = await prisma.repuesto.create({
    data: {
      nombre: 'Fuente de Alimentación',
      codigo: 'FUE-ALI-007',
      descripcion: 'Fuente de alimentación para equipos de infusión'
    }
  });

  console.log('✅ Repuestos creados');

  // Crear Máquinas
  const maquina1 = await prisma.maquina.create({
    data: {
      modelo: 'BBRAUN Dialog+',
      numeroSerie: 'DIALOG-2024-001',
      fechaCompra: new Date('2024-01-15'),
      fechaInstalacion: new Date('2024-02-01'),
      clienteId: cliente1.id,
      estado: 'Activo'
    }
  });

  const maquina2 = await prisma.maquina.create({
    data: {
      modelo: 'BBRAUN Infusomat Space',
      numeroSerie: 'INFUSO-2024-002',
      fechaCompra: new Date('2024-01-20'),
      fechaInstalacion: new Date('2024-02-15'),
      clienteId: cliente1.id,
      estado: 'Activo'
    }
  });

  const maquina3 = await prisma.maquina.create({
    data: {
      modelo: 'BBRAUN Perfusor Space',
      numeroSerie: 'PERFUS-2024-003',
      fechaCompra: new Date('2024-02-01'),
      fechaInstalacion: new Date('2024-02-20'),
      clienteId: cliente2.id,
      estado: 'En Mantenimiento'
    }
  });

  const maquina4 = await prisma.maquina.create({
    data: {
      modelo: 'BBRAUN Vista',
      numeroSerie: 'VISTA-2024-004',
      fechaCompra: new Date('2024-02-10'),
      fechaInstalacion: new Date('2024-03-01'),
      clienteId: cliente3.id,
      estado: 'Activo'
    }
  });

  const maquina5 = await prisma.maquina.create({
    data: {
      modelo: 'BBRAUN Ecoflac',
      numeroSerie: 'ECOF-2024-005',
      fechaCompra: new Date('2024-03-01'),
      fechaInstalacion: new Date('2024-03-15'),
      clienteId: cliente4.id,
      estado: 'Activo'
    }
  });

  console.log('✅ Máquinas creadas');

  // Crear Contratos
  await prisma.contrato.create({
    data: {
      clienteId: cliente1.id,
      fechaInicio: new Date('2024-01-01'),
      fechaFin: new Date('2025-12-31'),
      anosGarantia: 2,
      observaciones: 'Contrato de mantenimiento completo con cobertura 24/7'
    }
  });

  await prisma.contrato.create({
    data: {
      clienteId: cliente2.id,
      fechaInicio: new Date('2024-02-01'),
      fechaFin: new Date('2025-12-31'),
      anosGarantia: 2,
      observaciones: 'Mantenimiento preventivo mensual'
    }
  });

  console.log('✅ Contratos creados');

  // Crear Tickets
  const ticket1 = await prisma.ticket.create({
    data: {
      tipo: 'Preventivo',
      estado: 'Completado',
      clienteId: cliente1.id,
      maquinaId: maquina1.id,
      fechaSolicitud: new Date('2024-03-01'),
      prioridad: 'Media',
      descripcion: 'Mantenimiento preventivo mensual - limpieza y calibración',
      tecnicoId: tecnico1.id
    }
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      tipo: 'Correctivo',
      estado: 'En Progreso',
      clienteId: cliente2.id,
      maquinaId: maquina3.id,
      fechaSolicitud: new Date('2024-03-05'),
      prioridad: 'Alta',
      descripcion: 'Falla en bomba de infusión - requiere reparación urgente',
      tecnicoId: tecnico2.id
    }
  });

  const ticket3 = await prisma.ticket.create({
    data: {
      tipo: 'Preventivo',
      estado: 'Programado',
      clienteId: cliente3.id,
      maquinaId: maquina4.id,
      fechaSolicitud: new Date('2024-03-10'),
      prioridad: 'Baja',
      descripcion: 'Mantenimiento preventivo trimestral',
      tecnicoId: tecnico3.id
    }
  });

  const ticket4 = await prisma.ticket.create({
    data: {
      tipo: 'Correctivo',
      estado: 'Esperando Repuestos',
      clienteId: cliente4.id,
      maquinaId: maquina5.id,
      fechaSolicitud: new Date('2024-03-08'),
      prioridad: 'Media',
      descripcion: 'Reemplazo de sensor defectuoso',
      tecnicoId: tecnico1.id
    }
  });

  console.log('✅ Tickets creados');

  // Agregar tickets adicionales para mayor variedad
  const ticket5 = await prisma.ticket.create({
    data: {
      tipo: 'Preventivo',
      estado: 'Completado',
      clienteId: cliente4.id,
      maquinaId: maquina5.id,
      fechaSolicitud: new Date('2024-03-20'),
      prioridad: 'Baja',
      descripcion: 'Revisión anual del equipo',
      tecnicoId: tecnico3.id
    }
  });

  const ticket6 = await prisma.ticket.create({
    data: {
      tipo: 'Correctivo',
      estado: 'Completado',
      clienteId: cliente1.id,
      maquinaId: maquina2.id,
      fechaSolicitud: new Date('2024-04-01'),
      prioridad: 'Alta',
      descripcion: 'Reemplazo de bomba peristáltica dañada',
      tecnicoId: tecnico2.id
    }
  });

  console.log('✅ Tickets adicionales creados');

  // Crear Visitas
  const visita1 = await prisma.visita.create({
    data: {
      ticketId: ticket1.id,
      tecnicoId: tecnico1.id,
      fechaVisita: new Date('2024-03-02'),
      horasTrabajo: 4.5,
      descripcionTrabajo: 'Limpieza completa del equipo, calibración de sensores, verificación de funcionamiento',
      resultado: 'Exitoso'
    }
  });

  const visita2 = await prisma.visita.create({
    data: {
      ticketId: ticket2.id,
      tecnicoId: tecnico2.id,
      fechaVisita: new Date('2024-03-06'),
      horasTrabajo: 6.0,
      descripcionTrabajo: 'Diagnóstico inicial realizado, esperando repuestos para reparación',
      resultado: 'Pendiente'
    }
  });

  console.log('✅ Visitas creadas');

  // Agregar visitas para tickets adicionales
  const visita3 = await prisma.visita.create({
    data: {
      ticketId: ticket5.id,
      tecnicoId: tecnico3.id,
      fechaVisita: new Date('2024-03-22'),
      horasTrabajo: 2.0,
      descripcionTrabajo: 'Revisión general, sin necesidad de repuestos',
      resultado: 'Exitoso'
    }
  });

  const visita4 = await prisma.visita.create({
    data: {
      ticketId: ticket6.id,
      tecnicoId: tecnico2.id,
      fechaVisita: new Date('2024-04-02'),
      horasTrabajo: 5.5,
      descripcionTrabajo: 'Instalación de nueva bomba, pruebas de funcionamiento',
      resultado: 'Exitoso'
    }
  });

  console.log('✅ Visitas adicionales creadas');

  // Crear Uso de Repuestos
  await prisma.usoRepuesto.create({
    data: {
      visitaId: visita1.id,
      repuestoId: repuesto1.id,
      cantidad: 1
    }
  });

  await prisma.usoRepuesto.create({
    data: {
      visitaId: visita1.id,
      repuestoId: repuesto2.id,
      cantidad: 2
    }
  });

  await prisma.usoRepuesto.create({
    data: {
      visitaId: visita2.id,
      repuestoId: repuesto3.id,
      cantidad: 1
    }
  });

  // usos para nuevas visitas
  await prisma.usoRepuesto.create({
    data: {
      visitaId: visita4.id,
      repuestoId: repuesto3.id,
      cantidad: 1
    }
  });

  await prisma.usoRepuesto.create({
    data: {
      visitaId: visita4.id,
      repuestoId: repuesto4.id,
      cantidad: 2
    }
  });

  console.log('✅ Uso de repuestos registrado');

  // Crear Inventario de Clientes
  await prisma.inventarioCliente.create({
    data: {
      clienteId: cliente1.id,
      repuestoId: repuesto1.id,
      cantidad: 5
    }
  });

  await prisma.inventarioCliente.create({
    data: {
      clienteId: cliente1.id,
      repuestoId: repuesto2.id,
      cantidad: 3
    }
  });

  await prisma.inventarioCliente.create({
    data: {
      clienteId: cliente1.id,
      repuestoId: repuesto6.id,
      cantidad: 2
    }
  });

  // cliente2 inventario
  await prisma.inventarioCliente.create({
    data: {
      clienteId: cliente2.id,
      repuestoId: repuesto3.id,
      cantidad: 2
    }
  });
  await prisma.inventarioCliente.create({
    data: {
      clienteId: cliente2.id,
      repuestoId: repuesto1.id,
      cantidad: 4
    }
  });

  // cliente3 inventario
  await prisma.inventarioCliente.create({
    data: {
      clienteId: cliente3.id,
      repuestoId: repuesto4.id,
      cantidad: 10
    }
  });
  await prisma.inventarioCliente.create({
    data: {
      clienteId: cliente3.id,
      repuestoId: repuesto2.id,
      cantidad: 1
    }
  });

  // cliente4 inventario
  await prisma.inventarioCliente.create({
    data: {
      clienteId: cliente4.id,
      repuestoId: repuesto5.id,
      cantidad: 1
    }
  });
  await prisma.inventarioCliente.create({
    data: {
      clienteId: cliente4.id,
      repuestoId: repuesto3.id,
      cantidad: 2
    }
  });

  await prisma.inventarioCliente.create({
    data: {
      clienteId: cliente4.id,
      repuestoId: repuesto7.id,
      cantidad: 1
    }
  });

  console.log('✅ Inventario de clientes creado');

  // Crear Encuestas de Satisfacción
  await prisma.encuestaSatisfaccion.create({
    data: {
      ticketId: ticket1.id,
      calificacion: 5,
      comentarios: 'Excelente servicio, técnico muy profesional y puntal'
    }
  });

  console.log('✅ Encuestas de satisfacción creadas');

  console.log('🎉 Seed completado exitosamente!');
  console.log('\n📊 Resumen de datos creados:');
  console.log('- 3 Técnicos');
  console.log('- 4 Clientes');
  console.log('- 7 Repuestos');
  console.log('- 5 Máquinas');
  console.log('- 2 Contratos');
  console.log('- 6 Tickets');
  console.log('- 4 Visitas');
  console.log('- 6 Registros de uso de repuestos');
  console.log('- 10 Registros de inventario');  console.log('- 8 Contactos');  console.log('- 1 Encuesta de satisfacción');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });