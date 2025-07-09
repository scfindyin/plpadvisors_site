// Import Next.js Link component for navigation
import Link from "next/link"
// Import icons from Lucide React
import { Phone, Mail, MapPin } from "lucide-react"

// Footer component that appears on every page
export default function Footer() {
  // Get current year for copyright notice
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto py-12 md:py-16 px-4 md:px-6">
        {/* Using CSS Grid with explicit column templates for precise control */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-x-8"
          style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
        >
          {/* Column 1 - Company Information */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-4">Retirement Lifestyle Advisors</h3>
            <div className="space-y-4">
              {/* Michigan office address */}
              <div className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1 text-primary flex-shrink-0" />
                <span className="text-sm">
                  961 Four Mile Road
                  <br />
                  Grand Rapids, MI 49544
                </span>
              </div>
              {/* Florida office address */}
              <div className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1 text-primary flex-shrink-0" />
                <span className="text-sm">
                  3801 PGA Boulevard, Suite 600
                  <br />
                  Palm Beach Gardens, FL 33410
                </span>
              </div>
            </div>
          </div>

          {/* Column 2 - Contact Information */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <div className="space-y-4">
              {/* Phone number with clickable link */}
              <div className="flex items-start">
                <Phone size={16} className="mr-2 mt-1 text-primary flex-shrink-0" />
                <a href="tel:8669213613" className="text-sm hover:text-primary">
                  866-921-3613
                </a>
              </div>
              {/* Email address with clickable link */}
              <div className="flex items-start">
                <Mail size={16} className="mr-2 mt-1 text-primary flex-shrink-0" />
                <a href="mailto:info@retirementlifestyleadvisors.com" className="text-sm hover:text-primary">
                  info@retirementlifestyleadvisors.com
                </a>
              </div>
            </div>
          </div>

          {/* Column 3 - Legal Links */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <div className="space-y-4">
              {/* Privacy Policy link */}
              <div className="flex items-start">
                <span className="text-sm">
                  <Link href="/privacy-policy" className="hover:text-primary">
                    Privacy Policy
                  </Link>
                </span>
              </div>
              {/* Terms of Use link */}
              <div className="flex items-start">
                <span className="text-sm">
                  <Link href="/terms-of-use" className="hover:text-primary">
                    Terms of Use
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright notice */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Retirement Lifestyle Advisors - A PLP Services LLC Company. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
