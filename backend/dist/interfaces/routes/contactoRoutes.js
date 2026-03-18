"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactoController_1 = require("../controllers/contactoController");
const router = (0, express_1.Router)();
const contactoController = new contactoController_1.ContactoController();
// Rutas para contactos
router.get('/cliente/:clienteId', (req, res) => contactoController.getContactosByCliente(req, res));
router.get('/:id', (req, res) => contactoController.getContactoById(req, res));
router.post('/', (req, res) => contactoController.createContacto(req, res));
router.put('/:id', (req, res) => contactoController.updateContacto(req, res));
router.delete('/:id', (req, res) => contactoController.deleteContacto(req, res));
router.patch('/:id/principal', (req, res) => contactoController.setContactoPrincipal(req, res));
exports.default = router;
//# sourceMappingURL=contactoRoutes.js.map