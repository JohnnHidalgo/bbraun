import { AppBar, Toolbar, Typography, Button, Box, Drawer, List, ListItem, ListItemButton, ListItemText, Avatar, Divider, useTheme, Chip } from '@mui/material';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dashboard as DashboardIcon, People as PeopleIcon, Build as BuildIcon, Assignment as AssignmentIcon, Person as PersonIcon, Storage as StorageIcon, Assessment as AssessmentIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useUser } from '../contexts/UserContext';

const drawerWidth = 260;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, logout } = useUser();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', path: '/', icon: <DashboardIcon sx={{ mr: 2 }} /> },
    { text: 'Clientes', path: '/clientes', icon: <PeopleIcon sx={{ mr: 2 }} /> },
    { text: 'Máquinas', path: '/maquinas', icon: <BuildIcon sx={{ mr: 2 }} /> },
    { text: 'Tickets', path: '/tickets', icon: <AssignmentIcon sx={{ mr: 2 }} /> },
    { text: 'Técnicos', path: '/tecnicos', icon: <PersonIcon sx={{ mr: 2 }} /> },
    { text: 'Inventario', path: '/inventario', icon: <StorageIcon sx={{ mr: 2 }} /> },
    { text: 'Reportes', path: '/reportes', icon: <AssessmentIcon sx={{ mr: 2 }} /> },
  ];

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Branding Section */}
      <Box sx={{ p: 2.5, background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)', color: 'white', textAlign: 'center' }}>
        <Box sx={{ fontSize: '2rem', fontWeight: 'bold', mb: 0.5, letterSpacing: '1px' }}>
          🏥
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
          BBRAUN
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mt: 0.5 }}>
          Sistema de Mantenimiento
        </Typography>
      </Box>

      <Divider />

      {/* User Section */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5, background: '#f8fafc' }}>
        <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 40, height: 40, fontWeight: 'bold' }}>
          {user?.nombre?.[0] || 'U'}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.nombre || 'Usuario'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            {user?.rol || 'Técnico'}
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Menu List */}
      <List sx={{ flex: 1, px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                selected={isSelected}
                sx={{
                  borderRadius: 10,
                  transition: 'all 0.2s ease',
                  ...(isSelected && {
                    backgroundColor: 'rgba(30, 58, 138, 0.1)',
                    borderLeft: '3px solid',
                    borderLeftColor: 'primary.main',
                    fontWeight: 600,
                    color: 'primary.main',
                  }),
                  '&:hover': {
                    backgroundColor: 'rgba(30, 58, 138, 0.08)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', color: isSelected ? 'primary.main' : 'text.secondary', width: '100%' }}>
                  {item.icon}
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      sx: { fontSize: '0.95rem', fontWeight: isSelected ? 600 : 500 },
                    }}
                  />
                </Box>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Logout Button */}
      <Box sx={{ p: 1.5 }}>
        <Button
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            textTransform: 'none',
            fontSize: '0.95rem',
            fontWeight: 500,
            color: 'text.primary',
            border: '1px solid',
            borderColor: 'divider',
            '&:hover': {
              backgroundColor: '#fee2e2',
              borderColor: 'error.main',
              color: 'error.main',
            },
          }}
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1.5 }}>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '0.5px' }}>
            Sistema de Mantenimiento BBRAUN
          </Typography>
          <Chip
            avatar={<Avatar sx={{ bgcolor: theme.palette.secondary.main }}>{user?.nombre?.[0] || 'U'}</Avatar>}
            label={user?.nombre || 'Usuario'}
            variant="outlined"
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', '& .MuiChip-label': { fontWeight: 500 } }}
          />
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#ffffff',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#ffffff',
              borderRight: '1px solid',
              borderRightColor: 'divider',
              top: 0,
              height: '100vh',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          pt: { xs: '80px', sm: '80px' },
          backgroundColor: '#f8fafc',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;