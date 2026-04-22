'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const Footer = () => {
  const [footerData, setFooterData] = useState({
    groupInfo: {
      name: { zh: '学术课题组', en: 'Academic Research Group' },
      college: { zh: '北京大学化学学院', en: 'College of Chemistry, Peking University' }
    },
    quickLinks: [
      { id: 1, name: { zh: '首页', en: 'Home' }, href: '/' },
      { id: 2, name: { zh: '个人简介', en: 'About' }, href: '/about' },
      { id: 3, name: { zh: '研究方向', en: 'Research' }, href: '/research' },
      { id: 4, name: { zh: '联系我们', en: 'Contact' }, href: '/contact' }
    ],
    contactInfo: {
      address: { zh: '北京市海淀区颐和园路5号', en: 'No. 5 Yiheyuan Road, Haidian District, Beijing' },
      email: 'contact@example.com'
    },
    copyright: {
      zh: '© 2026 化学生物学与药物化学课题组. 保留所有权利.',
      en: '© 2026 Chemical Biology and Medicinal Chemistry Research Group. All rights reserved.'
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 从API获取页尾数据
    const fetchFooterData = async () => {
      try {
        const response = await fetch('/api/admin?action=getNavigation')
        const result = await response.json()
        if (result.success) {
          setFooterData(result.data.footer)
        }
      } catch (error) {
        console.error('Failed to fetch footer data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFooterData()
  }, [])

  const locale = 'zh'

  if (loading) {
    return null // 或者返回一个加载指示器
  }

  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">{footerData.groupInfo.name[locale as keyof typeof footerData.groupInfo.name]}</h3>
            <p className="text-sm text-gray-600">
              {footerData.groupInfo.college[locale as keyof typeof footerData.groupInfo.college]}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-4">快速链接</h3>
            <ul className="space-y-2 text-sm">
              {footerData.quickLinks.map((link) => (
                <li key={link.id}>
                  <Link href={link.href} className="text-gray-600 hover:text-primary">
                    {link.name[locale as keyof typeof link.name]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-4">联系信息</h3>
            <p className="text-sm text-gray-600 mb-2">
              地址：{footerData.contactInfo.address[locale as keyof typeof footerData.contactInfo.address]}
            </p>
            <p className="text-sm text-gray-600">
              邮箱：{footerData.contactInfo.email}
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>{footerData.copyright[locale as keyof typeof footerData.copyright]}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
