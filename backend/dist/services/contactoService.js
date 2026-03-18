"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactoService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ContactoService {
    // Obtener todos los contactos de un cliente
    async getContactosByCliente(clienteId) {
        return await prisma.contacto.findMany({
            where: { clienteId },
            orderBy: [
                { esPrincipal: 'desc' }, // Los principales primero
                { createdAt: 'asc' }
            ]
        });
    }
    // Obtener un contacto por ID
    async getContactoById(id) {
        return await prisma.contacto.findUnique({
            where: { id }
        });
    }
    // Crear un nuevo contacto
    async createContacto(data) {
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
    async updateContacto(id, data) {
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
    async deleteContacto(id) {
        try {
            await prisma.contacto.delete({
                where: { id }
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    // Establecer contacto como principal
    async setContactoPrincipal(id) {
        const contacto = await prisma.contacto.findUnique({ where: { id } });
        if (!contacto)
            return null;
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
exports.ContactoService = ContactoService;
//# sourceMappingURL=contactoService.js.map