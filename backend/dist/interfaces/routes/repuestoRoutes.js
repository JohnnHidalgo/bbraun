"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const repuestoController_1 = require("../controllers/repuestoController");
const router = (0, express_1.Router)();
router.get('/', repuestoController_1.getRepuestos);
router.post('/', repuestoController_1.createRepuesto);
router.get('/cliente/:clienteId', repuestoController_1.getRepuestosByCliente);
router.get('/:id', repuestoController_1.getRepuestoById);
router.put('/:id', repuestoController_1.updateRepuesto);
router.delete('/:id', repuestoController_1.deleteRepuesto);
exports.default = router;
//# sourceMappingURL=repuestoRoutes.js.map