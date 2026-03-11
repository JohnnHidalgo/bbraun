import { Request, Response } from 'express';
export declare const getRepuestos: (req: Request, res: Response) => Promise<void>;
export declare const createRepuesto: (req: Request, res: Response) => Promise<void>;
export declare const getRepuestoById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateRepuesto: (req: Request, res: Response) => Promise<void>;
export declare const deleteRepuesto: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=repuestoController.d.ts.map