import Link from 'next/link';
import React from 'react'

const FooterSection = () => {
  return (
    <footer className="border-t border-gray-200 py-20">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
        <Link href="/" className="text-2xl font-bold" scroll={false}>
          UNISTAY
        </Link>

        <hr className="my-8 border-gray-300" />

        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 text-sm text-gray-600">
          <p>&copy; UNISTAY. All rights reserved</p>
          <Link href="/privacy-policy" className="underline hover:text-gray-900" scroll={false}>
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="underline hover:text-gray-900" scroll={false}>
            Terms of Service
          </Link>
          <Link href="/cookie-policy" className="underline hover:text-gray-900" scroll={false}>
            Cookie Policy
          </Link>
        </div>
      </div>
    </footer>
  )
};

export default FooterSection;