import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { tramitesService } from '../../services/tramitesService'
import { useAuth } from '../../context/AuthContext'
import EstadoBadge from '../../components/ui/EstadoBadge'
import Spinner from '../../components/ui/Spinner'
import { Building2, Plus, ArrowRight } from 'lucide-react'

export default function ConstruccionListPage() {
  const { hasRole } = useAuth()
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = hasRole('OPERADOR', 'SUPERVISOR', 'ADMIN')
          ? await tramitesService.getSolicitudesPendientes()
          : await tramitesService.getMisSolicitudes()
        setSolicitudes(data.solicitudes ?? data)
      } catch {
        setError('No se pudieron cargar los permisos')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [hasRole])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" className="text-emerald-600 dark:text-emerald-400" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in-up space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Permisos de Construcción</h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {solicitudes.length} permiso{solicitudes.length !== 1 ? 's' : ''} registrado{solicitudes.length !== 1 ? 's' : ''}
          </p>
        </div>
        {hasRole('CIUDADANO', 'ADMIN') && (
          <Link
            to="/construccion/nuevo"
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 dark:hover:bg-emerald-500"
          >
            <Plus size={16} />
            Nuevo permiso
          </Link>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}

      {solicitudes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-14 dark:border-gray-700">
          <Building2 className="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No hay permisos registrados</p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Comienza creando un nuevo permiso de construcción</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3">Expediente</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="hidden px-4 py-3 sm:table-cell">Fecha</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {solicitudes.map((s, i) => (
                <tr
                  key={s.id}
                  className="animate-fade-in hover:bg-gray-50/70 dark:hover:bg-gray-800/40"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <td className="px-4 py-3 font-mono text-xs font-medium text-gray-700 dark:text-gray-300">{s.numeroExpediente}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{s.tipoTramite?.nombre}</td>
                  <td className="hidden px-4 py-3 text-gray-500 dark:text-gray-500 sm:table-cell">
                    {new Date(s.fechaSolicitud).toLocaleDateString('es-GT')}
                  </td>
                  <td className="px-4 py-3"><EstadoBadge estado={s.estado} /></td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/construccion/${s.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Ver <ArrowRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
