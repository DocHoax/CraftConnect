import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, Menu, X, User, LogOut, Home, Briefcase, HelpCircle, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { User as UserType } from '@/App'

interface NavigationProps {
  user: UserType | null
  logout: () => void
  transparent?: boolean
}

export default function Navigation({ user, logout, transparent = false }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const getDashboardLink = () => {
    if (!user) return '/login'
    switch (user.role) {
      case 'customer': return '/dashboard'
      case 'artisan': return '/artisan-dashboard'
      case 'admin': return '/admin'
      default: return '/'
    }
  }

  const bgClass = transparent && !isScrolled 
    ? 'bg-transparent' 
    : 'bg-[#F6F4F2]/95 backdrop-blur-md shadow-sm'

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/search', label: 'Find Artisans', icon: Briefcase },
    { to: '/help', label: 'How it Works', icon: HelpCircle },
    { to: '/contact', label: 'Contact', icon: MessageSquare },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass}`}>
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-[#2B1E1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Artisans
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E5F57]" />
                <input
                  type="text"
                  placeholder="What do you need?"
                  className="w-full pl-10 pr-4 py-2 lg:py-2.5 rounded-full bg-white border border-[#2B1E1A]/10 text-sm text-[#2B1E1A] placeholder:text-[#6E5F57]/60 focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50 transition-all"
                  onClick={() => navigate('/search')}
                  readOnly
                />
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className="px-3 py-2 text-[#2B1E1A] hover:text-[#E4A14F] transition-colors text-sm font-medium rounded-lg hover:bg-[#E4A14F]/5"
                >
                  {link.label}
                </Link>
              ))}
              
              {user ? (
                <div className="flex items-center space-x-2 ml-2">
                  <Link to={getDashboardLink()}>
                    <Button variant="ghost" className="text-[#2B1E1A] hover:text-[#E4A14F] hover:bg-[#E4A14F]/10 rounded-full text-sm">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    onClick={logout}
                    variant="ghost"
                    className="text-[#6E5F57] hover:text-[#2B1E1A] hover:bg-[#2B1E1A]/5 rounded-full"
                    size="sm"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 ml-2">
                  <Link to="/login">
                    <Button variant="ghost" className="text-[#2B1E1A] hover:text-[#E4A14F] hover:bg-[#E4A14F]/10 rounded-full text-sm">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-[#E4A14F] hover:bg-[#d09045] text-white rounded-full px-4 lg:px-6 text-sm">
                      Get started
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-[#2B1E1A]/5 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#2B1E1A]" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-[#2B1E1A]" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-screen pb-4' : 'max-h-0'}`}>
            <div className="bg-white rounded-2xl shadow-lg border border-[#2B1E1A]/5 overflow-hidden">
              {/* Mobile Search */}
              <div className="p-3 border-b border-[#2B1E1A]/5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E5F57]" />
                  <input
                    type="text"
                    placeholder="What do you need?"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F6F4F2] border-0 text-sm"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      navigate('/search')
                    }}
                    readOnly
                  />
                </div>
              </div>
              
              {/* Mobile Nav Links */}
              <div className="p-2">
                {navLinks.map((link) => (
                  <Link 
                    key={link.to}
                    to={link.to}
                    className="flex items-center gap-3 px-4 py-3 text-[#2B1E1A] hover:bg-[#F6F4F2] rounded-xl transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <link.icon className="w-5 h-5 text-[#6E5F57]" />
                    {link.label}
                  </Link>
                ))}
                
                <div className="border-t border-[#2B1E1A]/5 mt-2 pt-2">
                  {user ? (
                    <>
                      <Link 
                        to={getDashboardLink()}
                        className="flex items-center gap-3 px-4 py-3 text-[#2B1E1A] hover:bg-[#F6F4F2] rounded-xl transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="w-5 h-5 text-[#6E5F57]" />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setIsMobileMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <div className="space-y-2 p-2">
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full rounded-xl">Log in</Button>
                      </Link>
                      <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full bg-[#E4A14F] hover:bg-[#d09045] text-white rounded-xl">Get started</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation (visible only on small screens when logged in) */}
      {user && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E9E1D6] px-2 py-1 z-40 lg:hidden safe-area-bottom">
          <div className="flex justify-around items-center">
            <Link to="/" className="flex flex-col items-center p-2 text-[#6E5F57] hover:text-[#E4A14F]">
              <Home className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Home</span>
            </Link>
            <Link to="/search" className="flex flex-col items-center p-2 text-[#6E5F57] hover:text-[#E4A14F]">
              <Search className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Search</span>
            </Link>
            <Link to={getDashboardLink()} className="flex flex-col items-center p-2 text-[#6E5F57] hover:text-[#E4A14F]">
              <User className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Profile</span>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}