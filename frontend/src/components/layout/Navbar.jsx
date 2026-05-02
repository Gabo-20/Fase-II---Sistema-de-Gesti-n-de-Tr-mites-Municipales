import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { authService } from '../../services/authService'
import { Menu, Sun, Moon, LogOut, User } from 'lucide-react'

const ROLE_LABELS = {
  CIUDADANO: 'Ciudadano',
  OPERADOR: 'Operador',
  SUPERVISOR: 'Supervisor',
  ADMIN: 'Admin',
}

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try { await authService.logout() } catch { /* stateless */ }
    logout()
    navigate('/login')
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
        <span className="hidden text-sm font-medium text-gray-600 dark:text-gray-400 sm:block">
          Sistema de Trámites Municipales
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          title={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="hidden items-center gap-2 sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
            <User size={14} />
          </div>
          <div className="leading-tight">
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{user?.nombre}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">{ROLE_LABELS[user?.rol] ?? user?.rol}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30 dark:hover:text-red-400"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  )
}
