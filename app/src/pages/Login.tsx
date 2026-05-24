import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/AuthProvider'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'customer' as 'customer' | 'artisan' | 'admin',
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const user = await login({
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })

      if (user.role === 'customer') navigate('/dashboard')
      else if (user.role === 'artisan') navigate('/artisan-dashboard')
      else navigate('/admin')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F4F2] flex items-center justify-center py-6 sm:py-12 px-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-[#6E5F57] hover:text-[#2B1E1A] mb-4 sm:mb-8 transition-colors text-sm sm:text-base">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>

        <div className="bg-white rounded-2xl sm:rounded-[28px] p-5 sm:p-8 shadow-[0_18px_40px_rgba(43,30,26,0.10)]">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-[#2B1E1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Welcome back
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#6E5F57]">
              Sign in to your account to continue
            </p>
          </div>

          {/* Role Selection */}
          <div className="flex rounded-full bg-[#F6F4F2] p-1 mb-4 sm:mb-6">
            {(['customer', 'artisan', 'admin'] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setFormData({ ...formData, role })}
                className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-4 rounded-full text-xs sm:text-sm font-medium capitalize transition-all ${
                  formData.role === role
                    ? 'bg-[#E4A14F] text-white'
                    : 'text-[#6E5F57] hover:text-[#2B1E1A]'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#2B1E1A] mb-1.5 sm:mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#6E5F57]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-[#2B1E1A]/10 bg-white text-sm text-[#2B1E1A] placeholder:text-[#6E5F57]/50 focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2B1E1A] mb-1.5 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#6E5F57]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-[#2B1E1A]/10 bg-white text-sm text-[#2B1E1A] placeholder:text-[#6E5F57]/50 focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-[#6E5F57] hover:text-[#2B1E1A] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 rounded border-[#2B1E1A]/20 text-[#E4A14F] focus:ring-[#E4A14F]" />
                <span className="ml-2 text-[#6E5F57] text-xs sm:text-sm">Remember me</span>
              </label>
              <Link to="/" className="text-xs sm:text-sm text-[#E4A14F] hover:text-[#d09045] transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E4A14F] hover:bg-[#d09045] text-white rounded-full py-5 sm:py-6 text-sm sm:text-base font-medium transition-all hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-sm text-[#6E5F57]">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#E4A14F] hover:text-[#d09045] font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>

          <p className="mt-4 text-center text-xs text-[#6E5F57]">
            Auth mode: {import.meta.env.VITE_AUTH_MODE === 'api' ? 'backend API' : 'demo'}
          </p>
        </div>
      </div>
    </div>
  )
}