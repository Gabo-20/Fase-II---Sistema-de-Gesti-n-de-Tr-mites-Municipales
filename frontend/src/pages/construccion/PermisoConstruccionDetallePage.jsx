import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { tramitesService } from '../../services/tramitesService'
import { useAuth } from '../../context/AuthContext'
import EstadoBadge from '../../components/ui/EstadoBadge'

export default function PermisoConstruccionDetallePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { hasRole } = useAuth()
  const [permiso, setPermiso] = useState(null)
  const [loading, setLoading] = useState(true)
  const [obs, setObs] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    tramitesService.getEstadoPermiso(id)
      .then(({ data }) => setPermiso(data))
      .catch(() => navigate('/construccion'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleObservacion = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await tramitesService.agregarObservacion(id, { comentario: obs })
      const { data } = await tramitesService.getEstadoPermiso(id)
      setPermiso(data)
      setObs('')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6 text-sm text-gray-500">Cargando...</div>
  if (!permiso) return null

  return (
    <div className="p-6">
      <button onClick={() => navigate('/construccion')} className="mb-4 text-sm text-blue-600 hover:underline">
        ← Volver al listado
      </button>
      <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">Permiso {permiso.numeroExpediente}</h1>
          <EstadoBadge estado={permiso.estado} />
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-gray-500">Tipo</dt>
            <dd className="font-medium">{permiso.tipoTramite?.nombre}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Fecha</dt>
            <dd className="font-medium">{new Date(permiso.fechaSolicitud).toLocaleDateString('es-GT')}</dd>
          </div>
        </dl>

        {permiso.historial?.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-2 text-sm font-semibold text-gray-700">Historial</h2>
            <ol className="space-y-2">
              {permiso.historial.map((h) => (
                <li key={h.id} className="rounded-lg bg-gray-50 px-3 py-2 text-sm">
                  <span className="font-medium">{h.estado}</span>
                  {h.comentario && <span className="ml-2 text-gray-500">— {h.comentario}</span>}
                </li>
              ))}
            </ol>
          </div>
        )}

        {hasRole('OPERADOR', 'SUPERVISOR', 'ADMIN') && (
          <form onSubmit={handleObservacion} className="mt-6 space-y-3 border-t pt-4">
            <h2 className="text-sm font-semibold text-gray-700">Agregar observación técnica</h2>
            <textarea
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              required
              rows={2}
              placeholder="Observación técnica..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Agregar observación'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
