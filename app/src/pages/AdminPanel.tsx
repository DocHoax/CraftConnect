import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, Briefcase, DollarSign, TrendingUp, CheckCircle, 
  XCircle, Clock, LogOut, Search, Filter, BarChart3,
  AlertTriangle, Menu, X, Home
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/Navigation'
import type { User as UserType } from '@/App'
import { useAllBookings } from '@/features/bookings/hooks'
import { updateBookingStatus } from '@/features/bookings/bookings-api'

interface AdminPanelProps {
  user: UserType | null
  logout: () => void
}

export default function AdminPanel({ user, logout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'artisans' | 'bookings'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [actionBookingId, setActionBookingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState('')

  const {
    data: allBookings,
    isLoading: bookingsLoading,
    error: bookingsError,
    refresh,
  } = useAllBookings()

  const recentUsers = [
    { id: '1', name: 'John Smith', email: 'john@example.com', role: 'customer', status: 'active', joined: '2026-03-10' },
    { id: '2', name: 'Maria Johnson', email: 'maria@example.com', role: 'artisan', status: 'active', joined: '2026-03-09' },
    { id: '3', name: 'David Lee', email: 'david@example.com', role: 'customer', status: 'pending', joined: '2026-03-08' },
  ]

  const pendingArtisans = [
    { 
      id: '1', 
      name: 'Robert Chen', 
      email: 'robert@example.com', 
      category: 'Plumbing',
      experience: '10 years',
      submitted: '2026-03-10',
      documents: true 
    },
    { 
      id: '2', 
      name: 'Sarah Williams', 
      email: 'sarah@example.com', 
      category: 'HVAC',
      experience: '5 years',
      submitted: '2026-03-09',
      documents: false 
    },
  ]

  const recentBookings = useMemo(
    () => allBookings.slice(0, 5).map((booking) => ({
      id: booking.id,
      customer: `Customer #${booking.customerId}`,
      artisan: booking.artisanName,
      service: booking.service,
      amount: booking.price,
      status: booking.status,
      date: booking.date,
    })),
    [allBookings],
  )

  const stats = {
    totalUsers: 12543,
    totalArtisans: 5234,
    totalBookings: allBookings.length,
    totalRevenue: allBookings
      .filter((booking) => booking.status === 'completed' || booking.status === 'confirmed')
      .reduce((total, booking) => total + booking.price, 0),
    pendingApprovals: 23,
    activeBookings: allBookings.filter((booking) => booking.status === 'pending' || booking.status === 'confirmed').length,
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-50 text-green-700',
      pending: 'bg-yellow-50 text-yellow-700',
      suspended: 'bg-red-50 text-red-700',
      confirmed: 'bg-green-50 text-green-700',
      completed: 'bg-blue-50 text-blue-700',
      cancelled: 'bg-red-50 text-red-700',
    }
    return (
      <span className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-50 text-gray-700'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'artisans', label: 'Artisans', icon: Briefcase, badge: stats.pendingApprovals },
    { id: 'bookings', label: 'Bookings', icon: Clock },
  ]

  const handleUpdateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled' | 'completed') => {
    setActionError('')
    setActionBookingId(bookingId)

    const updatedBooking = await updateBookingStatus(bookingId, status)

    if (!updatedBooking) {
      setActionError('Unable to update booking status right now')
      setActionBookingId(null)
      return
    }

    refresh()
    setActionBookingId(null)
  }

  return (
    <div className="min-h-screen bg-[#F6F4F2] pb-20 lg:pb-0">
      <Navigation user={user} logout={logout} />

      <div className="pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between mb-2">
              <div>
                <h2 className="font-semibold text-[#2B1E1A] text-sm">Admin Panel</h2>
                <p className="text-xs text-[#6E5F57]">{user?.email}</p>
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
                      {item.badge && item.badge > 0 && (
                        <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
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
                <div className="mb-4 sm:mb-6">
                  <h2 className="font-semibold text-[#2B1E1A] text-sm sm:text-base">Admin Panel</h2>
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
                      {item.badge && item.badge > 0 && (
                        <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
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
              {activeTab === 'overview' && (
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#2B1E1A] mb-4 sm:mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Dashboard Overview
                  </h1>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                      <div className="flex items-center justify-between mb-2 sm:mb-4">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[#E4A14F]/10 flex items-center justify-center">
                          <Users className="w-4 h-4 sm:w-6 sm:h-6 text-[#E4A14F]" />
                        </div>
                        <span className="text-[10px] sm:text-xs text-green-600 bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">+12%</span>
                      </div>
                      <p className="text-xl sm:text-3xl font-bold text-[#2B1E1A]">{stats.totalUsers.toLocaleString()}</p>
                      <p className="text-xs sm:text-sm text-[#6E5F57]">Total Users</p>
                    </div>

                    <div className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                      <div className="flex items-center justify-between mb-2 sm:mb-4">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[#E4A14F]/10 flex items-center justify-center">
                          <Briefcase className="w-4 h-4 sm:w-6 sm:h-6 text-[#E4A14F]" />
                        </div>
                        <span className="text-[10px] sm:text-xs text-green-600 bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">+8%</span>
                      </div>
                      <p className="text-xl sm:text-3xl font-bold text-[#2B1E1A]">{stats.totalArtisans.toLocaleString()}</p>
                      <p className="text-xs sm:text-sm text-[#6E5F57]">Total Artisans</p>
                    </div>

                    <div className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                      <div className="flex items-center justify-between mb-2 sm:mb-4">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[#E4A14F]/10 flex items-center justify-center">
                          <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-[#E4A14F]" />
                        </div>
                        <span className="text-[10px] sm:text-xs text-green-600 bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">+15%</span>
                      </div>
                      <p className="text-xl sm:text-3xl font-bold text-[#2B1E1A]">{stats.totalBookings.toLocaleString()}</p>
                      <p className="text-xs sm:text-sm text-[#6E5F57]">Total Bookings</p>
                    </div>

                    <div className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                      <div className="flex items-center justify-between mb-2 sm:mb-4">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[#E4A14F]/10 flex items-center justify-center">
                          <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-[#E4A14F]" />
                        </div>
                        <span className="text-[10px] sm:text-xs text-green-600 bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">+22%</span>
                      </div>
                      <p className="text-xl sm:text-3xl font-bold text-[#2B1E1A]">${stats.totalRevenue.toLocaleString()}</p>
                      <p className="text-xs sm:text-sm text-[#6E5F57]">Total Revenue</p>
                    </div>

                    <div className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                      <div className="flex items-center justify-between mb-2 sm:mb-4">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-yellow-50 flex items-center justify-center">
                          <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" />
                        </div>
                      </div>
                      <p className="text-xl sm:text-3xl font-bold text-[#2B1E1A]">{stats.pendingApprovals}</p>
                      <p className="text-xs sm:text-sm text-[#6E5F57]">Pending Approvals</p>
                    </div>

                    <div className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                      <div className="flex items-center justify-between mb-2 sm:mb-4">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-green-50 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                        </div>
                      </div>
                      <p className="text-xl sm:text-3xl font-bold text-[#2B1E1A]">{stats.activeBookings}</p>
                      <p className="text-xs sm:text-sm text-[#6E5F57]">Active Bookings</p>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)] overflow-x-auto">
                    <h3 className="font-semibold text-[#2B1E1A] mb-3 sm:mb-4 text-sm sm:text-base">Recent Bookings</h3>
                    {bookingsError && <p className="mb-3 text-sm text-red-600">{bookingsError}</p>}
                    <table className="w-full min-w-[500px]">
                      <thead>
                        <tr className="text-left text-xs sm:text-sm text-[#6E5F57]">
                          <th className="pb-2 sm:pb-3">Booking ID</th>
                          <th className="pb-2 sm:pb-3">Customer</th>
                          <th className="pb-2 sm:pb-3">Artisan</th>
                          <th className="pb-2 sm:pb-3">Service</th>
                          <th className="pb-2 sm:pb-3">Amount</th>
                          <th className="pb-2 sm:pb-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookingsLoading && recentBookings.length === 0 && (
                          <tr>
                            <td className="py-3 text-xs sm:text-sm text-[#6E5F57]" colSpan={6}>Loading bookings...</td>
                          </tr>
                        )}
                        {recentBookings.map((booking) => (
                          <tr key={booking.id} className="border-t border-[#2B1E1A]/10">
                            <td className="py-2 sm:py-3 text-xs sm:text-sm">{booking.id}</td>
                            <td className="py-2 sm:py-3 text-xs sm:text-sm">{booking.customer}</td>
                            <td className="py-2 sm:py-3 text-xs sm:text-sm">{booking.artisan}</td>
                            <td className="py-2 sm:py-3 text-xs sm:text-sm">{booking.service}</td>
                            <td className="py-2 sm:py-3 text-xs sm:text-sm">${booking.amount}</td>
                            <td className="py-2 sm:py-3">{getStatusBadge(booking.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#2B1E1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      User Management
                    </h1>
                    <div className="flex gap-2 sm:gap-3">
                      <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E5F57]" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search users..."
                          className="pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 rounded-full border border-[#2B1E1A]/10 bg-white text-xs sm:text-sm w-full sm:w-auto"
                        />
                      </div>
                      <Button variant="outline" className="rounded-full text-xs sm:text-sm px-3 sm:px-4">
                        <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Filter
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)] overflow-x-auto">
                    {bookingsError && <p className="mb-3 text-sm text-red-600">{bookingsError}</p>}
                    {actionError && <p className="mb-3 text-sm text-red-600">{actionError}</p>}
                    <table className="w-full min-w-[500px]">
                      <thead>
                        <tr className="text-left text-xs sm:text-sm text-[#6E5F57]">
                          <th className="pb-2 sm:pb-3">Name</th>
                          <th className="pb-2 sm:pb-3">Email</th>
                          <th className="pb-2 sm:pb-3">Role</th>
                          <th className="pb-2 sm:pb-3">Status</th>
                          <th className="pb-2 sm:pb-3">Joined</th>
                          <th className="pb-2 sm:pb-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentUsers.map((user) => (
                          <tr key={user.id} className="border-t border-[#2B1E1A]/10">
                            <td className="py-2 sm:py-3 text-xs sm:text-sm font-medium text-[#2B1E1A]">{user.name}</td>
                            <td className="py-2 sm:py-3 text-xs sm:text-sm">{user.email}</td>
                            <td className="py-2 sm:py-3 text-xs sm:text-sm capitalize">{user.role}</td>
                            <td className="py-2 sm:py-3">{getStatusBadge(user.status)}</td>
                            <td className="py-2 sm:py-3 text-xs sm:text-sm">{user.joined}</td>
                            <td className="py-2 sm:py-3">
                              <div className="flex gap-1 sm:gap-2">
                                <Button size="sm" variant="outline" className="rounded-full text-[10px] sm:text-xs px-2 sm:px-3">
                                  View
                                </Button>
                                <Button size="sm" variant="outline" className="rounded-full text-[10px] sm:text-xs text-red-600 border-red-200 px-2 sm:px-3">
                                  Suspend
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'artisans' && (
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#2B1E1A] mb-4 sm:mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Artisan Approvals
                  </h1>

                  <div className="space-y-3 sm:space-y-4">
                    {pendingArtisans.map((artisan) => (
                      <div key={artisan.id} className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                        <div className="flex flex-col gap-3 sm:gap-4">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-[#2B1E1A] text-sm sm:text-base">{artisan.name}</h3>
                              {!artisan.documents && (
                                <span className="flex items-center gap-1 text-[10px] sm:text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                                  <AlertTriangle className="w-3 h-3" />
                                  Missing docs
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-[#6E5F57]">{artisan.email}</p>
                            <div className="flex flex-wrap gap-2 sm:gap-4 mt-1 sm:mt-2 text-xs sm:text-sm text-[#6E5F57]">
                              <span>{artisan.category}</span>
                              <span>{artisan.experience} experience</span>
                              <span>Applied: {artisan.submitted}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" className="rounded-full text-red-600 border-red-200 hover:bg-red-50 text-xs flex-1 sm:flex-none">
                              <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              Reject
                            </Button>
                            <Button className="rounded-full bg-[#E4A14F] hover:bg-[#d09045] text-white text-xs flex-1 sm:flex-none">
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'bookings' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#2B1E1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      All Bookings
                    </h1>
                    <Button variant="outline" className="rounded-full text-xs sm:text-sm">
                      <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Filter
                    </Button>
                  </div>

                  <div className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)] overflow-x-auto">
                    <table className="w-full min-w-[500px]">
                      <thead>
                        <tr className="text-left text-xs sm:text-sm text-[#6E5F57]">
                          <th className="pb-2 sm:pb-3">Booking ID</th>
                          <th className="pb-2 sm:pb-3">Customer</th>
                          <th className="pb-2 sm:pb-3">Artisan</th>
                          <th className="pb-2 sm:pb-3">Service</th>
                          <th className="pb-2 sm:pb-3">Date</th>
                          <th className="pb-2 sm:pb-3">Amount</th>
                          <th className="pb-2 sm:pb-3">Status</th>
                          <th className="pb-2 sm:pb-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookingsLoading && allBookings.length === 0 && (
                          <tr>
                            <td className="py-3 text-xs sm:text-sm text-[#6E5F57]" colSpan={8}>Loading bookings...</td>
                          </tr>
                        )}
                        {allBookings.map((booking) => (
                          <tr key={booking.id} className="border-t border-[#2B1E1A]/10">
                            <td className="py-2 sm:py-3 text-xs sm:text-sm">{booking.id}</td>
                            <td className="py-2 sm:py-3 text-xs sm:text-sm">Customer #{booking.customerId}</td>
                            <td className="py-2 sm:py-3 text-xs sm:text-sm">{booking.artisanName}</td>
                            <td className="py-2 sm:py-3 text-xs sm:text-sm">{booking.service}</td>
                            <td className="py-2 sm:py-3 text-xs sm:text-sm">{booking.date}</td>
                            <td className="py-2 sm:py-3 text-xs sm:text-sm">${booking.price}</td>
                            <td className="py-2 sm:py-3">{getStatusBadge(booking.status)}</td>
                            <td className="py-2 sm:py-3">
                              <div className="flex gap-1 sm:gap-2">
                                {booking.status === 'pending' && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="rounded-full text-[10px] sm:text-xs text-red-600 border-red-200 px-2 sm:px-3"
                                      onClick={() => void handleUpdateBookingStatus(booking.id, 'cancelled')}
                                      disabled={actionBookingId === booking.id}
                                    >
                                      {actionBookingId === booking.id ? 'Saving...' : 'Reject'}
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="rounded-full bg-[#E4A14F] hover:bg-[#d09045] text-white text-[10px] sm:text-xs px-2 sm:px-3"
                                      onClick={() => void handleUpdateBookingStatus(booking.id, 'confirmed')}
                                      disabled={actionBookingId === booking.id}
                                    >
                                      {actionBookingId === booking.id ? 'Saving...' : 'Accept'}
                                    </Button>
                                  </>
                                )}
                                {booking.status === 'confirmed' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="rounded-full text-[10px] sm:text-xs px-2 sm:px-3"
                                    onClick={() => void handleUpdateBookingStatus(booking.id, 'completed')}
                                    disabled={actionBookingId === booking.id}
                                  >
                                    {actionBookingId === booking.id ? 'Saving...' : 'Complete'}
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center p-2 ${activeTab === 'overview' ? 'text-[#E4A14F]' : 'text-[#6E5F57]'}`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Overview</span>
          </button>
          <button 
            onClick={() => setActiveTab('artisans')}
            className={`flex flex-col items-center p-2 ${activeTab === 'artisans' ? 'text-[#E4A14F]' : 'text-[#6E5F57]'}`}
          >
            <Briefcase className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Artisans</span>
          </button>
        </div>
      </div>
    </div>
  )
}