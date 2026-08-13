# Dr. Anand's Dental Clinic Website

A modern, responsive Next.js web application for **Dr. Anand's Dental Clinic** located in Ayya Koneru, Vizianagaram. Features real-time dynamic Justdial reviews integration, interactive popup calendar appointment booking with live slot availability, automated SMTP confirmation emails, and booking lookup.

---

## 🌟 Key Features

- **Brand Customization**: Custom logo emblem and favicon throughout the site.
- **Dynamic Justdial Reviews**: Server-side API endpoint (`/api/reviews`) dynamically fetching and caching reviews from the official Justdial Vizianagaram listing.
- **Interactive Popup Calendar**: Patient selects appointment dates & specialist free time slots (Morning: 9am–12:15pm, Evening: 2pm–8:15pm) with live booked vs free slot indicators.
- **Automated SMTP Email Dispatch**: Built-in Nodemailer integration sending HTML booking receipts directly to patient inboxes.
- **Booking Status Lookup**: Patients can check their scheduled appointment status anytime using their Booking Reference ID (e.g. `ANAND-839201`) or Phone Number.
- **Mobile Responsive Design**: Fully optimized touch targets, fluid layouts, and responsive modal dialogues.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Components & Icons**: TailwindCSS & [Lucide React](https://lucide.dev/)
- **Email Sending**: [Nodemailer](https://nodemailer.com/) (SMTP transport)
- **Deployment**: [Vercel](https://vercel.com/) / Netlify / Node.js Server

---

## 🚀 Quick Start (Local Development)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your Gmail address and 16-digit Gmail App Password:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=your-actual-email@gmail.com
   SMTP_PASS=your-16-digit-app-password
   SMTP_FROM="Dr. Anand's Dental Clinic <your-actual-email@gmail.com>"
   ```

3. **Run local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 📦 Production Deployment

### Option 1: Deploy to Vercel (Recommended - 1-Click)

1. Push this repository to **GitHub / GitLab / Bitbucket**.
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your repository.
4. Under **Environment Variables**, add:
   - `SMTP_USER` = your-email@gmail.com
   - `SMTP_PASS` = your-16-digit-app-password
   - `SMTP_HOST` = smtp.gmail.com
   - `SMTP_PORT` = 465
   - `SMTP_SECURE` = true
5. Click **Deploy**. Your site will be live on a custom `.vercel.app` URL!

### Option 2: Build & Run on custom Node.js Server

```bash
npm run build
npm start
```

---

## 📄 License

© 2026 Dr. Anand's Dental Clinic. All Rights Reserved.
