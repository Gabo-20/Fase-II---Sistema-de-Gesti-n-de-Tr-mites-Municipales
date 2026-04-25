import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from '../components/ui/ProtectedRoute'
import MainLayout from '../components/layout/MainLayout'
import AuthLayout from '../components/layout/AuthLayout'

// Auth pages
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

// App pages
import DashboardPage from '../pages/dashboard/DashboardPage'

// Licencias
import LicenciasListPage from '../pages/licencias/LicenciasListPage'
import NuevaLicenciaPage from '../pages/licencias/NuevaLicenciaPage'
import LicenciaDetallePage from '../pages/licencias/LicenciaDetallePage'

// Construcción
import ConstruccionListPage from '../pages/construccion/ConstruccionListPage'
import NuevoPermisoConstruccionPage from '../pages/construccion/NuevoPermisoConstruccionPage'
import PermisoConstruccionDetallePage from '../pages/construccion/PermisoConstruccionDetallePage'

// Catastro
import CatastroPage from '../pages/catastro/CatastroPage'

// Notificaciones
import NotificacionesPage from '../pages/notificaciones/NotificacionesPage'

const router = createBrowserRouter([
  // Rutas públicas (sin auth)
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/registro', element: <RegisterPage /> },
    ],
  },

  // Rutas protegidas — cualquier usuario autenticado
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/dashboard', element: <DashboardPage /> },

          // Licencias — ciudadano puede crear, funcionario/supervisor/admin pueden resolver
          { path: '/licencias', element: <LicenciasListPage /> },
          { path: '/licencias/nueva', element: <NuevaLicenciaPage /> },
          { path: '/licencias/:id', element: <LicenciaDetallePage /> },

          // Permisos de construcción
          { path: '/construccion', element: <ConstruccionListPage /> },
          { path: '/construccion/nuevo', element: <NuevoPermisoConstruccionPage /> },
          { path: '/construccion/:id', element: <PermisoConstruccionDetallePage /> },

          // Catastro — solo funcionario / supervisor / admin
          {
            element: <ProtectedRoute roles={['OPERADOR', 'SUPERVISOR', 'ADMIN']} />,
            children: [
              { path: '/catastro', element: <CatastroPage /> },
            ],
          },

          // Notificaciones
          { path: '/notificaciones', element: <NotificacionesPage /> },
        ],
      },
    ],
  },

  // Fallback
  { path: '*', element: <LoginPage /> },
])

export default router
