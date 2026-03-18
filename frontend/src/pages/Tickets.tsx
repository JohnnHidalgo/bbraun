import { Container, Typography, Button, Box, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Tickets: React.FC = () => {
  const navigate = useNavigate();

  // Datos de ejemplo
  const tickets = [
    { id: '1', estado: 'abierto', prioridad: 'alta', cliente: 'Hospital Santa Cruz', descripcion: 'Máquina no enciende' },
    { id: '2', estado: 'en_progreso', prioridad: 'media', cliente: 'Clínica Los Olivos', descripcion: 'Mantenimiento mensual' },
    { id: '3', estado: 'cerrado', prioridad: 'baja', cliente: 'Hospital Viedma', descripcion: 'Cambio de filtros' },
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'abierto': return 'error';
      case 'en_progreso': return 'warning';
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

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestión de Tickets</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Nuevo Ticket
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Prioridad</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>
                  <Chip
                    label={ticket.estado}
                    color={getEstadoColor(ticket.estado)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={ticket.prioridad}
                    color={getPrioridadColor(ticket.prioridad)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{ticket.cliente}</TableCell>
                <TableCell>{ticket.descripcion}</TableCell>
                <TableCell>
                  <Button size="small" color="primary" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                    Ver
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Tickets;