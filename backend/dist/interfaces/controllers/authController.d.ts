import { Response } from 'express';
import { AuthenticatedRequest } from '../../infrastructure/middleware/authMiddleware';
export declare const getMicrosoftLoginUrl: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const handleMicrosoftCallback: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const logout: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getCurrentUser: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=authController.d.ts.map