import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { UserProvider } from './contexts/UserContext';
import { DataProvider } from './contexts/DataContext';
import { bbraunTheme } from './theme/bbraunTheme';
import Login from './pages/Login';
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
              <Routes>
                {/* Ruta de login (pública) */}
                <Route path="/login" element={<Login />} />
                
                {/* Rutas protegidas */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute
                      element={
                        <Layout>
                          <Dashboard />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/clientes"
                  element={
                    <ProtectedRoute
                      element={
                        <Layout>
                          <Clientes />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/clientes/:id"
                  element={
                    <ProtectedRoute
                      element={
                        <Layout>
                          <ClienteDetail />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/maquinas"
                  element={
                    <ProtectedRoute
                      element={
                        <Layout>
                          <Maquinas />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/tickets"
                  element={
                    <ProtectedRoute
                      element={
                        <Layout>
                          <ColaTickets />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/tickets/:id"
                  element={
                    <ProtectedRoute
                      element={
                        <Layout>
                          <TicketDetail />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/visitas"
                  element={
                    <ProtectedRoute
                      element={
                        <Layout>
                          <Visitas />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/tecnicos"
                  element={
                    <ProtectedRoute
                      element={
                        <Layout>
                          <Tecnicos />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/inventario"
                  element={
                    <ProtectedRoute
                      element={
                        <Layout>
                          <Inventario />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/reportes"
                  element={
                    <ProtectedRoute
                      element={
                        <Layout>
                          <Reportes />
                        </Layout>
                      }
                    />
                  }
                />
                
                {/* Redirect por defecto */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ErrorBoundary>
          </Router>
        </ThemeProvider>
      </DataProvider>
    </UserProvider>
  );
}

export default App;
