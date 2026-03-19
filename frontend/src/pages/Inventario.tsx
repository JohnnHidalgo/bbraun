import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { clienteApi, repuestoApi, inventarioApi } from '../services/apiService';

interface Cliente {
  id: string;
  nombre: string;
}

interface Repuesto {
  id: string;
  nombre: string;
  codigo: string;
}

interface InventarioItem {
  inventarioId: string;
  clienteId: string;
  clienteNombre: string;
  repuestoId: string;
  repuestoNombre: string;
  repuestoCodigo: string;
  cantidad: number;
}

const Inventario: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<string>('');
  const [inventarios, setInventarios] = useState<InventarioItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<InventarioItem | null>(null);
  const [form, setForm] = useState({
    clienteId: '',
    repuestoId: '',
    cantidad: 0,
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedCliente) {
      loadInventario(selectedCliente);
    } else {
      loadInventario();
    }
  }, [selectedCliente]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [clientesRes, repuestosRes] = await Promise.all([
        clienteApi.getAll(),
        repuestoApi.getAll(),
      ]);

      setClientes(clientesRes.data);
      setRepuestos(repuestosRes.data);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInventario = async (clienteId?: string) => {
    setLoading(true);
    try {
      if (clienteId) {
        const res = await inventarioApi.getByCliente(clienteId);
        const cliente = clientes.find((c) => c.id === clienteId);
        setInventarios(
          res.data.map((item: any) => ({
            inventarioId: item.inventarioId,
            clienteId: clienteId,
            clienteNombre: cliente?.nombre || 'Sin cliente',
            repuestoId: item.id,
            repuestoNombre: item.nombre,
            repuestoCodigo: item.codigo,
            cantidad: item.cantidad ?? 0,
          }))
        );
      } else {
        const res = await inventarioApi.getAll();
        setInventarios(
          res.data.map((item: any) => ({
            inventarioId: item.id,
            clienteId: item.clienteId,
            clienteNombre: item.cliente?.nombre || 'Sin cliente',
            repuestoId: item.repuestoId,
            repuestoNombre: item.repuesto?.nombre || 'Sin repuesto',
            repuestoCodigo: item.repuesto?.codigo || '',
            cantidad: item.cantidad ?? 0,
          }))
        );
      }
    } catch (error) {
      console.error('Error loading inventario:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditing(null);
    setForm({
      clienteId: selectedCliente || (clientes[0]?.id ?? ''),
      repuestoId: repuestos[0]?.id || '',
      cantidad: 0,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (item: InventarioItem) => {
    setEditing(item);
    setForm({
      clienteId: item.clienteId,
      repuestoId: item.repuestoId,
      cantidad: item.cantidad,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await inventarioApi.update(editing.inventarioId, { cantidad: form.cantidad });
      } else {
        await inventarioApi.create({
          clienteId: form.clienteId,
          repuestoId: form.repuestoId,
          cantidad: form.cantidad,
        });
      }

      if (selectedCliente) {
        await loadInventario(selectedCliente);
      } else {
        await loadInventario();
      }
      closeDialog();
    } catch (error) {
      console.error('Error saving inventario:', error);
      alert('Error al guardar el inventario. Revisar la consola para más detalles.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este registro de inventario?')) return;
    try {
      await inventarioApi.delete(id);
      if (selectedCliente) {
        await loadInventario(selectedCliente);
      } else {
        await loadInventario();
      }
    } catch (error) {
      console.error('Error deleting inventario:', error);
      alert('Error al eliminar el inventario. Revisar la consola para más detalles.');
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Cargando inventario...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestión de Inventario</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
          Nuevo Registro
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 240 }}>
          <InputLabel id="select-cliente-label">Filtrar por cliente</InputLabel>
          <Select
            labelId="select-cliente-label"
            value={selectedCliente}
            label="Filtrar por cliente"
            onChange={(e) => setSelectedCliente(e.target.value)}
          >
            <MenuItem value="">Todos los clientes</MenuItem>
            {clientes.map((cliente) => (
              <MenuItem key={cliente.id} value={cliente.id}>
                {cliente.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Repuesto</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Código</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Cantidad</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Estado</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventarios.map((item) => (
                  <TableRow key={item.inventarioId} hover>
                    <TableCell>{item.clienteNombre}</TableCell>
                    <TableCell>{item.repuestoNombre}</TableCell>
                    <TableCell>
                      <Chip label={item.repuestoCodigo} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={item.cantidad}
                        color={item.cantidad > 0 ? 'success' : 'error'}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={item.cantidad > 0 ? 'Disponible' : 'Agotado'}
                        color={item.cantidad > 0 ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => openEditDialog(item)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(item.inventarioId)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {inventarios.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="textSecondary">No hay registros de inventario.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Editar inventario' : 'Nuevo inventario'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="select-client-label">Cliente</InputLabel>
              <Select
                labelId="select-client-label"
                value={form.clienteId}
                label="Cliente"
                onChange={(e) => setForm({ ...form, clienteId: e.target.value })}
                disabled={Boolean(editing)}
              >
                {clientes.map((cliente) => (
                  <MenuItem key={cliente.id} value={cliente.id}>
                    {cliente.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="select-repuesto-label">Repuesto</InputLabel>
              <Select
                labelId="select-repuesto-label"
                value={form.repuestoId}
                label="Repuesto"
                onChange={(e) => setForm({ ...form, repuestoId: e.target.value })}
                disabled={Boolean(editing)}
              >
                {repuestos.map((repuesto) => (
                  <MenuItem key={repuesto.id} value={repuesto.id}>
                    {repuesto.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Cantidad"
              type="number"
              value={form.cantidad}
              onChange={(e) => setForm({ ...form, cantidad: Number(e.target.value) })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancelar</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!form.clienteId || !form.repuestoId || form.cantidad < 0}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Inventario;
