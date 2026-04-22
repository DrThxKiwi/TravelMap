'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RichEditor from '@/components/RichEditor'

const ResearchManagementPage = () => {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [formData, setFormData] = useState({
    overview: {
      zh: '我们致力于化学生物学与药物化学的交叉研究，探索生命过程中的分子机制，开发新型治疗药物。',
      en: 'We are dedicated to interdisciplinary research in chemical biology and medicinal chemistry, exploring molecular mechanisms in life processes and developing novel therapeutic drugs.'
    },
    directions: [
      {
        id: 1,
        name: {
          zh: '化学生物学探针开发',
          en: 'Chemical Biology Probe Development'
        },
        background: {
          zh: '化学生物学是现代生命科学发展的重要方向，通过化学手段研究生物分子的功能和相互作用。',
          en: 'Chemical biology is an important direction in modern life science development, studying the functions and interactions of biological molecules through chemical methods.'
        },
        content: {
          zh: '开发新型荧光探针和功能分子，用于追踪和调控生物分子在活细胞和活体中的行为。',
          en: 'Develop novel fluorescent probes and functional molecules for tracking and regulating the behavior of biological molecules in living cells and organisms.'
        },
        methods: {
          zh: '有机合成、点击化学、生物正交反应、光谱学分析',
          en: 'Organic synthesis, Click chemistry, Bioorthogonal reactions, Spectroscopic analysis'
        },
        applications: {
          zh: '疾病诊断、药物筛选、生命过程机制研究',
          en: 'Disease diagnosis, Drug screening, Mechanism research of life processes'
        },
        image: ''
      },
      {
        id: 2,
        name: {
          zh: '天然产物全合成与结构修饰',
          en: 'Total Synthesis and Structural Modification of Natural Products'
        },
        background: {
          zh: '天然产物是药物发现的重要来源，其复杂的结构和多样的生物活性吸引了广泛的研究兴趣。',
          en: 'Natural products are an important source for drug discovery, and their complex structures and diverse bioactivities have attracted widespread research interest.'
        },
        content: {
          zh: '实现具有重要生理活性的天然产物的全合成，并进行结构-活性关系研究。',
          en: 'Achieve total synthesis of natural products with important physiological activities and conduct structure-activity relationship studies.'
        },
        methods: {
          zh: '有机合成、立体化学控制、分离纯化、结构鉴定',
          en: 'Organic synthesis, Stereochemical control, Separation and purification, Structural identification'
        },
        applications: {
          zh: '创新药物研发、先导化合物发现',
          en: 'Innovative drug development, Lead compound discovery'
        },
        image: ''
      }
    ]
  })

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [])

  const handleOverviewChange = (lang: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      overview: {
        ...prev.overview,
        [lang]: value
      }
    }))
  }

  const handleDirectionChange = (index: number, field: string, lang: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      directions: prev.directions.map((item, i) =>
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

  const addDirection = () => {
    setFormData(prev => ({
      ...prev,
      directions: [...prev.directions, {
        id: Date.now(),
        name: { zh: '', en: '' },
        background: { zh: '', en: '' },
        content: { zh: '', en: '' },
        methods: { zh: '', en: '' },
        applications: { zh: '', en: '' },
        image: ''
      }]
    }))
  }

  const removeDirection = (id: number) => {
    setFormData(prev => ({
      ...prev,
      directions: prev.directions.filter(item => item.id !== id)
    }))
  }

  const handleImageUpload = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
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
              directions: prev.directions.map((item, i) =>
                i === index ? { ...item, image: data.url } : item
              )
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

  useEffect(() => {
    // 从API加载数据
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin?action=getResearch')
        const data = await response.json()
        if (data.success) {
          // 转换数据结构以匹配前端期望的格式
          const transformedData = {
            overview: data.data.overview || {
              zh: '我们致力于化学生物学与药物化学的交叉研究，探索生命过程中的分子机制，开发新型治疗药物。',
              en: 'We are dedicated to interdisciplinary research in chemical biology and medicinal chemistry, exploring molecular mechanisms in life processes and developing novel therapeutic drugs.'
            },
            directions: data.data.directions || []
          }
          setFormData(transformedData)
        }
      } catch (error) {
        console.error('Failed to fetch research data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // 由于包含图片上传，需要使用FormData
      const formDataToSend = new FormData()
      formDataToSend.append('action', 'updateResearch')
      formDataToSend.append('data', JSON.stringify({
        overview: formData.overview,
        directions: formData.directions
      }))

      const response = await fetch('/api/admin', {
        method: 'POST',
        body: formDataToSend
      })
      const result = await response.json()
      if (result.success) {
        alert('研究方向更新成功！')
        router.push('/admin')
      } else {
        alert('更新失败：' + result.message)
      }
    } catch (error) {
      console.error('Failed to update research data:', error)
      alert('更新失败：服务器错误')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">研究方向管理</h1>

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
          {/* 整体开篇 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">整体研究定位</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">中文</label>
                <textarea
                  value={formData.overview.zh}
                  onChange={(e) => handleOverviewChange('zh', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">英文</label>
                <textarea
                  value={formData.overview.en}
                  onChange={(e) => handleOverviewChange('en', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* 研究方向列表 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">研究方向</h2>
              <button
                type="button"
                onClick={addDirection}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                添加研究方向
              </button>
            </div>

            {formData.directions.map((direction, index) => (
              <div key={direction.id} className="border border-gray-200 rounded-md p-4 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-800">研究方向 {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeDirection(direction.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    删除
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">方向名称</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={direction.name.zh}
                        onChange={(e) => handleDirectionChange(index, 'name', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="中文方向名称"
                      />
                      <input
                        type="text"
                        value={direction.name.en}
                        onChange={(e) => handleDirectionChange(index, 'name', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="英文方向名称"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">研究背景</label>
                    <div className="space-y-2">
                      <textarea
                        value={direction.background.zh}
                        onChange={(e) => handleDirectionChange(index, 'background', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows={3}
                        placeholder="中文研究背景"
                      />
                      <textarea
                        value={direction.background.en}
                        onChange={(e) => handleDirectionChange(index, 'background', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows={3}
                        placeholder="英文研究背景"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">核心研究内容</label>
                    <div className="space-y-2">
                      <textarea
                        value={direction.content.zh}
                        onChange={(e) => handleDirectionChange(index, 'content', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows={3}
                        placeholder="中文研究内容"
                      />
                      <textarea
                        value={direction.content.en}
                        onChange={(e) => handleDirectionChange(index, 'content', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows={3}
                        placeholder="英文研究内容"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">关键技术方法</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={direction.methods.zh}
                        onChange={(e) => handleDirectionChange(index, 'methods', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="中文技术方法"
                      />
                      <input
                        type="text"
                        value={direction.methods.en}
                        onChange={(e) => handleDirectionChange(index, 'methods', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="英文技术方法"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">应用场景与研究目标</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={direction.applications.zh}
                        onChange={(e) => handleDirectionChange(index, 'applications', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="中文应用场景"
                      />
                      <input
                        type="text"
                        value={direction.applications.en}
                        onChange={(e) => handleDirectionChange(index, 'applications', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="英文应用场景"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">示意图上传</label>
                    {direction.image ? (
                      <div className="relative mb-4">
                        <img 
                          src={direction.image} 
                          alt="研究方向示意图" 
                          className="w-full max-w-md h-auto rounded-md"
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              directions: prev.directions.map((item, i) =>
                                i === index ? { ...item, image: '' } : item
                              )
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
                          onChange={(e) => handleImageUpload(index, e)}
                          className="hidden"
                          id={`image-upload-${direction.id}`}
                        />
                        <label 
                          htmlFor={`image-upload-${direction.id}`}
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

export default ResearchManagementPage
