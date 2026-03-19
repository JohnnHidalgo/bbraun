import { Container, Typography, Box, Card, CardContent, Button, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Select, MenuItem as MuiMenuItem, Tabs, Tab } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Build as BuildIcon, Inventory as InventoryIcon, CalendarToday as CalendarIcon, PersonAdd as PersonAddIcon, Edit as EditIcon, Delete as DeleteIcon, Star as StarIcon, StarBorder as StarBorderIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, Add as AddIcon, History as HistoryIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { clienteApi, maquinaApi, ticketApi, visitaApi, repuestoApi, inventarioApi, contactoApi } from '../services/apiService';

interface Cliente {
  id: string;
  nombre: string;
  tipo: string;
  direccion: string;
  ciudad: string;
  contactos?: Contacto[];
}

interface Contacto {
  id: string;
  clienteId: string;
  nombre: string;
  cargo?: string;
  telefono: string;
  email?: string;
  esPrincipal: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Maquina {
  id: string;
  modelo: string;
  numeroSerie: string;
  estado: string;
  clienteId: string;
}

interface Ticket {
  id: string;
  descripcion: string;
  estado: string;
  prioridad: string;
  tipo?: string;
  fechaCreacion: string;
  fechaSolicitud?: string;
  clienteId: string;
  maquinaId: string;
  tecnicoId?: string;
  maquina?: Maquina;
  tecnico?: any;
}

interface Visita {
  id: string;
  fechaVisita: string;
  horasTrabajo: number;
  descripcionTrabajo: string;
  resultado: string;
  ticketId: string;
  tecnicoId: string;
  usoRepuestos: any[];
  ticket?: Ticket;
  tecnico?: any;
}

interface Repuesto {
  id: string;
  nombre: string;
  codigo: string;
  descripcion: string;
  cantidad?: number;
  inventarioId?: string;
}

const ClienteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [maquinas, setMaquinas] = useState<Maquina[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado para el diálogo de contacto
  const [contactoDialogOpen, setContactoDialogOpen] = useState(false);
  const [editingContacto, setEditingContacto] = useState<Contacto | null>(null);
  const [contactoForm, setContactoForm] = useState({
    nombre: '',
    cargo: '',
    telefono: '',
    email: '',
    esPrincipal: false
  });

  // Estado para el diálogo del calendario
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Estado para el diálogo de crear mantenimiento
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    descripcion: '',
    tipo: 'preventivo',
    maquinaId: '',
    prioridad: 'media',
    fechaSolicitud: new Date().toISOString().split('T')[0]
  });

  // Estado para el diálogo de edición de inventario
  const [inventarioDialogOpen, setInventarioDialogOpen] = useState(false);
  const [editingInventario, setEditingInventario] = useState<Repuesto | null>(null);
  const [inventarioCantidad, setInventarioCantidad] = useState<number>(0);

  // Estado para el diálogo de historial de máquina
  const [machineHistoryDialogOpen, setMachineHistoryDialogOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Maquina | null>(null);
  const [historyTabValue, setHistoryTabValue] = useState(0);

  useEffect(() => {
    if (id) {
      loadClienteData();
    }
  }, [id]);

  const loadClienteData = async () => {
    try {
      setLoading(true);

      // Load client details
      const clienteResponse = await clienteApi.getById(id!);
      setCliente(clienteResponse.data);

      // Load client's contacts
      const contactosResponse = await contactoApi.getByCliente(id!);
      setContactos(contactosResponse.data);

      // Load client's machines
      const maquinasResponse = await maquinaApi.getAll();
      const clienteMaquinas = maquinasResponse.data.filter((m: Maquina) => m.clienteId === id);
      setMaquinas(clienteMaquinas);

      // Load client's tickets
      const ticketsResponse = await ticketApi.getAll();
      let clienteTickets: Ticket[] = ticketsResponse.data.filter((t: Ticket) => t.clienteId === id);
      // attach maquina info if available
      const maquinasResponse2 = await maquinaApi.getAll();
      const maquinasMap: Record<string, Maquina> = {};
      maquinasResponse2.data.forEach((m: Maquina) => { maquinasMap[m.id] = m; });
      clienteTickets = clienteTickets.map(t => ({ ...t, maquina: maquinasMap[t.maquinaId] }));
      setTickets(clienteTickets);

      // Load all visits to filter by client's tickets
      const visitasResponse = await visitaApi.getAll();
      const clienteVisitas = visitasResponse.data.filter((v: Visita) =>
        clienteTickets.some((t: Ticket) => t.id === v.ticketId)
      );
      setVisitas(clienteVisitas);

      // Load client's spare parts
      const repuestosResponse = await repuestoApi.getByCliente(id!);
      setRepuestos(repuestosResponse.data);

    } catch (error) {
      console.error('Error loading client data:', error);
      // Fallback data for demo
      setCliente({
        id: id!,
        nombre: 'Cliente Demo',
        tipo: 'Hospital',
        ciudad: 'La Paz',
        direccion: 'Av. Principal 123',
        contactos: []
      });
      setContactos([
        { id: '1', clienteId: id!, nombre: 'Juan Pérez', cargo: 'Director Médico', telefono: '+591 12345678', email: 'juan.perez@hospital.com', esPrincipal: true, createdAt: '2026-03-01', updatedAt: '2026-03-01' },
        { id: '2', clienteId: id!, nombre: 'María García', cargo: 'Administradora', telefono: '+591 87654321', email: 'maria.garcia@hospital.com', esPrincipal: false, createdAt: '2026-03-02', updatedAt: '2026-03-02' }
      ]);
      setMaquinas([
        { id: '1', modelo: 'BBRAUN Pump 1', numeroSerie: 'BP001', estado: 'Activo', clienteId: id! },
        { id: '2', modelo: 'BBRAUN Monitor 2', numeroSerie: 'BM002', estado: 'En Mantenimiento', clienteId: id! }
      ]);
      setTickets([
        { id: '1', descripcion: 'Mantenimiento preventivo', estado: 'Completado', prioridad: 'Media', fechaCreacion: '2026-03-01', clienteId: id!, maquinaId: '1' },
        { id: '2', descripcion: 'Reparación urgente', estado: 'En Progreso', prioridad: 'Alta', fechaCreacion: '2026-03-05', clienteId: id!, maquinaId: '2' }
      ]);
      setVisitas([
        { id: '1', fechaVisita: '2026-03-02', horasTrabajo: 4, descripcionTrabajo: 'Limpieza y calibración', resultado: 'Exitoso', ticketId: '1', tecnicoId: '1', usoRepuestos: [] }
      ]);
      setRepuestos([
        { id: '1', nombre: 'Filtro BBRAUN', codigo: 'FLT001', descripcion: 'Filtro de aire', cantidad: 10 },
        { id: '2', nombre: 'Sensor de Presión', codigo: 'SEN002', descripcion: 'Sensor de presión', cantidad: 5 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'activo': return 'success';
      case 'en mantenimiento': return 'warning';
      case 'fuera de servicio': return 'error';
      default: return 'default';
    }
  };

  // Funciones para manejar contactos
  const handleOpenContactoDialog = (contacto?: Contacto) => {
    if (contacto) {
      setEditingContacto(contacto);
      setContactoForm({
        nombre: contacto.nombre,
        cargo: contacto.cargo || '',
        telefono: contacto.telefono,
        email: contacto.email || '',
        esPrincipal: contacto.esPrincipal
      });
    } else {
      setEditingContacto(null);
      setContactoForm({
        nombre: '',
        cargo: '',
        telefono: '',
        email: '',
        esPrincipal: false
      });
    }
    setContactoDialogOpen(true);
  };

  const handleCloseContactoDialog = () => {
    setContactoDialogOpen(false);
    setEditingContacto(null);
    setContactoForm({
      nombre: '',
      cargo: '',
      telefono: '',
      email: '',
      esPrincipal: false
    });
  };

  const handleSaveContacto = async () => {
    try {
      const contactoData = {
        ...contactoForm,
        clienteId: id!
      };

      if (editingContacto) {
        await contactoApi.update(editingContacto.id, contactoData);
      } else {
        await contactoApi.create(contactoData);
      }

      // Recargar contactos
      const contactosResponse = await contactoApi.getByCliente(id!);
      setContactos(contactosResponse.data);

      handleCloseContactoDialog();
    } catch (error) {
      console.error('Error saving contacto:', error);
    }
  };

  const handleDeleteContacto = async (contactoId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este contacto?')) {
      try {
        await contactoApi.delete(contactoId);
        // Recargar contactos
        const contactosResponse = await contactoApi.getByCliente(id!);
        setContactos(contactosResponse.data);
      } catch (error) {
        console.error('Error deleting contacto:', error);
      }
    }
  };

  const handleSetPrincipal = async (contactoId: string) => {
    try {
      await contactoApi.setPrincipal(contactoId);
      // Recargar contactos
      const contactosResponse = await contactoApi.getByCliente(id!);
      setContactos(contactosResponse.data);
    } catch (error) {
      console.error('Error setting principal contacto:', error);
    }
  };

  // Funciones para editar inventario
  const handleOpenInventarioDialog = (repuesto: Repuesto) => {
    setEditingInventario(repuesto);
    setInventarioCantidad(repuesto.cantidad || 0);
    setInventarioDialogOpen(true);
  };

  const handleCloseInventarioDialog = () => {
    setEditingInventario(null);
    setInventarioCantidad(0);
    setInventarioDialogOpen(false);
  };

  const handleSaveInventario = async () => {
    if (!editingInventario || !editingInventario.inventarioId) return;
    try {
      await inventarioApi.update(editingInventario.inventarioId, { cantidad: inventarioCantidad });
      const repuestosResponse = await repuestoApi.getByCliente(id!);
      setRepuestos(repuestosResponse.data);
      handleCloseInventarioDialog();
    } catch (error) {
      console.error('Error updating inventario:', error);
      alert('Error al actualizar el inventario');
    }
  };

  // Funciones para el calendario
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const hasMaintenanceOnDate = (day: number) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return tickets.some(ticket => {
      if (!ticket.fechaSolicitud) return false;
      const ticketDate = new Date(ticket.fechaSolicitud);
      return ticketDate.toDateString() === checkDate.toDateString() && ticket.estado !== 'Completado';
    });
  };

  const getMaintenanceForDate = (day: number) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return tickets.filter(ticket => {
      if (!ticket.fechaSolicitud) return false;
      const ticketDate = new Date(ticket.fechaSolicitud);
      return ticketDate.toDateString() === checkDate.toDateString() && ticket.estado !== 'Completado';
    });
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleOpenTicketDialog = () => {
    setTicketForm({
      descripcion: '',
      tipo: 'preventivo',
      maquinaId: '',
      prioridad: 'media',
      fechaSolicitud: new Date().toISOString().split('T')[0]
    });
    setTicketDialogOpen(true);
  };

  const handleCloseTicketDialog = () => {
    setTicketDialogOpen(false);
    setTicketForm({
      descripcion: '',
      tipo: 'preventivo',
      maquinaId: '',
      prioridad: 'media',
      fechaSolicitud: new Date().toISOString().split('T')[0]
    });
  };

  const handleSaveTicket = async () => {
    try {
      if (!ticketForm.descripcion || !ticketForm.maquinaId || !id) {
        alert('Por favor complete todos los campos');
        return;
      }

      const newTicket = {
        descripcion: ticketForm.descripcion,
        tipo: ticketForm.tipo,
        estado: 'abierto',
        prioridad: ticketForm.prioridad,
        clienteId: id,
        maquinaId: ticketForm.maquinaId,
        fechaSolicitud: ticketForm.fechaSolicitud
      };

      await ticketApi.create(newTicket);
      await loadClienteData();
      handleCloseTicketDialog();
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Error al crear mantenimiento');
    }
  };

  const handleOpenMachineHistory = (maquina: Maquina) => {
    setSelectedMachine(maquina);
    setHistoryTabValue(0);
    setMachineHistoryDialogOpen(true);
  };

  const handleCloseMachineHistory = () => {
    setMachineHistoryDialogOpen(false);
    setSelectedMachine(null);
  };

  const getMachineTickets = () => {
    if (!selectedMachine) return [];
    return tickets.filter(t => t.maquinaId === selectedMachine.id);
  };

  const getMachineVisitas = () => {
    if (!selectedMachine) return [];
    const machineTicketIds = tickets.filter(t => t.maquinaId === selectedMachine.id).map(t => t.id);
    return visitas.filter(v => machineTicketIds.includes(v.ticketId));
  };

  const getMachineRepuestos = () => {
    if (!selectedMachine) return [];
    const machineVisitas = getMachineVisitas();
    const repuestosDelVisita = machineVisitas.flatMap(v => v.usoRepuestos || []);
    
    // Agrupar por repuesto
    const grouped: { [key: string]: any } = {};
    repuestosDelVisita.forEach(uso => {
      if (!grouped[uso.repuestoId]) {
        grouped[uso.repuestoId] = {
          repuestoId: uso.repuestoId,
          nombre: uso.repuesto?.nombre || 'Desconocido',
          cantidad: 0,
          usos: []
        };
      }
      grouped[uso.repuestoId].cantidad += 1;
      grouped[uso.repuestoId].usos.push(uso);
    });
    return Object.values(grouped);
  };

  if (loading) {
    return (
      <Container>
        <Typography>Cargando detalles del cliente...</Typography>
      </Container>
    );
  }

  if (!cliente) {
    return (
      <Container>
        <Typography>Cliente no encontrado</Typography>
        <Button onClick={() => navigate('/clientes')}>Volver</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/clientes')}
            sx={{ mr: 2 }}
          >
            Volver
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {cliente.nombre}
          </Typography>
        </Box>

        {/* Client Info and Contacts */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
          {/* Client Info */}
          <Box sx={{ flex: '1 1 calc(50% - 24px)', minWidth: '400px' }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Información del Cliente
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography color="textSecondary">Tipo</Typography>
                    <Typography variant="body1">{cliente.tipo}</Typography>
                  </Box>
                  <Box>
                    <Typography color="textSecondary">Ciudad</Typography>
                    <Typography variant="body1">{cliente.ciudad}</Typography>
                  </Box>
                  <Box>
                    <Typography color="textSecondary">Dirección</Typography>
                    <Typography variant="body1">{cliente.direccion || 'No especificada'}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Contacts Section */}
          <Box sx={{ flex: '1 1 calc(50% - 24px)', minWidth: '400px' }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Contactos ({contactos.length})
                  </Typography>
                  <Button
                    startIcon={<PersonAddIcon />}
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenContactoDialog()}
                  >
                    Agregar
                  </Button>
                </Box>
                {contactos.length > 0 ? (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Nombre</TableCell>
                          <TableCell>Cargo</TableCell>
                          <TableCell>Teléfono</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Principal</TableCell>
                          <TableCell>Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {contactos.map((contacto) => (
                          <TableRow key={contacto.id}>
                            <TableCell>{contacto.nombre}</TableCell>
                            <TableCell>{contacto.cargo || '-'}</TableCell>
                            <TableCell>{contacto.telefono}</TableCell>
                            <TableCell>{contacto.email || '-'}</TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => handleSetPrincipal(contacto.id)}
                                color={contacto.esPrincipal ? 'primary' : 'default'}
                              >
                                {contacto.esPrincipal ? <StarIcon /> : <StarBorderIcon />}
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenContactoDialog(contacto)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteContacto(contacto.id)}
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography color="textSecondary">
                    No hay contactos registrados
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {/* Machines Section */}
          <Box sx={{ flex: '1 1 calc(50% - 24px)', minWidth: '400px' }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BuildIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Máquinas del Cliente ({maquinas.length})
                  </Typography>
                </Box>
                {maquinas.length > 0 ? (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                          <TableCell sx={{ fontWeight: 600 }}>Modelo</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>N° Serie</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {maquinas.map((maquina) => (
                          <TableRow key={maquina.id} hover>
                            <TableCell sx={{ fontWeight: 500 }}>{maquina.modelo}</TableCell>
                            <TableCell>{maquina.numeroSerie}</TableCell>
                            <TableCell>
                              <Chip
                                label={maquina.estado}
                                size="small"
                                color={getEstadoColor(maquina.estado)}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenMachineHistory(maquina)}
                                title="Ver Historial"
                              >
                                <HistoryIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography color="textSecondary">No hay máquinas registradas</Typography>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* Maintenance Calendar Section */}
          <Box sx={{ flex: '1 1 calc(50% - 24px)', minWidth: '400px' }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Calendario de Mantenimientos
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleOpenTicketDialog}
                      color="primary"
                    >
                      Agregar 
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<CalendarIcon />}
                      onClick={() => setCalendarDialogOpen(true)}
                    >
                    </Button>
                  </Box>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Próximos mantenimientos programados
                </Typography>
                {/* Aquí iría un calendario real - por ahora mostramos próximos tickets en tabla */}
                {tickets.filter(t => t.estado !== 'Completado').length > 0 ? (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                          <TableCell>Fecha Solicitud</TableCell>
                          <TableCell>Descripción</TableCell>
                          <TableCell>Prioridad</TableCell>
                          <TableCell>Estado</TableCell>
                          <TableCell>Máquina</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tickets.filter(t => t.estado !== 'Completado').map((ticket) => (
                          <TableRow key={ticket.id} hover>
                            <TableCell>{ticket.fechaSolicitud ? new Date(ticket.fechaSolicitud).toLocaleDateString() : '-'}</TableCell>
                            <TableCell>{ticket.descripcion}</TableCell>
                            <TableCell>{ticket.prioridad}</TableCell>
                            <TableCell>
                              <Chip
                                label={ticket.estado}
                                size="small"
                                color={getEstadoColor(ticket.estado)}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>{ticket.maquina?.modelo || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography color="textSecondary">No hay mantenimientos programados</Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Maintenance History */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Historial de Mantenimientos
            </Typography>
            {visitas.length > 0 ? (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Horas</TableCell>
                      <TableCell>Resultado</TableCell>
                      <TableCell>Repuestos Utilizados</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visitas.map((visita) => (
                      <TableRow key={visita.id}>
                        <TableCell>{new Date(visita.fechaVisita).toLocaleDateString()}</TableCell>
                        <TableCell>{visita.descripcionTrabajo}</TableCell>
                        <TableCell>{visita.horasTrabajo}h</TableCell>
                        <TableCell>
                          <Chip
                            label={visita.resultado}
                            size="small"
                            color={visita.resultado === 'Exitoso' ? 'success' : 'warning'}
                          />
                        </TableCell>
                        <TableCell>
                          {visita.usoRepuestos && visita.usoRepuestos.length > 0 ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {visita.usoRepuestos.map((uso: any) => {
                                const repuesto = repuestos.find(r => r.id === uso.repuestoId);
                                return repuesto ? (
                                  <Chip
                                    key={uso.id}
                                    label={`${repuesto.nombre} (${uso.cantidad})`}
                                    size="small"
                                    variant="outlined"
                                  />
                                ) : null;
                              })}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="textSecondary">Ninguno</Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="textSecondary">No hay historial de mantenimientos</Typography>
            )}
          </CardContent>
        </Card>

        {/* Spare Parts Stock */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <InventoryIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Repuestos en Stock ({repuestos.length})
              </Typography>
            </Box>
            {repuestos.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Código</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Descripción</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Cantidad</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Estado</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {repuestos.map((repuesto) => (
                      <TableRow key={repuesto.id} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{repuesto.nombre}</TableCell>
                        <TableCell>
                          <Chip
                            label={repuesto.codigo}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{repuesto.descripcion}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={repuesto.cantidad || 0}
                            color={repuesto.cantidad && repuesto.cantidad > 0 ? 'success' : 'error'}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={repuesto.cantidad && repuesto.cantidad > 0 ? 'Disponible' : 'Agotado'}
                            color={repuesto.cantidad && repuesto.cantidad > 0 ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button size="small" onClick={() => handleOpenInventarioDialog(repuesto)}>
                            Editar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="textSecondary">No hay repuestos en stock</Typography>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Contact Dialog */}
      <Dialog open={contactoDialogOpen} onClose={handleCloseContactoDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingContacto ? 'Editar Contacto' : 'Nuevo Contacto'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nombre"
              value={contactoForm.nombre}
              onChange={(e) => setContactoForm({ ...contactoForm, nombre: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Cargo"
              value={contactoForm.cargo}
              onChange={(e) => setContactoForm({ ...contactoForm, cargo: e.target.value })}
              fullWidth
              placeholder="Ej: Director Médico, Administrador"
            />
            <TextField
              label="Teléfono"
              value={contactoForm.telefono}
              onChange={(e) => setContactoForm({ ...contactoForm, telefono: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={contactoForm.email}
              onChange={(e) => setContactoForm({ ...contactoForm, email: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseContactoDialog}>Cancelar</Button>
          <Button
            onClick={handleSaveContacto}
            variant="contained"
            disabled={!contactoForm.nombre || !contactoForm.telefono}
          >
            {editingContacto ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Inventario Dialog */}
      <Dialog open={inventarioDialogOpen} onClose={handleCloseInventarioDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Inventario</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Repuesto"
              value={editingInventario?.nombre || ''}
              fullWidth
              disabled
            />
            <TextField
              label="Cantidad"
              type="number"
              value={inventarioCantidad}
              onChange={(e) => setInventarioCantidad(Number(e.target.value))}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInventarioDialog}>Cancelar</Button>
          <Button onClick={handleSaveInventario} variant="contained" disabled={inventarioCantidad < 0}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Calendar Dialog */}
      <Dialog open={calendarDialogOpen} onClose={() => setCalendarDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" onClick={handlePrevMonth}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flex: 1, textAlign: 'center' }}>
              {new Date(currentMonth.getFullYear(), currentMonth.getMonth()).toLocaleDateString('es-ES', {
                month: 'long',
                year: 'numeric',
              })}
            </Typography>
            <IconButton size="small" onClick={handleNextMonth}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {/* Days of week header */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 1 }}>
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'].map((day) => (
                <Typography key={day} align="center" variant="caption" sx={{ fontWeight: 'bold' }}>
                  {day}
                </Typography>
              ))}
            </Box>

            {/* Calendar days */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
              {/* Empty cells for days before month starts */}
              {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, i) => (
                <Box key={`empty-${i}`} sx={{ p: 1, minHeight: '60px' }} />
              ))}

              {/* Days of the month */}
              {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, i) => {
                const day = i + 1;
                const hasEvents = hasMaintenanceOnDate(day);
                const maintenanceList = getMaintenanceForDate(day);

                return (
                  <Box
                    key={day}
                    sx={{
                      p: 1,
                      minHeight: '60px',
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      bgcolor: hasEvents ? '#e3f2fd' : 'transparent',
                      cursor: hasEvents ? 'pointer' : 'default',
                      transition: 'all 0.3s ease',
                      '&:hover': hasEvents ? { bgcolor: '#bbdefb', boxShadow: 1 } : {},
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {day}
                    </Typography>
                    {hasEvents && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                        <Chip
                          label={`${maintenanceList.length} mantenimientos`}
                          size="small"
                          icon={<CalendarIcon />}
                          variant="outlined"
                          sx={{ height: '20px', fontSize: '0.7rem' }}
                          color="primary"
                        />
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCalendarDialogOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Ticket Dialog */}
      <Dialog open={ticketDialogOpen} onClose={handleCloseTicketDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Agregar Nuevo Mantenimiento
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Descripción del Mantenimiento"
              value={ticketForm.descripcion}
              onChange={(e) => setTicketForm({ ...ticketForm, descripcion: e.target.value })}
              fullWidth
              multiline
              rows={3}
              required
              placeholder="Ej: Revisión preventiva, cambio de aceite, etc."
            />
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Tipo de Mantenimiento
              </Typography>
              <Select
                value={ticketForm.tipo}
                onChange={(e) => setTicketForm({ ...ticketForm, tipo: e.target.value })}
                fullWidth
              >
                <MuiMenuItem value="preventivo">Preventivo</MuiMenuItem>
                <MuiMenuItem value="correctivo">Correctivo</MuiMenuItem>
              </Select>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Máquina *
              </Typography>
              <Select
                value={ticketForm.maquinaId}
                onChange={(e) => setTicketForm({ ...ticketForm, maquinaId: e.target.value })}
                fullWidth
                required
              >
                <MuiMenuItem value="">Seleccionar máquina</MuiMenuItem>
                {maquinas.map((maquina) => (
                  <MuiMenuItem key={maquina.id} value={maquina.id}>
                    {maquina.modelo} ({maquina.numeroSerie})
                  </MuiMenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Prioridad
              </Typography>
              <Select
                value={ticketForm.prioridad}
                onChange={(e) => setTicketForm({ ...ticketForm, prioridad: e.target.value })}
                fullWidth
              >
                <MuiMenuItem value="baja">Baja</MuiMenuItem>
                <MuiMenuItem value="media">Media</MuiMenuItem>
                <MuiMenuItem value="alta">Alta</MuiMenuItem>
              </Select>
            </Box>
            <TextField
              label="Fecha de Solicitud"
              type="date"
              value={ticketForm.fechaSolicitud}
              onChange={(e) => setTicketForm({ ...ticketForm, fechaSolicitud: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTicketDialog}>Cancelar</Button>
          <Button
            onClick={handleSaveTicket}
            variant="contained"
            disabled={!ticketForm.descripcion || !ticketForm.maquinaId}
          >
            Crear Mantenimiento
          </Button>
        </DialogActions>
      </Dialog>

      {/* Machine History Dialog */}
      <Dialog open={machineHistoryDialogOpen} onClose={handleCloseMachineHistory} maxWidth="md" fullWidth>
        <DialogTitle>
          Historial - {selectedMachine?.modelo} ({selectedMachine?.numeroSerie})
        </DialogTitle>
        <DialogContent>
          <Tabs value={historyTabValue} onChange={(_, value) => setHistoryTabValue(value)} sx={{ mt: 2, mb: 2 }}>
            <Tab label="Historial Completo" />
            <Tab label="Mantenimientos" />
            <Tab label="Repuestos Utilizados" />
          </Tabs>

          {/* Tab 0: Historial Completo */}
          {historyTabValue === 0 && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Información de la Máquina</Typography>
                <Typography variant="body2"><strong>Modelo:</strong> {selectedMachine?.modelo}</Typography>
                <Typography variant="body2"><strong>Número de Serie:</strong> {selectedMachine?.numeroSerie}</Typography>
                <Typography variant="body2"><strong>Estado:</strong> {selectedMachine?.estado}</Typography>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Mantenimientos Registrados</Typography>
              {getMachineTickets().length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell><strong>Fecha</strong></TableCell>
                        <TableCell><strong>Tipo</strong></TableCell>
                        <TableCell><strong>Descripción</strong></TableCell>
                        <TableCell><strong>Estado</strong></TableCell>
                        <TableCell><strong>Prioridad</strong></TableCell>
                        <TableCell><strong>Técnico</strong></TableCell>
                        <TableCell><strong>Visitas</strong></TableCell>
                        <TableCell><strong>Repuestos</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getMachineTickets().map((ticket) => {
                        const ticketVisitas = visitas.filter(v => v.ticketId === ticket.id);
                        const ticketRepuestos = ticketVisitas.flatMap(v => v.usoRepuestos || []);
                        return (
                          <TableRow key={ticket.id}>
                            <TableCell>{new Date(ticket.fechaSolicitud || '').toLocaleDateString('es-ES')}</TableCell>
                            <TableCell><Chip label={ticket.tipo || 'N/A'} size="small" /></TableCell>
                            <TableCell>{ticket.descripcion}</TableCell>
                            <TableCell><Chip label={ticket.estado} size="small" variant="outlined" /></TableCell>
                            <TableCell><Chip label={ticket.prioridad} size="small" /></TableCell>
                            <TableCell>{ticket.tecnico?.nombre || 'Sin asignar'}</TableCell>
                            <TableCell align="center">
                              <Chip label={`${ticketVisitas.length}`} size="small" color="info" />
                            </TableCell>
                            <TableCell align="center">
                              <Chip label={`${ticketRepuestos.length}`} size="small" color="warning" />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="textSecondary">No hay mantenimientos registrados</Typography>
              )}
            </Box>
          )}

          {/* Tab 1: Mantenimientos */}
          {historyTabValue === 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Visitas de Mantenimiento</Typography>
              {getMachineVisitas().length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell><strong>Fecha</strong></TableCell>
                        <TableCell><strong>Técnico</strong></TableCell>
                        <TableCell><strong>Horas</strong></TableCell>
                        <TableCell><strong>Resultado</strong></TableCell>
                        <TableCell><strong>Descripción</strong></TableCell>
                        <TableCell><strong>Repuestos Usados</strong></TableCell>
                        <TableCell><strong>Costo Estimado</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getMachineVisitas().map((visita) => {
                        const visitaRepuestos = visita.usoRepuestos || [];
                        const costoTotal = visitaRepuestos.reduce((total: number, uso: any) => total + (uso.costoUnitario || 0), 0);
                        return (
                          <TableRow key={visita.id}>
                            <TableCell>{new Date(visita.fechaVisita).toLocaleDateString('es-ES')}</TableCell>
                            <TableCell>{visita.tecnico?.nombre || 'Sin asignar'}</TableCell>
                            <TableCell align="center">{visita.horasTrabajo}h</TableCell>
                            <TableCell>
                              <Chip 
                                label={visita.resultado} 
                                size="small" 
                                color={visita.resultado === 'Completado' ? 'success' : 'warning'} 
                              />
                            </TableCell>
                            <TableCell>{visita.descripcionTrabajo}</TableCell>
                            <TableCell align="center">
                              <Chip label={`${visitaRepuestos.length}`} size="small" color="info" />
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                Bs. {costoTotal.toFixed(2)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="textSecondary">No hay visitas registradas</Typography>
              )}
            </Box>
          )}

          {/* Tab 2: Repuestos Utilizados */}
          {historyTabValue === 2 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Repuestos Utilizados</Typography>
              {getMachineRepuestos().length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell><strong>Repuesto</strong></TableCell>
                        <TableCell align="center"><strong>Cantidad Total</strong></TableCell>
                        <TableCell align="center"><strong>Veces Utilizado</strong></TableCell>
                        <TableCell align="right"><strong>Costo Unitario</strong></TableCell>
                        <TableCell align="right"><strong>Costo Total</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getMachineRepuestos().map((repuesto: any) => (
                        <TableRow key={repuesto.repuestoId}>
                          <TableCell>{repuesto.nombre}</TableCell>
                          <TableCell align="center">
                            <Chip label={repuesto.cantidad} color="primary" variant="outlined" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="textSecondary">No hay repuestos utilizados</Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMachineHistory}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClienteDetail;