# SwiftRide – Deployment & Setup Guide

## Running Locally

```bash
cd swiftride
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Demo Accounts

| Role  | Email                 | Password  |
|-------|-----------------------|-----------|
| Admin | admin@swiftride.ng    | admin123  |
| User  | demo@swiftride.ng     | demo123   |

## Deploying to Vercel

1. Push the `swiftride` folder to GitHub:

```bash
git init
git add .
git commit -m "initial commit: SwiftRide transport booking app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/swiftride.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com), click "Add New Project"
3. Import your GitHub repo
4. Vercel auto-detects Vite — just click **Deploy**
5. Your app will be live at `https://swiftride.vercel.app`

## Project Structure

```
src/
├── assets/              # Static assets
├── components/
│   └── common/          # Navbar, Footer
├── context/             # AuthContext, ThemeContext, BookingContext
├── data/                # buses.js, mock data
├── layouts/             # MainLayout, DashboardLayout, AdminLayout
├── pages/
│   ├── admin/           # Admin panel pages
│   ├── dashboard/       # User dashboard pages
│   ├── Home.jsx
│   ├── BusListing.jsx
│   ├── BusDetails.jsx
│   ├── SeatSelection.jsx
│   ├── Checkout.jsx
│   ├── BookingSuccess.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   └── NotFound.jsx
├── utils/               # helpers.js
├── App.jsx
├── main.jsx
└── index.css
```

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- React Router DOM v7
- Framer Motion (animations)
- React Hot Toast (notifications)
- React Icons
- QRCode.react (ticket QR code)
- LocalStorage (data persistence)
- Context API (state management)
