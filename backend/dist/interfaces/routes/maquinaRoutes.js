"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const maquinaController_1 = require("../controllers/maquinaController");
const router = (0, express_1.Router)();
router.get('/', maquinaController_1.getMaquinas);
router.post('/', maquinaController_1.createMaquina);
router.get('/:id', maquinaController_1.getMaquinaById);
router.put('/:id', maquinaController_1.updateMaquina);
router.delete('/:id', maquinaController_1.deleteMaquina);
exports.default = router;
//# sourceMappingURL=maquinaRoutes.js.map