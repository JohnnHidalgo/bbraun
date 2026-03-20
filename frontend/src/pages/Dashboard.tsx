import { Container, Typography, Box, Card, CardContent, LinearProgress, Divider, useTheme, Chip } from '@mui/material';
import { TrendingUp, Warning, CheckCircle, AccessTime, FlashOn } from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const theme = useTheme();

  const stats = [
    {
      title: 'Tickets Abiertos',
      value: 12,
      icon: <Warning sx={{ fontSize: 40 }} />,
      description: 'Pendientes de asignación',
      color: '#ff9800',
      bgColor: '#fff3e0',
      trend: '+2 desde ayer',
      trendUp: true,
    },
    {
      title: 'Mantenimientos',
      value: 38,
      icon: <CheckCircle sx={{ fontSize: 40 }} />,
      description: 'Completados este mes',
      color: '#4caf50',
      bgColor: '#f1f8e9',
      trend: '8% vs mes anterior',
      trendUp: true,
    },
    {
      title: 'Máquinas Activas',
      value: 150,
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      description: 'En operación normal',
      color: '#2196f3',
      bgColor: '#e3f2fd',
      trend: 'Todos operativos',
      trendUp: true,
    },
    {
      title: 'En Progreso',
      value: 8,
      icon: <AccessTime sx={{ fontSize: 40 }} />,
      description: 'Técnicos trabajando',
      color: '#9c27b0',
      bgColor: '#f3e5f5',
      trend: 'Completarán hoy',
      trendUp: true,
    },
  ];

  const proximosMantenimientos = [
    { id: 1, cliente: 'Hospital Santa Cruz', fecha: '2026-03-20', tipo: 'Preventivo', estado: 'Programado', prioridad: 'Media' },
    { id: 2, cliente: 'Clínica Los Olivos', fecha: '2026-03-19', tipo: 'Correctivo', estado: 'Urgente', prioridad: 'Alta' },
    { id: 3, cliente: 'Hospital Viedma', fecha: '2026-03-25', tipo: 'Preventivo', estado: 'Programado', prioridad: 'Baja' },
  ];



  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FlashOn sx={{ color: theme.palette.secondary.main }} />
              Dashboard
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Bienvenido al sistema de mantenimiento BBRAUN
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ px: 2, py: 1, bgcolor: '#f0f4f8', borderRadius: 2, fontWeight: 600, color: 'text.secondary' }}>
            Última actualización: hace 5 minutos
          </Typography>
        </Box>

        {/* KPI Cards Box */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 3,
            mb: 4,
          }}
        >
          {stats.map((stat, index) => (
            <Box key={index}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${stat.bgColor} 0%, rgba(255,255,255,0) 100%)`,
                  border: `2px solid`,
                  borderColor: stat.color,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    backgroundColor: stat.color,
                    opacity: 0.05,
                  },
                }}
              >
                <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                    <Chip
                      label={stat.trend}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: stat.color,
                      }}
                    />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: stat.color, mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: 'text.primary' }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {stat.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Main Content Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
            gap: 3,
          }}
        >
          {/* Próximos Mantenimientos */}
          <Box>
            <Card>
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                  color: 'white',
                  p: 2.5,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    📅 Próximos Mantenimientos
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Servicios programados para los próximos días
                  </Typography>
                </Box>
              </Box>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cliente</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fecha</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tipo</th>
                        <th style={{ padding: '16px', textAlign: 'center', fontSize: '0.875rem', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proximosMantenimientos.map((maint, idx) => (
                        <tr
                          key={idx}
                          style={{
                            borderBottom: '1px solid #e2e8f0',
                            transition: 'background-color 0.2s ease',
                            backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#f8fafc')}
                        >
                          <td style={{ padding: '14px 16px', fontSize: '0.9rem', fontWeight: 500, color: '#1e293b' }}>{maint.cliente}</td>
                          <td style={{ padding: '14px 16px', fontSize: '0.9rem', color: '#64748b' }}>{maint.fecha}</td>
                          <td style={{ padding: '14px 16px', fontSize: '0.9rem', color: '#64748b' }}>
                            <Chip label={maint.tipo} size="small" variant="outlined" sx={{ borderColor: '#e2e8f0' }} />
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                            <Chip
                              label={maint.estado}
                              size="small"
                              sx={{
                                backgroundColor: maint.estado === 'Urgente' ? '#fee2e2' : '#f0fdf4',
                                color: maint.estado === 'Urgente' ? '#dc2626' : '#16a34a',
                                fontWeight: 600,
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Info Panel */}
          <Box>
            <Card>
              <Box sx={{ background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)', color: 'white', p: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  ⚙️ Estado del Sistema
                </Typography>
              </Box>
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Utilización de Recursos
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      75%
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={75} sx={{ height: 8, borderRadius: 4 }} />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Box sx={{ width: 12, height: 12, bgcolor: '#10b981', borderRadius: '50%' }} />
                  <Typography variant="body2">Base de datos operativa</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Box sx={{ width: 12, height: 12, bgcolor: '#10b981', borderRadius: '50%' }} />
                  <Typography variant="body2">Servidor API activo</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 12, height: 12, bgcolor: '#10b981', borderRadius: '50%' }} />
                  <Typography variant="body2">Todas las funcionalidades habilitadas</Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card sx={{ mt: 3 }}>
              <Box sx={{ background: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)', color: 'white', p: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  📊 Resumen Rápido
                </Typography>
              </Box>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                      Técnicos en línea
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      5/8
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                      Tiempo promedio resolución
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      4.2h
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                      Satisfacción cliente
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>
                      4.8★
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;