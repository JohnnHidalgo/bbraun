"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../../infrastructure/middleware/authMiddleware");
const router = (0, express_1.Router)();
// Obtener URLs de login de Microsoft
router.get('/microsoft-login-url', authController_1.getMicrosoftLoginUrl);
// Callback de Microsoft (OAuth redirect URI)
router.get('/callback', authController_1.handleMicrosoftCallback);
// Logout
router.post('/logout', authMiddleware_1.authMiddleware, authController_1.logout);
// Obtener usuario actual
router.get('/me', authMiddleware_1.authMiddleware, authController_1.getCurrentUser);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map