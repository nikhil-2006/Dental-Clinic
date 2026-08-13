'use client'

import { useState, useEffect } from 'react'
import {
  ArrowUpRight,
  Calendar as CalendarIcon,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  Sparkles,
  Sun,
  Moon,
  X,
} from 'lucide-react'

interface BookingRecord {
  bookingId: string
  patientName: string
  phone: string
  email?: string
  service: string
  preferredDate: string
  preferredTime: string
  notes?: string
  status: string
  createdAt: string
}

const ALL_TIME_SLOTS = [
  { time: '09:00 AM', period: 'morning', label: '09:00 AM - 09:45 AM' },
  { time: '10:30 AM', period: 'morning', label: '10:30 AM - 11:15 AM' },
  { time: '11:30 AM', period: 'morning', label: '11:30 AM - 12:15 PM' },
  { time: '02:00 PM', period: 'evening', label: '02:00 PM - 02:45 PM' },
  { time: '04:30 PM', period: 'evening', label: '04:30 PM - 05:15 PM' },
  { time: '06:00 PM', period: 'evening', label: '06:00 PM - 06:45 PM' },
  { time: '07:30 PM', period: 'evening', label: '07:30 PM - 08:15 PM' },
]

const SERVICES_LIST = [
  'General Consultation & Checkup',
  'Root Canal Treatment (RCT)',
  'Teeth Cleaning & Scaling',
  'Tooth Extraction & Surgery',
  'Dental Crowns & Implants',
  'Cosmetic Dentistry & Smile Design',
]

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function BookingSection() {
  const [activeTab, setActiveTab] = useState<'book' | 'lookup'>('book')

  // Helper for tomorrow's date string
  const getTomorrowStr = () => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  }

  // Booking Form State
  const [patientName, setPatientName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [service, setService] = useState(SERVICES_LIST[0])
  const [preferredDate, setPreferredDate] = useState(getTomorrowStr())
  const [preferredTime, setPreferredTime] = useState('10:30 AM')
  const [notes, setNotes] = useState('')

  // Single Popup Calendar Modal State
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [calendarViewDate, setCalendarViewDate] = useState(new Date())
  const [bookedSlotsForDate, setBookedSlotsForDate] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  // Status & Confirmation State
  const [emailSentTo, setEmailSentTo] = useState('')
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null)
  const [copiedId, setCopiedId] = useState(false)

  // Lookup State
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<BookingRecord[]>([])
  const [searchError, setSearchError] = useState('')

  // Fetch booked slots whenever preferredDate changes or popup opens
  useEffect(() => {
    async function fetchSlotAvailability() {
      if (!preferredDate) return
      setLoadingSlots(true)
      try {
        const res = await fetch(`/api/appointments?date=${preferredDate}`)
        const data = await res.json()
        if (res.ok && data.success) {
          setBookedSlotsForDate(data.bookedSlots || [])
        } else {
          setBookedSlotsForDate([])
        }
      } catch {
        setBookedSlotsForDate([])
      } finally {
        setLoadingSlots(false)
      }
    }
    fetchSlotAvailability()
  }, [preferredDate, calendarOpen])

  // Format YYYY-MM-DD for display (e.g., "Saturday, Aug 15, 2026")
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return ''
    const parts = dateStr.split('-')
    if (parts.length !== 3) return dateStr
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Handle Form Submission & Email Dispatch
  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingSubmit(true)
    setErrorMsg('')

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          phone,
          email,
          service,
          preferredDate,
          preferredTime,
          notes,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setConfirmedBooking(data.booking)
        setEmailSentTo(data.emailSentTo || email)
      } else {
        setErrorMsg(data.message || 'Failed to complete booking. Please select another slot.')
      }
    } catch {
      setErrorMsg('Network error. Please check connection and retry.')
    } finally {
      setLoadingSubmit(false)
    }
  }

  // Handle Lookup
  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setSearching(true)
    setSearchError('')
    setSearchResults([])

    try {
      const isBookingId = searchQuery.trim().toUpperCase().startsWith('ANAND-')
      const param = isBookingId
        ? `bookingId=${encodeURIComponent(searchQuery.trim())}`
        : `phone=${encodeURIComponent(searchQuery.trim())}`

      const res = await fetch(`/api/appointments?${param}`)
      const data = await res.json()

      if (res.ok && data.success) {
        if (data.booking) {
          setSearchResults([data.booking])
        } else if (data.bookings) {
          if (data.bookings.length === 0) {
            setSearchError('No appointments found for this search query.')
          } else {
            setSearchResults(data.bookings)
          }
        }
      } else {
        setSearchError(data.message || 'No booking records found.')
      }
    } catch {
      setSearchError('Failed to retrieve appointment information.')
    } finally {
      setSearching(false)
    }
  }

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  const resetForm = () => {
    setConfirmedBooking(null)
    setPatientName('')
    setPhone('')
    setEmail('')
    setNotes('')
    setPreferredDate(getTomorrowStr())
    setPreferredTime('10:30 AM')
  }

  // Calendar Math Helpers
  const year = calendarViewDate.getFullYear()
  const month = calendarViewDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonthCount = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => {
    setCalendarViewDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCalendarViewDate(new Date(year, month + 1, 1))
  }

  const todayStr = new Date().toISOString().split('T')[0]

  const isDatePast = (dayNum: number) => {
    const checkDate = new Date(year, month, dayNum)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return checkDate < today
  }

  const formatDayString = (dayNum: number) => {
    const m = String(month + 1).padStart(2, '0')
    const d = String(dayNum).padStart(2, '0')
    return `${year}-${m}-${d}`
  }

  // Slots grouped by period
  const morningSlots = ALL_TIME_SLOTS.filter((s) => s.period === 'morning')
  const eveningSlots = ALL_TIME_SLOTS.filter((s) => s.period === 'evening')

  const isSlotBooked = (timeStr: string) => bookedSlotsForDate.includes(timeStr)

  const handleSelectSlotInCalendar = (timeStr: string) => {
    setPreferredTime(timeStr)
    setCalendarOpen(false) // Automatically close popup on slot selection
  }

  return (
    <section id="appointment" className="mx-3 sm:mx-5 mb-16 rounded-[1.5rem] sm:rounded-[2rem] bg-secondary px-4 py-10 sm:px-10 sm:py-16 lg:mx-auto lg:max-w-7xl lg:px-16 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
        {/* Left Column: Information & Controls */}
        <div>
          <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3.5 py-1 text-xs font-semibold text-primary w-fit mb-4">
            <CalendarIcon size={14} /> Instant Booking with SMTP Email
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-[-.03em]">
            Your best smile starts with a <em className="text-primary">conversation.</em>
          </h2>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
            Schedule your appointment with Dr. Anand. A confirmation email will be automatically dispatched to your inbox.
          </p>

          <div className="mt-6 sm:mt-8 space-y-3.5 text-xs sm:text-sm text-muted-foreground">
            <p className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 shrink-0 text-primary" size={17} />
              <span>
                <strong className="text-foreground font-medium block">Clinic Location:</strong>
                Besides Gayatri Hospital, Ayyakoneru Gumchi Road, Vizianagaram
              </span>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="shrink-0 text-primary" size={17} />
              <span>
                <strong className="text-foreground font-medium">Phone / Helpline:</strong> +91 891 255 0148
              </span>
            </p>
            <p className="flex items-center gap-2.5">
              <Clock className="shrink-0 text-primary" size={17} />
              <span>
                <strong className="text-foreground font-medium">Doctor Availability:</strong> Mon–Sun (By Appointment)
              </span>
            </p>
          </div>

          {/* Fully Responsive Mobile Tab Toggle Buttons */}
          <div className="mt-8 grid grid-cols-2 rounded-xl sm:rounded-full bg-background p-1 border border-border w-full sm:w-fit gap-1">
            <button
              onClick={() => setActiveTab('book')}
              className={`rounded-lg sm:rounded-full py-2.5 sm:py-2 px-3 sm:px-5 text-xs font-semibold transition-all text-center ${
                activeTab === 'book' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Book Appointment
            </button>
            <button
              onClick={() => setActiveTab('lookup')}
              className={`rounded-lg sm:rounded-full py-2.5 sm:py-2 px-3 sm:px-5 text-xs font-semibold transition-all text-center ${
                activeTab === 'lookup' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Check Status
            </button>
          </div>
        </div>

        {/* Right Column: Booking Form or Status Lookup */}
        <div className="rounded-2xl bg-card p-4 sm:p-8 shadow-md border border-border relative">
          {activeTab === 'book' && (
            <>
              {confirmedBooking ? (
                /* Confirmation Card & Email Sent Indicator */
                <div className="space-y-5 sm:space-y-6">
                  <div className="flex items-center gap-3 rounded-xl bg-emerald-500/10 p-3.5 sm:p-4 border border-emerald-500/20 text-emerald-700">
                    <CheckCircle2 size={22} className="shrink-0 text-emerald-600" />
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base">Appointment Successfully Confirmed!</h3>
                      <p className="text-xs">Your visit with Dr. Anand has been scheduled.</p>
                    </div>
                  </div>

                  {/* Automatic Email Confirmation Banner */}
                  <div className="flex items-center gap-2.5 rounded-xl bg-blue-500/10 p-3.5 border border-blue-500/20 text-blue-800 text-xs">
                    <Mail size={18} className="text-blue-600 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold block">Confirmation Email Sent</span>
                      <span className="text-[11px] opacity-80 truncate block">Sent to: <strong>{emailSentTo}</strong></span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-secondary/40 p-4 sm:p-5 space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-border/80 pb-3">
                      <span className="text-muted-foreground">Booking Reference ID</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary text-xs sm:text-sm">{confirmedBooking.bookingId}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyId(confirmedBooking.bookingId)}
                          className="rounded p-1 text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
                          title="Copy Booking ID"
                        >
                          {copiedId ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Patient Name</span>
                        <span className="font-semibold text-foreground truncate block">{confirmedBooking.patientName}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Contact Phone</span>
                        <span className="font-semibold text-foreground">{confirmedBooking.phone}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Appointment Date</span>
                        <span className="font-semibold text-foreground">{formatDateDisplay(confirmedBooking.preferredDate)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Time Slot</span>
                        <span className="font-semibold text-primary font-medium">{confirmedBooking.preferredTime}</span>
                      </div>
                    </div>

                    <div className="border-t border-border/80 pt-3">
                      <span className="text-muted-foreground block text-[11px]">Treatment / Service</span>
                      <span className="font-semibold text-foreground">{confirmedBooking.service}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Please arrive 5–10 minutes prior to your slot at Ayya Koneru, Vizianagaram. Need to change? Call{' '}
                    <strong className="text-foreground">+91 891 255 0148</strong>.
                  </p>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full rounded-full bg-primary py-3 text-xs font-semibold text-primary-foreground transition-all hover:opacity-95"
                  >
                    Book Another Appointment
                  </button>
                </div>
              ) : (
                /* Booking Form */
                <form onSubmit={handleBookSubmit} className="space-y-4 sm:space-y-5">
                  <div className="border-b border-border pb-3">
                    <h3 className="font-serif text-xl sm:text-2xl text-foreground">Schedule Your Visit</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Select treatment and pick date &amp; slot in the popup calendar.</p>
                  </div>

                  {errorMsg && (
                    <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive flex items-center justify-between">
                      <span>{errorMsg}</span>
                      <button type="button" onClick={() => setErrorMsg('')}><X size={14} /></button>
                    </div>
                  )}

                  {/* Treatment / Service Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Select Treatment / Service <span className="text-primary">*</span>
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      {SERVICES_LIST.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* SINGLE UNIFIED POPUP CALENDAR SELECTION FIELD - Fully Mobile Responsive */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Appointment Date &amp; Free Slot <span className="text-primary">*</span>
                    </label>
                    <div
                      onClick={() => setCalendarOpen(true)}
                      className="cursor-pointer rounded-xl border border-border bg-background p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 transition-all hover:border-primary/60 hover:shadow-sm group"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                          <CalendarIcon size={16} className="text-primary shrink-0" />
                          <span>{formatDateDisplay(preferredDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-primary font-medium mt-1">
                          <Clock size={14} className="shrink-0" />
                          <span>Selected Slot: <strong className="font-bold">{preferredTime}</strong></span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setCalendarOpen(true)
                        }}
                        className="w-full sm:w-auto rounded-full bg-primary px-4 py-2.5 sm:py-2 text-xs font-semibold text-primary-foreground shadow-sm group-hover:opacity-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <CalendarIcon size={14} /> Change Date &amp; Slot
                      </button>
                    </div>
                  </div>

                  {/* Patient Info Fields */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Patient Full Name <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Phone Number <span className="text-primary">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Email Address <span className="text-primary">*</span> <span className="text-muted-foreground font-normal">(Receives confirmation email)</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="patient@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Notes / Symptoms <span className="text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Describe any tooth pain, sensitive area, or notes..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loadingSubmit}
                    className="w-full rounded-full bg-primary px-5 sm:px-6 py-3.5 text-xs font-semibold text-primary-foreground transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loadingSubmit ? (
                      <>
                        <Loader2 className="animate-spin" size={16} /> Scheduling &amp; Dispatching Email...
                      </>
                    ) : (
                      <>
                        Confirm &amp; Send Email <ArrowUpRight size={16} />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-muted-foreground">
                    Instant confirmation. Free booking &amp; automatic email dispatch via SMTP.
                  </p>
                </form>
              )}
            </>
          )}

          {activeTab === 'lookup' && (
            /* Lookup Existing Booking Form - Mobile Responsive */
            <div className="space-y-5">
              <div className="border-b border-border pb-3">
                <h3 className="font-serif text-xl sm:text-2xl text-foreground">Find Your Booking</h3>
                <p className="text-xs text-muted-foreground mt-1">Enter your Booking Reference ID (e.g. ANAND-123456) or Phone number.</p>
              </div>

              <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  required
                  placeholder="Booking ID or Phone Number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="w-full sm:w-auto rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shrink-0 flex items-center justify-center gap-1.5"
                >
                  {searching ? <Loader2 className="animate-spin" size={15} /> : <Search size={15} />} Search
                </button>
              </form>

              {searchError && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
                  {searchError}
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="space-y-3 pt-1">
                  <h4 className="text-xs font-semibold text-foreground">Matching Bookings ({searchResults.length}):</h4>
                  {searchResults.map((b) => (
                    <div key={b.bookingId} className="rounded-xl border border-border bg-secondary/50 p-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between border-b border-border/80 pb-2">
                        <span className="font-mono font-bold text-primary text-xs sm:text-sm">{b.bookingId}</span>
                        <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 uppercase">
                          {b.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div><span className="text-muted-foreground">Patient:</span> <strong className="text-foreground truncate block">{b.patientName}</strong></div>
                        <div><span className="text-muted-foreground">Phone:</span> {b.phone}</div>
                        <div><span className="text-muted-foreground">Date:</span> {formatDateDisplay(b.preferredDate)}</div>
                        <div><span className="text-muted-foreground">Time:</span> {b.preferredTime}</div>
                      </div>
                      <div className="text-[11px] border-t border-border/60 pt-1.5">
                        <span className="text-muted-foreground">Service:</span> {b.service}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* POPUP CALENDAR MODAL / OVERLAY - Fully Mobile Responsive & Touch Friendly */}
      {calendarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl bg-card p-4 sm:p-6 shadow-2xl border border-border animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-3 sm:pb-4">
              <div>
                <h3 className="font-serif text-lg sm:text-xl text-foreground flex items-center gap-2">
                  <CalendarIcon className="text-primary shrink-0" size={18} /> Popup Calendar &amp; Slots
                </h3>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                  Pick date &amp; tap a free slot for Dr. Anand
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCalendarOpen(false)}
                className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors shrink-0"
                aria-label="Close calendar"
              >
                <X size={20} />
              </button>
            </div>

            {/* Calendar Controls */}
            <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between px-1 sm:px-2">
                <span className="font-serif text-base sm:text-lg font-medium text-foreground">
                  {MONTH_NAMES[month]} {year}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={prevMonth}
                    className="rounded-lg border border-border p-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={nextMonth}
                    className="rounded-lg border border-border p-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Day Labels Grid */}
              <div className="grid grid-cols-7 text-center text-[10px] sm:text-[11px] font-semibold text-muted-foreground border-b border-border/50 pb-2">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              {/* Dates Grid */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {/* Empty cells before month starts */}
                {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="h-9 sm:h-10" />
                ))}

                {/* Date cells */}
                {Array.from({ length: daysInMonthCount }).map((_, idx) => {
                  const dayNum = idx + 1
                  const dateStr = formatDayString(dayNum)
                  const isSelected = preferredDate === dateStr
                  const disabled = isDatePast(dayNum)
                  const isToday = dateStr === todayStr

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      disabled={disabled}
                      onClick={() => setPreferredDate(dateStr)}
                      className={`relative flex h-9 sm:h-10 flex-col items-center justify-center rounded-xl text-xs font-medium transition-all ${
                        disabled
                          ? 'opacity-30 cursor-not-allowed text-muted-foreground'
                          : isSelected
                          ? 'bg-primary text-primary-foreground font-bold shadow-md'
                          : isToday
                          ? 'border-2 border-primary text-primary font-semibold hover:bg-secondary'
                          : 'hover:bg-secondary text-foreground'
                      }`}
                    >
                      <span>{dayNum}</span>
                      {!disabled && !isSelected && (
                        <span className="size-1 rounded-full bg-emerald-500 mt-0.5" title="Available" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* SPECIALIST FREE TIME SLOTS SECTION FOR SELECTED DATE */}
            <div className="mt-5 border-t border-border pt-3.5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Clock size={14} className="text-primary shrink-0" /> Free Time Slots for {formatDateDisplay(preferredDate)}
                  </h4>
                  <span className="text-[11px] text-muted-foreground">
                    Tap any free time slot to select &amp; confirm
                  </span>
                </div>
                {loadingSlots && <Loader2 className="animate-spin text-primary" size={14} />}
              </div>

              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {/* Morning Slots */}
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 mb-2">
                    <Sun size={13} /> Morning Session (09:00 AM – 12:15 PM)
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {morningSlots.map((s) => {
                      const booked = isSlotBooked(s.time)
                      const isSelected = preferredTime === s.time
                      return (
                        <button
                          key={s.time}
                          type="button"
                          disabled={booked}
                          onClick={() => handleSelectSlotInCalendar(s.time)}
                          className={`rounded-xl px-2 py-2 text-center text-xs transition-all border ${
                            booked
                              ? 'bg-muted/50 text-muted-foreground line-through cursor-not-allowed border-transparent'
                              : isSelected
                              ? 'bg-primary text-primary-foreground font-bold border-primary shadow-sm ring-2 ring-primary/40'
                              : 'bg-background hover:bg-secondary border-border text-foreground hover:border-primary/40'
                          }`}
                        >
                          <div>{s.time}</div>
                          <div className="text-[9px] opacity-80">{booked ? 'Booked' : 'Free'}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Evening Slots */}
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 mb-2">
                    <Moon size={13} /> Afternoon &amp; Evening Session (02:00 PM – 08:15 PM)
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {eveningSlots.map((s) => {
                      const booked = isSlotBooked(s.time)
                      const isSelected = preferredTime === s.time
                      return (
                        <button
                          key={s.time}
                          type="button"
                          disabled={booked}
                          onClick={() => handleSelectSlotInCalendar(s.time)}
                          className={`rounded-xl px-2 py-2 text-center text-xs transition-all border ${
                            booked
                              ? 'bg-muted/50 text-muted-foreground line-through cursor-not-allowed border-transparent'
                              : isSelected
                              ? 'bg-primary text-primary-foreground font-bold border-primary shadow-sm ring-2 ring-primary/40'
                              : 'bg-background hover:bg-secondary border-border text-foreground hover:border-primary/40'
                          }`}
                        >
                          <div>{s.time}</div>
                          <div className="text-[9px] opacity-80">{booked ? 'Booked' : 'Free'}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-t border-border pt-3.5 gap-2">
              <div className="text-xs text-muted-foreground text-center sm:text-left">
                Selected: <strong className="text-foreground">{formatDateDisplay(preferredDate)}</strong> at <strong className="text-primary">{preferredTime}</strong>
              </div>
              <button
                type="button"
                onClick={() => setCalendarOpen(false)}
                className="w-full sm:w-auto rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
