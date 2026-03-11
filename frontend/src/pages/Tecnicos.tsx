import { Container, Typography, Button, Box, Card, CardContent, Chip } from '@mui/material';
import { Add as AddIcon, Groups as GroupsIcon } from '@mui/icons-material';

const Tecnicos: React.FC = () => {
  // Datos de ejemplo
  const tecnicos = [
    { id: 1, nombre: 'Juan Pérez', region: 'La Paz', especialidad: 'Infusión', tickets: 12, estado: 'activo' },
    { id: 2, nombre: 'María López', region: 'Cochabamba', especialidad: 'Monitoreo', tickets: 8, estado: 'activo' },
    { id: 3, nombre: 'Carlos Díaz', region: 'Santa Cruz', especialidad: 'General', tickets: 15, estado: 'activo' },
    { id: 4, nombre: 'Ana Rodríguez', region: 'La Paz', especialidad: 'Bombas', tickets: 5, estado: 'inactivo' },
  ];

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestión de Técnicos</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Agregar Técnico
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {tecnicos.map((tecnico) => (
          <Card key={tecnico.id} sx={{ minWidth: 300, flex: '1 1 300px' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {tecnico.nombre}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupsIcon fontSize="small" />
                    <Typography color="textSecondary" variant="body2">
                      {tecnico.region}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={tecnico.estado}
                  color={tecnico.estado === 'activo' ? 'success' : 'default'}
                  size="small"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography color="textSecondary" variant="body2">
                  Especialidad: <strong>{tecnico.especialidad}</strong>
                </Typography>
                <Typography color="textSecondary" variant="body2">
                  Tickets Atendidos: <strong>{tecnico.tickets}</strong>
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" color="primary">
                  Ver Perfil
                </Button>
                <Button size="small" color="secondary">
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

export default Tecnicos;