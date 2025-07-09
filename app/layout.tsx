// Import necessary React types and Next.js metadata functionality
import type React from "react"
import type { Metadata } from "next"
// Import Google Fonts for typography
import { Inter, Playfair_Display } from "next/font/google"
// Import global CSS styles
import "./globals.css"
// Import custom components
import { ThemeProvider } from "@/components/theme-provider"
import Footer from "@/components/footer"

// Configure Inter font (sans-serif) with CSS variable for use throughout the app
const inter = Inter({
  subsets: ["latin"], // Only load Latin character subset for performance
  variable: "--font-inter", // CSS variable name for use in Tailwind classes
})

// Configure Playfair Display font (serif) for headings
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

// Define metadata for SEO and browser tab information
export const metadata: Metadata = {
  title: "New Retirement Rules™ | Financial Education Classes",
  description:
    "Learn essential retirement strategies for today's economy. Register for our New Retirement Rules™ class designed for adults 55-70.",
    generator: 'v0.dev' // Indicates this was generated with v0.dev
}

// Root layout component - wraps ALL pages in the application
// This is a Next.js 13+ App Router feature that provides the HTML structure
export default function RootLayout({
  children, // This prop contains the page content that will be rendered
}: Readonly<{
  children: React.ReactNode // TypeScript type for React components
}>) {
  return (
    // HTML document structure
    <html lang="en" suppressHydrationWarning>
      {/* suppressHydrationWarning prevents warnings about server/client mismatch for theme */}
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        {/* Apply font variables and set default font family */}
        
        {/* ThemeProvider enables dark/light mode switching */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {/* Flexbox layout to ensure footer stays at bottom */}
          <div className="flex min-h-screen flex-col">
            {/* Main content area that grows to fill available space */}
            <main className="flex-1">{children}</main>
            {/* Footer component that appears on every page */}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'