'use client'

import { useState, useEffect } from 'react'
import BookingSection from '@/components/BookingSection'
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from 'lucide-react'

const services = [
  { title: 'Preventive care', copy: 'Thoughtful routines and gentle visits that keep your smile healthy for life.', tag: 'The foundation', icon: ShieldCheck },
  { title: 'Cosmetic dentistry', copy: 'Subtle, natural enhancements designed around your features and confidence.', tag: 'The artistry', icon: Sparkles },
  { title: 'Restorative care & RCT', copy: 'Modern, comfortable root canal and restorative treatments with minimal discomfort.', tag: 'The renewal', icon: Star },
]

interface ReviewItem {
  quote: string
  name: string
  detail: string
  rating: number
  source?: string
}

const defaultReviews: ReviewItem[] = [
  {
    quote: "Extremely satisfied with the dental care at Gorantla Multi Speciality Dental Clinic. Prompt service with minimal waiting time and very reasonable pricing.",
    name: 'Sravani P.',
    detail: 'Verified Patient • Raja Bazaar, Vizianagaram',
    rating: 5,
    source: 'Patient Review',
  },
  {
    quote: 'Dr. Gorantla is very gentle and explains every step of the procedure clearly. Clean, hygienic setup and excellent root canal treatment.',
    name: 'Rajesh Kumar V.',
    detail: 'Verified Patient • Vizianagaram',
    rating: 5,
    source: 'Patient Review',
  },
  {
    quote: 'Best multi-speciality dental clinic in Satya Sai Complex, Raja Bazaar area. Highly recommended for families seeking quality dental care.',
    name: 'Venkatesh M.',
    detail: 'Verified Patient • Vizianagaram',
    rating: 5,
    source: 'Patient Review',
  },
  {
    quote: 'Immediate appointment availability and friendly staff. Made my dental cleaning experience completely stress-free.',
    name: 'Anusha R.',
    detail: 'Verified Patient • Raja Bazaar, Vizianagaram',
    rating: 5,
    source: 'Patient Review',
  },
]

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [justdialInfo, setJustdialInfo] = useState({
    rating: 5.0,
    totalRatings: '100+',
    url: 'https://justdial.com/Vizianagaram/Dr-Anands-Dental-Clinic-Ayya-Koneru/',
  })

  useEffect(() => {
    async function fetchJustdialData() {
      try {
        const res = await fetch('/api/reviews')
        if (res.ok) {
          const data = await res.json()
          if (data.reviews && data.reviews.length > 0) {
            setReviews(data.reviews)
          }
          if (data.rating) {
            setJustdialInfo({
              rating: data.rating || 5.0,
              totalRatings: data.totalRatings || '100+',
              url: data.justdialUrl || 'https://justdial.com/Vizianagaram/Dr-Anands-Dental-Clinic-Ayya-Koneru/',
            })
          }
        }
      } catch (err) {
        console.error('Error loading dynamic reviews:', err)
      } finally {
        setLoadingReviews(false)
      }
    }
    fetchJustdialData()
  }, [])

  const displayReviews = reviews.length > 0 ? reviews : defaultReviews

  const nextTestimonial = () => setActiveTestimonial((current) => (current + 1) % displayReviews.length)
  const previousTestimonial = () => setActiveTestimonial((current) => (current - 1 + displayReviews.length) % displayReviews.length)

  const directionsUrl = "https://www.google.com/maps/search/?api=1&query=Gorantla+Multi+Speciality+Dental+Clinic+Satya+Sai+Complex+Raja+Bazaar+AG+Road+Vizianagaram+Andhra+Pradesh+535002"
  const whatsappUrl = "https://wa.me/918922231777?text=Hello%20Gorantla%20Multi%20Speciality%20Dental%20Clinic,%20I%20would%20like%20to%20inquire%20about%20an%20appointment."
  const callUrl = "tel:+918922231777"

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      {/* Top Header Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
          <a href="#top" className="flex items-center gap-2.5 font-serif text-lg sm:text-xl tracking-tight" aria-label="Gorantla Multi Speciality Dental Clinic home">
            <img src="/images/dr-anand-logo.jpg" alt="Gorantla Dental Clinic Logo" className="size-9 rounded-full object-cover shadow-sm border border-primary/30" />
            <div className="flex flex-col leading-tight">
              <span className="font-serif font-bold text-foreground">GORANTLA</span>
              <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-primary">Multi Speciality Dental Clinic</span>
            </div>
          </a>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            <a href="#care" className="nav-link">Our care</a>
            <a href="#story" className="nav-link">Our story</a>
            <a href="#journal" className="nav-link">Reviews</a>
            <a href="#appointment" className="nav-link">Contact</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href={callUrl}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Phone size={13} className="text-primary" /> Call Clinic
            </a>
            <a
              href="#appointment"
              className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Book a Visit <ArrowUpRight className="ml-1 inline" size={14} />
            </a>
          </div>

          <button className="rounded-full p-2 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {menuOpen && (
          <nav className="border-t border-border bg-background px-5 py-4 md:hidden" aria-label="Mobile navigation">
            <div className="flex flex-col gap-3">
              <a href="#care" onClick={() => setMenuOpen(false)}>Our care</a>
              <a href="#story" onClick={() => setMenuOpen(false)}>Our story</a>
              <a href="#journal" onClick={() => setMenuOpen(false)}>Reviews</a>
              <a href={callUrl} className="font-semibold text-primary flex items-center gap-1.5">
                <Phone size={14} /> Call: +91 89222 31777
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-600 flex items-center gap-1.5">
                <MessageCircle size={14} /> WhatsApp Us
              </a>
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground flex items-center gap-1.5">
                <Navigation size={14} className="text-primary" /> Get Directions
              </a>
              <a href="#appointment" onClick={() => setMenuOpen(false)} className="mt-1 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground">
                Book Appointment <ArrowUpRight className="ml-1 inline" size={14} />
              </a>
            </div>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section id="top" className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-32 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:pb-24 lg:pt-44">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary/80 px-3.5 py-1 text-xs font-medium text-primary mb-4">
            <Sparkles size={13} /> Multi Speciality Dental Care in Vizianagaram
          </div>
          <h1 className="mt-2 font-serif text-4xl leading-[1.02] tracking-[-.04em] text-pretty sm:text-6xl lg:text-7xl">
            GORANTLA <em className="text-primary font-normal">Multi Speciality</em> Dental Clinic
          </h1>
          <p className="mt-5 max-w-md text-sm sm:text-base leading-relaxed text-muted-foreground">
            Satya Sai Complex, Raja Bazaar / A.G. Road, Vizianagaram, AP 535002.<br />
            Advanced, gentle dental treatments delivered with modern care.
          </p>

          {/* Action Buttons: Call the Clinic, WhatsApp, Get Directions */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={callUrl}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-xs sm:text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Phone size={16} /> Call the Clinic
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:-translate-y-0.5"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-xs sm:text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
            >
              <Navigation size={16} className="text-primary" /> Get Directions
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-border pt-5">
            <div>
              <p className="font-serif text-2xl font-bold">5.0 ★</p>
              <div className="mt-1 flex text-primary" aria-label="5 out of 5 stars">
                <Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" />
              </div>
            </div>
            <div className="h-9 w-px bg-border" />
            <div>
              <p className="text-xs font-semibold text-foreground">Clinic Address</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Satya Sai Complex, Raja Bazaar / A.G. Road
              </p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:ml-auto">
          <div className="hero-image-wrap">
            <img src="/images/luma-dental-hero.png" alt="Gorantla Multi Speciality Dental Clinic" className="h-full w-full object-cover" />
          </div>
          <div className="absolute -bottom-5 -left-3 flex max-w-[220px] items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-xl sm:-left-7">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"><Check size={17} /></span>
            <p className="text-xs font-medium leading-5">Your comfort &amp; health come first.</p>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="border-y border-border bg-secondary/45">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-8 px-5 py-8 lg:px-8">
          <div>
            <p className="eyebrow">Multi Speciality Dental Care in Vizianagaram</p>
          </div>
          <div className="flex gap-8 sm:gap-16">
            <div>
              <p className="font-serif text-3xl font-bold">15+</p>
              <p className="mt-1 text-xs text-muted-foreground">Years of excellence</p>
            </div>
            <div>
              <p className="font-serif text-3xl font-bold">100%</p>
              <p className="mt-1 text-xs text-muted-foreground">Sterilized equipment</p>
            </div>
            <div>
              <p className="font-serif text-3xl font-bold">5.0/5</p>
              <p className="mt-1 text-xs text-muted-foreground">Patient rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Care Services Section */}
      <section id="care" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <p className="eyebrow">Our care</p>
            <h2 className="mt-5 max-w-sm font-serif text-4xl leading-tight tracking-[-.03em] sm:text-5xl">Care that sees the <em className="text-primary">whole you.</em></h2>
            <p className="mt-6 max-w-sm text-sm leading-6 text-muted-foreground">Whether you are here for a routine clean, root canal, or complete smile refresh, we make space for what matters to you.</p>
            <a href="#appointment" className="mt-8 inline-flex items-center text-sm font-semibold text-primary">View all services <ArrowUpRight className="ml-2" size={16} /></a>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {services.map(({ title, copy, tag, icon: Icon }) => (
              <article key={title} className="service-card">
                <div className="flex size-11 items-center justify-center rounded-full bg-secondary text-primary"><Icon size={20} /></div>
                <p className="mt-8 text-[10px] font-semibold uppercase tracking-[.16em] text-muted-foreground">{tag}</p>
                <h3 className="mt-3 font-serif text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p>
                <a href="#appointment" className="mt-7 inline-flex items-center text-xs font-semibold">Learn more <ArrowUpRight className="ml-1" size={14} /></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="story" className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
          <div>
            <p className="eyebrow text-primary-foreground/65">Our philosophy</p>
            <h2 className="mt-5 max-w-lg font-serif text-4xl leading-tight tracking-[-.03em] sm:text-5xl">Beautifully considered. <em className="text-accent">Naturally you.</em></h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-primary-foreground/70">We believe the best dentistry is personal. That means taking the time to listen, explain clearly, and create care that feels as good as it looks.</p>
            <div className="mt-9 grid max-w-md gap-4 sm:grid-cols-2">
              <div className="border-l border-primary-foreground/25 pl-4">
                <p className="font-serif text-lg">Unhurried visits</p>
                <p className="mt-1 text-xs leading-5 text-primary-foreground/65">Plenty of time for questions and conversation.</p>
              </div>
              <div className="border-l border-primary-foreground/25 pl-4">
                <p className="font-serif text-lg">Modern comfort</p>
                <p className="mt-1 text-xs leading-5 text-primary-foreground/65">Thoughtful technology, gentle techniques.</p>
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] bg-accent/12 p-7 sm:p-10">
            <div className="flex items-center justify-between border-b border-primary-foreground/20 pb-5">
              <span className="font-serif text-2xl">The Gorantla Standard</span>
              <Sparkles size={21} />
            </div>
            <div className="space-y-6 pt-7">
              <div>
                <p className="text-xs uppercase tracking-[.14em] text-primary-foreground/55">01 / Listen first</p>
                <p className="mt-2 text-sm leading-6 text-primary-foreground/80">Your goals, concerns, and comfort shape every recommendation.</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[.14em] text-primary-foreground/55">02 / Show the why</p>
                <p className="mt-2 text-sm leading-6 text-primary-foreground/80">Clear explanations and visual tools, never confusing jargon.</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[.14em] text-primary-foreground/55">03 / Keep it human</p>
                <p className="mt-2 text-sm leading-6 text-primary-foreground/80">Warm care from a team who remembers your name.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="journal" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary/80 px-3.5 py-1 text-xs font-medium text-primary mb-3">
              <Sparkles size={13} /> Patient Testimonials
            </div>
            <p className="eyebrow">Patient Feedback</p>
            <h2 className="mt-2 font-serif text-4xl tracking-[-.03em] sm:text-5xl">Kind words, <em className="text-primary">honestly.</em></h2>
            <p className="mt-2 text-xs text-muted-foreground">
              What patients say about Gorantla Multi Speciality Dental Clinic in Vizianagaram.
            </p>
          </div>
          {displayReviews.length > 3 && (
            <div className="flex gap-2">
              <button onClick={previousTestimonial} className="rounded-full border border-border p-3 transition-colors hover:border-primary hover:text-primary" aria-label="Previous testimonial"><ChevronLeft size={18} /></button>
              <button onClick={nextTestimonial} className="rounded-full border border-border p-3 transition-colors hover:border-primary hover:text-primary" aria-label="Next testimonial"><ChevronRight size={18} /></button>
            </div>
          )}
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {displayReviews.slice(0, 6).map((item, index) => (
            <div
              key={index}
              className="testimonial-card text-left transition-all hover:shadow-md border border-border/80 rounded-2xl p-6 bg-card"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-1 text-primary">
                  {Array.from({ length: item.rating || 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  {item.source || 'Verified'}
                </span>
              </div>
              <p className="mt-6 font-serif text-lg leading-relaxed">&quot;{item.quote}&quot;</p>
              <div className="mt-8 border-t border-border/60 pt-4">
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Appointment & Contact Section */}
      <BookingSection />

      {/* Footer */}
      <footer className="mx-auto flex max-w-7xl flex-col gap-8 px-5 pb-10 pt-4 text-sm lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div>
          <a href="#top" className="font-serif text-xl inline-flex items-center gap-2">
            <img src="/images/dr-anand-logo.jpg" alt="Gorantla Logo" className="size-7 rounded-full object-cover shadow-sm border border-primary/20" />
            GORANTLA MULTI SPECIALITY DENTAL CLINIC
          </a>
          <p className="mt-2 text-xs text-muted-foreground">
            Satya Sai Complex, Raja Bazaar / A.G. Road, Vizianagaram, AP 535002<br />
            Phone: <a href={callUrl} className="hover:text-primary underline">+91 89222 31777</a>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={callUrl} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary hover:bg-primary/20">
              <Phone size={12} /> Call Clinic
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-500/20">
              <MessageCircle size={12} /> WhatsApp
            </a>
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-foreground hover:bg-secondary/80">
              <Navigation size={12} className="text-primary" /> Get Directions
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-muted-foreground">
          <a href="#care" className="hover:text-foreground">Our care</a>
          <a href="#story" className="hover:text-foreground">Our story</a>
          <a href={callUrl} className="hover:text-foreground"><Phone className="mr-1 inline" size={13} /> +91 89222 31777</a>
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground inline-flex items-center">
            Directions <ExternalLink size={11} className="ml-1" />
          </a>
        </div>

        <p className="text-xs text-muted-foreground">© 2026 GORANTLA MULTI SPECIALITY DENTAL CLINIC</p>
      </footer>
    </main>
  )
}
