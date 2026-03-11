import { Request, Response } from 'express';
export declare const getClientes: (req: Request, res: Response) => Promise<void>;
export declare const createCliente: (req: Request, res: Response) => Promise<void>;
export declare const getClienteById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateCliente: (req: Request, res: Response) => Promise<void>;
export declare const deleteCliente: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=clienteController.d.ts.map