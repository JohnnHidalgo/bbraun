"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agenciaController_1 = require("../controllers/agenciaController");
const router = (0, express_1.Router)();
router.get('/', agenciaController_1.getAgencias);
exports.default = router;
//# sourceMappingURL=agenciaRoutes.js.map