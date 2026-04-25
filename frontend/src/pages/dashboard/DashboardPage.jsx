import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

const CARDS = [
  {
    title: 'Licencias Comerciales',
    desc: 'Solicita, renueva o consulta el estado de tus licencias.',
    href: '/licencias',
    color: 'bg-blue-50 border-blue-200',
    icon: '🏪',
    roles: ['CIUDADANO', 'OPERADOR', 'SUPERVISOR', 'ADMIN'],
  },
  {
    title: 'Permisos de Construcción',
    desc: 'Gestiona permisos de obra y consulta su avance.',
    href: '/construccion',
    color: 'bg-green-50 border-green-200',
    icon: '🏗️',
    roles: ['CIUDADANO', 'OPERADOR', 'SUPERVISOR', 'ADMIN'],
  },
  {
    title: 'Catastro Municipal',
    desc: 'Administración de inmuebles y propietarios.',
    href: '/catastro',
    color: 'bg-yellow-50 border-yellow-200',
    icon: '🗺️',
    roles: ['OPERADOR', 'SUPERVISOR', 'ADMIN'],
  },
  {
    title: 'Notificaciones',
    desc: 'Revisa actualizaciones de tus trámites.',
    href: '/notificaciones',
    color: 'bg-purple-50 border-purple-200',
    icon: '🔔',
    roles: ['CIUDADANO', 'OPERADOR', 'SUPERVISOR', 'ADMIN'],
  },
]

export default function DashboardPage() {
  const { user, hasRole } = useAuth()

  const cards = CARDS.filter((c) => hasRole(...c.roles))

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {user?.nombre?.split(' ')[0]}
        </h1>
        <p className="text-sm text-gray-500">
          Rol: <span className="font-medium capitalize">{user?.rol?.toLowerCase()}</span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            to={card.href}
            className={`rounded-xl border p-6 transition hover:shadow-md ${card.color}`}
          >
            <div className="mb-2 text-3xl">{card.icon}</div>
            <h2 className="font-semibold text-gray-800">{card.title}</h2>
            <p className="mt-1 text-sm text-gray-600">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
