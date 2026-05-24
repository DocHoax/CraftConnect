import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Calendar, Clock, MapPin, Star, User as UserIcon, Settings, 
  CreditCard, LogOut, CheckCircle, XCircle, Clock3,
  Menu, X, Home, Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/Navigation'
import type { User as UserType } from '@/App'
import { useCustomerBookings } from '@/features/bookings/hooks'
import { updateBookingStatus } from '@/features/bookings/bookings-api'
import { artisans } from '@/data/mockData'

interface CustomerDashboardProps {
  user: UserType | null
  logout: () => void
}

export default function CustomerDashboard({ user, logout }: CustomerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'bookings' | 'history' | 'profile'>('bookings')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [actionBookingId, setActionBookingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState('')
  const {
    data: customerBookings,
    isLoading: bookingsLoading,
    error: bookingsError,
    refresh,
  } = useCustomerBookings(user?.id)

  const bookings = useMemo(
    () => customerBookings.filter((booking) => booking.status === 'pending' || booking.status === 'confirmed'),
    [customerBookings],
  )

  const history = useMemo(
    () => customerBookings.filter((booking) => booking.status === 'completed' || booking.status === 'cancelled'),
    [customerBookings],
  )

  const getBookingImage = (artisanId: string) => {
    return artisans.find((artisan) => artisan.id === artisanId)?.image ?? '/images/artisan-1.jpg'
  }

  const handleCancelBooking = async (bookingId: string) => {
    setActionError('')
    setActionBookingId(bookingId)

    const updatedBooking = await updateBookingStatus(bookingId, 'cancelled')

    if (!updatedBooking) {
      setActionError('Unable to cancel booking right now')
      setActionBookingId(null)
      return
    }

    refresh()
    setActionBookingId(null)
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-50 text-yellow-700',
      confirmed: 'bg-green-50 text-green-700',
      completed: 'bg-blue-50 text-blue-700',
      cancelled: 'bg-red-50 text-red-700',
    }
    const icons = {
      pending: Clock3,
      confirmed: CheckCircle,
      completed: CheckCircle,
      cancelled: XCircle,
    }
    const Icon = icons[status as keyof typeof icons] || Clock3
    return (
      <span className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs ${styles[status as keyof typeof styles]}`}>
        <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </span>
    )
  }

  const navItems = [
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'profile', label: 'Profile', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-[#F6F4F2] pb-20 lg:pb-0">
      <Navigation user={user} logout={logout} />

      <div className="pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E9E1D6] flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-[#6E5F57]" />
                </div>
                <div>
                  <h2 className="font-semibold text-[#2B1E1A] text-sm">{user?.name}</h2>
                  <p className="text-xs text-[#6E5F57]">{user?.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-white shadow-sm"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="lg:hidden bg-white rounded-2xl p-4 shadow-lg mb-4">
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as typeof activeTab)
                        setMobileMenuOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        activeTab === item.id ? 'bg-[#E4A14F]/10 text-[#E4A14F]' : 'text-[#6E5F57] hover:bg-[#F6F4F2]'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  ))}
                  <div className="pt-2 border-t border-[#2B1E1A]/10">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                </nav>
              </div>
            )}

            {/* Sidebar - Desktop */}
            <div className="hidden lg:block lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)] sticky top-24">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-16 h-16 sm:w-20 mx-auto rounded-full bg-[#E9E1D6] flex items-center justify-center mb-2 sm:mb-3">
                    <UserIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#6E5F57]" />
                  </div>
                  <h2 className="font-semibold text-[#2B1E1A] text-sm sm:text-base">{user?.name}</h2>
                  <p className="text-xs sm:text-sm text-[#6E5F57]">{user?.email}</p>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as typeof activeTab)}
                      className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-colors text-sm ${
                        activeTab === item.id ? 'bg-[#E4A14F]/10 text-[#E4A14F]' : 'text-[#6E5F57] hover:bg-[#F6F4F2]'
                      }`}
                    >
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      {item.label}
                    </button>
                  ))}
                  <div className="pt-3 sm:pt-4 border-t border-[#2B1E1A]/10">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-sm"
                    >
                      <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                      Logout
                    </button>
                  </div>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {activeTab === 'bookings' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#2B1E1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      My Bookings
                    </h1>
                    <Link to="/search">
                      <Button className="bg-[#E4A14F] hover:bg-[#d09045] text-white rounded-full text-sm w-full sm:w-auto">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book New Service
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {bookingsError && (
                      <p className="text-sm text-red-600">{bookingsError}</p>
                    )}
                    {actionError && (
                      <p className="text-sm text-red-600">{actionError}</p>
                    )}

                    {bookingsLoading && bookings.length === 0 && (
                      <div className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                        <p className="text-sm text-[#6E5F57]">Loading bookings...</p>
                      </div>
                    )}

                    {!bookingsLoading && bookings.length === 0 && !bookingsError && (
                      <div className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                        <p className="text-sm text-[#6E5F57]">No active bookings yet.</p>
                      </div>
                    )}

                    {bookings.map((booking) => (
                      <div key={booking.id} className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden bg-[#E9E1D6] flex-shrink-0">
                            <img src={getBookingImage(booking.artisanId)} alt={booking.artisanName} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h3 className="font-semibold text-[#2B1E1A] text-sm sm:text-base truncate">{booking.service}</h3>
                                <p className="text-xs sm:text-sm text-[#6E5F57]">with {booking.artisanName}</p>
                              </div>
                              {getStatusBadge(booking.status)}
                            </div>
                            <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 sm:mt-3 text-xs sm:text-sm text-[#6E5F57]">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                {booking.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                {booking.time}
                              </span>
                              <span className="flex items-center gap-1 hidden sm:flex">
                                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                                {booking.location}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-between gap-2">
                            <span className="font-semibold text-[#E4A14F] text-sm sm:text-base">${booking.price}</span>
                            <div className="flex gap-2">
                              {booking.status === 'pending' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-full text-red-600 border-red-200 hover:bg-red-50 text-xs"
                                  onClick={() => void handleCancelBooking(booking.id)}
                                  disabled={actionBookingId === booking.id}
                                >
                                  {actionBookingId === booking.id ? 'Cancelling...' : 'Cancel'}
                                </Button>
                              )}
                              <Link to={`/payment/${booking.id}`}>
                                <Button size="sm" className="rounded-full bg-[#E4A14F] hover:bg-[#d09045] text-white text-xs">
                                  <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                  Pay
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#2B1E1A] mb-4 sm:mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Booking History
                  </h1>

                  <div className="space-y-3 sm:space-y-4">
                    {bookingsError && (
                      <p className="text-sm text-red-600">{bookingsError}</p>
                    )}

                    {bookingsLoading && history.length === 0 && (
                      <div className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                        <p className="text-sm text-[#6E5F57]">Loading booking history...</p>
                      </div>
                    )}

                    {!bookingsLoading && history.length === 0 && !bookingsError && (
                      <div className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                        <p className="text-sm text-[#6E5F57]">No past bookings yet.</p>
                      </div>
                    )}

                    {history.map((item) => (
                      <div key={item.id} className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden bg-[#E9E1D6] flex-shrink-0">
                            <img src={getBookingImage(item.artisanId)} alt={item.artisanName} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h3 className="font-semibold text-[#2B1E1A] text-sm sm:text-base truncate">{item.service}</h3>
                                <p className="text-xs sm:text-sm text-[#6E5F57]">with {item.artisanName}</p>
                              </div>
                              {getStatusBadge(item.status)}
                            </div>
                            <p className="text-xs sm:text-sm text-[#6E5F57] mt-2">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                              {item.date}
                            </p>
                          </div>
                          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2">
                            <span className="font-semibold text-[#E4A14F] text-sm sm:text-base">${item.price}</span>
                            {item.status === 'completed' && (
                              <Button size="sm" variant="outline" className="rounded-full text-xs">
                                <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                Rate
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#2B1E1A] mb-4 sm:mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Profile Settings
                  </h1>

                  <div className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[#2B1E1A] mb-1.5 sm:mb-2">Full Name</label>
                        <input
                          type="text"
                          defaultValue={user?.name}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-[#2B1E1A]/10 bg-white text-sm text-[#2B1E1A] focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#2B1E1A] mb-1.5 sm:mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue={user?.email}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-[#2B1E1A]/10 bg-white text-sm text-[#2B1E1A] focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#2B1E1A] mb-1.5 sm:mb-2">Phone</label>
                        <input
                          type="tel"
                          defaultValue="+1 (555) 000-0000"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-[#2B1E1A]/10 bg-white text-sm text-[#2B1E1A] focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#2B1E1A] mb-1.5 sm:mb-2">Address</label>
                        <input
                          type="text"
                          defaultValue="123 Main St, Downtown"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-[#2B1E1A]/10 bg-white text-sm text-[#2B1E1A] focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50"
                        />
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[#2B1E1A]/10">
                      <h3 className="font-semibold text-[#2B1E1A] mb-3 sm:mb-4 text-sm sm:text-base">Notification Preferences</h3>
                      <div className="space-y-2 sm:space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#2B1E1A]/20 text-[#E4A14F] focus:ring-[#E4A14F]" />
                          <span className="ml-2 text-sm text-[#6E5F57]">Email notifications for bookings</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#2B1E1A]/20 text-[#E4A14F] focus:ring-[#E4A14F]" />
                          <span className="ml-2 text-sm text-[#6E5F57]">SMS reminders</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="w-4 h-4 rounded border-[#2B1E1A]/20 text-[#E4A14F] focus:ring-[#E4A14F]" />
                          <span className="ml-2 text-sm text-[#6E5F57]">Promotional emails</span>
                        </label>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-6 flex justify-end">
                      <Button className="bg-[#E4A14F] hover:bg-[#d09045] text-white rounded-full px-6 sm:px-8 text-sm sm:text-base">
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
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
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`flex flex-col items-center p-2 ${activeTab === 'bookings' ? 'text-[#E4A14F]' : 'text-[#6E5F57]'}`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Bookings</span>
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center p-2 ${activeTab === 'profile' ? 'text-[#E4A14F]' : 'text-[#6E5F57]'}`}
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}