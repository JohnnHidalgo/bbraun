import { Container, Typography, Button, Box, Card, CardContent, Chip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const Inventario: React.FC = () => {
  // Datos de ejemplo
  const repuestos = [
    { id: 1, nombre: 'Filtro de aire', codigo: 'FILT-001', cantidad: 25, disponible: true },
    { id: 2, nombre: 'Batería de respaldo', codigo: 'BAT-002', cantidad: 5, disponible: true },
    { id: 3, nombre: 'Tubo de pvc 1/2"', codigo: 'TUBO-003', cantidad: 0, disponible: false },
    { id: 4, nombre: 'Conector eléctrico', codigo: 'CONEC-004', cantidad: 15, disponible: true },
  ];

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestión de Inventario</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Agregar Repuesto
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {repuestos.map((repuesto) => (
          <Card key={repuesto.id} sx={{ minWidth: 300, flex: '1 1 300px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {repuesto.nombre}
              </Typography>
              <Typography color="textSecondary">
                Código: {repuesto.codigo}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Cantidad:
                  </Typography>
                  <Typography variant="h6">
                    {repuesto.cantidad}
                  </Typography>
                </Box>
                <Chip
                  label={repuesto.disponible ? 'Disponible' : 'Agotado'}
                  color={repuesto.disponible ? 'success' : 'error'}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Button size="small" color="primary">
                  Ver Historial
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

export default Inventario;