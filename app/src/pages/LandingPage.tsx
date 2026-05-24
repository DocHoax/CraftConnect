import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { 
  Star, ArrowRight, CheckCircle, Shield, Headphones, 
  Droplets, Zap, Hammer, Paintbrush, Sparkles, Wind, 
  Settings, TreePine, Truck, Wrench, Scissors, Smartphone,
  ChevronDown, User as UserIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/Navigation'
import type { User } from '@/App'
import { artisans, categories, testimonials, faqs, howItWorks, pricingTiers } from '@/data/mockData'

gsap.registerPlugin(ScrollTrigger)

interface LandingPageProps {
  user: User | null
  logout: () => void
}

export default function LandingPage({ user, logout }: LandingPageProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const howItWorksRef = useRef<HTMLDivElement>(null)
  const categoriesRef = useRef<HTMLDivElement>(null)
  const artisansRef = useRef<HTMLDivElement>(null)
  const trustRef = useRef<HTMLDivElement>(null)
  const pricingRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)
  const recruitRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation
      gsap.fromTo('.hero-headline', 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.2 }
      )
      gsap.fromTo('.hero-subtext',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.4 }
      )
      gsap.fromTo('.hero-cta',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.6 }
      )
      gsap.fromTo('.hero-card',
        { x: 100, opacity: 0, scale: 0.95 },
        { x: 0, opacity: 1, scale: 1, duration: 1, ease: 'power2.out', delay: 0.3 }
      )
      gsap.fromTo('.floating-spot',
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)', stagger: 0.15, delay: 0.6 }
      )

      // How It Works section
      gsap.fromTo('.step-card',
        { y: 80, opacity: 0, scale: 0.98 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out', stagger: 0.15,
          scrollTrigger: {
            trigger: howItWorksRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Categories section
      gsap.fromTo('.category-spot',
        { scale: 0.85, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.06,
          scrollTrigger: {
            trigger: categoriesRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Featured Artisans section
      gsap.fromTo('.artisan-card',
        { x: 60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.7, ease: 'power2.out', stagger: 0.12,
          scrollTrigger: {
            trigger: artisansRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Trust section
      gsap.fromTo('.trust-card',
        { y: 70, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', stagger: 0.12,
          scrollTrigger: {
            trigger: trustRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Pricing section
      gsap.fromTo('.pricing-card',
        { x: 40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.7, ease: 'power2.out', stagger: 0.12,
          scrollTrigger: {
            trigger: pricingRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Testimonials section
      gsap.fromTo('.testimonial-card',
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', stagger: 0.15,
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Recruitment section
      gsap.fromTo('.recruit-text',
        { x: -60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: {
            trigger: recruitRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      )
      gsap.fromTo('.recruit-card',
        { x: 80, opacity: 0, scale: 0.98 },
        {
          x: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out',
          scrollTrigger: {
            trigger: recruitRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // FAQ section
      gsap.fromTo('.faq-item',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.08,
          scrollTrigger: {
            trigger: faqRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    })

    return () => ctx.revert()
  }, [])

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ElementType> = {
      Droplets, Zap, Hammer, Paintbrush, Sparkles, Wind, 
      Settings, TreePine, Truck, Wrench, Scissors, Smartphone
    }
    const Icon = icons[iconName] || Wrench
    return <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
  }

  return (
    <div className="min-h-screen bg-[#F6F4F2] pb-16 lg:pb-0">
      <Navigation user={user} logout={logout} transparent />

      {/* Section 1: Hero */}
      <section ref={heroRef} className="relative min-h-screen pt-16 sm:pt-20 lg:pt-0 overflow-hidden">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 min-h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full py-8 sm:py-12 lg:py-0">
            {/* Left Content */}
            <div className="order-2 lg:order-1 max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
              <h1 className="hero-headline text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#2B1E1A] leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Book trusted artisans in minutes
              </h1>
              <p className="hero-subtext mt-4 sm:mt-6 text-base sm:text-lg text-[#6E5F57] leading-relaxed px-4 sm:px-0">
                From fixes to full projects—find verified pros, see upfront pricing, and book a time that works for you.
              </p>
              <div className="hero-cta mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link to="/search">
                  <Button className="bg-[#E4A14F] hover:bg-[#d09045] text-white rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-medium transition-transform hover:-translate-y-0.5">
                    Find an artisan
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/help">
                  <Button variant="outline" className="rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-medium border-[#2B1E1A]/20 text-[#2B1E1A] hover:bg-[#2B1E1A]/5">
                    How it works
                  </Button>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="hero-cta mt-6 sm:mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E4A14F]/20 border-2 border-white flex items-center justify-center">
                        <UserIcon className="w-3 h-3 sm:w-4 sm:h-4 text-[#E4A14F]" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-[#6E5F57]">12,000+ happy customers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-[#E4A14F] text-[#E4A14F]" />
                  <span className="font-semibold text-[#2B1E1A]">4.9</span>
                  <span className="text-xs sm:text-sm text-[#6E5F57]">rating</span>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Card */}
            <div className="order-1 lg:order-2 relative px-4 sm:px-8 lg:px-0">
              <div className="hero-card relative bg-white rounded-2xl sm:rounded-[28px] p-4 sm:p-6 lg:p-8 shadow-[0_18px_40px_rgba(43,30,26,0.10)] max-w-sm sm:max-w-md lg:max-w-none mx-auto">
                <div className="aspect-square rounded-full overflow-hidden bg-[#E9E1D6]">
                  <img 
                    src="/images/hero-worker.jpg" 
                    alt="Professional artisan" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-6 sm:bottom-10 left-4 sm:left-10 bg-white rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-lg flex items-center gap-1.5 sm:gap-2">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-[#E4A14F] text-[#E4A14F]" />
                  <span className="text-xs sm:text-sm font-medium text-[#2B1E1A]">4.9 · 12,000+ reviews</span>
                </div>
              </div>

              {/* Floating Spots - Hidden on small mobile */}
              <div className="hidden sm:block floating-spot absolute -top-2 sm:-top-4 -left-2 sm:-left-4 lg:top-0 lg:-left-8">
                <div className="w-14 h-14 sm:w-20 sm:h-20 lg:w-28 lg:h-28 rounded-full overflow-hidden shadow-lg border-2 sm:border-4 border-white">
                  <img src="/images/spot-cleaning.jpg" alt="Cleaning" className="w-full h-full object-cover" />
                </div>
                <span className="block text-center text-[10px] sm:text-xs font-medium text-[#2B1E1A] mt-1">Cleaning</span>
              </div>
              <div className="hidden sm:block floating-spot absolute top-1/4 -right-2 sm:-right-4 lg:-right-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 rounded-full overflow-hidden shadow-lg border-2 sm:border-4 border-white">
                  <img src="/images/spot-electrical.jpg" alt="Electrical" className="w-full h-full object-cover" />
                </div>
                <span className="block text-center text-[10px] sm:text-xs font-medium text-[#2B1E1A] mt-1">Electrical</span>
              </div>
              <div className="hidden sm:block floating-spot absolute -bottom-2 sm:-bottom-4 left-1/4 lg:bottom-8 lg:left-0">
                <div className="w-14 h-14 sm:w-20 sm:h-20 lg:w-28 lg:h-28 rounded-full overflow-hidden shadow-lg border-2 sm:border-4 border-white">
                  <img src="/images/spot-plumbing.jpg" alt="Plumbing" className="w-full h-full object-cover" />
                </div>
                <span className="block text-center text-[10px] sm:text-xs font-medium text-[#2B1E1A] mt-1">Plumbing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: How It Works */}
      <section ref={howItWorksRef} className="py-12 sm:py-16 lg:py-28">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B1E1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Three steps to done
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#6E5F57]">
              Search. Book. Relax. We handle the details.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {howItWorks.map((step) => (
              <div key={step.step} className="step-card bg-white rounded-2xl sm:rounded-[28px] p-4 sm:p-6 lg:p-8 shadow-[0_18px_40px_rgba(43,30,26,0.08)] hover:shadow-[0_22px_48px_rgba(43,30,26,0.12)] transition-shadow">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#E4A14F]/10 flex items-center justify-center mb-4 sm:mb-6">
                  <span className="text-xl sm:text-2xl font-bold text-[#E4A14F]">{step.step}</span>
                </div>
                <div className="aspect-video rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-6 bg-[#E9E1D6]">
                  <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#2B1E1A] mb-1 sm:mb-2">{step.title}</h3>
                <p className="text-sm sm:text-base text-[#6E5F57]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Categories */}
      <section ref={categoriesRef} className="py-12 sm:py-16 lg:py-28">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B1E1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Find the right skill
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#6E5F57]">
              Browse our most popular services
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                to={`/search?category=${category.id}`}
                className="category-spot group flex flex-col items-center"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full bg-white shadow-[0_8px_24px_rgba(43,30,26,0.08)] flex items-center justify-center group-hover:shadow-[0_12px_32px_rgba(43,30,26,0.12)] group-hover:scale-105 transition-all duration-300">
                  <div className="text-[#E4A14F]">
                    {getIcon(category.icon)}
                  </div>
                </div>
                <span className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-[#2B1E1A] text-center">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Featured Artisans */}
      <section ref={artisansRef} className="py-12 sm:py-16 lg:py-28 overflow-hidden">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8 sm:mb-12">
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B1E1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Meet top-rated pros
              </h2>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#6E5F57]">
                Every artisan is identity-verified, background-checked, and reviewed by real customers.
              </p>
            </div>
            <Link to="/search" className="mt-4 lg:mt-0 mx-auto lg:mx-0">
              <Button variant="outline" className="rounded-full border-[#2B1E1A]/20 text-[#2B1E1A] hover:bg-[#2B1E1A]/5 text-sm sm:text-base">
                Browse all artisans
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {artisans.map((artisan) => (
              <Link 
                key={artisan.id} 
                to={`/artisan/${artisan.id}`}
                className="artisan-card flex-shrink-0 w-64 sm:w-72 lg:w-80 snap-start"
              >
                <div className="bg-white rounded-2xl sm:rounded-[28px] overflow-hidden shadow-[0_18px_40px_rgba(43,30,26,0.08)] hover:shadow-[0_22px_48px_rgba(43,30,26,0.14)] hover:-translate-y-1.5 transition-all duration-300">
                  <div className="aspect-[4/3] bg-[#E9E1D6]">
                    <img src={artisan.image} alt={artisan.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                      <h3 className="font-semibold text-[#2B1E1A] text-sm sm:text-base">{artisan.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-[#E4A14F] text-[#E4A14F]" />
                        <span className="text-xs sm:text-sm font-medium text-[#2B1E1A]">{artisan.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#6E5F57] mb-2 sm:mb-3">{artisan.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-[#6E5F57]">{artisan.location}</span>
                      <span className="text-xs sm:text-sm font-medium text-[#E4A14F]">{artisan.priceRange}</span>
                    </div>
                    {artisan.verified && (
                      <div className="mt-2 sm:mt-3 flex items-center gap-1 text-[10px] sm:text-xs text-[#2B1E1A]">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Trust & Safety */}
      <section ref={trustRef} className="py-12 sm:py-16 lg:py-28">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B1E1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              You're covered
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#6E5F57]">
              We verify, insure, and support every booking.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              { 
                icon: CheckCircle, 
                title: 'Verified identity', 
                description: 'ID + background check for every artisan.',
                image: '/images/trust-verify.jpg'
              },
              { 
                icon: Shield, 
                title: 'Insurance cover', 
                description: 'Protection for the job, just in case.',
                image: '/images/trust-insurance.jpg'
              },
              { 
                icon: Headphones, 
                title: 'Support team', 
                description: 'Help before, during, and after your appointment.',
                image: '/images/trust-support.jpg'
              },
            ].map((item, index) => (
              <div key={index} className="trust-card bg-white rounded-2xl sm:rounded-[28px] p-4 sm:p-6 lg:p-8 shadow-[0_18px_40px_rgba(43,30,26,0.08)] text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto rounded-full overflow-hidden mb-4 sm:mb-6 bg-[#E9E1D6]">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#2B1E1A] mb-1 sm:mb-2">{item.title}</h3>
                <p className="text-sm sm:text-base text-[#6E5F57]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Pricing */}
      <section ref={pricingRef} className="py-12 sm:py-16 lg:py-28">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B1E1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Fair, upfront pricing
              </h2>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#6E5F57]">
                No hidden fees. See typical ranges before you book.
              </p>
              <Link to="/search" className="inline-block mt-6 sm:mt-8">
                <Button className="bg-[#E4A14F] hover:bg-[#d09045] text-white rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base">
                  Get a personalized estimate
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {pricingTiers.map((tier) => (
                <div key={tier.name} className="pricing-card bg-white rounded-2xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                  <h3 className="font-semibold text-[#2B1E1A] mb-1 text-sm sm:text-base">{tier.name}</h3>
                  <p className="text-xl sm:text-2xl font-bold text-[#E4A14F] mb-1 sm:mb-2">{tier.price}</p>
                  <p className="text-xs sm:text-sm text-[#6E5F57] mb-3 sm:mb-4">{tier.description}</p>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {tier.examples.map((example, i) => (
                      <li key={i} className="text-xs sm:text-sm text-[#6E5F57] flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#E4A14F] flex-shrink-0 mt-0.5" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Testimonials */}
      <section ref={testimonialsRef} className="py-12 sm:py-16 lg:py-28">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B1E1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Real stories
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card bg-white rounded-2xl sm:rounded-[28px] p-4 sm:p-6 lg:p-8 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden bg-[#E9E1D6] flex-shrink-0">
                    <img src={testimonial.image} alt={testimonial.customerName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2B1E1A] text-sm sm:text-base">{testimonial.customerName}</h4>
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-[#E4A14F] text-[#E4A14F]" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-[#6E5F57] text-sm sm:text-base lg:text-lg leading-relaxed">"{testimonial.comment}"</p>
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-[#6E5F57]">Service: {testimonial.service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8: Become an Artisan */}
      <section ref={recruitRef} className="py-12 sm:py-16 lg:py-28">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="recruit-text text-center lg:text-left order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B1E1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Turn your skills into income
              </h2>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-[#6E5F57] leading-relaxed">
                Set your schedule, choose your jobs, and get paid quickly—with support and insurance included.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link to="/signup">
                  <Button className="bg-[#E4A14F] hover:bg-[#d09045] text-white rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base">
                    Apply to join
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/help">
                  <Button variant="outline" className="rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base border-[#2B1E1A]/20">
                    How payments work
                  </Button>
                </Link>
              </div>
              <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-4 sm:gap-6">
                {[
                  { value: '$2.5M+', label: 'Paid to artisans' },
                  { value: '5,000+', label: 'Active artisans' },
                  { value: '4.9', label: 'Average rating' },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#E4A14F]">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-[#6E5F57]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="recruit-card relative order-1 lg:order-2">
              <div className="bg-white rounded-2xl sm:rounded-[28px] p-4 sm:p-6 lg:p-8 shadow-[0_18px_40px_rgba(43,30,26,0.10)]">
                <div className="aspect-square rounded-full overflow-hidden bg-[#E9E1D6] max-w-[280px] sm:max-w-sm mx-auto">
                  <img src="/images/recruit-portrait.jpg" alt="Artisan" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="absolute -bottom-4 sm:-bottom-6 -right-2 sm:-right-6 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden shadow-lg border-2 sm:border-4 border-white">
                <img src="/images/recruit-detail.jpg" alt="Tools" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 9: FAQ */}
      <section ref={faqRef} className="py-12 sm:py-16 lg:py-28">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B1E1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Questions, answered
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-2 sm:space-y-3">
            {faqs.map((faq, index) => (
              <details key={index} className="faq-item group bg-white rounded-xl sm:rounded-2xl shadow-[0_8px_24px_rgba(43,30,26,0.06)] overflow-hidden">
                <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer list-none">
                  <span className="font-medium text-[#2B1E1A] text-sm sm:text-base pr-4">{faq.question}</span>
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#6E5F57] group-open:rotate-180 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <p className="text-[#6E5F57] leading-relaxed text-sm sm:text-base">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Section 10: Footer */}
      <footer className="bg-[#E9E1D6] py-12 sm:py-16 lg:py-20">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* CTA */}
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B1E1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Get started today
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#6E5F57]">
              Book your first artisan—or join the network and start earning.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
              <Link to="/search">
                <Button className="bg-[#E4A14F] hover:bg-[#d09045] text-white rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base">
                  Find an artisan
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" className="rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base border-[#2B1E1A]/20 text-[#2B1E1A]">
                  Become an artisan
                </Button>
              </Link>
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pt-8 sm:pt-12 border-t border-[#2B1E1A]/10">
            {[
              {
                title: 'Product',
                links: ['How it works', 'Pricing', 'Trust & Safety', 'Business'],
              },
              {
                title: 'Categories',
                links: ['Plumbing', 'Electrical', 'Carpentry', 'Cleaning'],
              },
              {
                title: 'Support',
                links: ['Help Center', 'Contact', 'Reschedule', 'Claims'],
              },
              {
                title: 'Company',
                links: ['About', 'Careers', 'Terms', 'Privacy'],
              },
            ].map((column) => (
              <div key={column.title}>
                <h4 className="font-semibold text-[#2B1E1A] mb-3 sm:mb-4 text-sm sm:text-base">{column.title}</h4>
                <ul className="space-y-2 sm:space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <Link to="/" className="text-xs sm:text-sm text-[#6E5F57] hover:text-[#2B1E1A] transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-[#2B1E1A]/10">
            <p className="text-xs sm:text-sm text-[#6E5F57] text-center sm:text-left">
              © 2026 Artisans Booking System. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-3 sm:mt-0">
              <Link to="/" className="text-xs sm:text-sm text-[#6E5F57] hover:text-[#2B1E1A]">Terms</Link>
              <Link to="/" className="text-xs sm:text-sm text-[#6E5F57] hover:text-[#2B1E1A]">Privacy</Link>
              <Link to="/" className="text-xs sm:text-sm text-[#6E5F57] hover:text-[#2B1E1A]">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}