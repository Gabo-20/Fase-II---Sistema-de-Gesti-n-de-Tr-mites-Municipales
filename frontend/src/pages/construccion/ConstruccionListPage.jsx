import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { tramitesService } from '../../services/tramitesService'
import { useAuth } from '../../context/AuthContext'
import EstadoBadge from '../../components/ui/EstadoBadge'

export default function ConstruccionListPage() {
  const { hasRole } = useAuth()
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = hasRole('OPERADOR', 'SUPERVISOR', 'ADMIN')
          ? await tramitesService.getSolicitudesPendientes()
          : await tramitesService.getMisSolicitudes()
        setSolicitudes(data.solicitudes ?? data)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [hasRole])

  if (loading) return <div className="p-6 text-sm text-gray-500">Cargando...</div>

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Permisos de Construcción</h1>
        {hasRole('CIUDADANO', 'ADMIN') && (
          <Link
            to="/construccion/nuevo"
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            + Nuevo permiso
          </Link>
        )}
      </div>

      {solicitudes.length === 0 ? (
        <p className="text-sm text-gray-500">No hay permisos registrados.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Expediente</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {solicitudes.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-medium">{s.numeroExpediente}</td>
                  <td className="px-4 py-3">{s.tipoTramite?.nombre}</td>
                  <td className="px-4 py-3">{new Date(s.fechaSolicitud).toLocaleDateString('es-GT')}</td>
                  <td className="px-4 py-3"><EstadoBadge estado={s.estado} /></td>
                  <td className="px-4 py-3">
                    <Link to={`/construccion/${s.id}`} className="text-blue-600 hover:underline">Ver</Link>
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
