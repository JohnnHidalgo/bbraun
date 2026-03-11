import { Container, Typography, Button, Box, Card, CardContent, Chip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const Maquinas: React.FC = () => {
  // Datos de ejemplo
  const maquinas = [
    { id: 1, modelo: 'BBRAUN Infusor 500', numeroSerie: 'BB001-2024', estado: 'activo', cliente: 'Hospital Santa Cruz' },
    { id: 2, modelo: 'BBRAUN Monitor 300', numeroSerie: 'BB002-2024', estado: 'mantenimiento', cliente: 'Clínica Los Olivos' },
    { id: 3, modelo: 'BBRAUN Bomba 200', numeroSerie: 'BB003-2024', estado: 'activo', cliente: 'Hospital Viedma' },
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'success';
      case 'mantenimiento': return 'warning';
      case 'inactivo': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestión de Máquinas</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Nueva Máquina
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {maquinas.map((maquina) => (
          <Card key={maquina.id} sx={{ minWidth: 300, flex: '1 1 300px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {maquina.modelo}
              </Typography>
              <Typography color="textSecondary" sx={{ mb: 1 }}>
                Serie: {maquina.numeroSerie}
              </Typography>
              <Typography color="textSecondary" sx={{ mb: 2 }}>
                Cliente: {maquina.cliente}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip
                  label={maquina.estado}
                  color={getEstadoColor(maquina.estado)}
                  size="small"
                />
                <Box>
                  <Button size="small" color="primary">
                    Ver Historial
                  </Button>
                  <Button size="small" color="secondary" sx={{ ml: 1 }}>
                    Editar
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default Maquinas;