'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RichEditor from '@/components/RichEditor'

const HomepageManagementPage = () => {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [formData, setFormData] = useState({
    groupName: {
      zh: '化学生物学与药物化学课题组',
      en: 'Chemical Biology and Medicinal Chemistry Research Group'
    },
    piName: {
      zh: '张三 教授',
      en: 'Prof. Zhang San'
    },
    college: {
      zh: '北京大学化学学院',
      en: 'College of Chemistry, Peking University'
    },
    address: {
      zh: '北京市海淀区颐和园路5号',
      en: 'No. 5 Yiheyuan Road, Haidian District, Beijing'
    },
    researchOverview: {
      zh: '我们致力于化学生物学与药物化学的交叉研究，探索生命过程中的分子机制，开发新型治疗药物。',
      en: 'We are dedicated to interdisciplinary research in chemical biology and medicinal chemistry, exploring molecular mechanisms in life processes and developing novel therapeutic drugs.'
    },
    researchDirections: {
      zh: '主要研究方向包括：天然产物全合成、化学生物学探针开发、药物靶点发现与验证、创新药物设计与合成。',
      en: 'Our main research directions include: total synthesis of natural products, development of chemical biology probes, drug target discovery and validation, and innovative drug design and synthesis.'
    },
    researchImage: '',
    news: [
      {
        id: 1,
        date: '2026-04-15',
        title: { zh: '课题组在Nature发表重要研究成果', en: 'Research group publishes important findings in Nature' },
        description: { zh: '关于新型催化剂的研究取得重大突破', en: 'Major breakthrough in novel catalyst research' }
      },
      {
        id: 2,
        date: '2026-04-10',
        title: { zh: 'PI应邀在国际会议上做主旨报告', en: 'PI invited to give keynote speech at international conference' },
        description: { zh: '在第25届国际化学会议上分享研究成果', en: 'Sharing research results at the 25th International Chemistry Conference' }
      }
    ]
  })

  useEffect(() => {
    // 从API加载数据
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin?action=getHomepage')
        const data = await response.json()
        if (data.success) {
          // 确保数据格式正确
          const safeData = {
            ...data.data,
            researchDirections: data.data.researchDirections || {
              zh: '主要研究方向包括：天然产物全合成、化学生物学探针开发、药物靶点发现与验证、创新药物设计与合成。',
              en: 'Our main research directions include: total synthesis of natural products, development of chemical biology probes, drug target discovery and validation, and innovative drug design and synthesis.'
            },
            researchImage: data.data.researchImage || ''
          }
          setFormData(safeData)
        }
      } catch (error) {
        console.error('Failed to fetch homepage data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const handleInputChange = (field: string, lang: string, value: string) => {
    setFormData(prev => {
      const fieldValue = prev[field as keyof typeof prev];
      // 检查字段是否为对象类型（有zh和en属性）
      if (typeof fieldValue === 'object' && fieldValue !== null && 'zh' in fieldValue && 'en' in fieldValue) {
        return {
          ...prev,
          [field]: {
            ...fieldValue,
            [lang]: value
          }
        };
      }
      // 对于非对象类型字段，直接赋值
      return {
        ...prev,
        [field]: value
      };
    });
  }

  const handleNewsChange = (index: number, field: string, lang: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      news: prev.news.map((item, i) => 
        i === index 
          ? { 
              ...item, 
              [field]: {
                zh: (item[field as keyof typeof item] as any)?.zh || '',
                en: (item[field as keyof typeof item] as any)?.en || '',
                [lang]: value
              }
            }
          : item
      )
    }))
  }

  const addNews = () => {
    setFormData(prev => ({
      ...prev,
      news: [...prev.news, {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        title: { zh: '', en: '' },
        description: { zh: '', en: '' }
      }]
    }))
  }

  const removeNews = (id: number) => {
    setFormData(prev => ({
      ...prev,
      news: prev.news.filter(item => item.id !== id)
    }))
  }

  const handleResearchImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        // 创建FormData对象
        const formData = new FormData()
        formData.append('file', file)
        
        // 发送文件上传请求
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            // 使用服务器返回的URL
            setFormData(prev => ({
              ...prev,
              researchImage: data.url
            }))
          } else {
            alert('上传失败：' + data.message)
          }
        } else {
          alert('上传失败：服务器错误')
        }
      } catch (error) {
        console.error('Failed to upload image:', error)
        alert('上传失败：网络错误')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // 由于包含图片上传，需要使用FormData
      const formDataToSend = new FormData()
      formDataToSend.append('action', 'updateHomepage')
      formDataToSend.append('data', JSON.stringify(formData))

      const response = await fetch('/api/admin', {
        method: 'POST',
        body: formDataToSend
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        alert('首页数据更新成功！')
        router.push('/admin')
        // 重新加载数据以显示最新更改
        const fetchData = async () => {
          try {
            const response = await fetch('/api/admin?action=getHomepage')
            const data = await response.json()
            if (data.success) {
              // 确保数据格式正确
              const safeData = {
                ...data.data,
                researchDirections: data.data.researchDirections || {
                  zh: '主要研究方向包括：天然产物全合成、化学生物学探针开发、药物靶点发现与验证、创新药物设计与合成。',
                  en: 'Our main research directions include: total synthesis of natural products, development of chemical biology probes, drug target discovery and validation, and innovative drug design and synthesis.'
                },
                researchImage: data.data.researchImage || ''
              }
              setFormData(safeData)
            }
          } catch (error) {
            console.error('Failed to fetch homepage data:', error)
          }
        }
        fetchData()
      } else {
        alert('更新失败：' + result.message)
      }
    } catch (error) {
      console.error('Failed to update homepage data:', error)
      alert('更新失败：服务器错误')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">首页管理</h1>

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
          {/* 课题组基本信息 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">课题组基本信息</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">课题组名称</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">中文</label>
                    <input
                      type="text"
                      value={formData.groupName.zh}
                      onChange={(e) => handleInputChange('groupName', 'zh', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">英文</label>
                    <input
                      type="text"
                      value={formData.groupName.en}
                      onChange={(e) => handleInputChange('groupName', 'en', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">PI信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">中文</label>
                    <input
                      type="text"
                      value={formData.piName.zh}
                      onChange={(e) => handleInputChange('piName', 'zh', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">英文</label>
                    <input
                      type="text"
                      value={formData.piName.en}
                      onChange={(e) => handleInputChange('piName', 'en', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">所属学院</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">中文</label>
                    <input
                      type="text"
                      value={formData.college.zh}
                      onChange={(e) => handleInputChange('college', 'zh', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">英文</label>
                    <input
                      type="text"
                      value={formData.college.en}
                      onChange={(e) => handleInputChange('college', 'en', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">地址</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">中文</label>
                    <input
                      type="text"
                      value={formData.address.zh}
                      onChange={(e) => handleInputChange('address', 'zh', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">英文</label>
                    <input
                      type="text"
                      value={formData.address.en}
                      onChange={(e) => handleInputChange('address', 'en', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">研究概述</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">中文</label>
                    <textarea
                      value={formData.researchOverview.zh}
                      onChange={(e) => handleInputChange('researchOverview', 'zh', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">英文</label>
                    <textarea
                      value={formData.researchOverview.en}
                      onChange={(e) => handleInputChange('researchOverview', 'en', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">核心研究方向</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">中文</label>
                    <textarea
                      value={formData.researchDirections.zh}
                      onChange={(e) => handleInputChange('researchDirections', 'zh', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">英文</label>
                    <textarea
                      value={formData.researchDirections.en}
                      onChange={(e) => handleInputChange('researchDirections', 'en', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">研究方向示意图</h3>
                {formData.researchImage ? (
                  <div className="relative mb-4">
                    <img 
                      src={formData.researchImage} 
                      alt="研究方向示意图" 
                      className="w-full max-w-md h-auto rounded-md"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          researchImage: ''
                        }))
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleResearchImageUpload}
                      className="hidden"
                      id="research-image-upload"
                    />
                    <label 
                      htmlFor="research-image-upload"
                      className="cursor-pointer"
                    >
                      <p className="text-gray-500">点击或拖拽上传图片</p>
                      <p className="text-xs text-gray-400 mt-1">支持 JPG、PNG，建议尺寸 800x600</p>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 科研动态 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">科研动态</h2>
              <button
                type="button"
                onClick={addNews}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                添加动态
              </button>
            </div>

            {formData.news.map((news, index) => (
              <div key={news.id} className="border border-gray-200 rounded-md p-4 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-800">动态 {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeNews(news.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    删除
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
                  <input
                    type="date"
                    value={news.date}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      news: prev.news.map((item, i) => 
                        i === index ? { ...item, date: e.target.value } : item
                      )
                    }))}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">标题</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">中文</label>
                      <input
                        type="text"
                        value={news.title.zh}
                        onChange={(e) => handleNewsChange(index, 'title', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">英文</label>
                      <input
                        type="text"
                        value={news.title.en}
                        onChange={(e) => handleNewsChange(index, 'title', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">描述</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">中文</label>
                      <textarea
                        value={news.description.zh}
                        onChange={(e) => handleNewsChange(index, 'description', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">英文</label>
                      <textarea
                        value={news.description.en}
                        onChange={(e) => handleNewsChange(index, 'description', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-end">
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

export default HomepageManagementPage
