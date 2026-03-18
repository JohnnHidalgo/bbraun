"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactoController = void 0;
const contactoService_1 = require("../../services/contactoService");
const contactoService = new contactoService_1.ContactoService();
class ContactoController {
    // Obtener todos los contactos de un cliente
    async getContactosByCliente(req, res) {
        try {
            const { clienteId } = req.params;
            const contactos = await contactoService.getContactosByCliente(clienteId);
            res.json(contactos);
        }
        catch (error) {
            console.error('Error al obtener contactos:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    // Obtener un contacto por ID
    async getContactoById(req, res) {
        try {
            const { id } = req.params;
            const contacto = await contactoService.getContactoById(id);
            if (!contacto) {
                return res.status(404).json({ error: 'Contacto no encontrado' });
            }
            res.json(contacto);
        }
        catch (error) {
            console.error('Error al obtener contacto:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    // Crear un nuevo contacto
    async createContacto(req, res) {
        try {
            const contactoData = req.body;
            const nuevoContacto = await contactoService.createContacto(contactoData);
            res.status(201).json(nuevoContacto);
        }
        catch (error) {
            console.error('Error al crear contacto:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    // Actualizar un contacto
    async updateContacto(req, res) {
        try {
            const { id } = req.params;
            const contactoData = req.body;
            const contactoActualizado = await contactoService.updateContacto(id, contactoData);
            if (!contactoActualizado) {
                return res.status(404).json({ error: 'Contacto no encontrado' });
            }
            res.json(contactoActualizado);
        }
        catch (error) {
            console.error('Error al actualizar contacto:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    // Eliminar un contacto
    async deleteContacto(req, res) {
        try {
            const { id } = req.params;
            const eliminado = await contactoService.deleteContacto(id);
            if (!eliminado) {
                return res.status(404).json({ error: 'Contacto no encontrado' });
            }
            res.json({ message: 'Contacto eliminado exitosamente' });
        }
        catch (error) {
            console.error('Error al eliminar contacto:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    // Establecer contacto principal
    async setContactoPrincipal(req, res) {
        try {
            const { id } = req.params;
            const contacto = await contactoService.setContactoPrincipal(id);
            if (!contacto) {
                return res.status(404).json({ error: 'Contacto no encontrado' });
            }
            res.json(contacto);
        }
        catch (error) {
            console.error('Error al establecer contacto principal:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}
exports.ContactoController = ContactoController;
//# sourceMappingURL=contactoController.js.map