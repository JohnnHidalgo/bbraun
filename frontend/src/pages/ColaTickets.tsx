import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Button, Box, Chip, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Tabs, Tab, Badge
} from '@mui/material';
import { Add as AddIcon, OpenInNew as OpenIcon } from '@mui/icons-material';

interface Ticket {
  id: string;
  titulo: string;
  descripcion: string;
  prioridad: string;
  estado: string;
  cliente: { nombre: string };
  tecnico?: { nombre: string };
  maquina?: { modelo: string };
  fechaCreacion: string;
  fechaAsignacion?: string;
}

const ColaTickets: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const usuarioActual = { id: '2', nombre: 'María López' }; // Simulado

  // Datos de ejemplo
  const todosTickets: Ticket[] = [
    {
      id: '1',
      titulo: 'Máquina no enciende',
      descripcion: 'La máquina no responde al botón de encendido',
      prioridad: 'alta',
      estado: 'en_progreso',
      cliente: { nombre: 'Hospital Santa Cruz' },
      tecnico: { nombre: 'Juan Pérez' },
      maquina: { modelo: 'Braun Infusomat' },
      fechaCreacion: '2026-03-10T08:00:00',
      fechaAsignacion: '2026-03-10T09:30:00'
    },
    {
      id: '2',
      titulo: 'Mantenimiento preventivo',
      descripcion: 'Revisión general y cambio de filtros',
      prioridad: 'media',
      estado: 'abierto',
      cliente: { nombre: 'Clínica Los Olivos' },
      maquina: { modelo: 'Braun Infusomat Space' },
      fechaCreacion: '2026-03-11T10:00:00'
    },
    {
      id: '3',
      titulo: 'Panel de control defectuoso',
      descripcion: 'Panel muestra valores incorrectos',
      prioridad: 'alta',
      estado: 'abierto',
      cliente: { nombre: 'Hospital Central' },
      maquina: { modelo: 'Braun Infusomat Basic' },
      fechaCreacion: '2026-03-12T08:30:00'
    },
    {
      id: '4',
      titulo: 'Revisión de conexiones',
      descripcion: 'Cable dañado, requiere reemplazo',
      prioridad: 'baja',
      estado: 'abierto',
      cliente: { nombre: 'Clínica San José' },
      maquina: { modelo: 'Braun Infusomat Standard' },
      fechaCreacion: '2026-03-11T14:00:00'
    },
    {
      id: '5',
      titulo: 'Revisión completada',
      descripcion: 'Mantenimiento realizado exitosamente',
      prioridad: 'baja',
      estado: 'cerrado',
      cliente: { nombre: 'Hospital Santa Cruz' },
      tecnico: { nombre: 'Carlos Díaz' },
      maquina: { modelo: 'Braun Infusomat' },
      fechaCreacion: '2026-03-08T09:00:00',
      fechaAsignacion: '2026-03-08T10:00:00'
    }
  ];

  const ticketsDisponibles = todosTickets.filter(t => t.estado === 'abierto' && !t.tecnico);
  const misTickets = todosTickets.filter(t => t.tecnico?.nombre === usuarioActual.nombre);
  const ticketsEnProgreso = todosTickets.filter(t => t.estado === 'en_progreso');

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'abierto': return 'default';
      case 'en_progreso': return 'warning';
      case 'resuelto': return 'info';
      case 'cerrado': return 'success';
      default: return 'default';
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return 'error';
      case 'media': return 'warning';
      case 'baja': return 'success';
      default: return 'default';
    }
  };

  const renderTabla = (tickets: Ticket[], mostrarAsignar: boolean = false) => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell><strong>ID</strong></TableCell>
            <TableCell><strong>Título</strong></TableCell>
            <TableCell><strong>Cliente</strong></TableCell>
            <TableCell><strong>Prioridad</strong></TableCell>
            <TableCell><strong>Estado</strong></TableCell>
            {!mostrarAsignar && <TableCell><strong>Técnico</strong></TableCell>}
            <TableCell><strong>Creado</strong></TableCell>
            <TableCell align="center"><strong>Acciones</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <TableRow key={ticket.id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    #{ticket.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: '500' }}>
                      {ticket.titulo}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {ticket.maquina?.modelo}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{ticket.cliente.nombre}</TableCell>
                <TableCell>
                  <Chip label={ticket.prioridad} color={getPrioridadColor(ticket.prioridad)} size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={ticket.estado} color={getEstadoColor(ticket.estado)} size="small" />
                </TableCell>
                {!mostrarAsignar && (
                  <TableCell>
                    {ticket.tecnico?.nombre || '-'}
                  </TableCell>
                )}
                <TableCell>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(ticket.fechaCreacion).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    color="primary"
                    startIcon={<OpenIcon />}
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                    sx={{ mr: 1 }}
                  >
                    Ver
                  </Button>
                  {mostrarAsignar && ticket.estado === 'abierto' && !ticket.tecnico && (
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                    >
                      Tomar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={mostrarAsignar ? 7 : 8} align="center" sx={{ py: 3 }}>
                <Typography color="textSecondary">No hay tickets en esta categoría</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 2 }}>
        <Typography variant="h4">Centro de Atención (Help Desk)</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Nuevo Ticket
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff6b6b' }}>
            {ticketsDisponibles.length}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Tickets Disponibles
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ffa94d' }}>
            {ticketsEnProgreso.length}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            En Progreso
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#51cf66' }}>
            {misTickets.length}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Mis Tickets
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#748ffc' }}>
            {todosTickets.length}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Total de Tickets
          </Typography>
        </Paper>
      </Box>

      <Paper>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab
            label={
              <Badge badgeContent={ticketsDisponibles.length} color="error">
                Cola Disponible
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={misTickets.length} color="success">
                Mis Tickets
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={ticketsEnProgreso.length} color="warning">
                En Progreso
              </Badge>
            }
          />
          <Tab label="Todos" />
        </Tabs>
      </Paper>

      {tabValue === 0 && (
        <Box>
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            📋 Tickets Disponibles para Asignar
          </Typography>
          {renderTabla(ticketsDisponibles, true)}
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            👤 Mis Tickets Asignados
          </Typography>
          {renderTabla(misTickets)}
        </Box>
      )}

      {tabValue === 2 && (
        <Box>
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            ⏳ Tickets en Progreso
          </Typography>
          {renderTabla(ticketsEnProgreso)}
        </Box>
      )}

      {tabValue === 3 && (
        <Box>
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            📊 Todos los Tickets
          </Typography>
          {renderTabla(todosTickets)}
        </Box>
      )}
    </Container>
  );
};

export default ColaTickets;
