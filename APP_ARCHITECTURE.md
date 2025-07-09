# PLP Advisors Event Registration Application - Architecture Overview

## Application Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              USER JOURNEY FLOW                                │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   HOME      │───▶│  REGISTER   │───▶│   PAYMENT   │───▶│ THANK YOU   │
│   PAGE      │    │   PAGE      │    │   PAGE      │    │   PAGE      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│Upcoming     │    │Registration │    │Payment      │    │Success      │
│Events       │    │Form         │    │Form         │    │Message      │
│Component    │    │Component    │    │Component    │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│Event        │    │Event        │    │Order        │    │Confirmation │
│Selector     │    │Data         │    │Summary      │    │Email        │
│Component    │    │Validation   │    │Card         │    │(Future)     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              COMPONENT HIERARCHY                              │
└─────────────────────────────────────────────────────────────────────────────────┘

RootLayout (app/layout.tsx)
├── ThemeProvider
├── Main Content Area
│   ├── Home Page (app/page.tsx)
│   │   ├── Hero Section
│   │   ├── UpcomingEvents Component
│   │   ├── Benefits Section
│   │   └── Guarantee Section
│   │
│   ├── Register Page (app/register/page.tsx)
│   │   └── RegistrationForm Component
│   │       ├── EventSelector Component
│   │       ├── Personal Info Fields
│   │       ├── Address Fields
│   │       └── Confirmation Checkbox
│   │
│   ├── Payment Page (app/payment/page.tsx)
│   │   └── PaymentForm Component
│   │       ├── Order Summary
│   │       ├── Billing Information
│   │       └── Payment Information
│   │
│   └── Thank You Page (app/thank-you/page.tsx)
│       └── Success Message
│
└── Footer Component
    ├── Company Information
    ├── Contact Details
    └── Legal Links
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW DIAGRAM                                │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   CLIENT    │    │   SERVER    │    │  DATABASE   │    │  EXTERNAL   │
│  COMPONENTS │    │   ACTIONS   │    │  (SUPABASE) │    │  SERVICES   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│1. User      │───▶│2. Form      │───▶│3. Events    │    │4. Payment   │
│   Input     │    │   Validation│    │   Table     │    │   Processor  │
│             │    │             │    │             │    │   (Stripe)   │
│             │    │             │    │             │    │             │
│5. UI        │◀───│6. Success/  │◀───│7. Updated   │    │8. Email     │
│   Updates   │    │   Error     │    │   Data      │    │   Service   │
│             │    │   Response  │    │             │    │   (Resend)  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## Database Schema

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE SCHEMA                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

EVENTS TABLE
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ id (PK)     │ date        │ location    │ address     │ city        │
│ VARCHAR     │ DATE         │ VARCHAR     │ VARCHAR     │ VARCHAR     │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
│ state       │ zip         │ time        │ created_at  │ updated_at  │
│ VARCHAR     │ VARCHAR     │ VARCHAR     │ TIMESTAMP   │ TIMESTAMP   │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘

REGISTRATIONS TABLE
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ id (PK)     │ event_id    │ first_name  │ last_name   │ address     │
│ VARCHAR     │ VARCHAR(FK) │ VARCHAR     │ VARCHAR     │ VARCHAR     │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
│ city        │ state       │ zip_code    │ phone       │ email       │
│ VARCHAR     │ VARCHAR     │ VARCHAR     │ VARCHAR     │ VARCHAR     │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
│ guest_name  │ status      │ created_at  │ updated_at  │             │
│ VARCHAR     │ VARCHAR     │ TIMESTAMP   │ TIMESTAMP   │             │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘

PAYMENTS TABLE
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ id (PK)     │ registration│ amount      │ status      │ payment     │
│ VARCHAR     │ _id (FK)    │ DECIMAL     │ VARCHAR     │ _method     │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
│ created_at  │ updated_at  │             │             │             │
│ TIMESTAMP   │ TIMESTAMP   │             │             │             │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              TECHNOLOGY STACK                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

FRONTEND
├── Next.js 15 (React Framework)
├── TypeScript (Type Safety)
├── Tailwind CSS (Styling)
├── Radix UI (Component Library)
├── Lucide React (Icons)
├── React Hook Form (Form Management)
└── Zod (Validation)

BACKEND
├── Next.js Server Actions
├── Supabase (Database)
├── PostgreSQL (Database Engine)
└── Server-Side Rendering

DEVELOPMENT
├── ESLint (Code Quality)
├── Prettier (Code Formatting)
├── TypeScript (Type Checking)
└── Next.js Development Server

DEPLOYMENT
├── Vercel (Hosting)
├── Supabase (Database Hosting)
└── Environment Variables
```

## File Structure

```
PLPAdvisorsSite/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with fonts & theme
│   ├── page.tsx                 # Home page
│   ├── register/
│   │   └── page.tsx            # Registration page
│   ├── payment/
│   │   └── page.tsx            # Payment page
│   └── thank-you/
│       └── page.tsx            # Success page
│
├── components/                   # Reusable components
│   ├── ui/                      # Base UI components (Radix)
│   ├── registration-form.tsx    # Registration form
│   ├── payment-form.tsx         # Payment form
│   ├── event-selector.tsx       # Event selection
│   ├── upcoming-events.tsx      # Events display
│   ├── footer.tsx               # Site footer
│   └── theme-provider.tsx       # Theme management
│
├── lib/                         # Utility functions
│   ├── actions.ts               # Server actions
│   ├── utils.ts                 # Helper functions
│   └── supabase/
│       ├── client.ts            # Client-side DB connection
│       └── server.ts            # Server-side DB connection
│
├── public/                      # Static assets
│   ├── logo.png
│   ├── hero-bg.jpg
│   └── NRR-BooksDown.png
│
└── Configuration Files
    ├── package.json             # Dependencies
    ├── tailwind.config.ts       # Tailwind configuration
    ├── tsconfig.json            # TypeScript configuration
    └── next.config.mjs          # Next.js configuration
```

## Key Features & Functionality

### 1. **Event Management**
- Dynamic event fetching from Supabase
- Fallback data for offline scenarios
- Event selection with radio buttons
- Date formatting and display

### 2. **Registration System**
- Multi-step registration process
- Form validation with Zod
- Guest/spouse registration option
- Data persistence across steps

### 3. **Payment Processing**
- Simulated payment processing
- Credit card form validation
- Order summary display
- Payment status tracking

### 4. **User Experience**
- Responsive design (mobile-first)
- Loading states and skeletons
- Error handling and messages
- Smooth navigation flow

### 5. **Data Management**
- Server-side data fetching
- Client-side state management
- Session storage for data persistence
- Database error handling

## Security & Performance

### **Security Measures**
- Server-side validation
- Client-side validation
- Environment variable protection
- Database connection security

### **Performance Optimizations**
- Server-side rendering (SSR)
- Image optimization with Next.js
- Font optimization
- Lazy loading of components
- Database query optimization

### **Error Handling**
- Graceful fallbacks for database failures
- User-friendly error messages
- Console logging for debugging
- Form validation feedback

## Future Enhancements

### **Planned Features**
- Email confirmation system (Resend)
- Real payment processing (Stripe)
- Admin dashboard for event management
- Email marketing integration
- Analytics tracking

### **Technical Improvements**
- Real-time event updates
- Advanced form validation
- Progressive Web App (PWA)
- Performance monitoring
- Automated testing

This architecture provides a solid foundation for the PLP Advisors event registration system, with clear separation of concerns, robust error handling, and scalability for future enhancements. 