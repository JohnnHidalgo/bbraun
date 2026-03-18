import { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Add as AddIcon, Groups as GroupsIcon } from '@mui/icons-material';

interface Tecnico {
  id: number;
  nombre: string;
  region: string;
  especialidad: string;
  tickets: number;
  estado: 'activo' | 'inactivo';
}

type DialogMode = 'add' | 'edit' | 'view';

interface TicketSummary {
  id: string;
  titulo: string;
  estado: string;
  prioridad: string;
  cliente: string;
  fechaSolicitud: string;
  tecnicoId: number;
}

interface VisitaResumen {
  id: string;
  ticketId: string;
  tecnicoId: number;
  fecha: string;
  descripcion: string;
  estado: string;
}

const Tecnicos: React.FC = () => {
  // Datos de ejemplo
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([
    { id: 1, nombre: 'Juan Pérez', region: 'La Paz', especialidad: 'Infusión', tickets: 12, estado: 'activo' },
    { id: 2, nombre: 'María López', region: 'Cochabamba', especialidad: 'Monitoreo', tickets: 8, estado: 'activo' },
    { id: 3, nombre: 'Carlos Díaz', region: 'Santa Cruz', especialidad: 'General', tickets: 15, estado: 'activo' },
    { id: 4, nombre: 'Ana Rodríguez', region: 'La Paz', especialidad: 'Bombas', tickets: 5, estado: 'inactivo' },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>('add');
  const [selectedTecnico, setSelectedTecnico] = useState<Tecnico | null>(null);
  const [formValues, setFormValues] = useState({
    nombre: '',
    region: '',
    especialidad: '',
    tickets: 0,
    estado: 'activo' as 'activo' | 'inactivo',
  });

  // Datos de ejemplo para historial de tickets/visitas por técnico
  const sampleTickets: TicketSummary[] = [
    {
      id: 'T-001',
      titulo: 'Falla en bomba de infusión',
      estado: 'en_progreso',
      prioridad: 'alta',
      cliente: 'Hospital Santa Cruz',
      fechaSolicitud: '2026-03-12',
      tecnicoId: 1,
    },
    {
      id: 'T-002',
      titulo: 'Revisión de monitoreo',
      estado: 'abierto',
      prioridad: 'media',
      cliente: 'Clínica del Norte',
      fechaSolicitud: '2026-03-10',
      tecnicoId: 2,
    },
    {
      id: 'T-003',
      titulo: 'Calibración de bomba',
      estado: 'cerrado',
      prioridad: 'baja',
      cliente: 'Hospital La Paz',
      fechaSolicitud: '2026-02-27',
      tecnicoId: 3,
    },
  ];

  const sampleVisitas: VisitaResumen[] = [
    {
      id: 'V-001',
      ticketId: 'T-001',
      tecnicoId: 1,
      fecha: '2026-03-13',
      descripcion: 'Revisión inicial y ajuste de presión',
      estado: 'realizada',
    },
    {
      id: 'V-002',
      ticketId: 'T-001',
      tecnicoId: 1,
      fecha: '2026-03-14',
      descripcion: 'Cambio de filtro y prueba final',
      estado: 'realizada',
    },
    {
      id: 'V-003',
      ticketId: 'T-002',
      tecnicoId: 2,
      fecha: '2026-03-11',
      descripcion: 'Diagnóstico de señal',
      estado: 'en_progreso',
    },
  ];

  const openAddDialog = () => {
    setDialogMode('add');
    setSelectedTecnico(null);
    setFormValues({ nombre: '', region: '', especialidad: '', tickets: 0, estado: 'activo' });
    setOpenDialog(true);
  };

  const openViewDialog = (tecnico: Tecnico) => {
    setDialogMode('view');
    setSelectedTecnico(tecnico);
    setFormValues({
      nombre: tecnico.nombre,
      region: tecnico.region,
      especialidad: tecnico.especialidad,
      tickets: tecnico.tickets,
      estado: tecnico.estado,
    });
    setOpenDialog(true);
  };

  const openEditDialog = (tecnico: Tecnico) => {
    setDialogMode('edit');
    setSelectedTecnico(tecnico);
    setFormValues({
      nombre: tecnico.nombre,
      region: tecnico.region,
      especialidad: tecnico.especialidad,
      tickets: tecnico.tickets,
      estado: tecnico.estado,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTecnico(null);
  };

  const handleSave = () => {
    if (!formValues.nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    if (dialogMode === 'add') {
      const nextId = Math.max(0, ...tecnicos.map((t) => t.id)) + 1;
      setTecnicos([
        ...tecnicos,
        {
          id: nextId,
          nombre: formValues.nombre,
          region: formValues.region,
          especialidad: formValues.especialidad,
          tickets: formValues.tickets,
          estado: formValues.estado,
        },
      ]);
    } else if (dialogMode === 'edit' && selectedTecnico) {
      setTecnicos(
        tecnicos.map((t) =>
          t.id === selectedTecnico.id
            ? {
                ...t,
                nombre: formValues.nombre,
                region: formValues.region,
                especialidad: formValues.especialidad,
                tickets: formValues.tickets,
                estado: formValues.estado,
              }
            : t
        )
      );
    }

    setOpenDialog(false);
  };

  const toggleEstado = (tecnico: Tecnico) => {
    setTecnicos(
      tecnicos.map((t) =>
        t.id === tecnico.id
          ? { ...t, estado: t.estado === 'activo' ? 'inactivo' : 'activo' }
          : t
      )
    );
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestión de Técnicos</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAddDialog}>
          Agregar Técnico
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Región</strong></TableCell>
              <TableCell><strong>Especialidad</strong></TableCell>
              <TableCell><strong>Tickets</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell align="right"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tecnicos.map((tecnico) => (
              <TableRow key={tecnico.id} hover>
                <TableCell>{tecnico.nombre}</TableCell>
                <TableCell>{tecnico.region}</TableCell>
                <TableCell>{tecnico.especialidad}</TableCell>
                <TableCell>{tecnico.tickets}</TableCell>
                <TableCell>
                  <Chip
                    label={tecnico.estado}
                    color={tecnico.estado === 'activo' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button size="small" color="primary" onClick={() => openViewDialog(tecnico)}>
                      Ver
                    </Button>
                    <Button size="small" color="secondary" onClick={() => openEditDialog(tecnico)}>
                      Editar
                    </Button>
                    <Button size="small" color={tecnico.estado === 'activo' ? 'warning' : 'success'} onClick={() => toggleEstado(tecnico)}>
                      {tecnico.estado === 'activo' ? 'Desactivar' : 'Activar'}
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {dialogMode === 'add' && 'Agregar Técnico'}
          {dialogMode === 'edit' && 'Editar Técnico'}
          {dialogMode === 'view' && 'Perfil de Técnico'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Nombre"
              value={formValues.nombre}
              onChange={(e) => setFormValues({ ...formValues, nombre: e.target.value })}
              fullWidth
              disabled={dialogMode === 'view'}
            />
            <TextField
              label="Región"
              value={formValues.region}
              onChange={(e) => setFormValues({ ...formValues, region: e.target.value })}
              fullWidth
              disabled={dialogMode === 'view'}
            />
            <TextField
              label="Especialidad"
              value={formValues.especialidad}
              onChange={(e) => setFormValues({ ...formValues, especialidad: e.target.value })}
              fullWidth
              disabled={dialogMode === 'view'}
            />
            <TextField
              label="Tickets Atendidos"
              type="number"
              value={formValues.tickets}
              onChange={(e) => setFormValues({ ...formValues, tickets: Number(e.target.value) })}
              fullWidth
              disabled={dialogMode === 'view'}
            />
            <FormControl fullWidth>
              <InputLabel id="estado-label">Estado</InputLabel>
              <Select
                labelId="estado-label"
                label="Estado"
                value={formValues.estado}
                onChange={(e) => setFormValues({ ...formValues, estado: e.target.value as 'activo' | 'inactivo' })}
                disabled={dialogMode === 'view'}
              >
                <MenuItem value="activo">Activo</MenuItem>
                <MenuItem value="inactivo">Inactivo</MenuItem>
              </Select>
            </FormControl>
            {dialogMode !== 'view' && (
              <FormControlLabel
                control={
                  <Switch
                    checked={formValues.estado === 'activo'}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        estado: e.target.checked ? 'activo' : 'inactivo',
                      })
                    }
                  />
                }
                label="Técnico activo"
              />
            )}
          </Box>

          {dialogMode === 'view' && selectedTecnico && (
            <>
              {/* Productividad del técnico */}
              {(() => {
                const ticketsAsignados = sampleTickets.filter((t) => t.tecnicoId === selectedTecnico.id);
                const visitasTecnico = sampleVisitas.filter((v) => v.tecnicoId === selectedTecnico.id);
                const ticketsCerrados = ticketsAsignados.filter((t) => t.estado === 'cerrado').length;
                const visitasRealizadas = visitasTecnico.filter((v) => v.estado === 'realizada').length;
                const productividad = ticketsAsignados.length
                  ? Math.round((ticketsCerrados / ticketsAsignados.length) * 100)
                  : 0;

                return (
                  <Box sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                      Indicadores de productividad
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      <Typography variant="body2">
                        <strong>Tickets asignados:</strong> {ticketsAsignados.length}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Tickets cerrados:</strong> {ticketsCerrados}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Visitas realizadas:</strong> {visitasRealizadas}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Productividad:</strong> {productividad}%
                      </Typography>
                    </Box>
                  </Box>
                );
              })()}

              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                Tickets asignados
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>ID</strong></TableCell>
                    <TableCell><strong>Título</strong></TableCell>
                    <TableCell><strong>Estado</strong></TableCell>
                    <TableCell><strong>Prioridad</strong></TableCell>
                    <TableCell><strong>Cliente</strong></TableCell>
                    <TableCell><strong>Visitas</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sampleTickets
                    .filter((t) => t.tecnicoId === selectedTecnico.id)
                    .map((ticket) => {
                      const visitasPorTicket = sampleVisitas.filter(
                        (v) => v.ticketId === ticket.id && v.tecnicoId === selectedTecnico.id
                      );
                      return (
                        <TableRow key={ticket.id} hover>
                          <TableCell>{ticket.id}</TableCell>
                          <TableCell>{ticket.titulo}</TableCell>
                          <TableCell>{ticket.estado}</TableCell>
                          <TableCell>{ticket.prioridad}</TableCell>
                          <TableCell>{ticket.cliente}</TableCell>
                          <TableCell>{visitasPorTicket.length}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>

              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                Historial de visitas
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Fecha</strong></TableCell>
                    <TableCell><strong>Ticket</strong></TableCell>
                    <TableCell><strong>Descripción</strong></TableCell>
                    <TableCell><strong>Estado</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sampleVisitas
                    .filter((v) => v.tecnicoId === selectedTecnico.id)
                    .map((visita) => {
                      const ticket = sampleTickets.find((t) => t.id === visita.ticketId);
                      return (
                        <TableRow key={visita.id} hover>
                          <TableCell>{visita.fecha}</TableCell>
                          <TableCell>{ticket?.titulo || visita.ticketId}</TableCell>
                          <TableCell>{visita.descripcion}</TableCell>
                          <TableCell>{visita.estado}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cerrar</Button>
          {dialogMode !== 'view' && (
            <Button variant="contained" onClick={handleSave}>
              Guardar
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Tecnicos;