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
    quote: "Extremely satisfied with the dental care at Dr. Anand's Dental Clinic. Prompt service with minimal waiting time and very reasonable pricing.",
    name: 'Sravani P.',
    detail: 'Verified Justdial Patient • Ayya Koneru',
    rating: 5,
    source: 'Justdial',
  },
  {
    quote: 'Dr. Anand is very gentle and explains every step of the procedure clearly. Clean, hygienic setup and excellent root canal treatment.',
    name: 'Rajesh Kumar V.',
    detail: 'Verified Justdial Patient • Vizianagaram',
    rating: 5,
    source: 'Justdial',
  },
  {
    quote: 'Best dental clinic in Ayya Koneru area. Highly recommended for families seeking quality and compassionate dental care.',
    name: 'Venkatesh M.',
    detail: 'Verified Justdial Patient • Vizianagaram',
    rating: 5,
    source: 'Justdial',
  },
  {
    quote: 'Immediate appointment availability and friendly staff. Made my dental cleaning experience completely stress-free.',
    name: 'Anusha R.',
    detail: 'Verified Justdial Patient • Ayya Koneru',
    rating: 5,
    source: 'Justdial',
  },
]

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [submitted, setSubmitted] = useState(false)

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
        console.error('Error loading dynamic Justdial reviews:', err)
      } finally {
        setLoadingReviews(false)
      }
    }
    fetchJustdialData()
  }, [])

  const displayReviews = reviews.length > 0 ? reviews : defaultReviews

  const nextTestimonial = () => setActiveTestimonial((current) => (current + 1) % displayReviews.length)
  const previousTestimonial = () => setActiveTestimonial((current) => (current - 1 + displayReviews.length) % displayReviews.length)

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#top" className="flex items-center gap-2.5 font-serif text-xl tracking-tight" aria-label="Dr. Anand's Dental Clinic home">
            <img src="/images/dr-anand-logo.jpg" alt="Dr. Anand's Dental Clinic Logo" className="size-9 rounded-full object-cover shadow-sm border border-primary/30" />
            Dr. Anand&apos;s <span className="font-sans text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Dental Clinic</span>
          </a>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            <a href="#care" className="nav-link">Our care</a>
            <a href="#story" className="nav-link">Our story</a>
            <a href="#journal" className="nav-link">Reviews</a>
          </nav>
          <a href="#appointment" className="hidden rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 md:block">Book a visit <ArrowUpRight className="ml-1 inline" size={14} /></a>
          <button className="rounded-full p-2 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
        </div>
        {menuOpen && <nav className="border-t border-border bg-background px-5 py-4 md:hidden" aria-label="Mobile navigation"><div className="flex flex-col gap-4"><a href="#care" onClick={() => setMenuOpen(false)}>Our care</a><a href="#story" onClick={() => setMenuOpen(false)}>Our story</a><a href="#journal" onClick={() => setMenuOpen(false)}>Reviews</a><a href="#appointment" onClick={() => setMenuOpen(false)} className="font-semibold text-primary">Book a visit <ArrowUpRight className="ml-1 inline" size={14} /></a></div></nav>}
      </header>

      <section id="top" className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-36 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:pb-28 lg:pt-48">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary/80 px-3.5 py-1 text-xs font-medium text-primary mb-4">
            <Sparkles size={13} /> 5.0 Star Dental Practice in Vizianagaram
          </div>
          <h1 className="mt-2 font-serif text-5xl leading-[.98] tracking-[-.04em] text-pretty sm:text-7xl">Feel good about your <em className="text-primary">smile.</em></h1>
          <p className="mt-7 max-w-md text-base leading-7 text-muted-foreground">Modern dentistry, thoughtfully delivered. At Dr. Anand&apos;s Dental Clinic, every visit is designed to feel calm, personal, and entirely about you.</p>
          <div className="mt-9 flex flex-wrap items-center gap-4"><a href="#appointment" className="rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg">Book Appointment <ArrowUpRight className="ml-2 inline" size={16} /></a><a href="#care" className="rounded-full border border-border px-6 py-3.5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary">Explore Services</a></div>
          <div className="mt-12 flex items-center gap-7 border-t border-border pt-6">
            <div>
              <p className="font-serif text-2xl">{justdialInfo.rating.toFixed(1)} ★</p>
              <div className="mt-1 flex text-primary" aria-label={`${justdialInfo.rating} out of 5 stars`}>
                <Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" />
              </div>
            </div>
            <div className="h-9 w-px bg-border" />
            <div>
              <p className="text-xs font-semibold text-foreground">Justdial Verified Listing</p>
              <a href={justdialInfo.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs text-muted-foreground hover:text-primary underline underline-offset-2">
                {justdialInfo.totalRatings} ratings in Vizianagaram <ExternalLink size={11} className="ml-1" />
              </a>
            </div>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-lg lg:ml-auto"><div className="hero-image-wrap"><img src="/images/luma-dental-hero.png" alt="Patient relaxing in Dr. Anand's Dental Clinic" className="h-full w-full object-cover" /></div><div className="absolute -bottom-5 -left-3 flex max-w-[210px] items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-xl sm:-left-7"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"><Check size={17} /></span><p className="text-xs font-medium leading-5">Your comfort comes first, always.</p></div></div>
      </section>

      <section className="border-y border-border bg-secondary/45"><div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-8 px-5 py-8 lg:px-8"><div><p className="eyebrow">Trusted Dental Care in Vizianagaram</p></div><div className="flex gap-10 sm:gap-16"><div><p className="font-serif text-3xl">15+</p><p className="mt-1 text-xs text-muted-foreground">Years of care</p></div><div><p className="font-serif text-3xl">100+</p><p className="mt-1 text-xs text-muted-foreground">Justdial reviews</p></div><div><p className="font-serif text-3xl">5.0/5</p><p className="mt-1 text-xs text-muted-foreground">Patient rating</p></div></div></div></section>

      <section id="care" className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32"><div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]"><div><p className="eyebrow">Our care</p><h2 className="mt-5 max-w-sm font-serif text-4xl leading-tight tracking-[-.03em] sm:text-5xl">Care that sees the <em className="text-primary">whole you.</em></h2><p className="mt-6 max-w-sm text-sm leading-6 text-muted-foreground">Whether you are here for a routine clean or a complete smile refresh, we make space for what matters to you.</p><a href="#appointment" className="mt-8 inline-flex items-center text-sm font-semibold text-primary">View all services <ArrowUpRight className="ml-2" size={16} /></a></div><div className="grid gap-4 sm:grid-cols-3">{services.map(({ title, copy, tag, icon: Icon }) => <article key={title} className="service-card"><div className="flex size-11 items-center justify-center rounded-full bg-secondary text-primary"><Icon size={20} /></div><p className="mt-8 text-[10px] font-semibold uppercase tracking-[.16em] text-muted-foreground">{tag}</p><h3 className="mt-3 font-serif text-2xl">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p><a href="#appointment" className="mt-7 inline-flex items-center text-xs font-semibold">Learn more <ArrowUpRight className="ml-1" size={14} /></a></article>)}</div></div></section>

      <section id="story" className="bg-primary text-primary-foreground"><div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-32"><div><p className="eyebrow text-primary-foreground/65">Our philosophy</p><h2 className="mt-5 max-w-lg font-serif text-4xl leading-tight tracking-[-.03em] sm:text-5xl">Beautifully considered. <em className="text-accent">Naturally you.</em></h2><p className="mt-6 max-w-md text-sm leading-7 text-primary-foreground/70">We believe the best dentistry is personal. That means taking the time to listen, explain clearly, and create care that feels as good as it looks.</p><div className="mt-9 grid max-w-md gap-4 sm:grid-cols-2"><div className="border-l border-primary-foreground/25 pl-4"><p className="font-serif text-lg">Unhurried visits</p><p className="mt-1 text-xs leading-5 text-primary-foreground/65">Plenty of time for questions and conversation.</p></div><div className="border-l border-primary-foreground/25 pl-4"><p className="font-serif text-lg">Modern comfort</p><p className="mt-1 text-xs leading-5 text-primary-foreground/65">Thoughtful technology, gentle techniques.</p></div></div></div><div className="rounded-[2rem] bg-accent/12 p-7 sm:p-10"><div className="flex items-center justify-between border-b border-primary-foreground/20 pb-5"><span className="font-serif text-2xl">The Dr. Anand standard</span><Sparkles size={21} /></div><div className="space-y-6 pt-7"><div><p className="text-xs uppercase tracking-[.14em] text-primary-foreground/55">01 / Listen first</p><p className="mt-2 text-sm leading-6 text-primary-foreground/80">Your goals, concerns, and comfort shape every recommendation.</p></div><div><p className="text-xs uppercase tracking-[.14em] text-primary-foreground/55">02 / Show the why</p><p className="mt-2 text-sm leading-6 text-primary-foreground/80">Clear explanations and visual tools, never confusing jargon.</p></div><div><p className="text-xs uppercase tracking-[.14em] text-primary-foreground/55">03 / Keep it human</p><p className="mt-2 text-sm leading-6 text-primary-foreground/80">Warm care from a team who remembers your name.</p></div></div></div></div></section>

      <section id="journal" className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary/80 px-3.5 py-1 text-xs font-medium text-primary mb-3">
              <Sparkles size={13} /> Live Justdial Fetch
            </div>
            <p className="eyebrow">Patient Feedback</p>
            <h2 className="mt-2 font-serif text-4xl tracking-[-.03em] sm:text-5xl">Kind words, <em className="text-primary">honestly.</em></h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Automatically fetched from our live profile on{' '}
              <a href={justdialInfo.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline hover:opacity-80">
                Justdial Vizianagaram <ExternalLink size={11} className="inline ml-0.5" />
              </a>
            </p>
          </div>
          {displayReviews.length > 3 && (
            <div className="flex gap-2">
              <button onClick={previousTestimonial} className="rounded-full border border-border p-3 transition-colors hover:border-primary hover:text-primary" aria-label="Previous testimonial"><ChevronLeft size={18} /></button>
              <button onClick={nextTestimonial} className="rounded-full border border-border p-3 transition-colors hover:border-primary hover:text-primary" aria-label="Next testimonial"><ChevronRight size={18} /></button>
            </div>
          )}
        </div>

        {loadingReviews ? (
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-border bg-card p-6 min-h-[220px]">
                <div className="h-4 w-24 bg-muted rounded mb-6"></div>
                <div className="h-4 w-full bg-muted rounded mb-2"></div>
                <div className="h-4 w-4/5 bg-muted rounded mb-6"></div>
                <div className="h-3 w-1/3 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : (
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
                    {item.source || 'Justdial'}
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
        )}
      </section>

      <BookingSection />

      <footer className="mx-auto flex max-w-7xl flex-col gap-8 px-5 pb-10 pt-4 text-sm lg:flex-row lg:items-end lg:justify-between lg:px-8"><div><a href="#top" className="font-serif text-xl inline-flex items-center gap-2"><img src="/images/dr-anand-logo.jpg" alt="Dr. Anand's Logo" className="size-7 rounded-full object-cover shadow-sm border border-primary/20" /> Dr. Anand&apos;s Dental Clinic</a><p className="mt-2 text-xs text-muted-foreground">Ayya Koneru, Vizianagaram</p></div><div className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-muted-foreground"><a href="#care" className="hover:text-foreground">Our care</a><a href="#story" className="hover:text-foreground">Our story</a><a href="mailto:hello@dranandsdental.com" className="hover:text-foreground"><Mail className="mr-1 inline" size={13} /> Email us</a><a href={justdialInfo.url} target="_blank" rel="noopener noreferrer" className="hover:text-foreground inline-flex items-center">Justdial Profile <ExternalLink size={11} className="ml-1" /></a></div><p className="text-xs text-muted-foreground">© 2026 Dr. Anand&apos;s Dental Clinic</p></footer>
    </main>
  )
}
