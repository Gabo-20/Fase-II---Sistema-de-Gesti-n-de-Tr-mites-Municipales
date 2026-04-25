import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/dashboard', label: 'Inicio', icon: '🏠', roles: ['CIUDADANO', 'OPERADOR', 'SUPERVISOR', 'ADMIN'] },
  { to: '/licencias', label: 'Licencias', icon: '📄', roles: ['CIUDADANO', 'OPERADOR', 'SUPERVISOR', 'ADMIN'] },
  { to: '/construccion', label: 'Construcción', icon: '🏗️', roles: ['CIUDADANO', 'OPERADOR', 'SUPERVISOR', 'ADMIN'] },
  { to: '/catastro', label: 'Catastro', icon: '🗺️', roles: ['OPERADOR', 'SUPERVISOR', 'ADMIN'] },
  { to: '/notificaciones', label: 'Notificaciones', icon: '🔔', roles: ['CIUDADANO', 'OPERADOR', 'SUPERVISOR', 'ADMIN'] },
]

export default function Sidebar() {
  const { hasRole } = useAuth()

  return (
    <aside className="flex w-60 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-14 items-center border-b border-gray-200 px-4">
        <span className="font-bold text-gray-900">Municipalidad</span>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV.filter((n) => hasRole(...n.roles)).map((n) => (
            <li key={n.to}>
              <NavLink
                to={n.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <span>{n.icon}</span>
                {n.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
