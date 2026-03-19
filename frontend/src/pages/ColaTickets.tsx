import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Button, Box, Chip, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Tabs, Tab, Badge, CircularProgress
} from '@mui/material';
import { Add as AddIcon, OpenInNew as OpenIcon } from '@mui/icons-material';
import { useUser } from '../contexts/UserContext';
import { useData } from '../contexts/DataContext';

interface Ticket {
  id: string;
  descripcion: string;
  prioridad: string;
  estado: string;
  cliente: { nombre: string };
  tecnico?: { nombre: string };
  maquina?: { modelo: string };
  fechaSolicitud: string;
  fechaAsignacion?: string;
  tecnicoId?: string;
  createdAt: string;
}

const ColaTickets: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { tickets, loading, loadTickets, updateTicket } = useData();
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const ticketsDisponibles = tickets.filter(t => !t.tecnicoId && t.estado === 'abierto');
  const misTickets = tickets.filter(t => t.tecnicoId === user?.id);
  const ticketsEnProgreso = tickets.filter(t => t.estado === 'en_proceso');
  const todosTickets = tickets;

  const handleTomarTicket = async (ticketId: string) => {
    if (!user) {
      alert('Usuario no autenticado');
      return;
    }
    try {
      await updateTicket(ticketId, {
        estado: 'en_proceso',
        tecnicoId: user.id,
      });
      alert('Ticket asignado a ti.');
    } catch (error) {
      console.error('Error taking ticket:', error);
      alert('Error al tomar el ticket');
    }
  };
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'abierto': return 'default';
      case 'en_proceso': return 'warning';
      case 'esperando_repuestos': return 'info';
      case 'cerrado': return 'success';
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

  const renderTabla = (tickets: Ticket[], mostrarAsignar: boolean = false) => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell><strong>ID</strong></TableCell>
            <TableCell><strong>Descripción</strong></TableCell>
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
                      {ticket.descripcion}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {ticket.maquina?.modelo || 'Sin máquina'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{ticket.cliente?.nombre || 'N/A'}</TableCell>
                <TableCell>
                  <Chip label={ticket.prioridad} color={getPrioridadColor(ticket.prioridad)} size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={ticket.estado} color={getEstadoColor(ticket.estado)} size="small" />
                </TableCell>
                {!mostrarAsignar && (
                  <TableCell>
                    {ticket.tecnico?.nombre || 'No asignado'}
                  </TableCell>
                )}
                <TableCell>
                  <Typography variant="caption" color="textSecondary">
                    {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}
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
                  {mostrarAsignar && ticket.estado === 'abierto' && !ticket.tecnicoId && (
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => handleTomarTicket(ticket.id)}
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
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      )}
      {!loading && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 2 }}>
            <Typography variant="h4">Centro de Atención (Help Desk)</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/tickets/new')}>
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
        </>
      )}
    </Container>
  );
};

export default ColaTickets;
