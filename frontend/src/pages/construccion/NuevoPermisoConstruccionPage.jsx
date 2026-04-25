import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { tramitesService } from '../../services/tramitesService'

export default function NuevoPermisoConstruccionPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ tipoTramiteId: '', direccion: '', descripcion: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await tramitesService.crearPermisoConstruccion(form)
      navigate(`/construccion/${data.id}`)
    } catch (err) {
      setError(err.response?.data?.mensaje ?? 'Error al crear el permiso')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl font-bold text-gray-900">Nuevo Permiso de Construcción</h1>
      <div className="max-w-lg rounded-xl border border-gray-200 bg-white p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Tipo de permiso</label>
            <select
              name="tipoTramiteId"
              value={form.tipoTramiteId}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">Selecciona un tipo...</option>
              <option value="3">Obra nueva</option>
              <option value="4">Ampliación</option>
              <option value="5">Remodelación</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Dirección del inmueble</label>
            <input
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Zona, colonia, dirección exacta..."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Descripción de la obra</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Describe la obra a realizar..."
            />
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/construccion')}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
