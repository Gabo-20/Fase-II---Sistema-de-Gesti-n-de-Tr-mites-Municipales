import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import { FileText, Building2, Map, Bell, ChevronRight } from 'lucide-react'

const CARDS = [
  {
    title: 'Licencias Comerciales',
    desc: 'Solicita, renueva o consulta el estado de tus licencias.',
    href: '/licencias',
    Icon: FileText,
    accent: 'border-blue-200 dark:border-blue-900/50',
    iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    roles: ['CIUDADANO', 'OPERADOR', 'SUPERVISOR', 'ADMIN'],
  },
  {
    title: 'Permisos de Construcción',
    desc: 'Gestiona permisos de obra y consulta su avance.',
    href: '/construccion',
    Icon: Building2,
    accent: 'border-emerald-200 dark:border-emerald-900/50',
    iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    roles: ['CIUDADANO', 'OPERADOR', 'SUPERVISOR', 'ADMIN'],
  },
  {
    title: 'Catastro Municipal',
    desc: 'Administración de inmuebles y propietarios.',
    href: '/catastro',
    Icon: Map,
    accent: 'border-amber-200 dark:border-amber-900/50',
    iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    roles: ['OPERADOR', 'SUPERVISOR', 'ADMIN'],
  },
  {
    title: 'Notificaciones',
    desc: 'Revisa actualizaciones y avisos de tus trámites.',
    href: '/notificaciones',
    Icon: Bell,
    accent: 'border-purple-200 dark:border-purple-900/50',
    iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    roles: ['CIUDADANO', 'OPERADOR', 'SUPERVISOR', 'ADMIN'],
  },
]

const ROLE_LABELS = {
  CIUDADANO: 'Ciudadano',
  OPERADOR: 'Operador',
  SUPERVISOR: 'Supervisor',
  ADMIN: 'Administrador',
}

export default function DashboardPage() {
  const { user, hasRole } = useAuth()
  const cards = CARDS.filter((c) => hasRole(...c.roles))

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bienvenido, {user?.nombre?.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Accede a los módulos disponibles para tu perfil de{' '}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {ROLE_LABELS[user?.rol] ?? user?.rol}
          </span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map(({ href, title, desc, Icon, accent, iconBg }, i) => (
          <Link
            key={href}
            to={href}
            style={{ animationDelay: `${i * 60}ms` }}
            className={[
              'group flex flex-col rounded-xl border bg-white p-5',
              'shadow-sm hover:shadow-md dark:bg-gray-900',
              'hover:-translate-y-0.5 hover:border-opacity-80',
              'transition-all duration-200',
              accent,
            ].join(' ')}
          >
            <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
              <Icon size={20} />
            </div>
            <h2 className="font-semibold text-gray-900 dark:text-white">{title}</h2>
            <p className="mt-1 flex-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{desc}</p>
            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              <span>Ir al módulo</span>
              <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
