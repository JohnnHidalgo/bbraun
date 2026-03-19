"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inventarioController_1 = require("../controllers/inventarioController");
const router = (0, express_1.Router)();
router.get('/', inventarioController_1.getInventarios);
router.get('/cliente/:clienteId', inventarioController_1.getInventariosByCliente);
router.get('/:id', inventarioController_1.getInventarioById);
router.post('/', inventarioController_1.createInventario);
router.put('/:id', inventarioController_1.updateInventario);
router.delete('/:id', inventarioController_1.deleteInventario);
exports.default = router;
//# sourceMappingURL=inventarioRoutes.js.map