const STYLES = {
  RECIBIDA:    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  EN_REVISION: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  APROBADA:    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  RECHAZADA:   'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  SUBSANACION: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
}

const LABELS = {
  RECIBIDA:    'Recibida',
  EN_REVISION: 'En revisión',
  APROBADA:    'Aprobada',
  RECHAZADA:   'Rechazada',
  SUBSANACION: 'Subsanación',
}

export default function EstadoBadge({ estado }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[estado] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>
      {LABELS[estado] ?? estado}
    </span>
  )
}
