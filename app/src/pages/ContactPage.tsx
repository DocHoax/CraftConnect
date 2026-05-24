import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/Navigation'
import type { User } from '@/App'

interface ContactPageProps {
  user: User | null
  logout: () => void
}

export default function ContactPage({ user, logout }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate sending
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSent(true)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#F6F4F2]">
      <Navigation user={user} logout={logout} />

      <div className="pt-24 pb-12">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link to="/" className="inline-flex items-center text-[#6E5F57] hover:text-[#2B1E1A] mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>

            <div className="text-center mb-12">
              <h1 className="text-3xl lg:text-4xl font-bold text-[#2B1E1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Get in Touch
              </h1>
              <p className="mt-4 text-lg text-[#6E5F57]">
                Have questions? We'd love to hear from you.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Info */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white rounded-[28px] p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                  <div className="w-12 h-12 rounded-full bg-[#E4A14F]/10 flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-[#E4A14F]" />
                  </div>
                  <h3 className="font-semibold text-[#2B1E1A] mb-1">Email</h3>
                  <p className="text-[#6E5F57]">support@artisans.com</p>
                </div>

                <div className="bg-white rounded-[28px] p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                  <div className="w-12 h-12 rounded-full bg-[#E4A14F]/10 flex items-center justify-center mb-4">
                    <Phone className="w-6 h-6 text-[#E4A14F]" />
                  </div>
                  <h3 className="font-semibold text-[#2B1E1A] mb-1">Phone</h3>
                  <p className="text-[#6E5F57]">+1 (555) 123-4567</p>
                </div>

                <div className="bg-white rounded-[28px] p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                  <div className="w-12 h-12 rounded-full bg-[#E4A14F]/10 flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-[#E4A14F]" />
                  </div>
                  <h3 className="font-semibold text-[#2B1E1A] mb-1">Address</h3>
                  <p className="text-[#6E5F57]">123 Artisan Way, Suite 100<br />New York, NY 10001</p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-[28px] p-6 lg:p-8 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                  {isSent ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
                        <Send className="w-10 h-10 text-green-500" />
                      </div>
                      <h2 className="text-2xl font-bold text-[#2B1E1A] mb-2">Message Sent!</h2>
                      <p className="text-[#6E5F57]">We'll get back to you within 24 hours.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-[#2B1E1A] mb-2">Your Name</label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-[#2B1E1A]/10 bg-white text-[#2B1E1A] placeholder:text-[#6E5F57]/50 focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50"
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#2B1E1A] mb-2">Email Address</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-[#2B1E1A]/10 bg-white text-[#2B1E1A] placeholder:text-[#6E5F57]/50 focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50"
                            placeholder="you@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#2B1E1A] mb-2">Subject</label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-[#2B1E1A]/10 bg-white text-[#2B1E1A] placeholder:text-[#6E5F57]/50 focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50"
                          placeholder="How can we help?"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#2B1E1A] mb-2">Message</label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={5}
                          className="w-full px-4 py-3 rounded-xl border border-[#2B1E1A]/10 bg-white text-[#2B1E1A] placeholder:text-[#6E5F57]/50 focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50 resize-none"
                          placeholder="Tell us more about your inquiry..."
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#E4A14F] hover:bg-[#d09045] text-white rounded-full py-6 text-base font-medium disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                            Send Message
                          </span>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}