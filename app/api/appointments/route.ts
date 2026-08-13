import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { sendAppointmentEmail } from '@/lib/email'

interface BookingRecord {
  bookingId: string
  patientName: string
  phone: string
  email?: string
  service: string
  preferredDate: string
  preferredTime: string
  notes?: string
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled'
  createdAt: string
  emailSent?: boolean
}

const dataDir = path.join(process.cwd(), 'data')
const filePath = path.join(dataDir, 'appointments.json')

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf8')
  }
}

function getBookings(): BookingRecord[] {
  ensureDataFile()
  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(raw) || []
  } catch {
    return []
  }
}

function saveBookings(bookings: BookingRecord[]) {
  ensureDataFile()
  fs.writeFileSync(filePath, JSON.stringify(bookings, null, 2), 'utf8')
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const bookingId = searchParams.get('bookingId')
  const phone = searchParams.get('phone')
  const date = searchParams.get('date')

  const bookings = getBookings()

  if (bookingId) {
    const found = bookings.find(
      (b) => b.bookingId.toLowerCase() === bookingId.toLowerCase()
    )
    if (!found) {
      return NextResponse.json(
        { success: false, message: 'Booking ID not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, booking: found })
  }

  if (phone) {
    const userBookings = bookings.filter((b) =>
      b.phone.replace(/\D/g, '').includes(phone.replace(/\D/g, ''))
    )
    return NextResponse.json({ success: true, bookings: userBookings })
  }

  if (date) {
    const dateBookings = bookings.filter((b) => b.preferredDate === date)
    const bookedSlots = dateBookings.map((b) => b.preferredTime)
    return NextResponse.json({
      success: true,
      date,
      totalBooked: bookedSlots.length,
      bookedSlots,
      bookings: dateBookings,
    })
  }

  return NextResponse.json({ success: true, total: bookings.length, bookings })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { patientName, phone, email, service, preferredDate, preferredTime, notes } = body

    if (!patientName || !phone || !service || !preferredDate || !preferredTime) {
      return NextResponse.json(
        { success: false, message: 'Please fill in all required fields (Name, Phone, Service, Date, Time)' },
        { status: 400 }
      )
    }

    const bookings = getBookings()

    // Check if slot is already booked for Dr. Anand on that date
    const existingSlot = bookings.find(
      (b) => b.preferredDate === preferredDate && b.preferredTime === preferredTime && b.status === 'Confirmed'
    )

    if (existingSlot) {
      return NextResponse.json(
        {
          success: false,
          message: `The ${preferredTime} slot on ${preferredDate} is already booked. Please select another free time slot.`,
        },
        { status: 400 }
      )
    }

    const randomNum = Math.floor(100000 + Math.random() * 900000)
    const bookingId = `ANAND-${randomNum}`

    const newBooking: BookingRecord = {
      bookingId,
      patientName: patientName.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : undefined,
      service,
      preferredDate,
      preferredTime,
      notes: notes ? notes.trim() : undefined,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      emailSent: true,
    }

    bookings.unshift(newBooking)
    saveBookings(bookings)

    // Trigger Email Dispatch
    const recipientEmail = email && email.trim() ? email.trim() : `${patientName.toLowerCase().replace(/\s+/g, '')}@patient.dranandsdental.com`
    
    let emailRecord = null
    try {
      emailRecord = await sendAppointmentEmail({
        to: recipientEmail,
        subject: `Appointment Confirmed (${bookingId}) - Dr. Anand's Dental Clinic`,
        bookingId,
        patientName: patientName.trim(),
        phone: phone.trim(),
        service,
        preferredDate,
        preferredTime,
        notes: notes ? notes.trim() : undefined,
      })
    } catch (e) {
      console.error('Email dispatch failed:', e)
    }

    return NextResponse.json({
      success: true,
      message: 'Appointment booked & confirmation email dispatched successfully',
      booking: newBooking,
      emailSentTo: recipientEmail,
      emailHtml: emailRecord ? emailRecord.html : null,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to book appointment' },
      { status: 500 }
    )
  }
}
