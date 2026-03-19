import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, Button, Card, CardContent, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Grid, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { FileDownload as FileDownloadIcon, Print as PrintIcon, GetApp as GetAppIcon } from '@mui/icons-material';
import { useData } from '../contexts/DataContext';

interface ReportData {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: 'estadisticas' | 'tickets' | 'tecnicos' | 'clientes' | 'maquinas';
  generado: string;
}

const Reportes: React.FC = () => {
  const { tickets, loading } = useData();
  const [openDialog, setOpenDialog] = useState(false);
  const [reporteSeleccionado, setReporteSeleccionado] = useState<ReportData | null>(null);
  const [formato, setFormato] = useState('pdf');

  // Cálculo de estadísticas
  const estadisticas = {
    totalTickets: tickets.length,
    ticketsAbiertos: tickets.filter(t => t.estado === 'abierto').length,
    ticketsEnProceso: tickets.filter(t => t.estado === 'en_proceso').length,
    ticketsCerrados: tickets.filter(t => t.estado === 'cerrado').length,
    ticketsPorAlta: tickets.filter(t => t.prioridad === 'Alta').length,
    ticketsPorMedia: tickets.filter(t => t.prioridad === 'Media').length,
    ticketsPorBaja: tickets.filter(t => t.prioridad === 'Baja').length,
  };

  // Agrupar tickets por técnico
  const ticketsPorTecnico = tickets.reduce((acc, ticket) => {
    if (ticket.tecnico) {
      const tecnicoId = ticket.tecnico.id;
      const tecnicoNombre = ticket.tecnico.nombre;
      if (!acc[tecnicoId]) {
        acc[tecnicoId] = { nombre: tecnicoNombre, cantidad: 0, completados: 0 };
      }
      acc[tecnicoId].cantidad++;
      if (ticket.estado === 'cerrado') {
        acc[tecnicoId].completados++;
      }
    }
    return acc;
  }, {} as Record<string, { nombre: string; cantidad: number; completados: number }>);

  // Agrupar tickets por cliente
  const ticketsPorCliente = tickets.reduce((acc, ticket) => {
    if (ticket.cliente) {
      const clienteId = ticket.cliente.id;
      const clienteNombre = ticket.cliente.nombre;
      if (!acc[clienteId]) {
        acc[clienteId] = { nombre: clienteNombre, cantidad: 0 };
      }
      acc[clienteId].cantidad++;
    }
    return acc;
  }, {} as Record<string, { nombre: string; cantidad: number }>);

  // Agrupar tickets por máquina
  const ticketsPorMaquina = tickets.reduce((acc, ticket) => {
    if (ticket.maquina) {
      const maquinaId = ticket.maquina.id;
      const maquinaModelo = ticket.maquina.modelo;
      if (!acc[maquinaId]) {
        acc[maquinaId] = { modelo: maquinaModelo, cantidad: 0 };
      }
      acc[maquinaId].cantidad++;
    }
    return acc;
  }, {} as Record<string, { modelo: string; cantidad: number }>);

  const reportes: ReportData[] = [
    {
      id: '1',
      nombre: 'Estadísticas Generales',
      descripcion: 'Resumen de tickets, estados y prioridades',
      tipo: 'estadisticas',
      generado: new Date().toLocaleDateString(),
    },
    {
      id: '2',
      nombre: 'Tickets por Tecnician',
      descripcion: 'Productividad y desempeño de técnicos',
      tipo: 'tecnicos',
      generado: new Date().toLocaleDateString(),
    },
    {
      id: '3',
      nombre: 'Tickets por Cliente',
      descripcion: 'Servicios prestados a cada cliente',
      tipo: 'clientes',
      generado: new Date().toLocaleDateString(),
    },
    {
      id: '4',
      nombre: 'Tickets por Máquina',
      descripcion: 'Historial de mantenimiento por equipo',
      tipo: 'maquinas',
      generado: new Date().toLocaleDateString(),
    },
  ];

  const handleDescargar = (reporte: ReportData) => {
    setReporteSeleccionado(reporte);
    setOpenDialog(true);
  };

  const handleConfirmarDescarga = () => {
    if (!reporteSeleccionado) return;

    let contenido = generarContenidoReporte(reporteSeleccionado);

    if (formato === 'csv') {
      descargarCSV(contenido.csv || '', reporteSeleccionado.nombre);
    } else if (formato === 'json') {
      descargarJSON(contenido.data || {}, reporteSeleccionado.nombre);
    } else {
      generarPDF(contenido.html || '', reporteSeleccionado.nombre);
    }

    setOpenDialog(false);
    setReporteSeleccionado(null);
  };

  const generarContenidoReporte = (reporte: ReportData) => {
    switch (reporte.tipo) {
      case 'estadisticas':
        return {
          html: `
            <h2>${reporte.nombre}</h2>
            <p>Fecha: ${new Date().toLocaleDateString()}</p>
            <h3>Resumen de Tickets</h3>
            <ul>
              <li>Total de Tickets: ${estadisticas.totalTickets}</li>
              <li>Abiertos: ${estadisticas.ticketsAbiertos}</li>
              <li>En Proceso: ${estadisticas.ticketsEnProceso}</li>
              <li>Cerrados: ${estadisticas.ticketsCerrados}</li>
            </ul>
            <h3>Por Prioridad</h3>
            <ul>
              <li>Alta: ${estadisticas.ticketsPorAlta}</li>
              <li>Media: ${estadisticas.ticketsPorMedia}</li>
              <li>Baja: ${estadisticas.ticketsPorBaja}</li>
            </ul>
          `,
          csv: generarCSVEstadisticas(),
          data: estadisticas,
        };
      case 'tecnicos':
        return {
          html: generarHTMLTecnicos(),
          csv: generarCSVTecnicos(),
          data: ticketsPorTecnico,
        };
      case 'clientes':
        return {
          html: generarHTMLClientes(),
          csv: generarCSVClientes(),
          data: ticketsPorCliente,
        };
      case 'maquinas':
        return {
          html: generarHTMLMaquinas(),
          csv: generarCSVMaquinas(),
          data: ticketsPorMaquina,
        };
      default:
        return { html: '', csv: '', data: {} };
    }
  };

  const generarCSVEstadisticas = () => {
    return `Concepto,Cantidad\nTotal de Tickets,${estadisticas.totalTickets}\nAbiertos,${estadisticas.ticketsAbiertos}\nEn Proceso,${estadisticas.ticketsEnProceso}\nCerrados,${estadisticas.ticketsCerrados}\nAlta Prioridad,${estadisticas.ticketsPorAlta}\nMedia Prioridad,${estadisticas.ticketsPorMedia}\nBaja Prioridad,${estadisticas.ticketsPorBaja}`;
  };

  const generarCSVTecnicos = () => {
    let csv = 'Técnico,Total de Tickets,Completados\n';
    Object.values(ticketsPorTecnico).forEach(t => {
      csv += `${t.nombre},${t.cantidad},${t.completados}\n`;
    });
    return csv;
  };

  const generarCSVClientes = () => {
    let csv = 'Cliente,Total de Tickets\n';
    Object.values(ticketsPorCliente).forEach(c => {
      csv += `${c.nombre},${c.cantidad}\n`;
    });
    return csv;
  };

  const generarCSVMaquinas = () => {
    let csv = 'Máquina,Total de Tickets\n';
    Object.values(ticketsPorMaquina).forEach(m => {
      csv += `${m.modelo},${m.cantidad}\n`;
    });
    return csv;
  };

  const generarHTMLTecnicos = () => {
    let html = `<h2>Tickets por Técnico</h2><p>Fecha: ${new Date().toLocaleDateString()}</p><table border="1"><tr><th>Técnico</th><th>Total</th><th>Completados</th></tr>`;
    Object.values(ticketsPorTecnico).forEach(t => {
      html += `<tr><td>${t.nombre}</td><td>${t.cantidad}</td><td>${t.completados}</td></tr>`;
    });
    html += '</table>';
    return html;
  };

  const generarHTMLClientes = () => {
    let html = `<h2>Tickets por Cliente</h2><p>Fecha: ${new Date().toLocaleDateString()}</p><table border="1"><tr><th>Cliente</th><th>Total de Tickets</th></tr>`;
    Object.values(ticketsPorCliente).forEach(c => {
      html += `<tr><td>${c.nombre}</td><td>${c.cantidad}</td></tr>`;
    });
    html += '</table>';
    return html;
  };

  const generarHTMLMaquinas = () => {
    let html = `<h2>Tickets por Máquina</h2><p>Fecha: ${new Date().toLocaleDateString()}</p><table border="1"><tr><th>Máquina</th><th>Total de Tickets</th></tr>`;
    Object.values(ticketsPorMaquina).forEach(m => {
      html += `<tr><td>${m.modelo}</td><td>${m.cantidad}</td></tr>`;
    });
    html += '</table>';
    return html;
  };

  const descargarCSV = (csv: string, nombre: string) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `${nombre}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const descargarJSON = (data: any, nombre: string) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2)));
    element.setAttribute('download', `${nombre}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const generarPDF = (html: string, nombre: string) => {
    const element = document.createElement('a');
    const pdfContent = `
      <html>
        <head>
          <title>${nombre}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h2 { color: #333; }
            table { border-collapse: collapse; width: 100%; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `;
    element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(pdfContent));
    element.setAttribute('download', `${nombre}.html`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            📊 Reportes
          </Typography>
          <Button variant="contained" startIcon={<FileDownloadIcon />}>
            Nuevo Reporte
          </Button>
        </Box>

        {/* Estadísticas KPI */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">Total Tickets</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  {estadisticas.totalTickets}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">Abiertos</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ff6b6b' }}>
                  {estadisticas.ticketsAbiertos}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">En Proceso</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ffa94d' }}>
                  {estadisticas.ticketsEnProceso}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">Cerrados</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#51cf66' }}>
                  {estadisticas.ticketsCerrados}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Reportes disponibles */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Reportes Disponibles
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Nombre del Reporte</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportes.map((reporte) => (
                <TableRow key={reporte.id} hover>
                  <TableCell sx={{ fontWeight: '500' }}>{reporte.nombre}</TableCell>
                  <TableCell>{reporte.descripcion}</TableCell>
                  <TableCell>{reporte.generado}</TableCell>
                  <TableCell align="center">
                    <Button size="small" variant="outlined" color="primary" sx={{ mr: 1 }} startIcon={<PrintIcon />}>
                      Ver
                    </Button>
                    <Button size="small" variant="outlined" color="secondary" startIcon={<GetAppIcon />} onClick={() => handleDescargar(reporte)}>
                      Descargar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Diálogo de descarga */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Descargar Reporte</DialogTitle>
        <DialogContent sx={{ minWidth: '400px', pt: 2 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {reporteSeleccionado?.nombre}
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Formato</InputLabel>
            <Select
              value={formato}
              onChange={(e) => setFormato(e.target.value)}
              label="Formato"
            >
              <MenuItem value="pdf">PDF (HTML)</MenuItem>
              <MenuItem value="csv">CSV</MenuItem>
              <MenuItem value="json">JSON</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleConfirmarDescarga} variant="contained" color="primary">
            Descargar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Reportes;