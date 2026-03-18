import { Request, Response } from 'express';
export declare class ContactoController {
    getContactosByCliente(req: Request, res: Response): Promise<void>;
    getContactoById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createContacto(req: Request, res: Response): Promise<void>;
    updateContacto(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteContacto(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    setContactoPrincipal(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=contactoController.d.ts.map