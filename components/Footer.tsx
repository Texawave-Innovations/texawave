import Link from "next/link";
import Image from "next/image";

const servicesColumn = [
  { label: "Software & AI Solutions", href: "/software-iot" },
  { label: "Product Engineering", href: "/product-engineering" },
  { label: "Procurement Services", href: "/procurement" },
  { label: "Manufacturing Support", href: "/manufacturing-support" },
];

const resourcesColumn = [
  { label: "Case Studies", href: "/case-studies" },
  { label: "Blog", href: "/blog" },
];

const companyColumn = [
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
];

export function Footer() {
  return (
    <footer className="bg-[#f8fafc] dark:bg-bg-primary border-t border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 font-sans">
      {/* 4-Column Grid Layout */}
      <div className="mx-auto w-full max-w-[1400px] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8 px-[clamp(1rem,4vw,4rem)] py-14">
        {/* Column 1: Services */}
        <div>
          <h3 className="mb-4 font-semibold text-slate-800 dark:text-white text-[16px] font-display">Services</h3>
          <div className="flex flex-col gap-2">
            {servicesColumn.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="text-[15px] text-slate-600 dark:text-slate-400 hover:text-[#3FAE49] dark:hover:text-[#8CC63F] transition-colors duration-150"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Column 2: Resources */}
        <div>
          <h3 className="mb-4 font-semibold text-slate-800 dark:text-white text-[16px] font-display">Resources</h3>
          <div className="flex flex-col gap-2">
            {resourcesColumn.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="text-[15px] text-slate-600 dark:text-slate-400 hover:text-[#3FAE49] dark:hover:text-[#8CC63F] transition-colors duration-150"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Column 3: Company */}
        <div>
          <h3 className="mb-4 font-semibold text-slate-800 dark:text-white text-[16px] font-display">Company</h3>
          <div className="flex flex-col gap-2">
            {companyColumn.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="text-[15px] text-slate-600 dark:text-slate-400 hover:text-[#3FAE49] dark:hover:text-[#8CC63F] transition-colors duration-150"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Column 4: Contact Us */}
        <div className="col-span-2 sm:col-span-1">
          <h3 className="mb-4 font-semibold text-slate-800 dark:text-white text-[16px] font-display">Contact Us</h3>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-1">Phone</span>
            <a
              href="tel:+918680845604"
              className="text-[15px] text-slate-600 dark:text-slate-400 hover:text-[#3FAE49] dark:hover:text-[#8CC63F] block mb-4 font-medium transition-colors duration-150"
            >
              +91 8680845604
            </a>

            <span className="text-[13px] font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-1">Email</span>
            <a
              href="mailto:contact@texawave.com"
              className="text-[15px] text-slate-600 dark:text-slate-400 hover:text-[#3FAE49] dark:hover:text-[#8CC63F] block font-medium transition-colors duration-150"
            >
              contact@texawave.com
            </a>
          </div>
        </div>
      </div>

      {/* Social Icons & Policy Links Area */}
      <div className="border-t border-slate-200 dark:border-white/5 bg-[#f8fafc] dark:bg-bg-secondary">
        {/* Social Icons Row */}
        <div className="flex justify-center items-center gap-6 py-6">
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/company/109956903/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:scale-110 transition-transform duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#0A66C2] hover:opacity-85 transition-opacity">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          {/* YouTube */}
          <a
            href="https://youtube.com/@texawaveinnovations?si=ql2sYALoSyE0s6mr"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="hover:scale-110 transition-transform duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#FF0000] hover:opacity-85 transition-opacity">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
          {/* Instagram */}
          <a
            href="https://www.instagram.com/texawaveinnovations/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:scale-110 transition-transform duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 hover:opacity-85 transition-opacity" style={{ fill: 'url(#instagram-gradient)' }}>
              <defs>
                <radialGradient id="instagram-gradient" cx="30%" cy="107%" r="130%" fx="30%" fy="107%" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#fdf497" />
                  <stop offset="5%" stopColor="#fdf497" />
                  <stop offset="45%" stopColor="#fd5949" />
                  <stop offset="60%" stopColor="#d6249f" />
                  <stop offset="90%" stopColor="#285AEB" />
                </radialGradient>
              </defs>
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
            </svg>
          </a>
          {/* Facebook */}
          <a
            href="https://www.facebook.com/profile.php?id=61590668282253"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:scale-110 transition-transform duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#1877F2] hover:opacity-85 transition-opacity">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
            </svg>
          </a>
          {/* X (formerly Twitter) */}
          <a
            href="https://x.com/Texawave"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="hover:scale-110 transition-transform duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-black dark:text-white hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Dark Copyright Section (Bottom) */}
      <div className="bg-[#0a0b0e] py-8 border-t border-slate-800">
        <div className="flex flex-col items-center justify-center">
          <Link href="/" className="mb-4 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:rounded">
            <Image
              src="/texawave_logo.webp"
              alt="Texawave"
              width={120}
              height={36}
              className="h-9 w-auto object-contain"
            />
          </Link>
          <p className="text-[12px] text-slate-400 text-center px-4">
            &copy; 2026 Texawave Innovations. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}