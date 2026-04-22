'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ContactPage = () => {
  const router = useRouter()
  const locale = 'zh' // 这里应该从router获取，暂时硬编码
  const [loading, setLoading] = useState(true)
  const [contactData, setContactData] = useState({
    email: 'zhangsan@pku.edu.cn',
    address: {
      zh: '北京市海淀区颐和园路5号北京大学化学楼A区301室',
      en: 'Room 301, Building A, Chemistry Building, Peking University, No. 5 Yiheyuan Road, Haidian District, Beijing'
    },
    lat: '39.9872',
    lng: '116.3123'
  })

  useEffect(() => {
    // 从API加载数据
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin?action=getContact')
        const data = await response.json()
        if (data.success && data.data) {
          setContactData(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch contact data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>
  }

  // 安全获取数据
  const safeGetLocale = (obj: any, defaultValue: string = '') => {
    if (!obj) return defaultValue
    if (obj[locale]) return obj[locale]
    return defaultValue
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-primary mb-8">
        {locale === 'zh' ? '联系我们' : 'Contact'}
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* 联系信息 */}
        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {locale === 'zh' ? '联系方式' : 'Contact Information'}
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-700 mb-2">
                {locale === 'zh' ? '工作邮箱' : 'Email'}
              </h3>
              <p className="text-gray-600">
                {contactData?.email || 'email@example.com'}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-700 mb-2">
                {locale === 'zh' ? '单位实验室地址' : 'Laboratory Address'}
              </h3>
              <p className="text-gray-600">
                {safeGetLocale(contactData?.address, '地址')}
              </p>
            </div>
          </div>
        </div>

        {/* 地图 */}
        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {locale === 'zh' ? '实验室位置' : 'Laboratory Location'}
          </h2>
          <div className="aspect-video bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
            {/* 这里嵌入百度地图，暂时用占位符 */}
            <p className="text-gray-500 text-center">
              {locale === 'zh' ? '百度地图' : 'Baidu Map'}
            </p>
          </div>
          <div className="mt-4 text-sm text-gray-500 text-center">
            {locale === 'zh' ? '北京大学化学学院' : 'College of Chemistry, Peking University'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
