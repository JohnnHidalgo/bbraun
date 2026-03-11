import { Container, Typography, Box, Button, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';

const Reportes: React.FC = () => {
  const reportes = [
    { id: 1, nombre: 'Historial de Mantenimiento por Máquina', descripcion: 'Detalle completo de mantenimientos realizados', generado: '2026-03-08' },
    { id: 2, nombre: 'Repuestos Utilizados por Máquina', descripcion: 'Registro de consumo de repuestos', generado: '2026-03-07' },
    { id: 3, nombre: 'Actividad por Técnico', descripcion: 'Productividad y desempeño de técnicos', generado: '2026-03-06' },
    { id: 4, nombre: 'Mantenimientos por Cliente', descripcion: 'Resumen de servicios por cliente', generado: '2026-03-05' },
    { id: 5, nombre: 'Máquinas en Garantía', descripcion: 'Estado de garantía de equipos', generado: '2026-03-04' },
  ];

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Reportes</Typography>
        <Button variant="contained" startIcon={<FileDownloadIcon />}>
          Generar Nuevo Reporte
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Nombre del Reporte</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Fecha de Generación</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportes.map((reporte) => (
              <TableRow key={reporte.id} hover>
                <TableCell sx={{ fontWeight: '500' }}>{reporte.nombre}</TableCell>
                <TableCell>{reporte.descripcion}</TableCell>
                <TableCell>{reporte.generado}</TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" color="primary" sx={{ mr: 1 }}>
                    Ver
                  </Button>
                  <Button size="small" variant="outlined" color="secondary">
                    Descargar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Resumen de Actividades
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Card sx={{ flex: '1 1 250px', minWidth: 250 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total de Mantenimientos (Marzo)
              </Typography>
              <Typography variant="h4">42</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: '1 1 250px', minWidth: 250 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Mantenimientos Completados
              </Typography>
              <Typography variant="h4">38</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: '1 1 250px', minWidth: 250 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Ticket Pendientes
              </Typography>
              <Typography variant="h4">4</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: '1 1 250px', minWidth: 250 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Promedio de Satisfacción
              </Typography>
              <Typography variant="h4">4.8/5</Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default Reportes;