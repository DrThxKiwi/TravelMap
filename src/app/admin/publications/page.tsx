'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const PublicationsManagementPage = () => {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [formData, setFormData] = useState({
    publications: [
      {
        id: 1,
        authors: {
          zh: '张三*, 李四, 王五, 赵六',
          en: 'Zhang San*, Li Si, Wang Wu, Zhao Liu'
        },
        title: {
          zh: '化学生物学探针在肿瘤早期诊断中的应用',
          en: 'Application of Chemical Biology Probes in Early Tumor Diagnosis'
        },
        journal: {
          zh: 'Nature',
          en: 'Nature'
        },
        year: '2026',
        volume: '545',
        pages: '123-130',
        doi: '10.1038/nature24000',
        isRepresentative: true,
        isHighImpact: true,
        pdfLink: '#'
      },
      {
        id: 2,
        authors: {
          zh: '李四, 张三*, 钱七',
          en: 'Li Si, Zhang San*, Qian Qi'
        },
        title: {
          zh: '天然产物全合成的新方法',
          en: 'New Methods for Total Synthesis of Natural Products'
        },
        journal: {
          zh: 'Journal of the American Chemical Society',
          en: 'Journal of the American Chemical Society'
        },
        year: '2025',
        volume: '147',
        pages: '4567-4574',
        doi: '10.1021/jacs.5b00000',
        isRepresentative: true,
        isHighImpact: true,
        pdfLink: '#'
      },
      {
        id: 3,
        authors: {
          zh: '王五, 赵六, 张三*',
          en: 'Wang Wu, Zhao Liu, Zhang San*'
        },
        title: {
          zh: '创新药物设计的计算机辅助方法',
          en: 'Computer-Aided Methods for Innovative Drug Design'
        },
        journal: {
          zh: 'Angewandte Chemie International Edition',
          en: 'Angewandte Chemie International Edition'
        },
        year: '2024',
        volume: '63',
        pages: 'e202400000',
        doi: '10.1002/anie.202400000',
        isRepresentative: true,
        isHighImpact: true,
        pdfLink: '#'
      },
      {
        id: 4,
        authors: {
          zh: '赵六, 钱七, 孙八, 张三*',
          en: 'Zhao Liu, Qian Qi, Sun Ba, Zhang San*'
        },
        title: {
          zh: '蛋白质-蛋白质相互作用的化学生物学研究',
          en: 'Chemical Biology Study of Protein-Protein Interactions'
        },
        journal: {
          zh: 'Chemical Science',
          en: 'Chemical Science'
        },
        year: '2024',
        volume: '15',
        pages: '3456-3465',
        doi: '10.1039/d3sc00000j',
        isRepresentative: false,
        isHighImpact: false,
        pdfLink: '#'
      }
    ]
  })

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [])

  const handlePublicationChange = (index: number, field: string, lang: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      publications: prev.publications.map((pub, i) =>
        i === index
          ? {
              ...pub,
              [field]: typeof value === 'boolean'
                ? value
                : field === 'year' || field === 'volume' || field === 'pages' || field === 'doi'
                ? value
                : {
                    zh: (pub[field as keyof typeof pub] as any)?.zh || '',
                    en: (pub[field as keyof typeof pub] as any)?.en || '',
                    [lang]: value
                  }
            }
          : pub
      )
    }))
  }

  const addPublication = () => {
    setFormData(prev => ({
      ...prev,
      publications: [...prev.publications, {
        id: Date.now(),
        authors: { zh: '', en: '' },
        title: { zh: '', en: '' },
        journal: { zh: '', en: '' },
        year: '',
        volume: '',
        pages: '',
        doi: '',
        isRepresentative: false,
        isHighImpact: false,
        pdfLink: ''
      }]
    }))
  }

  const removePublication = (id: number) => {
    setFormData(prev => ({
      ...prev,
      publications: prev.publications.filter(p => p.id !== id)
    }))
  }

  useEffect(() => {
    // 从API加载数据
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin?action=getPublications')
        const data = await response.json()
        if (data.success) {
          // 转换数据结构以匹配前端期望的格式
          const transformedData = {
            publications: data.data || []
          }
          setFormData(transformedData)
        }
      } catch (error) {
        console.error('Failed to fetch publications data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // 只提交 publications 字段，因为 API 接口期望的数据结构是直接的论文列表
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'updatePublications',
          data: formData.publications
        })
      })
      const result = await response.json()
      if (result.success) {
        alert('学术论文更新成功！')
        router.push('/admin')
      } else {
        alert('更新失败：' + result.message)
      }
    } catch (error) {
      console.error('Failed to update publications data:', error)
      alert('更新失败：服务器错误')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">学术论文管理</h1>

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
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">论文列表</h2>
              <button
                type="button"
                onClick={addPublication}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                添加论文
              </button>
            </div>

            {formData.publications.map((pub, index) => (
              <div 
                key={pub.id} 
                className={`border rounded-md p-4 mb-4 ${pub.isHighImpact ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-800">论文 {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removePublication(pub.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    删除
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">作者列表</label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={pub.authors.zh}
                          onChange={(e) => handlePublicationChange(index, 'authors', 'zh', e.target.value)}
                          className="w-full border border-gray-300 rounded-md p-2"
                          placeholder="中文作者列表"
                        />
                        <input
                          type="text"
                          value={pub.authors.en}
                          onChange={(e) => handlePublicationChange(index, 'authors', 'en', e.target.value)}
                          className="w-full border border-gray-300 rounded-md p-2"
                          placeholder="英文作者列表"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">论文标题</label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={pub.title.zh}
                          onChange={(e) => handlePublicationChange(index, 'title', 'zh', e.target.value)}
                          className="w-full border border-gray-300 rounded-md p-2"
                          placeholder="中文标题"
                        />
                        <input
                          type="text"
                          value={pub.title.en}
                          onChange={(e) => handlePublicationChange(index, 'title', 'en', e.target.value)}
                          className="w-full border border-gray-300 rounded-md p-2"
                          placeholder="英文标题"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">期刊名称</label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={pub.journal.zh}
                          onChange={(e) => handlePublicationChange(index, 'journal', 'zh', e.target.value)}
                          className="w-full border border-gray-300 rounded-md p-2"
                          placeholder="中文期刊名称"
                        />
                        <input
                          type="text"
                          value={pub.journal.en}
                          onChange={(e) => handlePublicationChange(index, 'journal', 'en', e.target.value)}
                          className="w-full border border-gray-300 rounded-md p-2"
                          placeholder="英文期刊名称"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">年份</label>
                        <input
                          type="text"
                          value={pub.year}
                          onChange={(e) => handlePublicationChange(index, 'year', '', e.target.value)}
                          className="w-full border border-gray-300 rounded-md p-2"
                          placeholder="2026"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">卷</label>
                        <input
                          type="text"
                          value={pub.volume}
                          onChange={(e) => handlePublicationChange(index, 'volume', '', e.target.value)}
                          className="w-full border border-gray-300 rounded-md p-2"
                          placeholder="卷号"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">页码</label>
                        <input
                          type="text"
                          value={pub.pages}
                          onChange={(e) => handlePublicationChange(index, 'pages', '', e.target.value)}
                          className="w-full border border-gray-300 rounded-md p-2"
                          placeholder="页码"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">DOI</label>
                    <input
                      type="text"
                      value={pub.doi}
                      onChange={(e) => handlePublicationChange(index, 'doi', '', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="例如：10.1038/nature24000"
                    />
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={pub.isRepresentative}
                        onChange={(e) => handlePublicationChange(index, 'isRepresentative', '', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">代表性论文（★标记）</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={pub.isHighImpact}
                        onChange={(e) => handlePublicationChange(index, 'isHighImpact', '', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">高水平期刊（蓝色背景）</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PDF上传</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <p className="text-gray-500 text-sm">点击或拖拽上传PDF文件</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">文章配图上传</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <p className="text-gray-500 text-sm">点击或拖拽上传图片（建议尺寸 400x300）</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

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

export default PublicationsManagementPage
