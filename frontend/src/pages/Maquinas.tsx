import { Container, Typography, Button, Box, Chip, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab, TextField, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useState } from 'react';

const Maquinas: React.FC = () => {
  const [filtroCliente, setFiltroCliente] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [maquinaSeleccionada, setMaquinaSeleccionada] = useState<any>(null);
  const [historyTabValue, setHistoryTabValue] = useState(0);

  // sample data to simulate history
  const sampleTickets = [
    { id: '1', maquinaId: 1, descripcion: 'Mantenimiento preventivo', estado: 'Completado', prioridad: 'Media', tipo: 'preventivo', fechaSolicitud: '2026-03-01', tecnico: { nombre: 'Técnico A' } },
    { id: '2', maquinaId: 2, descripcion: 'Reparación urgente', estado: 'En Progreso', prioridad: 'Alta', tipo: 'correctivo', fechaSolicitud: '2026-03-05', tecnico: { nombre: 'Técnico B' } }
  ];

  const sampleVisitas = [
    { id: '1', fechaVisita: '2026-03-02', horasTrabajo: 4, descripcionTrabajo: 'Limpieza y calibración', resultado: 'Exitoso', ticketId: '1', tecnico: { nombre: 'Técnico A' }, usoRepuestos: [{ id: 'u1', repuestoId: 'r1', cantidad: 1, costoUnitario: 50 } ] },
    { id: '2', fechaVisita: '2026-03-06', horasTrabajo: 3, descripcionTrabajo: 'Cambio de filtro', resultado: 'Exitoso', ticketId: '2', tecnico: { nombre: 'Técnico B' }, usoRepuestos: [{ id: 'u2', repuestoId: 'r2', cantidad: 2, costoUnitario: 25 } ] }
  ];

  const sampleRepuestos = [
    { id: 'r1', nombre: 'Filtro BBRAUN', codigo: 'FLT001', descripcion: 'Filtro de aire', cantidad: 10 },
    { id: 'r2', nombre: 'Sensor de Presión', codigo: 'SEN002', descripcion: 'Sensor de presión', cantidad: 5 }
  ];

  const getMachineTickets = () => {
    if (!maquinaSeleccionada) return [];
    return sampleTickets.filter(t => t.maquinaId === maquinaSeleccionada.id);
  };

  const getMachineVisitas = () => {
    if (!maquinaSeleccionada) return [];
    const machineTicketIds = getMachineTickets().map((t: any) => t.id);
    return sampleVisitas.filter(v => machineTicketIds.includes(v.ticketId));
  };

  const getMachineRepuestos = () => {
    if (!maquinaSeleccionada) return [];
    const visitas = getMachineVisitas();
    const repuestosUsos = visitas.flatMap(v => v.usoRepuestos || []);
    const grouped: { [key: string]: any } = {};
    repuestosUsos.forEach((uso: any) => {
      if (!grouped[uso.repuestoId]) {
        const rep = sampleRepuestos.find(r => r.id === uso.repuestoId);
        grouped[uso.repuestoId] = {
          repuestoId: uso.repuestoId,
          nombre: rep?.nombre || 'Desconocido',
          cantidad: 0,
          usos: []
        };
      }
      grouped[uso.repuestoId].cantidad += uso.cantidad || 0;
      grouped[uso.repuestoId].usos.push(uso);
    });
    return Object.values(grouped);
  };

  const handleVerHistorial = (maquina: any) => {
    setMaquinaSeleccionada(maquina);
    setHistoryTabValue(0);
  };

  // Datos de ejemplo
  const maquinas = [
    { id: 1, modelo: 'BBRAUN Infusor 500', numeroSerie: 'BB001-2024', estado: 'activo', cliente: 'Hospital Santa Cruz' },
    { id: 2, modelo: 'BBRAUN Monitor 300', numeroSerie: 'BB002-2024', estado: 'mantenimiento', cliente: 'Clínica Los Olivos' },
    { id: 3, modelo: 'BBRAUN Bomba 200', numeroSerie: 'BB003-2024', estado: 'activo', cliente: 'Hospital Viedma' },
  ];


  // Extraer clientes únicos
  const clientes = [...new Set(maquinas.map(maquina => maquina.cliente))];

  // Filtrar máquinas según el cliente seleccionado
  let maquinasFiltradas = filtroCliente ? maquinas.filter(maquina => maquina.cliente === filtroCliente) : maquinas;
  if (searchTerm) {
    maquinasFiltradas = maquinasFiltradas.filter(m =>
      m.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.numeroSerie.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

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

      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filtro por Cliente</InputLabel>
          <Select
            value={filtroCliente}
            label="Filtro por Cliente"
            onChange={(e) => setFiltroCliente(e.target.value)}
          >
            <MenuItem value="">
              <em>Todos los clientes</em>
            </MenuItem>
            {clientes.map((cliente) => (
              <MenuItem key={cliente} value={cliente}>
                {cliente}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Buscar máquina"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 250 }}
        />
      </Box>

      {/* layout: list on left, history/detail on right */}
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ width: '300px', maxHeight: '70vh', overflowY: 'auto' }}>
          <List>
            {maquinasFiltradas.map((maquina) => (
              <ListItem key={maquina.id} disablePadding>
                <ListItemButton
                  selected={maquinaSeleccionada?.id === maquina.id}
                  onClick={() => handleVerHistorial(maquina)}
                >
                  <ListItemText
                    primary={maquina.modelo}
                    secondary={maquina.numeroSerie}
                  />
                  <Chip
                    sx={{ ml: 1 }}
                    label={maquina.estado}
                    size="small"
                    color={getEstadoColor(maquina.estado)}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ flex: 1, minHeight: '70vh', overflowY: 'auto' }}>
          {maquinaSeleccionada ? (
            <>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Historial - {maquinaSeleccionada.modelo} ({maquinaSeleccionada.numeroSerie})
              </Typography>
              <Tabs value={historyTabValue} onChange={(_, value) => setHistoryTabValue(value)} sx={{ mb: 2 }}>
                <Tab label="Historial Completo" />
                <Tab label="Mantenimientos" />
                <Tab label="Repuestos Utilizados" />
              </Tabs>
              {/* reuse same tab content as before, swapping maquinaSeleccionada */}
              {historyTabValue === 0 && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Información de la Máquina</Typography>
                    <Typography variant="body2"><strong>Modelo:</strong> {maquinaSeleccionada.modelo}</Typography>
                    <Typography variant="body2"><strong>Número de Serie:</strong> {maquinaSeleccionada.numeroSerie}</Typography>
                    <Typography variant="body2"><strong>Estado:</strong> {maquinaSeleccionada.estado}</Typography>
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Mantenimientos Registrados</Typography>
                  {getMachineTickets().length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell><strong>Fecha</strong></TableCell>
                            <TableCell><strong>Tipo</strong></TableCell>
                            <TableCell><strong>Descripción</strong></TableCell>
                            <TableCell><strong>Estado</strong></TableCell>
                            <TableCell><strong>Prioridad</strong></TableCell>
                            <TableCell><strong>Técnico</strong></TableCell>
                            <TableCell><strong>Visitas</strong></TableCell>
                            <TableCell><strong>Repuestos</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {getMachineTickets().map((ticket: any) => {
                            const ticketVisitas = sampleVisitas.filter(v => v.ticketId === ticket.id);
                            const ticketRepuestos = ticketVisitas.flatMap(v => v.usoRepuestos || []);
                            return (
                              <TableRow key={ticket.id}>
                                <TableCell>{ticket.fechaSolicitud ? new Date(ticket.fechaSolicitud).toLocaleDateString('es-ES') : '-'}</TableCell>
                                <TableCell><Chip label={ticket.tipo || 'N/A'} size="small" /></TableCell>
                                <TableCell>{ticket.descripcion}</TableCell>
                                <TableCell><Chip label={ticket.estado} size="small" variant="outlined" /></TableCell>
                                <TableCell><Chip label={ticket.prioridad} size="small" /></TableCell>
                                <TableCell>{ticket.tecnico?.nombre || 'Sin asignar'}</TableCell>
                                <TableCell align="center">
                                  <Chip label={`${ticketVisitas.length}`} size="small" color="info" />
                                </TableCell>
                                <TableCell align="center">
                                  <Chip label={`${ticketRepuestos.length}`} size="small" color="warning" />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography color="textSecondary">No hay mantenimientos registrados</Typography>
                  )}
                </Box>
              )}
              {historyTabValue === 1 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Visitas de Mantenimiento</Typography>
                  {getMachineVisitas().length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell><strong>Fecha</strong></TableCell>
                            <TableCell><strong>Técnico</strong></TableCell>
                            <TableCell><strong>Horas</strong></TableCell>
                            <TableCell><strong>Resultado</strong></TableCell>
                            <TableCell><strong>Descripción</strong></TableCell>
                            <TableCell><strong>Repuestos Usados</strong></TableCell>
                            <TableCell><strong>Costo Estimado</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {getMachineVisitas().map((visita: any) => {
                            const visitaRepuestos = visita.usoRepuestos || [];
                            const costoTotal = visitaRepuestos.reduce((total: number, uso: any) => total + (uso.costoUnitario || 0), 0);
                            return (
                              <TableRow key={visita.id}>
                                <TableCell>{new Date(visita.fechaVisita).toLocaleDateString('es-ES')}</TableCell>
                                <TableCell>{visita.tecnico?.nombre || 'Sin asignar'}</TableCell>
                                <TableCell align="center">{visita.horasTrabajo}h</TableCell>
                                <TableCell>
                                  <Chip 
                                    label={visita.resultado} 
                                    size="small" 
                                    color={visita.resultado === 'Exitoso' ? 'success' : 'warning'} 
                                  />
                                </TableCell>
                                <TableCell>{visita.descripcionTrabajo}</TableCell>
                                <TableCell align="center">
                                  <Chip label={`${visitaRepuestos.length}`} size="small" color="info" />
                                </TableCell>
                                <TableCell align="right">
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                    Bs. {costoTotal.toFixed(2)}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography color="textSecondary">No hay visitas registradas</Typography>
                  )}
                </Box>
              )}
              {historyTabValue === 2 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Repuestos Utilizados</Typography>
                  {getMachineRepuestos().length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell><strong>Repuesto</strong></TableCell>
                            <TableCell align="center"><strong>Cantidad Total</strong></TableCell>
                            <TableCell align="center"><strong>Veces Utilizado</strong></TableCell>
                            <TableCell align="right"><strong>Costo Unitario</strong></TableCell>
                            <TableCell align="right"><strong>Costo Total</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {getMachineRepuestos().map((repuesto: any) => (
                            <TableRow key={repuesto.repuestoId}>
                              <TableCell>{repuesto.nombre}</TableCell>
                              <TableCell align="center">
                                <Chip label={repuesto.cantidad} color="primary" variant="outlined" />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography color="textSecondary">No hay repuestos utilizados</Typography>
                  )}
                </Box>
              )}
            </>
          ) : (
            <Typography sx={{ mt: 3 }} color="textSecondary">Seleccione una máquina para ver el historial</Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Maquinas;