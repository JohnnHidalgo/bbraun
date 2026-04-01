"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agenciaController_1 = require("../controllers/agenciaController");
const router = (0, express_1.Router)();
router.get('/', agenciaController_1.getAgencias);
router.get('/:id', agenciaController_1.getAgenciaById);
router.post('/', agenciaController_1.createAgencia);
router.put('/:id', agenciaController_1.updateAgencia);
router.delete('/:id', agenciaController_1.deleteAgencia);
exports.default = router;
//# sourceMappingURL=agenciaRoutes.js.map