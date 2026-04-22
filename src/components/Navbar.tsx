'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const pathname = usePathname()
  const locale = 'zh' as 'zh' | 'en'

  const navLinks = [
    { href: '/', label: { zh: '首页', en: 'Home' } },
    { href: '/about', label: { zh: '个人简介', en: 'About' } },
    { href: '/research', label: { zh: '研究方向', en: 'Research' } },
    { href: '/team', label: { zh: '研究团队', en: 'Team' } },
    { href: '/projects', label: { zh: '科研项目', en: 'Projects' } },
    { href: '/publications', label: { zh: '学术论文', en: 'Publications' } },
    { href: '/contact', label: { zh: '联系我们', en: 'Contact' } },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              学术课题组
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium hover:text-primary transition-colors ${pathname === link.href ? 'text-primary' : 'text-gray-600'}`}
              >
                {link.label[locale]}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => console.log('Switching to Chinese')}
              className={`px-3 py-1 text-sm font-medium rounded ${locale === 'zh' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              中
            </button>
            <button
              onClick={() => console.log('Switching to English')}
              className={`px-3 py-1 text-sm font-medium rounded ${locale === 'en' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              En
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar