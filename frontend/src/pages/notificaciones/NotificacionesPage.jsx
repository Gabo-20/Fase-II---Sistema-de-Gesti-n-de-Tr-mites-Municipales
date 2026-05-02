import { Bell } from 'lucide-react'

export default function NotificacionesPage() {
  return (
    <div className="animate-fade-in-up">
      <h1 className="mb-5 text-xl font-bold text-gray-900 dark:text-white">Notificaciones</h1>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-16 dark:border-gray-700">
        <Bell className="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Módulo disponible en Sprint 2</p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Aquí verás actualizaciones de tus trámites</p>
      </div>
    </div>
  )
}
