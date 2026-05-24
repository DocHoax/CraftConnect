import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search, ChevronDown, MessageCircle, Book, Shield, CreditCard, Calendar } from 'lucide-react'
import Navigation from '@/components/Navigation'
import type { User } from '@/App'

interface HelpPageProps {
  user: User | null
  logout: () => void
}

export default function HelpPage({ user, logout }: HelpPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [openFaq, setOpenFaq] = useState<string | null>('booking')

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Book,
      description: 'Learn the basics of using Artisans',
    },
    {
      id: 'booking',
      title: 'Booking & Scheduling',
      icon: Calendar,
      description: 'How to book and manage appointments',
    },
    {
      id: 'payments',
      title: 'Payments & Pricing',
      icon: CreditCard,
      description: 'Understanding fees and payment methods',
    },
    {
      id: 'safety',
      title: 'Trust & Safety',
      icon: Shield,
      description: 'Our verification and safety measures',
    },
  ]

  const faqs = [
    {
      category: 'booking',
      question: 'How do I book an artisan?',
      answer: 'To book an artisan, simply search for the service you need, browse through verified professionals, select your preferred date and time, and confirm your booking. You\'ll receive a confirmation email with all the details.',
    },
    {
      category: 'booking',
      question: 'Can I reschedule or cancel a booking?',
      answer: 'Yes! You can reschedule or cancel your booking up to 24 hours before the scheduled appointment without any penalty. Just go to your dashboard and manage your bookings.',
    },
    {
      category: 'payments',
      question: 'How is pricing calculated?',
      answer: 'Artisans set their own hourly rates or provide fixed quotes for specific jobs. You\'ll see the pricing upfront before confirming your booking. There are no hidden fees.',
    },
    {
      category: 'payments',
      question: 'What payment methods are accepted?',
      answer: 'We accept credit/debit cards, bank transfers, and mobile payment options like Apple Pay and Google Pay. All payments are processed securely through our platform.',
    },
    {
      category: 'safety',
      question: 'Are artisans verified?',
      answer: 'Absolutely. Every artisan on our platform undergoes identity verification, background checks, and skill validation. We also monitor reviews to ensure quality service.',
    },
    {
      category: 'safety',
      question: 'What if something goes wrong?',
      answer: 'We have a dedicated support team available 24/7. If you\'re not satisfied with the service, we\'ll work with you and the artisan to resolve the issue or provide a refund.',
    },
    {
      category: 'getting-started',
      question: 'How do I become an artisan?',
      answer: 'To join as an artisan, click "Become an Artisan" and complete the registration form. You\'ll need to provide your professional details, verify your identity, and wait for approval from our team.',
    },
    {
      category: 'getting-started',
      question: 'Is there a fee to use the platform?',
      answer: 'For customers, it\'s completely free to browse and book artisans. Artisans pay a small commission on completed jobs, which helps us maintain the platform and provide support.',
    },
  ]

  const filteredFaqs = searchQuery
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs

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

            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl lg:text-4xl font-bold text-[#2B1E1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                How can we help?
              </h1>
              <p className="mt-4 text-lg text-[#6E5F57]">
                Find answers to common questions
              </p>
            </div>

            {/* Search */}
            <div className="relative max-w-xl mx-auto mb-12">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E5F57]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for answers..."
                className="w-full pl-12 pr-4 py-4 rounded-full border border-[#2B1E1A]/10 bg-white text-[#2B1E1A] placeholder:text-[#6E5F57]/50 focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50 shadow-[0_8px_24px_rgba(43,30,26,0.08)]"
              />
            </div>

            {/* Categories */}
            {!searchQuery && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                {helpCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setOpenFaq(openFaq === category.id ? null : category.id)}
                    className={`bg-white rounded-[28px] p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)] text-left transition-all hover:-translate-y-1 ${
                      openFaq === category.id ? 'ring-2 ring-[#E4A14F]' : ''
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-[#E4A14F]/10 flex items-center justify-center mb-4">
                      <category.icon className="w-6 h-6 text-[#E4A14F]" />
                    </div>
                    <h3 className="font-semibold text-[#2B1E1A] mb-1">{category.title}</h3>
                    <p className="text-sm text-[#6E5F57]">{category.description}</p>
                  </button>
                ))}
              </div>
            )}

            {/* FAQs */}
            <div className="bg-white rounded-[28px] p-6 lg:p-8 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
              <h2 className="text-xl font-semibold text-[#2B1E1A] mb-6">
                {searchQuery ? 'Search Results' : 'Frequently Asked Questions'}
              </h2>

              <div className="space-y-3">
                {filteredFaqs.map((faq, index) => (
                  <details
                    key={index}
                    className="group"
                    open={openFaq === faq.category || searchQuery ? true : undefined}
                  >
                    <summary className="flex items-center justify-between p-4 rounded-xl bg-[#F6F4F2] cursor-pointer list-none hover:bg-[#E9E1D6] transition-colors">
                      <span className="font-medium text-[#2B1E1A]">{faq.question}</span>
                      <ChevronDown className="w-5 h-5 text-[#6E5F57] group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-4 py-4 text-[#6E5F57] leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-[#6E5F57]">No results found. Try a different search term.</p>
                </div>
              )}
            </div>

            {/* Contact CTA */}
            <div className="mt-12 text-center">
              <p className="text-[#6E5F57] mb-4">Can't find what you're looking for?</p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#E4A14F] hover:bg-[#d09045] text-white rounded-full font-medium transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}