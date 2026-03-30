import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Button, Container, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import { useUser } from '../contexts/UserContext';
import api from '../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si ya está autenticado, redirigir al dashboard
    if (isAuthenticated && user) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    // Manejar el callback de Microsoft (si viene con code en la URL)
    const code = searchParams.get('code');
    if (code) {
      handleMicrosoftCallback(code);
    }
  }, [searchParams]);

  const handleMicrosoftCallback = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/auth/callback', { params: { code } });
      const { token } = response.data;
      
      // Guardar token
      localStorage.setItem('token', token);
      
      // Redirigir al dashboard
      navigate('/');
    } catch (err: any) {
      console.error('Microsoft login error:', err);
      setError('Error al conectar con tu cuenta de Microsoft. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/auth/microsoft-login-url');
      const { authUrl } = response.data;
      
      // Redirigir a Microsoft para autenticación
      window.location.href = authUrl;
    } catch (err: any) {
      console.error('Failed to get login URL:', err);
      setError('Error al iniciar sesión con Microsoft. Intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            textAlign: 'center',
            width: '100%',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
            B. Braun - Sistema de Gestión
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Inicia sesión con tu correo institucional de Microsoft
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            variant="contained"
            size="large"
            onClick={handleMicrosoftLogin}
            disabled={loading}
            sx={{
              backgroundColor: '#0078d4',
              '&:hover': {
                backgroundColor: '#106ebe',
              },
              mb: 2,
              width: '100%',
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                Conectando...
              </>
            ) : (
              <>
                🔐 Iniciar Sesión con Microsoft
              </>
            )}
          </Button>

          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 2 }}>
            Solo se permiten cuentas organizacionales de B. Braun
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
