import { Container, Typography, Button, Box, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const Tickets: React.FC = () => {
  // Datos de ejemplo
  const tickets = [
    { id: 1, tipo: 'correctivo', estado: 'abierto', prioridad: 'alta', cliente: 'Hospital Santa Cruz', descripcion: 'Máquina no enciende' },
    { id: 2, tipo: 'preventivo', estado: 'asignado', prioridad: 'media', cliente: 'Clínica Los Olivos', descripcion: 'Mantenimiento mensual' },
    { id: 3, tipo: 'correctivo', estado: 'cerrado', prioridad: 'baja', cliente: 'Hospital Viedma', descripcion: 'Cambio de filtros' },
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'abierto': return 'error';
      case 'asignado': return 'warning';
      case 'en_proceso': return 'info';
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
              <TableCell>Tipo</TableCell>
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
                    label={ticket.tipo}
                    color={ticket.tipo === 'preventivo' ? 'primary' : 'secondary'}
                    size="small"
                  />
                </TableCell>
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
                  <Button size="small" color="primary">
                    Ver
                  </Button>
                  <Button size="small" color="secondary" sx={{ ml: 1 }}>
                    Editar
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