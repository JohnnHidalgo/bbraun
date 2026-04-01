"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const microsoft_config_1 = require("../../config/microsoft.config");
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, microsoft_config_1.jwtConfig.secret);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
exports.authMiddleware = authMiddleware;
const generateToken = (user) => {
    const signOptions = { expiresIn: microsoft_config_1.jwtConfig.expiresIn };
    return jsonwebtoken_1.default.sign(user, microsoft_config_1.jwtConfig.secret, signOptions);
};
exports.generateToken = generateToken;
//# sourceMappingURL=authMiddleware.js.map