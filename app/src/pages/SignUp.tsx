import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone, MapPin, Briefcase, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { categories } from '@/data/mockData'
import { useAuth } from '@/features/auth/AuthProvider'

export default function SignUp() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [accountType, setAccountType] = useState<'customer' | 'artisan'>('customer')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    category: '',
    experience: '',
    serviceDescription: '',
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const user = await signUp({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password,
        accountType,
        category: formData.category || undefined,
        experience: formData.experience || undefined,
        serviceDescription: formData.serviceDescription || undefined,
      })

      if (user.role === 'customer') navigate('/dashboard')
      else navigate('/artisan-dashboard')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to create account')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F4F2] py-4 sm:py-8 lg:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-[#6E5F57] hover:text-[#2B1E1A] mb-4 sm:mb-8 transition-colors text-sm sm:text-base">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>

        <div className="bg-white rounded-2xl sm:rounded-[28px] p-5 sm:p-8 shadow-[0_18px_40px_rgba(43,30,26,0.10)]">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-[#2B1E1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Create your account
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#6E5F57]">
              Join thousands of happy customers and skilled artisans
            </p>
          </div>

          {/* Account Type Selection */}
          <div className="flex rounded-full bg-[#F6F4F2] p-1 mb-6 sm:mb-8">
            <button
              type="button"
              onClick={() => setAccountType('customer')}
              className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-6 rounded-full text-xs sm:text-sm font-medium transition-all ${
                accountType === 'customer'
                  ? 'bg-[#E4A14F] text-white'
                  : 'text-[#6E5F57] hover:text-[#2B1E1A]'
              }`}
            >
              I'm a Customer
            </button>
            <button
              type="button"
              onClick={() => setAccountType('artisan')}
              className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-6 rounded-full text-xs sm:text-sm font-medium transition-all ${
                accountType === 'artisan'
                  ? 'bg-[#E4A14F] text-white'
                  : 'text-[#6E5F57] hover:text-[#2B1E1A]'
              }`}
            >
              I'm an Artisan
            </button>
          </div>

          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Common Fields */}
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-sm font-medium text-[#2B1E1A] mb-1.5 sm:mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#6E5F57]" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-[#2B1E1A]/10 bg-white text-sm text-[#2B1E1A] placeholder:text-[#6E5F57]/50 focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50 transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

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
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-sm font-medium text-[#2B1E1A] mb-1.5 sm:mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#6E5F57]" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-[#2B1E1A]/10 bg-white text-sm text-[#2B1E1A] placeholder:text-[#6E5F57]/50 focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50 transition-all"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2B1E1A] mb-1.5 sm:mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#6E5F57]" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-[#2B1E1A]/10 bg-white text-sm text-[#2B1E1A] placeholder:text-[#6E5F57]/50 focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50 transition-all"
                    placeholder="Your address"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Artisan Specific Fields */}
            {accountType === 'artisan' && (
              <div className="space-y-4 sm:space-y-5 pt-4 border-t border-[#2B1E1A]/10">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#2B1E1A] mb-1.5 sm:mb-2">
                      Artisan Category
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#6E5F57]" />
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-[#2B1E1A]/10 bg-white text-sm text-[#2B1E1A] focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50 transition-all appearance-none"
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2B1E1A] mb-1.5 sm:mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-[#2B1E1A]/10 bg-white text-sm text-[#2B1E1A] placeholder:text-[#6E5F57]/50 focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50 transition-all"
                      placeholder="e.g., 5"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2B1E1A] mb-1.5 sm:mb-2">
                    Service Description
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 sm:left-4 top-3 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-[#6E5F57]" />
                    <textarea
                      value={formData.serviceDescription}
                      onChange={(e) => setFormData({ ...formData, serviceDescription: e.target.value })}
                      className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-[#2B1E1A]/10 bg-white text-sm text-[#2B1E1A] placeholder:text-[#6E5F57]/50 focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50 transition-all resize-none"
                      placeholder="Describe your services and expertise..."
                      rows={3}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
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

              <div>
                <label className="block text-sm font-medium text-[#2B1E1A] mb-1.5 sm:mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#6E5F57]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-[#2B1E1A]/10 bg-white text-sm text-[#2B1E1A] placeholder:text-[#6E5F57]/50 focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <input 
                type="checkbox" 
                className="w-4 h-4 mt-0.5 rounded border-[#2B1E1A]/20 text-[#E4A14F] focus:ring-[#E4A14F]" 
                required
              />
              <span className="ml-2 text-xs sm:text-sm text-[#6E5F57]">
                I agree to the{' '}
                <Link to="/" className="text-[#E4A14F] hover:text-[#d09045]">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/" className="text-[#E4A14F] hover:text-[#d09045]">Privacy Policy</Link>
              </span>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E4A14F] hover:bg-[#d09045] text-white rounded-full py-5 sm:py-6 text-sm sm:text-base font-medium transition-all hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : accountType === 'customer' ? 'Create Customer Account' : 'Register as Artisan'}
            </Button>
          </form>

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-sm text-[#6E5F57]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#E4A14F] hover:text-[#d09045] font-medium transition-colors">
                Sign in
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