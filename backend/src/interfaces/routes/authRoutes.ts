import { Router } from 'express';
import {
  getMicrosoftLoginUrl,
  handleMicrosoftCallback,
  logout,
  getCurrentUser,
} from '../controllers/authController';
import { authMiddleware } from '../../infrastructure/middleware/authMiddleware';

const router = Router();

// Obtener URLs de login de Microsoft
router.get('/microsoft-login-url', getMicrosoftLoginUrl);

// Callback de Microsoft (OAuth redirect URI)
router.get('/callback', handleMicrosoftCallback);

// Logout
router.post('/logout', authMiddleware, logout);

// Obtener usuario actual
router.get('/me', authMiddleware, getCurrentUser);

export default router;
