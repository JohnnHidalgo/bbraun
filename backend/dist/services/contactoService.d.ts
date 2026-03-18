export declare class ContactoService {
    getContactosByCliente(clienteId: string): Promise<{
        id: string;
        nombre: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        clienteId: string;
        cargo: string | null;
        telefono: string;
        esPrincipal: boolean;
    }[]>;
    getContactoById(id: string): Promise<{
        id: string;
        nombre: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        clienteId: string;
        cargo: string | null;
        telefono: string;
        esPrincipal: boolean;
    } | null>;
    createContacto(data: {
        clienteId: string;
        nombre: string;
        cargo?: string;
        telefono: string;
        email?: string;
        esPrincipal?: boolean;
    }): Promise<{
        id: string;
        nombre: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        clienteId: string;
        cargo: string | null;
        telefono: string;
        esPrincipal: boolean;
    }>;
    updateContacto(id: string, data: Partial<{
        nombre: string;
        cargo: string;
        telefono: string;
        email: string;
        esPrincipal: boolean;
    }>): Promise<{
        id: string;
        nombre: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        clienteId: string;
        cargo: string | null;
        telefono: string;
        esPrincipal: boolean;
    }>;
    deleteContacto(id: string): Promise<boolean>;
    setContactoPrincipal(id: string): Promise<{
        id: string;
        nombre: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        clienteId: string;
        cargo: string | null;
        telefono: string;
        esPrincipal: boolean;
    } | null>;
}
//# sourceMappingURL=contactoService.d.ts.map