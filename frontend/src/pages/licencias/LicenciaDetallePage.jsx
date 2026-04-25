import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { tramitesService } from '../../services/tramitesService'
import { useAuth } from '../../context/AuthContext'
import EstadoBadge from '../../components/ui/EstadoBadge'

export default function LicenciaDetallePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { hasRole } = useAuth()
  const [solicitud, setSolicitud] = useState(null)
  const [loading, setLoading] = useState(true)
  const [resolucion, setResolucion] = useState({ accion: '', comentario: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    tramitesService.getSolicitudById(id)
      .then(({ data }) => setSolicitud(data))
      .catch(() => navigate('/licencias'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleResolver = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await tramitesService.aprobarRechazarLicencia(id, resolucion)
      const { data } = await tramitesService.getSolicitudById(id)
      setSolicitud(data)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6 text-sm text-gray-500">Cargando...</div>
  if (!solicitud) return null

  const puedeResolver =
    hasRole('OPERADOR', 'SUPERVISOR', 'ADMIN') &&
    ['RECIBIDA', 'EN_REVISION', 'SUBSANACION'].includes(solicitud.estado)

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/licencias')}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Volver al listado
      </button>

      <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">
            Expediente {solicitud.numeroExpediente}
          </h1>
          <EstadoBadge estado={solicitud.estado} />
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-gray-500">Tipo de trámite</dt>
            <dd className="font-medium">{solicitud.tipoTramite?.nombre}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Fecha de solicitud</dt>
            <dd className="font-medium">
              {new Date(solicitud.fechaSolicitud).toLocaleDateString('es-GT')}
            </dd>
          </div>
          {solicitud.funcionario && (
            <div>
              <dt className="text-gray-500">Funcionario asignado</dt>
              <dd className="font-medium">{solicitud.funcionario.nombre}</dd>
            </div>
          )}
        </dl>

        {/* Historial */}
        {solicitud.historial?.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-2 text-sm font-semibold text-gray-700">Historial de estados</h2>
            <ol className="space-y-2">
              {solicitud.historial.map((h) => (
                <li key={h.id} className="rounded-lg bg-gray-50 px-3 py-2 text-sm">
                  <span className="font-medium">{h.estado}</span>
                  {h.comentario && <span className="ml-2 text-gray-500">— {h.comentario}</span>}
                  <span className="ml-2 text-xs text-gray-400">
                    {new Date(h.creadoEn).toLocaleString('es-GT')}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Resolución (solo funcionarios) */}
        {puedeResolver && (
          <form onSubmit={handleResolver} className="mt-6 space-y-3 border-t pt-4">
            <h2 className="text-sm font-semibold text-gray-700">Resolución</h2>
            <select
              value={resolucion.accion}
              onChange={(e) => setResolucion({ ...resolucion, accion: e.target.value })}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Selecciona acción...</option>
              <option value="APROBADA">Aprobar</option>
              <option value="RECHAZADA">Rechazar</option>
              <option value="SUBSANACION">Solicitar subsanación</option>
            </select>
            <textarea
              value={resolucion.comentario}
              onChange={(e) => setResolucion({ ...resolucion, comentario: e.target.value })}
              rows={2}
              placeholder="Comentario (opcional)"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Confirmar resolución'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
