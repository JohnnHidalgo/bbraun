import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  clienteApi,
  maquinaApi,
  ticketApi,
  visitaApi,
  repuestoApi,
  contactoApi,
} from '../services/apiService';

interface Cliente {
  id: string;
  nombre: string;
  tipo: string;
  direccion: string;
  ciudad: string;
  createdAt: string;
  updatedAt: string;
}

interface Maquina {
  id: string;
  modelo: string;
  numeroSerie: string;
  clienteId: string;
  estado: string;
  createdAt: string;
  updatedAt: string;
}

interface Ticket {
  id: string;
  tipo: string;
  estado: string;
  clienteId: string;
  maquinaId: string;
  prioridad: string;
  descripcion: string;
  tecnicoId?: string;
  fechaSolicitud: string;
  createdAt: string;
  updatedAt: string;
  cliente?: Cliente;
  maquina?: Maquina;
  tecnico?: { id: string; nombre: string };
}

interface Visita {
  id: string;
  ticketId: string;
  tecnicoId: string;
  fechaVisita: string;
  horasTrabajo: number;
  descripcionTrabajo: string;
  resultado: string;
  createdAt: string;
  updatedAt: string;
}

interface DataContextType {
  // Clientes
  clientes: Cliente[];
  loadClientes: () => Promise<void>;
  getClienteById: (id: string) => Promise<Cliente>;
  createCliente: (data: any) => Promise<Cliente>;
  updateCliente: (id: string, data: any) => Promise<Cliente>;
  deleteCliente: (id: string) => Promise<void>;

  // Máquinas
  maquinas: Maquina[];
  loadMaquinas: () => Promise<void>;
  getMaquinaById: (id: string) => Promise<Maquina>;
  createMaquina: (data: any) => Promise<Maquina>;
  updateMaquina: (id: string, data: any) => Promise<Maquina>;
  deleteMaquina: (id: string) => Promise<void>;

  // Tickets
  tickets: Ticket[];
  loadTickets: () => Promise<void>;
  getTicketById: (id: string) => Promise<Ticket>;
  createTicket: (data: any) => Promise<Ticket>;
  updateTicket: (id: string, data: any) => Promise<Ticket>;
  deleteTicket: (id: string) => Promise<void>;

  // Visitas
  visitas: Visita[];
  loadVisitas: () => Promise<void>;
  getVisitaById: (id: string) => Promise<Visita>;
  createVisita: (data: any) => Promise<Visita>;
  updateVisita: (id: string, data: any) => Promise<Visita>;
  deleteVisita: (id: string) => Promise<void>;

  // Estados
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [maquinas, setMaquinas] = useState<Maquina[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clientes
  const loadClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await clienteApi.getAll();
      setClientes(response.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error loading clientes';
      setError(message);
      console.error('Error loading clientes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getClienteById = useCallback(async (id: string) => {
    setError(null);
    try {
      const response = await clienteApi.getById(id);
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error getting cliente';
      setError(message);
      throw err;
    }
  }, []);

  const createCliente = useCallback(async (data: any) => {
    setError(null);
    try {
      const response = await clienteApi.create(data);
      await loadClientes();
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error creating cliente';
      setError(message);
      throw err;
    }
  }, [loadClientes]);

  const updateCliente = useCallback(async (id: string, data: any) => {
    setError(null);
    try {
      const response = await clienteApi.update(id, data);
      await loadClientes();
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating cliente';
      setError(message);
      throw err;
    }
  }, [loadClientes]);

  const deleteCliente = useCallback(async (id: string) => {
    setError(null);
    try {
      await clienteApi.delete(id);
      await loadClientes();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error deleting cliente';
      setError(message);
      throw err;
    }
  }, [loadClientes]);

  // Máquinas
  const loadMaquinas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await maquinaApi.getAll();
      setMaquinas(response.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error loading maquinas';
      setError(message);
      console.error('Error loading maquinas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMaquinaById = useCallback(async (id: string) => {
    setError(null);
    try {
      const response = await maquinaApi.getById(id);
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error getting maquina';
      setError(message);
      throw err;
    }
  }, []);

  const createMaquina = useCallback(async (data: any) => {
    setError(null);
    try {
      const response = await maquinaApi.create(data);
      await loadMaquinas();
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error creating maquina';
      setError(message);
      throw err;
    }
  }, [loadMaquinas]);

  const updateMaquina = useCallback(async (id: string, data: any) => {
    setError(null);
    try {
      const response = await maquinaApi.update(id, data);
      await loadMaquinas();
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating maquina';
      setError(message);
      throw err;
    }
  }, [loadMaquinas]);

  const deleteMaquina = useCallback(async (id: string) => {
    setError(null);
    try {
      await maquinaApi.delete(id);
      await loadMaquinas();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error deleting maquina';
      setError(message);
      throw err;
    }
  }, [loadMaquinas]);

  // Tickets
  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ticketApi.getAll();
      setTickets(response.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error loading tickets';
      setError(message);
      console.error('Error loading tickets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getTicketById = useCallback(async (id: string) => {
    setError(null);
    try {
      const response = await ticketApi.getById(id);
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error getting ticket';
      setError(message);
      throw err;
    }
  }, []);

  const createTicket = useCallback(async (data: any) => {
    setError(null);
    try {
      const response = await ticketApi.create(data);
      await loadTickets();
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error creating ticket';
      setError(message);
      throw err;
    }
  }, [loadTickets]);

  const updateTicket = useCallback(async (id: string, data: any) => {
    setError(null);
    try {
      const response = await ticketApi.update(id, data);
      await loadTickets();
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating ticket';
      setError(message);
      throw err;
    }
  }, [loadTickets]);

  const deleteTicket = useCallback(async (id: string) => {
    setError(null);
    try {
      await ticketApi.delete(id);
      await loadTickets();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error deleting ticket';
      setError(message);
      throw err;
    }
  }, [loadTickets]);

  // Visitas
  const loadVisitas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await visitaApi.getAll();
      setVisitas(response.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error loading visitas';
      setError(message);
      console.error('Error loading visitas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getVisitaById = useCallback(async (id: string) => {
    setError(null);
    try {
      const response = await visitaApi.getById(id);
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error getting visita';
      setError(message);
      throw err;
    }
  }, []);

  const createVisita = useCallback(async (data: any) => {
    setError(null);
    try {
      const response = await visitaApi.create(data);
      await loadVisitas();
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error creating visita';
      setError(message);
      throw err;
    }
  }, [loadVisitas]);

  const updateVisita = useCallback(async (id: string, data: any) => {
    setError(null);
    try {
      const response = await visitaApi.update(id, data);
      await loadVisitas();
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating visita';
      setError(message);
      throw err;
    }
  }, [loadVisitas]);

  const deleteVisita = useCallback(async (id: string) => {
    setError(null);
    try {
      await visitaApi.delete(id);
      await loadVisitas();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error deleting visita';
      setError(message);
      throw err;
    }
  }, [loadVisitas]);

  return (
    <DataContext.Provider
      value={{
        clientes,
        loadClientes,
        getClienteById,
        createCliente,
        updateCliente,
        deleteCliente,
        maquinas,
        loadMaquinas,
        getMaquinaById,
        createMaquina,
        updateMaquina,
        deleteMaquina,
        tickets,
        loadTickets,
        getTicketById,
        createTicket,
        updateTicket,
        deleteTicket,
        visitas,
        loadVisitas,
        getVisitaById,
        createVisita,
        updateVisita,
        deleteVisita,
        loading,
        error,
        setError,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};