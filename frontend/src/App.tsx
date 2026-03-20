import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { UserProvider } from './contexts/UserContext';
import { DataProvider } from './contexts/DataContext';
import { bbraunTheme } from './theme/bbraunTheme';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import ClienteDetail from './pages/ClienteDetail';
import Maquinas from './pages/Maquinas';
import ColaTickets from './pages/ColaTickets';
import TicketDetail from './pages/TicketDetail';
import Visitas from './pages/Visitas';
import Tecnicos from './pages/Tecnicos';
import Inventario from './pages/Inventario';
import Reportes from './pages/Reportes';

function App() {
  return (
    <UserProvider>
      <DataProvider>
        <ThemeProvider theme={bbraunTheme}>
          <CssBaseline />
          <Router>
            <ErrorBoundary>
              <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/clientes/:id" element={<ClienteDetail />} />
                <Route path="/maquinas" element={<Maquinas />} />
                <Route path="/tickets" element={<ColaTickets />} />
                <Route path="/tickets/:id" element={<TicketDetail />} />
                <Route path="/visitas" element={<Visitas />} />
                <Route path="/tecnicos" element={<Tecnicos />} />
                <Route path="/inventario" element={<Inventario />} />
                <Route path="/reportes" element={<Reportes />} />
              </Routes>
            </Layout>
            </ErrorBoundary>
          </Router>
        </ThemeProvider>
      </DataProvider>
    </UserProvider>
  );
}

export default App;
