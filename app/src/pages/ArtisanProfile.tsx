import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Star, MapPin, Briefcase, Clock, CheckCircle, MessageCircle, Calendar, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/Navigation'
import type { User } from '@/App'
import { useArtisanProfile } from '@/features/artisans/hooks'

interface ArtisanProfileProps {
  user: User | null
  logout: () => void
}

export default function ArtisanProfile({ user, logout }: ArtisanProfileProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'services' | 'reviews' | 'availability'>('services')
  const { artisan, reviews, isLoading, error } = useArtisanProfile(id)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F4F2]">
        <Navigation user={user} logout={logout} />
        <div className="pt-24 pb-12 text-center">
          <h1 className="text-2xl font-bold text-[#2B1E1A]">Loading artisan profile...</h1>
        </div>
      </div>
    )
  }

  if (!artisan) {
    return (
      <div className="min-h-screen bg-[#F6F4F2]">
        <Navigation user={user} logout={logout} />
        <div className="pt-24 pb-12 text-center">
          <h1 className="text-2xl font-bold text-[#2B1E1A]">Artisan not found</h1>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <Link to="/search" className="mt-4 inline-block text-[#E4A14F]">
            Back to search
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F4F2]">
      <Navigation user={user} logout={logout} />

      <div className="pt-20 pb-12">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-[#6E5F57] hover:text-[#2B1E1A] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to search
          </button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-2">
              {/* Profile Header */}
              <div className="bg-white rounded-[28px] p-6 lg:p-8 shadow-[0_18px_40px_rgba(43,30,26,0.08)] mb-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden bg-[#E9E1D6] flex-shrink-0">
                    <img src={artisan.image} alt={artisan.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-[#2B1E1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {artisan.name}
                        </h1>
                        <p className="text-lg text-[#6E5F57] mt-1">{artisan.category}</p>
                      </div>
                      {artisan.verified && (
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Verified
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-[#E4A14F] text-[#E4A14F]" />
                        <span className="font-semibold text-[#2B1E1A]">{artisan.rating}</span>
                        <span className="text-[#6E5F57]">({artisan.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#6E5F57]">
                        <MapPin className="w-4 h-4" />
                        {artisan.location}
                      </div>
                      <div className="flex items-center gap-1 text-[#6E5F57]">
                        <Briefcase className="w-4 h-4" />
                        {artisan.experience} years experience
                      </div>
                    </div>

                    <p className="mt-4 text-[#6E5F57] leading-relaxed">{artisan.description}</p>

                    <div className="flex flex-wrap gap-3 mt-6">
                      {user?.role === 'customer' ? (
                        <Link to={`/booking/${artisan.id}`}>
                          <Button className="bg-[#E4A14F] hover:bg-[#d09045] text-white rounded-full px-8">
                            <Calendar className="w-4 h-4 mr-2" />
                            Book Appointment
                          </Button>
                        </Link>
                      ) : (
                        <Button disabled className="rounded-full px-8">
                          <Calendar className="w-4 h-4 mr-2" />
                          Sign in to Book
                        </Button>
                      )}
                      <Button variant="outline" className="rounded-full border-[#2B1E1A]/20">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-[28px] shadow-[0_18px_40px_rgba(43,30,26,0.08)] overflow-hidden">
                <div className="flex border-b border-[#2B1E1A]/10">
                  {(['services', 'reviews', 'availability'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-4 text-sm font-medium capitalize transition-colors ${
                        activeTab === tab
                          ? 'text-[#E4A14F] border-b-2 border-[#E4A14F]'
                          : 'text-[#6E5F57] hover:text-[#2B1E1A]'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="p-6 lg:p-8">
                  {activeTab === 'services' && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#2B1E1A] mb-4">Services Offered</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {artisan.services.map((service, index) => (
                          <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-[#F6F4F2]">
                            <CheckCircle className="w-5 h-5 text-[#E4A14F]" />
                            <span className="text-[#2B1E1A]">{service}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 p-4 rounded-xl bg-[#E4A14F]/10">
                        <p className="text-sm text-[#2B1E1A]">
                          <span className="font-semibold">Pricing:</span> {artisan.priceRange}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-[#2B1E1A]">Customer Reviews</h3>
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 fill-[#E4A14F] text-[#E4A14F]" />
                          <span className="font-semibold text-[#2B1E1A]">{artisan.rating}</span>
                          <span className="text-[#6E5F57]">({artisan.reviews} reviews)</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review.id} className="p-4 rounded-xl bg-[#F6F4F2]">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-[#2B1E1A]">{review.customerName}</span>
                              <span className="text-sm text-[#6E5F57]">{review.date}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-[#E4A14F] text-[#E4A14F]" />
                              ))}
                            </div>
                            <p className="text-[#6E5F57]">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'availability' && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#2B1E1A] mb-4">Available Days</h3>
                      <div className="grid grid-cols-7 gap-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                          <div
                            key={day}
                            className={`p-3 rounded-xl text-center ${
                              artisan.availability.includes(day)
                                ? 'bg-[#E4A14F]/10 text-[#E4A14F]'
                                : 'bg-[#F6F4F2] text-[#6E5F57]'
                            }`}
                          >
                            <Clock className="w-4 h-4 mx-auto mb-1" />
                            <span className="text-xs">{day}</span>
                          </div>
                        ))}
                      </div>
                      <p className="mt-4 text-sm text-[#6E5F57]">
                        Available hours may vary. Book to see specific time slots.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[28px] p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)] sticky top-24">
                <h3 className="text-lg font-semibold text-[#2B1E1A] mb-4">Quick Book</h3>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm text-[#6E5F57] mb-2">Starting from</label>
                    <p className="text-2xl font-bold text-[#E4A14F]">{artisan.priceRange.split('-')[0]}</p>
                  </div>
                  <div className="pt-4 border-t border-[#2B1E1A]/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#6E5F57]">Response time</span>
                      <span className="text-sm font-medium text-[#2B1E1A]">Usually within 1 hour</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6E5F57]">Completed jobs</span>
                      <span className="text-sm font-medium text-[#2B1E1A]">{artisan.reviews + 50}+</span>
                    </div>
                  </div>
                </div>
                {user?.role === 'customer' ? (
                  <Link to={`/booking/${artisan.id}`}>
                    <Button className="w-full bg-[#E4A14F] hover:bg-[#d09045] text-white rounded-full py-6">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button className="w-full bg-[#E4A14F] hover:bg-[#d09045] text-white rounded-full py-6">
                      Sign in to Book
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}