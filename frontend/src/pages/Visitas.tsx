import { Container, Typography, Button, Box, Card, CardContent } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const Visitas: React.FC = () => {
  // Datos de ejemplo
  const visitas = [
    { id: 1, ticket: '#001', tecnico: 'Juan Pérez', fecha: '2026-03-08', horas: 2.5, resultado: 'Completada' },
    { id: 2, ticket: '#002', tecnico: 'María López', fecha: '2026-03-07', horas: 1.5, resultado: 'Completada' },
    { id: 3, ticket: '#003', tecnico: 'Carlos Díaz', fecha: '2026-03-06', horas: 3.0, resultado: 'En proceso' },
  ];

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestión de Visitas</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Registrar Visita
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {visitas.map((visita) => (
          <Card key={visita.id} sx={{ minWidth: 300, flex: '1 1 300px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ticket: {visita.ticket}
              </Typography>
              <Typography color="textSecondary">
                Técnico: {visita.tecnico}
              </Typography>
              <Typography color="textSecondary">
                Fecha: {visita.fecha}
              </Typography>
              <Typography color="textSecondary">
                Horas: {visita.horas}h
              </Typography>
              <Typography color="textSecondary" sx={{ mt: 1 }}>
                Resultado: <strong>{visita.resultado}</strong>
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button size="small" color="primary">
                  Ver Detalles
                </Button>
                <Button size="small" color="secondary" sx={{ ml: 1 }}>
                  Editar
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default Visitas;