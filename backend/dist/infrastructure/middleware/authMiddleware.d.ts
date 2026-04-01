import { Request, Response, NextFunction } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        nombre: string;
        azureId: string;
    };
}
export declare const authMiddleware: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const generateToken: (user: {
    id: string;
    email: string;
    nombre: string;
    azureId: string;
}) => string;
//# sourceMappingURL=authMiddleware.d.ts.map