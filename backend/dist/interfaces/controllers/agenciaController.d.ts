import { Request, Response } from 'express';
export declare const getAgencias: (req: Request, res: Response) => Promise<void>;
export declare const getAgenciaById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createAgencia: (req: Request, res: Response) => Promise<void>;
export declare const updateAgencia: (req: Request, res: Response) => Promise<void>;
export declare const deleteAgencia: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=agenciaController.d.ts.map