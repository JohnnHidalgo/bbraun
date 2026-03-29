import { Container, Typography, Button, Box, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { Add as AddIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clienteApi, agenciaApi } from '../services/apiService';

interface Agencia {
  id: string;
  ageCentro: number;
  ageOficina: number;
  ageCodigo: string;
  ageNombre: string;
}

interface Cliente {
  id: string;
  nombre: string;
  tipo: string;
  direccion: string;
  agenciaId?: string;
  agencia?: Agencia;
  contactos?: any[];
}

const Clientes: React.FC = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [agencias, setAgencias] = useState<Agencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [newCliente, setNewCliente] = useState({
    nombre: '',
    tipo: 'Hospital',
    direccion: '',
    agenciaId: ''
  });

  useEffect(() => {
    loadClientes();
    loadAgencias();
  }, []);

  const loadAgencias = async () => {
    try {
      const response = await agenciaApi.getAll();
      setAgencias(response.data);
    } catch (error) {
      console.error('Error loading agencias:', error);
      setAgencias([]);
    }
  };

  const loadClientes = async () => {
    try {
      const response = await clienteApi.getAll();
      setClientes(response.data);
    } catch (error) {
      console.error('Error loading clientes:', error);
      // Fallback to sample data if API fails
      setClientes([
        { id: '1', nombre: 'Hospital Santa Cruz', tipo: 'Hospital', direccion: 'Av. Principal 123', contactos: [] },
        { id: '2', nombre: 'Clínica Los Olivos', tipo: 'Clínica', direccion: 'Calle Los Olivos 456', contactos: [] },
        { id: '3', nombre: 'Hospital Viedma', tipo: 'Hospital', direccion: 'Plaza Principal 789', contactos: [] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCliente = async () => {
    try {
      await clienteApi.create(newCliente);
      setOpenCreate(false);
      setNewCliente({
        nombre: '',
        tipo: 'Hospital',
        direccion: '',
        agenciaId: ''
      });
      loadClientes();
    } catch (error) {
      console.error('Error creating cliente:', error);
    }
  };

  const handleViewDetails = (cliente: Cliente) => {
    navigate(`/clientes/${cliente.id}`);
  };

  if (loading) {
    return (
      <Container>
        <Typography>Cargando clientes...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestión de Clientes</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)}>
          Nuevo Cliente
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {clientes.map((cliente) => (
          <Card key={cliente.id} sx={{ minWidth: 300, flex: '1 1 300px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {cliente.nombre}
              </Typography>
              <Typography color="textSecondary">
                Tipo: {cliente.tipo}
              </Typography>
              <Typography color="textSecondary">
                Agencia: {cliente.agencia?.ageNombre || 'Sin Agencia'}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button size="small" color="primary" startIcon={<VisibilityIcon />} onClick={() => handleViewDetails(cliente)}>
                  Ver Detalles
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Dialog for creating new client */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="md" fullWidth>
        <DialogTitle>Crear Nuevo Cliente</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
            <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '200px' }}>
              <TextField
                fullWidth
                label="Nombre"
                value={newCliente.nombre}
                onChange={(e) => setNewCliente({ ...newCliente, nombre: e.target.value })}
                required
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '200px' }}>
              <TextField
                fullWidth
                select
                label="Tipo"
                value={newCliente.tipo}
                onChange={(e) => setNewCliente({ ...newCliente, tipo: e.target.value })}
              >
                <MenuItem value="Hospital">Hospital</MenuItem>
                <MenuItem value="Clínica">Clínica</MenuItem>
                <MenuItem value="Centro Médico">Centro Médico</MenuItem>
                <MenuItem value="Laboratorio">Laboratorio</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '200px' }}>
              <TextField
                fullWidth
                label="Dirección"
                value={newCliente.direccion}
                onChange={(e) => setNewCliente({ ...newCliente, direccion: e.target.value })}
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '200px' }}>
              <TextField
                fullWidth
                select
                label="Agencia"
                value={newCliente.agenciaId}
                onChange={(e) => setNewCliente({ ...newCliente, agenciaId: e.target.value })}
                required
              >
                <MenuItem value="">Seleccionar agencia</MenuItem>
                {agencias.map((agencia) => (
                  <MenuItem key={agencia.id} value={agencia.id}>
                    {agencia.ageNombre} ({agencia.ageCodigo})
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancelar</Button>
          <Button onClick={handleCreateCliente} variant="contained" disabled={!newCliente.nombre || !newCliente.agenciaId}>
            Crear Cliente
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Clientes;