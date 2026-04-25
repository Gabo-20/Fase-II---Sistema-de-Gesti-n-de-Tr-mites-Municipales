import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/authService'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try { await authService.logout() } catch { /* ignorar error de red */ }
    logout()
    navigate('/login')
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      <span className="text-sm font-medium text-gray-700">
        Sistema de Trámites Municipales
      </span>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user?.nombre}</span>
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
          {user?.rol}
        </span>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Salir
        </button>
      </div>
    </header>
  )
}
