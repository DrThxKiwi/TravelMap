'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const NavigationManagementPage = () => {
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    navigation: [
      {
        id: 1,
        name: {
          zh: '首页',
          en: 'Home'
        },
        href: '/'
      },
      {
        id: 2,
        name: {
          zh: '关于我们',
          en: 'About'
        },
        href: '/about'
      },
      {
        id: 3,
        name: {
          zh: '研究方向',
          en: 'Research'
        },
        href: '/research'
      },
      {
        id: 4,
        name: {
          zh: '研究团队',
          en: 'Team'
        },
        href: '/team'
      },
      {
        id: 5,
        name: {
          zh: '科研项目',
          en: 'Projects'
        },
        href: '/projects'
      },
      {
        id: 6,
        name: {
          zh: '学术论文',
          en: 'Publications'
        },
        href: '/publications'
      },
      {
        id: 7,
        name: {
          zh: '实验平台',
          en: 'Facilities'
        },
        href: '/facilities'
      },
      {
        id: 8,
        name: {
          zh: '联系我们',
          en: 'Contact'
        },
        href: '/contact'
      }
    ],
    footer: {
      groupInfo: {
        name: {
          zh: '学术课题组',
          en: 'Academic Research Group'
        },
        college: {
          zh: '北京大学化学学院',
          en: 'College of Chemistry, Peking University'
        }
      },
      quickLinks: [
        {
          id: 1,
          name: {
            zh: '首页',
            en: 'Home'
          },
          href: '/'
        },
        {
          id: 2,
          name: {
            zh: '个人简介',
            en: 'About'
          },
          href: '/about'
        },
        {
          id: 3,
          name: {
            zh: '研究方向',
            en: 'Research'
          },
          href: '/research'
        },
        {
          id: 4,
          name: {
            zh: '联系我们',
            en: 'Contact'
          },
          href: '/contact'
        }
      ],
      contactInfo: {
        address: {
          zh: '北京市海淀区颐和园路5号',
          en: 'No. 5 Yiheyuan Road, Haidian District, Beijing'
        },
        email: 'contact@example.com'
      },
      copyright: {
        zh: '© 2026 化学生物学与药物化学课题组. 保留所有权利.',
        en: '© 2026 Chemical Biology and Medicinal Chemistry Research Group. All rights reserved.'
      },
      disclaimer: {
        zh: '本网站内容仅供参考，如有任何问题，请联系我们。',
        en: 'The content of this website is for reference only. If you have any questions, please contact us.'
      }
    }
  })
  const router = useRouter()

  useEffect(() => {
    // 从API加载数据
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin?action=getNavigation')
        const data = await response.json()
        if (data.success) {
          setFormData(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch navigation data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleNavigationChange = (id: number, field: string, lang: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      navigation: prev.navigation.map(item => 
        item.id === id 
          ? { 
              ...item, 
              [field]: field === 'name' 
                ? { ...item.name, [lang]: value }
                : value 
            }
          : item
      )
    }))
  }

  const handleFooterChange = (field: string, subField: string, lang: string, value: string) => {
    setFormData(prev => {
      // 处理版权信息和免责声明字段
      if (field === 'copyright' || field === 'disclaimer') {
        return {
          ...prev,
          footer: {
            ...prev.footer,
            [field]: {
              ...prev.footer[field as keyof typeof prev.footer],
              [subField]: value
            }
          }
        }
      }
      // 处理其他字段
      return {
        ...prev,
        footer: {
          ...prev.footer,
          [field]: {
            ...prev.footer[field as keyof typeof prev.footer],
            [subField]: field === 'contactInfo' && subField === 'email' 
              ? value 
              : {
                  zh: (prev.footer[field as keyof typeof prev.footer][subField as keyof typeof prev.footer[keyof typeof prev.footer]] as any)?.zh || '',
                  en: (prev.footer[field as keyof typeof prev.footer][subField as keyof typeof prev.footer[keyof typeof prev.footer]] as any)?.en || '',
                  [lang]: value
                }
          }
        }
      }
    })
  }

  const addNavigationItem = () => {
    const newId = Math.max(...formData.navigation.map(item => item.id)) + 1
    setFormData(prev => ({
      ...prev,
      navigation: [...prev.navigation, {
        id: newId,
        name: { zh: '新菜单项', en: 'New Menu Item' },
        href: '/'
      }]
    }))
  }

  const removeNavigationItem = (id: number) => {
    setFormData(prev => ({
      ...prev,
      navigation: prev.navigation.filter(item => item.id !== id)
    }))
  }

  const addQuickLinkItem = () => {
    const newId = Math.max(...formData.footer.quickLinks.map(item => item.id)) + 1
    setFormData(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        quickLinks: [...prev.footer.quickLinks, {
          id: newId,
          name: { zh: '新链接', en: 'New Link' },
          href: '/'
        }]
      }
    }))
  }

  const removeQuickLinkItem = (id: number) => {
    setFormData(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        quickLinks: prev.footer.quickLinks.filter(item => item.id !== id)
      }
    }))
  }

  const handleQuickLinkChange = (id: number, field: string, lang: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        quickLinks: prev.footer.quickLinks.map(item => 
          item.id === id 
            ? { 
                ...item, 
                [field]: field === 'name' 
                  ? { ...item.name, [lang]: value }
                  : value 
              }
            : item
        )
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'updateNavigation',
          data: formData
        })
      })
      const result = await response.json()
      if (result.success) {
        alert('导航与页尾更新成功！')
        router.push('/admin')
      } else {
        alert('更新失败：' + result.message)
      }
    } catch (error) {
      console.error('Failed to update navigation data:', error)
      alert('更新失败：服务器错误')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">导航与页尾管理</h1>

        <div className="mb-6">
          <button 
            type="button" 
            onClick={() => router.push('/admin')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
          >
            ← 返回管理首页
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 导航栏管理 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">导航栏管理</h2>
              <button
                type="button"
                onClick={addNavigationItem}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                添加菜单项
              </button>
            </div>

            {formData.navigation.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-md p-4 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-800">菜单项 {item.id}</h3>
                  <button
                    type="button"
                    onClick={() => removeNavigationItem(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    删除
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">菜单项名称</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={item.name.zh}
                        onChange={(e) => handleNavigationChange(item.id, 'name', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="中文名称"
                      />
                      <input
                        type="text"
                        value={item.name.en}
                        onChange={(e) => handleNavigationChange(item.id, 'name', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="英文名称"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">链接地址</label>
                    <input
                      type="text"
                      value={item.href}
                      onChange={(e) => handleNavigationChange(item.id, 'href', 'zh', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="例如: /home"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 页尾管理 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">页尾管理</h2>

            <div className="space-y-6">
              {/* 课题组信息 */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">课题组信息</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">课题组名称</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={formData.footer.groupInfo.name.zh}
                        onChange={(e) => handleFooterChange('groupInfo', 'name', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="中文名称"
                      />
                      <input
                        type="text"
                        value={formData.footer.groupInfo.name.en}
                        onChange={(e) => handleFooterChange('groupInfo', 'name', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="英文名称"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">学院信息</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={formData.footer.groupInfo.college.zh}
                        onChange={(e) => handleFooterChange('groupInfo', 'college', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="中文学院信息"
                      />
                      <input
                        type="text"
                        value={formData.footer.groupInfo.college.en}
                        onChange={(e) => handleFooterChange('groupInfo', 'college', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="英文学院信息"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 快速链接 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-700">快速链接</h3>
                  <button
                    type="button"
                    onClick={addQuickLinkItem}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                  >
                    添加链接
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.footer.quickLinks.map((link) => (
                    <div key={link.id} className="border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium text-gray-800">链接 {link.id}</h4>
                        <button
                          type="button"
                          onClick={() => removeQuickLinkItem(link.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          删除
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">链接名称</label>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={link.name.zh}
                              onChange={(e) => handleQuickLinkChange(link.id, 'name', 'zh', e.target.value)}
                              className="w-full border border-gray-300 rounded-md p-2"
                              placeholder="中文名称"
                            />
                            <input
                              type="text"
                              value={link.name.en}
                              onChange={(e) => handleQuickLinkChange(link.id, 'name', 'en', e.target.value)}
                              className="w-full border border-gray-300 rounded-md p-2"
                              placeholder="英文名称"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">链接地址</label>
                          <input
                            type="text"
                            value={link.href}
                            onChange={(e) => handleQuickLinkChange(link.id, 'href', 'zh', e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2"
                            placeholder="例如: /home"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 联系信息 */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">联系信息</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={formData.footer.contactInfo.address.zh}
                        onChange={(e) => handleFooterChange('contactInfo', 'address', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="中文地址"
                      />
                      <input
                        type="text"
                        value={formData.footer.contactInfo.address.en}
                        onChange={(e) => handleFooterChange('contactInfo', 'address', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="英文地址"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                    <input
                      type="email"
                      value={formData.footer.contactInfo.email}
                      onChange={(e) => handleFooterChange('contactInfo', 'email', 'zh', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="邮箱地址"
                    />
                  </div>
                </div>
              </div>

              {/* 版权信息 */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">版权信息</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.footer.copyright.zh}
                    onChange={(e) => handleFooterChange('copyright', 'zh', 'zh', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="中文版权信息"
                  />
                  <input
                    type="text"
                    value={formData.footer.copyright.en}
                    onChange={(e) => handleFooterChange('copyright', 'en', 'en', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="英文版权信息"
                  />
                </div>
              </div>

              {/* 免责声明 */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">免责声明</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.footer.disclaimer.zh}
                    onChange={(e) => handleFooterChange('disclaimer', 'zh', 'zh', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="中文免责声明"
                  />
                  <input
                    type="text"
                    value={formData.footer.disclaimer.en}
                    onChange={(e) => handleFooterChange('disclaimer', 'en', 'en', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="英文免责声明"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              保存更改
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NavigationManagementPage
