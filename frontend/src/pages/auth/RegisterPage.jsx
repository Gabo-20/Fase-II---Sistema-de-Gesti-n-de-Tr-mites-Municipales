import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/authService'
import Spinner from '../../components/ui/Spinner'
import { CreditCard, User, Mail, Lock, AlertCircle, Landmark } from 'lucide-react'

const FIELDS = [
  { name: 'dpi', label: 'DPI (13 dígitos)', type: 'text', Icon: CreditCard, placeholder: '1234567890123', maxLength: 13, pattern: '\\d{13}' },
  { name: 'nombre', label: 'Nombre completo', type: 'text', Icon: User, placeholder: 'Juan Pérez García' },
  { name: 'correo', label: 'Correo electrónico', type: 'email', Icon: Mail, placeholder: 'correo@ejemplo.com' },
  { name: 'password', label: 'Contraseña', type: 'password', Icon: Lock, placeholder: 'Mínimo 8 caracteres', minLength: 8 },
  { name: 'confirmar', label: 'Confirmar contraseña', type: 'password', Icon: Lock, placeholder: 'Repite la contraseña' },
]

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ dpi: '', nombre: '', correo: '', password: '', confirmar: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    try {
      const { dpi, nombre, correo, password } = form
      await authService.register({ dpi, nombre, correo, password })
      const { data } = await authService.login({ correo, password })
      login(data.usuario, data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error ?? 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30 px-4 py-8 dark:from-gray-950 dark:to-blue-950/20">
      <div className="w-full max-w-md animate-fade-in-up rounded-2xl bg-white p-8 shadow-xl shadow-gray-200/60 dark:bg-gray-900 dark:shadow-gray-950/80">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/25">
            <Landmark size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Crear cuenta</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Municipalidad — Trámites en línea</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {FIELDS.map(({ name, label, type, Icon, placeholder, maxLength, pattern, minLength }) => (
            <div key={name}>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
              </label>
              <div className="relative">
                <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required
                  placeholder={placeholder}
                  maxLength={maxLength}
                  minLength={minLength}
                  pattern={pattern}
                  autoComplete={type === 'email' ? 'email' : type === 'password' ? 'new-password' : 'off'}
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-500"
                />
              </div>
            </div>
          ))}

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 dark:hover:bg-blue-500"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="text-white" />
                <span>Registrando...</span>
              </>
            ) : (
              'Crear cuenta'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
