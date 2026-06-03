# Hilabi Parking Pass — Setup

## Prerequisites
- Node.js 18+
- PostgreSQL running locally

## 1. Database

Create the database:
```
createdb parking_passes
```

## 2. Server

```bash
cd server
cp .env.example .env        # fill in DATABASE_URL, JWT_SECRET
npm install
npm run db:setup            # creates tables + default users
npm run dev                 # starts on port 3001
```

Default logins created by setup:
| Username | Password | Role |
|---|---|---|
| admin | admin123 | Admin |
| scanner | scanner123 | Scanner |

## 3. Client

```bash
cd client
cp .env.example .env.local  # set NEXT_PUBLIC_API_URL if needed
npm install
npm run dev                 # starts on port 3000
```

## URLs

| URL | Who uses it |
|---|---|
| http://localhost:3000 | Users — self-register & get QR pass |
| http://localhost:3000/login | Admin & Scanner login |
| http://localhost:3000/scanner | Scanner — scan QR at gate |
| http://localhost:3000/admin | Admin — dashboard & manage passes |
| http://localhost:3000/admin/generate | Admin — generate pass with duration |

## OTP (Development)

OTPs are printed to the **server console** (no SMS sent yet).
To enable real SMS, replace the `console.log` in `server/src/utils/otp.js` with your Twilio integration.
