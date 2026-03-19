import { Request, Response } from 'express';
export declare const getInventarios: (req: Request, res: Response) => Promise<void>;
export declare const getInventariosByCliente: (req: Request, res: Response) => Promise<void>;
export declare const getInventarioById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createInventario: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateInventario: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteInventario: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=inventarioController.d.ts.map