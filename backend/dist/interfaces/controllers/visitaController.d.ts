import { Request, Response } from 'express';
export declare const getVisitas: (req: Request, res: Response) => Promise<void>;
export declare const createVisita: (req: Request, res: Response) => Promise<void>;
export declare const getVisitaById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateVisita: (req: Request, res: Response) => Promise<void>;
export declare const deleteVisita: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=visitaController.d.ts.map