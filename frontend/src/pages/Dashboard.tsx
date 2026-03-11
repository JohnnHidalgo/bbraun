import { Container, Typography, Box, Card, CardContent, LinearProgress, Divider } from '@mui/material';
import { TrendingUp, Warning, CheckCircle, AccessTime } from '@mui/icons-material';

const Dashboard: React.FC = () => {
  // Datos de ejemplo - en producción vendrían de la API
  const stats = [
    {
      title: 'Tickets Abiertos',
      value: 12,
      icon: <Warning sx={{ fontSize: 40, color: '#ff9800' }} />,
      description: 'Pendientes de asignación',
      color: '#fff3e0',
    },
    {
      title: 'Mantenimientos Completados',
      value: 38,
      icon: <CheckCircle sx={{ fontSize: 40, color: '#4caf50' }} />,
      description: 'Esta temporada',
      color: '#f1f8e9',
    },
    {
      title: 'Máquinas Activas',
      value: 150,
      icon: <TrendingUp sx={{ fontSize: 40, color: '#2196f3' }} />,
      description: 'En operación',
      color: '#e3f2fd',
    },
    {
      title: 'Tareas en Progreso',
      value: 8,
      icon: <AccessTime sx={{ fontSize: 40, color: '#9c27b0' }} />,
      description: 'Técnicos trabajando',
      color: '#f3e5f5',
    },
  ];

  const proximosMantenimientos = [
    { id: 1, cliente: 'Hospital Santa Cruz', fecha: '2026-03-10', tipo: 'Preventivo', estado: 'Programado' },
    { id: 2, cliente: 'Clínica Los Olivos', fecha: '2026-03-12', tipo: 'Correctivo', estado: 'Urgente' },
    { id: 3, cliente: 'Hospital Viedma', fecha: '2026-03-15', tipo: 'Preventivo', estado: 'Programado' },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Dashboard - Sistema de Mantenimiento BBRAUN
        </Typography>

        {/* Tarjetas de Estadísticas */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          {stats.map((stat, index) => (
            <Box key={index} sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '250px' }}>
              <Card
                sx={{
                  backgroundColor: stat.color,
                  border: '1px solid #e0e0e0',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom variant="body2">
                        {stat.title}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {stat.value}
                      </Typography>
                    </Box>
                    {stat.icon}
                  </Box>
                  <Typography color="textSecondary" variant="caption">
                    {stat.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Sección de Próximos Mantenimientos */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Próximos Mantenimientos
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {proximosMantenimientos.map((item, index) => (
              <Box key={index} sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {item.cliente}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      backgroundColor: item.estado === 'Urgente' ? '#ffebee' : '#f1f8e9',
                      color: item.estado === 'Urgente' ? '#c62828' : '#558b2f',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '12px',
                      fontWeight: 500,
                    }}
                  >
                    {item.estado}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" color="textSecondary">
                    {item.tipo}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {item.fecha}
                  </Typography>
                </Box>
                {index < proximosMantenimientos.length - 1 && <Divider sx={{ mt: 1 }} />}
              </Box>
            ))}
          </CardContent>
        </Card>

        {/* Métricas de Rendimiento */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: '300px' }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Eficiencia de Técnicos
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Juan Pérez</Typography>
                    <Typography variant="body2" color="textSecondary">
                      85%
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={85} />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">María López</Typography>
                    <Typography variant="body2" color="textSecondary">
                      92%
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={92} />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Carlos Díaz</Typography>
                    <Typography variant="body2" color="textSecondary">
                      78%
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={78} />
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: '300px' }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Satisfacción de Clientes
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 600, color: '#4caf50' }}>
                      4.8
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      de 5 estrellas
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="caption" color="textSecondary">
                  Basado en 48 encuestas completadas este mes
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;