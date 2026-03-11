"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const visitaController_1 = require("../controllers/visitaController");
const router = (0, express_1.Router)();
router.get('/', visitaController_1.getVisitas);
router.post('/', visitaController_1.createVisita);
router.get('/:id', visitaController_1.getVisitaById);
router.put('/:id', visitaController_1.updateVisita);
router.delete('/:id', visitaController_1.deleteVisita);
exports.default = router;
//# sourceMappingURL=visitaRoutes.js.map