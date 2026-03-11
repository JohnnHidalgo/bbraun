import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ContactoService {
  // Obtener todos los contactos de un cliente
  async getContactosByCliente(clienteId: string) {
    return await prisma.contacto.findMany({
      where: { clienteId },
      orderBy: [
        { esPrincipal: 'desc' }, // Los principales primero
        { createdAt: 'asc' }
      ]
    });
  }

  // Obtener un contacto por ID
  async getContactoById(id: string) {
    return await prisma.contacto.findUnique({
      where: { id }
    });
  }

  // Crear un nuevo contacto
  async createContacto(data: {
    clienteId: string;
    nombre: string;
    cargo?: string;
    telefono: string;
    email?: string;
    esPrincipal?: boolean;
  }) {
    // Si es principal, quitar el principal de otros contactos
    if (data.esPrincipal) {
      await prisma.contacto.updateMany({
        where: { clienteId: data.clienteId },
        data: { esPrincipal: false }
      });
    }

    return await prisma.contacto.create({
      data
    });
  }

  // Actualizar un contacto
  async updateContacto(id: string, data: Partial<{
    nombre: string;
    cargo: string;
    telefono: string;
    email: string;
    esPrincipal: boolean;
  }>) {
    // Si se está marcando como principal, quitar el principal de otros
    if (data.esPrincipal) {
      const contacto = await prisma.contacto.findUnique({ where: { id } });
      if (contacto) {
        await prisma.contacto.updateMany({
          where: { clienteId: contacto.clienteId },
          data: { esPrincipal: false }
        });
      }
    }

    return await prisma.contacto.update({
      where: { id },
      data
    });
  }

  // Eliminar un contacto
  async deleteContacto(id: string) {
    try {
      await prisma.contacto.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Establecer contacto como principal
  async setContactoPrincipal(id: string) {
    const contacto = await prisma.contacto.findUnique({ where: { id } });
    if (!contacto) return null;

    // Quitar principal de otros contactos del mismo cliente
    await prisma.contacto.updateMany({
      where: { clienteId: contacto.clienteId },
      data: { esPrincipal: false }
    });

    // Establecer este como principal
    return await prisma.contacto.update({
      where: { id },
      data: { esPrincipal: true }
    });
  }
}