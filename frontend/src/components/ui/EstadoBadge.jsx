const COLORES = {
  RECIBIDA:    'bg-gray-100 text-gray-700',
  EN_REVISION: 'bg-yellow-100 text-yellow-700',
  APROBADA:    'bg-green-100 text-green-700',
  RECHAZADA:   'bg-red-100 text-red-700',
  SUBSANACION: 'bg-orange-100 text-orange-700',
}

const ETIQUETAS = {
  RECIBIDA:    'Recibida',
  EN_REVISION: 'En revisión',
  APROBADA:    'Aprobada',
  RECHAZADA:   'Rechazada',
  SUBSANACION: 'Subsanación',
}

export default function EstadoBadge({ estado }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${COLORES[estado] ?? 'bg-gray-100 text-gray-600'}`}>
      {ETIQUETAS[estado] ?? estado}
    </span>
  )
}
