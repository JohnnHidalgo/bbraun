import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Button, Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Select, MenuItem, FormControl, InputLabel, CircularProgress
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { ticketApi, clienteApi, maquinaApi } from '../services/apiService';

interface Ticket {
  id: string;
  descripcion: string;
  prioridad: string;
  estado: string;
  clienteId: string;
  tecnicoId?: string;
  fechaAsignacion?: string;
  cliente?: { nombre: string };
  maquina?: { modelo: string; numeroSerie: string };
  tecnico?: { nombre: string; id: string };
  visitas?: Visita[];
  repuestosUsados?: RepuestoTicket[];
  historialEstados?: HistorialEstado[];
}

interface UsoRepuesto {
  id: string;
  visitaId: string;
  repuestoId: string;
  cantidad: number;
  repuesto?: { nombre: string };
}

interface Visita {
  id: string;
  ticketId: string;
  tecnicoId: string;
  fecha: string; // fecha de creación/inicio
  fechaInicio?: string;
  fechaFin?: string;
  descripcion?: string; // detalle del trabajo al completar
  estado: string; // programada, en_progreso, realizada
  tecnico?: { nombre: string };
  usoRepuestos?: UsoRepuesto[];
}

interface RepuestoTicket {
  id: string;
  ticketId: string;
  cantidad: number;
  precioUnitario: number;
  repuesto?: { nombre: string };
}

interface HistorialEstado {
  id: string;
  estado: string;
  fecha: string;
  cambiadoPor: string;
  observaciones?: string;
}

interface Usuario {
  id: string;
  nombre: string;
}

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewTicket = id === 'new';

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);
  const [tecnicos, setTecnicos] = useState<Usuario[]>([]);
  const [repuestosList, setRepuestosList] = useState<{id:string,nombre:string}[]>([]);
  const [clientes, setClientes] = useState<{id:string,nombre:string}[]>([]);
  const [maquinas, setMaquinas] = useState<{id:string, modelo:string, clienteId:string}[]>([]);
  const [createForm, setCreateForm] = useState({
    tipo: 'correctivo',
    prioridad: 'media',
    clienteId: '',
    maquinaId: '',
    descripcion: '',
  });
  const [creating, setCreating] = useState(false);
  const usuarioActual = { id: 'cmmxsrq10000043k6wef0gcev', nombre: 'Juan Pérez' }; // Simulado - usuario conectado

  const [openVisitaDialog, setOpenVisitaDialog] = useState(false);
  const [openTecnicoDialog, setOpenTecnicoDialog] = useState(false);
  const [openEstadoDialog, setOpenEstadoDialog] = useState(false);
  const [openCompleteDialog, setOpenCompleteDialog] = useState(false);
  const [selectedVisita, setSelectedVisita] = useState<Visita | null>(null);
  const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState('');
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [observacionesEstado, setObservacionesEstado] = useState('');
  const [completionForm, setCompletionForm] = useState({
    descripcion: '',
    estadoTicket: '',
    repuestos: [] as UsoRepuesto[]
  });
  const [visitaForm, setVisitaForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    tecnicoId: '',
    descripcion: '',
    estado: 'programada'
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [clientesRes, maquinasRes] = await Promise.all([
          clienteApi.getAll(),
          maquinaApi.getAll(),
        ]);

        setClientes(clientesRes.data);
        setMaquinas(maquinasRes.data);

        if (isNewTicket) {
          const primerClienteId = clientesRes.data[0]?.id || '';
          const primerMaquinaId = maquinasRes.data.find((m: any) => m.clienteId === primerClienteId)?.id || '';
          setCreateForm((prev) => ({
            ...prev,
            clienteId: primerClienteId,
            maquinaId: primerMaquinaId,
          }));
        }
      } catch (error) {
        console.error('Error loading clientes/maquinas:', error);
        setClientes([
          { id: '1', nombre: 'Hospital Santa Cruz' },
          { id: '2', nombre: 'Clínica Los Olivos' },
        ]);
        setMaquinas([
          { id: '1', modelo: 'Braun Infusomat', clienteId: '1' },
          { id: '2', modelo: 'Braun Infusomat Space', clienteId: '2' },
        ]);
      }

      try {
        const mockTecnicos: Usuario[] = [
          { id: '1', nombre: 'Juan Pérez' },
          { id: '2', nombre: 'María López' },
          { id: '3', nombre: 'Carlos Díaz' }
        ];
        const mockRepuestos = [
          { id: 'r1', nombre: 'Filtro' },
          { id: 'r2', nombre: 'Junta' },
          { id: 'r3', nombre: 'Bomba' }
        ];

        setTecnicos(mockTecnicos);
        setRepuestosList(mockRepuestos);
      } catch (error) {
        console.error('Error loading datos mock:', error);
      }

      if (!isNewTicket) {
        try {
          const response = await ticketApi.getById(id!);
          setTicket(response.data);
          setVisitas(response.data.visitas || []);
        } catch (error) {
          console.error('Error fetching ticket:', error);
        }
      } else {
        setTicket(null);
      }

      setLoading(false);
    };

    fetchData();
  }, [id, isNewTicket]);

  const handleCreateTicket = async () => {
    if (!createForm.clienteId || !createForm.maquinaId || !createForm.descripcion) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      setCreating(true);
      const response = await ticketApi.create({
        tipo: createForm.tipo,
        prioridad: createForm.prioridad,
        clienteId: createForm.clienteId,
        maquinaId: createForm.maquinaId,
        descripcion: createForm.descripcion,
      });
      navigate(`/tickets/${response.data.id}`);
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Error al crear el ticket. Intenta nuevamente.');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenVisitaDialog = () => {
    setOpenVisitaDialog(true);
  };

  const handleCloseVisitaDialog = () => {
    setOpenVisitaDialog(false);
    setVisitaForm({
      fecha: new Date().toISOString().split('T')[0],
      tecnicoId: '',
      descripcion: '',
      estado: 'programada'
    });
  };

  const handleSaveVisita = async () => {
    if (!visitaForm.tecnicoId) {
      alert('Por favor selecciona un técnico');
      return;
    }

    try {
      const now = new Date().toISOString();
      const newVisita: Visita = {
        id: Date.now().toString(),
        ticketId: id || '',
        tecnicoId: visitaForm.tecnicoId,
        fecha: now,
        fechaInicio: now,
        estado: 'en_progreso',
        tecnico: tecnicos.find(t => t.id === visitaForm.tecnicoId),
        usoRepuestos: []
      };

      setVisitas([...visitas, newVisita]);
      handleCloseVisitaDialog();
      alert('Visita creada, puedes finalizarla cuando termines');
    } catch (error) {
      console.error('Error saving visita:', error);
      alert('Error al registrar la visita');
    }
  };

  const handleDeleteVisita = (visitaId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta visita?')) {
      setVisitas(visitas.filter(v => v.id !== visitaId));
    }
  };

  const handleOpenTecnicoDialog = () => {
    setTecnicoSeleccionado(ticket?.tecnico?.nombre || '');
    setOpenTecnicoDialog(true);
  };

  const handleCloseTecnicoDialog = () => {
    setOpenTecnicoDialog(false);
    setTecnicoSeleccionado('');
  };

  const handleOpenCompleteDialog = (visita: Visita) => {
    setSelectedVisita(visita);
    setCompletionForm({ descripcion: visita.descripcion || '', estadoTicket: ticket?.estado || '', repuestos: visita.usoRepuestos || [] });
    setOpenCompleteDialog(true);
  };

  const handleCloseCompleteDialog = () => {
    setOpenCompleteDialog(false);
    setSelectedVisita(null);
    setCompletionForm({ descripcion: '', estadoTicket: '', repuestos: [] });
  };

  const handleSaveCompletion = () => {
    if (!selectedVisita) return;
    const now = new Date().toISOString();
    const updatedVisita: Visita = {
      ...selectedVisita,
      fechaFin: now,
      descripcion: completionForm.descripcion,
      estado: 'realizada',
      usoRepuestos: completionForm.repuestos
    };
    const updatedVisitas = visitas.map(v => v.id === updatedVisita.id ? updatedVisita : v);
    setVisitas(updatedVisitas);

    // update ticket state if changed
    if (ticket && completionForm.estadoTicket && completionForm.estadoTicket !== ticket.estado) {
      const nuevoTicket = {
        ...ticket,
        estado: completionForm.estadoTicket,
        historialEstados: [
          ...(ticket.historialEstados || []),
          {
            id: Date.now().toString(),
            estado: completionForm.estadoTicket,
            fecha: now,
            cambiadoPor: usuarioActual.nombre,
            observaciones: 'Estado actualizado durante cierre de visita'
          }
        ]
      };
      setTicket(nuevoTicket as Ticket);
    }

    handleCloseCompleteDialog();
    alert('Visita finalizada y repuestos registrados.');
  };
  const handleSaveTecnico = async () => {
    if (!tecnicoSeleccionado) {
      alert('Por favor selecciona un técnico');
      return;
    }

    try {
      const tecnicoAsignado = tecnicos.find(t => t.id === tecnicoSeleccionado);
      if (ticket && tecnicoAsignado) {
        const nuevoTicket = {
          ...ticket,
          tecnicoId: tecnicoAsignado.id,
          tecnico: { nombre: tecnicoAsignado.nombre, id: tecnicoAsignado.id },
          fechaAsignacion: new Date().toISOString(),
          historialEstados: [
            ...(ticket.historialEstados || []),
            {
              id: Date.now().toString(),
              estado: ticket.estado,
              fecha: new Date().toISOString(),
              cambiadoPor: usuarioActual.nombre,
              observaciones: `Ticket asignado a ${tecnicoAsignado.nombre}`
            }
          ]
        };
        setTicket(nuevoTicket);
        handleCloseTecnicoDialog();
        alert('Técnico asignado exitosamente');
      }
    } catch (error) {
      console.error('Error assigning tecnico:', error);
      alert('Error al asignar el técnico');
    }
  };

  const handleTomarTicket = async () => {
    if (!ticket) return;

    try {
      const nuevoTicket = {
        ...ticket,
        tecnicoId: usuarioActual.id,
        tecnico: { nombre: usuarioActual.nombre, id: usuarioActual.id },
        estado: 'En Progreso',
        fechaAsignacion: new Date().toISOString(),
        historialEstados: [
          ...(ticket.historialEstados || []),
          {
            id: Date.now().toString(),
            estado: 'En Progreso',
            fecha: new Date().toISOString(),
            cambiadoPor: usuarioActual.nombre,
            observaciones: `${usuarioActual.nombre} tomó este ticket de la cola`
          }
        ]
      };
      setTicket(nuevoTicket);
      alert('¡Ticket asignado a ti! Ahora puedes comenzar a trabajar en él.');
    } catch (error) {
      console.error('Error taking ticket:', error);
      alert('Error al tomar el ticket');
    }
  };

  const handleOpenEstadoDialog = () => {
    setNuevoEstado(ticket?.estado || '');
    setObservacionesEstado('');
    setOpenEstadoDialog(true);
  };

  const handleCloseEstadoDialog = () => {
    setOpenEstadoDialog(false);
    setNuevoEstado('');
    setObservacionesEstado('');
  };

  const handleCambiarEstado = async () => {
    if (!nuevoEstado) {
      alert('Por favor selecciona un estado');
      return;
    }

    try {
      const nuevoTicket = {
        ...ticket,
        estado: nuevoEstado,
        historialEstados: [
          ...(ticket?.historialEstados || []),
          {
            id: Date.now().toString(),
            estado: nuevoEstado,
            fecha: new Date().toISOString(),
            cambiadoPor: usuarioActual.nombre,
            observaciones: observacionesEstado || '-'
          }
        ]
      };
      setTicket(nuevoTicket as Ticket);
      handleCloseEstadoDialog();
      alert('Estado actualizado exitosamente');
    } catch (error) {
      console.error('Error updating estado:', error);
      alert('Error al actualizar el estado');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (isNewTicket) {
    const maquinasFiltradas = maquinas.filter((m) => m.clienteId === createForm.clienteId);
    const canSubmit = !!createForm.clienteId && !!createForm.maquinaId && !!createForm.descripcion;

    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/tickets')}
            sx={{ mr: 2 }}
          >
            Volver
          </Button>
          <Typography variant="h4">Crear Nuevo Ticket</Typography>
        </Box>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Complete el formulario para registrar un ticket
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="tipo-label">Tipo</InputLabel>
              <Select
                labelId="tipo-label"
                label="Tipo"
                value={createForm.tipo}
                onChange={(e) => setCreateForm({ ...createForm, tipo: e.target.value })}
              >
                <MenuItem value="correctivo">Correctivo</MenuItem>
                <MenuItem value="preventivo">Preventivo</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="prioridad-label">Prioridad</InputLabel>
              <Select
                labelId="prioridad-label"
                label="Prioridad"
                value={createForm.prioridad}
                onChange={(e) => setCreateForm({ ...createForm, prioridad: e.target.value })}
              >
                <MenuItem value="alta">Alta</MenuItem>
                <MenuItem value="media">Media</MenuItem>
                <MenuItem value="baja">Baja</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="cliente-label">Cliente</InputLabel>
              <Select
                labelId="cliente-label"
                label="Cliente"
                value={createForm.clienteId}
                onChange={(e) => {
                  const clienteId = e.target.value;
                  setCreateForm({
                    ...createForm,
                    clienteId,
                    maquinaId: maquinas.find((m) => m.clienteId === clienteId)?.id || ''
                  });
                }}
              >
                {clientes.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth disabled={!createForm.clienteId}>
              <InputLabel id="maquina-label">Máquina</InputLabel>
              <Select
                labelId="maquina-label"
                label="Máquina"
                value={createForm.maquinaId}
                onChange={(e) => setCreateForm({ ...createForm, maquinaId: e.target.value })}
              >
                {maquinasFiltradas.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.modelo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Descripción"
              multiline
              minRows={4}
              value={createForm.descripcion}
              onChange={(e) => setCreateForm({ ...createForm, descripcion: e.target.value })}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button onClick={() => navigate('/tickets')}>Cancelar</Button>
            <Button
              variant="contained"
              onClick={handleCreateTicket}
              disabled={!canSubmit || creating}
            >
              {creating ? 'Creando...' : 'Crear ticket'}
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (!ticket) {
    return <Typography>Ticket no encontrado</Typography>;
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Programado': return 'default';
      case 'En Progreso': return 'warning';
      case 'Esperando Repuestos': return 'info';
      case 'Completado': return 'success';
      default: return 'default';
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'Alta': return 'error';
      case 'Media': return 'warning';
      case 'Baja': return 'success';
      default: return 'default';
    }
  };

  // calcula el tiempo de servicio entre inicio y fin en horas/minutos
  const getServiceTime = (visita: Visita) => {
    if (!visita.fechaInicio || !visita.fechaFin) return '-';
    const start = new Date(visita.fechaInicio).getTime();
    const end = new Date(visita.fechaFin).getTime();
    const diffMs = end - start;
    if (diffMs < 0) return '-';
    const diffMin = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMin / 60);
    const mins = diffMin % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/tickets')}
          sx={{ mr: 2 }}
        >
          Volver
        </Button>
        <Typography variant="h4">
          {id === 'new' ? 'Crear Nuevo Ticket' : `Detalle del Ticket #${ticket.id}`}
        </Typography>
      </Box>

      {/* Información del Ticket */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: '#fafafa', border: '2px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Información del Ticket
          </Typography>
          {(!ticket.tecnicoId || ticket.tecnicoId !== usuarioActual.id) && !ticket.tecnico && (
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={handleTomarTicket}
            >
              Tomar Ticket
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
          <Box>
            <Typography variant="body2" color="textSecondary">Descripción</Typography>
            <Typography variant="body1">{ticket.descripcion}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">Estado</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label={ticket.estado} color={getEstadoColor(ticket.estado)} size="small" />
              <Button size="small" variant="outlined" onClick={handleOpenEstadoDialog}>
                Cambiar
              </Button>
            </Box>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">Prioridad</Typography>
            <Chip label={ticket.prioridad} color={getPrioridadColor(ticket.prioridad)} size="small" />
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">Cliente</Typography>
            <Typography variant="body1">{ticket.cliente?.nombre}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">Máquina</Typography>
            <Typography variant="body1">
              {ticket.maquina?.modelo} ({ticket.maquina?.numeroSerie})
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
            <Box>
              <Typography variant="body2" color="textSecondary">Técnico Asignado</Typography>
              <Typography variant="body1">{ticket.tecnico?.nombre || 'No asignado'}</Typography>
              {ticket.fechaAsignacion && (
                <Typography variant="caption" color="textSecondary">
                  {new Date(ticket.fechaAsignacion).toLocaleString()}
                </Typography>
              )}
            </Box>
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={handleOpenTecnicoDialog}
              variant="outlined"
            >
              Asignar
            </Button>
          </Box>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="textSecondary">Descripción</Typography>
          <Typography variant="body1">{ticket.descripcion}</Typography>
        </Box>
      </Paper>

      {/* Sección de Visitas */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Visitas ({visitas.length})
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenVisitaDialog}
            size="small"
          >
            Registrar Visita
          </Button>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Fecha</strong></TableCell>
                <TableCell><strong>Técnico</strong></TableCell>
                <TableCell><strong>Descripción</strong></TableCell>
                <TableCell><strong>Estado</strong></TableCell>
                <TableCell><strong>Tiempo</strong></TableCell>
                <TableCell><strong>Repuestos</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visitas.length > 0 ? (
                visitas.map((visita) => (
                  <TableRow key={visita.id}>
                    <TableCell>{new Date(visita.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>{visita.tecnico?.nombre}</TableCell>
                    <TableCell>{visita.descripcion}</TableCell>
                    <TableCell>
                      <Chip
                        label={visita.estado}
                        color={getEstadoColor(visita.estado)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {getServiceTime(visita)}
                    </TableCell>
                    <TableCell>
                      {visita.usoRepuestos && visita.usoRepuestos.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {visita.usoRepuestos.map((uso) => (
                            <Chip
                              key={uso.id}
                              label={`${uso.repuesto?.nombre || 'Repuesto'} (${uso.cantidad})`}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="textSecondary">Ninguno</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center" sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      {visita.estado !== 'realizada' && (
                        <Button
                          size="small"
                          color="primary"
                          variant="outlined"
                          onClick={() => handleOpenCompleteDialog(visita)}
                        >
                          Finalizar
                        </Button>
                      )}
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteVisita(visita.id)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'textSecondary' }}>
                    No hay visitas registradas
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Sección de Repuestos */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Repuestos Utilizados ({visitas.flatMap(v => v.usoRepuestos || []).length})
          </Typography>
          <Typography variant="body2" color="textSecondary">
            (listado agregado de todas las visitas)
          </Typography>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Repuesto</strong></TableCell>
                <TableCell align="right"><strong>Cantidad</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visitas.flatMap(v => v.usoRepuestos || []).length > 0 ? (
                visitas.flatMap(v => v.usoRepuestos || []).map((uso) => (
                  <TableRow key={uso.id}>
                    <TableCell>{uso.repuesto?.nombre || 'Repuesto'}</TableCell>
                    <TableCell align="right">{uso.cantidad}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 3, color: 'textSecondary' }}>
                    No hay repuestos utilizados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Historial de Estado */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Historial de Cambios
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {ticket.historialEstados && ticket.historialEstados.length > 0 ? (
            ticket.historialEstados.map((cambio) => (
              <Box
                key={cambio.id}
                sx={{
                  p: 2,
                  backgroundColor: '#f5f5f5',
                  borderLeft: '4px solid #1976d2',
                  borderRadius: '4px'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Chip
                      label={cambio.estado}
                      color={getEstadoColor(cambio.estado)}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="textSecondary">
                      Por: {cambio.cambiadoPor}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(cambio.fecha).toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    {cambio.observaciones}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              Sin cambios registrados
            </Typography>
          )}
        </Box>
      </Paper>
      <Dialog open={openTecnicoDialog} onClose={handleCloseTecnicoDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Asignar Técnico al Ticket</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Seleccionar Técnico *</InputLabel>
            <Select
              value={tecnicoSeleccionado}
              label="Seleccionar Técnico *"
              onChange={(e) => setTecnicoSeleccionado(e.target.value)}
            >
              <MenuItem value="">Sin asignar</MenuItem>
              {tecnicos.map((tecnico) => (
                <MenuItem key={tecnico.id} value={tecnico.id}>
                  {tecnico.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTecnicoDialog}>Cancelar</Button>
          <Button onClick={handleSaveTecnico} variant="contained" color="primary">
            Asignar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para Cambiar Estado */}
      <Dialog open={openEstadoDialog} onClose={handleCloseEstadoDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Cambiar Estado del Ticket</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Nuevo Estado *</InputLabel>
              <Select
                value={nuevoEstado}
                label="Nuevo Estado *"
                onChange={(e) => setNuevoEstado(e.target.value)}
              >
                <MenuItem value="">Seleccionar estado</MenuItem>
                <MenuItem value="abierto">Abierto</MenuItem>
                <MenuItem value="en_progreso">En Progreso</MenuItem>
                <MenuItem value="resuelto">Resuelto</MenuItem>
                <MenuItem value="cerrado">Cerrado</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Observaciones (opcional)"
              multiline
              rows={2}
              value={observacionesEstado}
              onChange={(e) => setObservacionesEstado(e.target.value)}
              placeholder="Agrega notas sobre este cambio de estado"
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEstadoDialog}>Cancelar</Button>
          <Button onClick={handleCambiarEstado} variant="contained" color="primary">
            Cambiar Estado
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para Finalizar Visita */}
      <Dialog open={openCompleteDialog} onClose={handleCloseCompleteDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Finalizar Visita</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Descripción del trabajo"
              multiline
              rows={3}
              value={completionForm.descripcion}
              onChange={(e) => setCompletionForm({ ...completionForm, descripcion: e.target.value })}
              placeholder="Detalle del trabajo realizado"
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Nuevo estado del ticket</InputLabel>
              <Select
                value={completionForm.estadoTicket}
                label="Nuevo estado del ticket"
                onChange={(e) => setCompletionForm({ ...completionForm, estadoTicket: e.target.value })}
              >
                <MenuItem value="">(sin cambio)</MenuItem>
                <MenuItem value="en_progreso">En progreso</MenuItem>
                <MenuItem value="esperando_repuestos">Esperando repuestos</MenuItem>
                <MenuItem value="cerrado">Cerrado</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="subtitle2">Repuestos usados</Typography>
            {completionForm.repuestos.map((u, idx) => (
              <Box key={u.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <FormControl sx={{ minWidth: 120 }} size="small">
                  <InputLabel>Repuesto</InputLabel>
                  <Select
                    value={u.repuestoId}
                    label="Repuesto"
                    onChange={(e) => {
                      const list = [...completionForm.repuestos];
                      list[idx].repuestoId = e.target.value;
                      list[idx].repuesto = repuestosList.find(r => r.id === e.target.value);
                      setCompletionForm({ ...completionForm, repuestos: list });
                    }}
                  >
                    <MenuItem value="">(seleccione)</MenuItem>
                    {repuestosList.map(r => (
                      <MenuItem key={r.id} value={r.id}>{r.nombre}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  type="number"
                  label="Cant."
                  size="small"
                  value={u.cantidad}
                  onChange={(e) => {
                    const list = [...completionForm.repuestos];
                    list[idx].cantidad = parseInt(e.target.value) || 0;
                    setCompletionForm({ ...completionForm, repuestos: list });
                  }}
                  sx={{ width: 80 }}
                />
                <Button size="small" color="error" onClick={() => {
                  const list = completionForm.repuestos.filter((_, i) => i !== idx);
                  setCompletionForm({ ...completionForm, repuestos: list });
                }}>X</Button>
              </Box>
            ))}
            <Button size="small" onClick={() => {
              const nueva: UsoRepuesto = { id: Date.now().toString(), visitaId: selectedVisita?.id || '', repuestoId: '', cantidad: 1 };
              setCompletionForm({ ...completionForm, repuestos: [...completionForm.repuestos, nueva] });
            }}>Añadir repuesto</Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCompleteDialog}>Cancelar</Button>
          <Button onClick={handleSaveCompletion} variant="contained" color="primary">
            Completar Visita
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para Registrar Visita */}
      <Dialog open={openVisitaDialog} onClose={handleCloseVisitaDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Registrar Nueva Visita</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Fecha"
              type="date"
              value={visitaForm.fecha}
              onChange={(e) => setVisitaForm({ ...visitaForm, fecha: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Técnico *</InputLabel>
              <Select
                value={visitaForm.tecnicoId}
                label="Técnico *"
                onChange={(e) => setVisitaForm({ ...visitaForm, tecnicoId: e.target.value })}
              >
                <MenuItem value="">Seleccionar técnico</MenuItem>
                {tecnicos.map((tecnico) => (
                  <MenuItem key={tecnico.id} value={tecnico.id}>
                    {tecnico.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Descripción *"
              multiline
              rows={3}
              value={visitaForm.descripcion}
              onChange={(e) => setVisitaForm({ ...visitaForm, descripcion: e.target.value })}
              placeholder="Describe lo que se realizó en la visita"
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={visitaForm.estado}
                label="Estado"
                onChange={(e) => setVisitaForm({ ...visitaForm, estado: e.target.value })}
              >
                <MenuItem value="programada">Programada</MenuItem>
                <MenuItem value="realizada">Realizada</MenuItem>
                <MenuItem value="cancelada">Cancelada</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVisitaDialog}>Cancelar</Button>
          <Button onClick={handleSaveVisita} variant="contained" color="primary">
            Guardar Visita
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TicketDetail;
