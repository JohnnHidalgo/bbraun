import { Request, Response } from 'express';
export declare const getMaquinas: (req: Request, res: Response) => Promise<void>;
export declare const createMaquina: (req: Request, res: Response) => Promise<void>;
export declare const getMaquinaById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateMaquina: (req: Request, res: Response) => Promise<void>;
export declare const deleteMaquina: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=maquinaController.d.ts.map