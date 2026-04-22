'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AboutManagementPage = () => {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [formData, setFormData] = useState({
    basicInfo: {
      name: {
        zh: '张三',
        en: 'Zhang San'
      },
      title: {
        zh: '教授',
        en: 'Professor'
      },
      college: {
        zh: '北京大学化学学院',
        en: 'College of Chemistry, Peking University'
      },
      researchField: {
        zh: '化学生物学、药物化学',
        en: 'Chemical Biology, Medicinal Chemistry'
      },
      office: {
        zh: '化学楼A区301室',
        en: 'Room 301, Building A, Chemistry Building'
      },
      email: 'zhangsan@pku.edu.cn',
      photo: ''
    },
    education: [
      {
        id: 1,
        period: '2005-2010',
        institution: {
          zh: '哈佛大学',
          en: 'Harvard University'
        },
        degree: {
          zh: '博士',
          en: 'Ph.D.'
        },
        major: {
          zh: '化学',
          en: 'Chemistry'
        }
      },
      {
        id: 2,
        period: '2001-2005',
        institution: {
          zh: '北京大学',
          en: 'Peking University'
        },
        degree: {
          zh: '学士',
          en: 'B.Sc.'
        },
        major: {
          zh: '化学',
          en: 'Chemistry'
        }
      }
    ],
    workExperience: [
      {
        id: 1,
        period: '2015-至今',
        organization: {
          zh: '北京大学',
          en: 'Peking University'
        },
        position: {
          zh: '教授',
          en: 'Professor'
        }
      },
      {
        id: 2,
        period: '2010-2015',
        organization: {
          zh: '斯坦福大学',
          en: 'Stanford University'
        },
        position: {
          zh: '博士后',
          en: 'Postdoctoral Fellow'
        }
      }
    ],
    academicPositions: [
      {
        id: 1,
        position: {
          zh: '《化学学报》编委',
          en: 'Editorial Board Member, Acta Chimica Sinica'
        }
      },
      {
        id: 2,
        position: {
          zh: '中国化学会化学生物学专业委员会委员',
          en: 'Member, Chemical Biology Committee, Chinese Chemical Society'
        }
      }
    ],
    honors: [
      {
        id: 1,
        honor: {
          zh: '国家自然科学奖二等奖（2024）',
          en: 'Second Prize of National Natural Science Award (2024)'
        }
      },
      {
        id: 2,
        honor: {
          zh: '教育部自然科学奖一等奖（2023）',
          en: 'First Prize of Ministry of Education Natural Science Award (2023)'
        }
      }
    ]
  })

  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  const handleBasicInfoChange = (field: string, lang: string, value: string) => {
    setFormData(prev => {
      const updatedBasicInfo = { ...prev.basicInfo };
      if (field === 'email') {
        updatedBasicInfo[field as keyof typeof updatedBasicInfo] = value as any;
      } else {
        const currentValue = updatedBasicInfo[field as keyof typeof updatedBasicInfo] as { zh: string; en: string };
        updatedBasicInfo[field as keyof typeof updatedBasicInfo] = {
          zh: currentValue?.zh || '',
          en: currentValue?.en || '',
          [lang]: value
        } as any;
      }
      return {
        ...prev,
        basicInfo: updatedBasicInfo
      };
    });
  }

  const handleEducationChange = (index: number, field: string, lang: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((item, i) => 
        i === index 
          ? { 
              ...item, 
              [field]: field === 'period' 
                ? value 
                : {
                    zh: (item[field as keyof typeof item] as any)?.zh || '',
                    en: (item[field as keyof typeof item] as any)?.en || '',
                    [lang]: value
                  }
            }
          : item
      )
    }))
  }

  const handleWorkExperienceChange = (index: number, field: string, lang: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((item, i) => 
        i === index 
          ? { 
              ...item, 
              [field]: field === 'period' 
                ? value 
                : {
                    zh: (item[field as keyof typeof item] as any)?.zh || '',
                    en: (item[field as keyof typeof item] as any)?.en || '',
                    [lang]: value
                  }
            }
          : item
      )
    }))
  }

  const handleAcademicPositionChange = (index: number, lang: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      academicPositions: prev.academicPositions.map((item, i) => 
        i === index 
          ? { 
              ...item, 
              position: {
                ...item.position,
                [lang]: value
              }
            }
          : item
      )
    }))
  }

  const handleHonorChange = (index: number, lang: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      honors: prev.honors.map((item, i) => 
        i === index 
          ? { 
              ...item, 
              honor: {
                ...item.honor,
                [lang]: value
              }
            }
          : item
      )
    }))
  }

  const addItem = (type: string) => {
    setFormData(prev => {
      if (type === 'education') {
        return {
          ...prev,
          education: [...prev.education, {
            id: Date.now(),
            period: '',
            institution: { zh: '', en: '' },
            degree: { zh: '', en: '' },
            major: { zh: '', en: '' }
          }]
        };
      } else if (type === 'workExperience') {
        return {
          ...prev,
          workExperience: [...prev.workExperience, {
            id: Date.now(),
            period: '',
            organization: { zh: '', en: '' },
            position: { zh: '', en: '' }
          }]
        };
      } else if (type === 'academicPositions') {
        return {
          ...prev,
          academicPositions: [...prev.academicPositions, {
            id: Date.now(),
            position: { zh: '', en: '' }
          }]
        };
      } else if (type === 'honors') {
        return {
          ...prev,
          honors: [...prev.honors, {
            id: Date.now(),
            honor: { zh: '', en: '' }
          }]
        };
      }
      return prev;
    });
  }

  const removeItem = (type: string, id: number) => {
    setFormData(prev => {
      if (type === 'education') {
        return {
          ...prev,
          education: prev.education.filter(item => item.id !== id)
        };
      } else if (type === 'workExperience') {
        return {
          ...prev,
          workExperience: prev.workExperience.filter(item => item.id !== id)
        };
      } else if (type === 'academicPositions') {
        return {
          ...prev,
          academicPositions: prev.academicPositions.filter(item => item.id !== id)
        };
      } else if (type === 'honors') {
        return {
          ...prev,
          honors: prev.honors.filter(item => item.id !== id)
        };
      }
      return prev;
    });
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
              basicInfo: {
                ...prev.basicInfo,
                photo: data.url
              }
            }))
          } else {
            alert('上传失败：' + data.message)
          }
        } else {
          alert('上传失败：服务器错误')
        }
      } catch (error) {
        console.error('Failed to upload photo:', error)
        alert('上传失败：网络错误')
      }
    }
  }

  useEffect(() => {
    // 从API加载数据
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin?action=getAbout')
        const data = await response.json()
        if (data.success) {
          // 转换数据结构以匹配前端期望的格式
          const transformedData = {
            basicInfo: {
              name: data.data.name,
              title: data.data.title,
              college: data.data.college,
              researchField: data.data.researchField,
              office: data.data.office,
              email: data.data.email,
              photo: data.data.photo
            },
            education: data.data.education || [],
            workExperience: data.data.workExperience || [],
            academicPositions: data.data.academicPositions || [],
            honors: data.data.honors || []
          }
          setFormData(transformedData)
        }
      } catch (error) {
        console.error('Failed to fetch about data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // 转换数据结构以匹配API期望的格式
      const transformedData = {
        ...formData.basicInfo,
        education: formData.education,
        workExperience: formData.workExperience,
        academicPositions: formData.academicPositions,
        honors: formData.honors
      }
      
      // 由于包含图片上传，需要使用FormData
      const formDataToSend = new FormData()
      formDataToSend.append('action', 'updateAbout')
      formDataToSend.append('data', JSON.stringify(transformedData))

      const response = await fetch('/api/admin', {
        method: 'POST',
        body: formDataToSend
      })
      const result = await response.json()
      if (result.success) {
        alert('个人简介更新成功！')
        router.push('/admin')
      } else {
        alert('更新失败：' + result.message)
      }
    } catch (error) {
      console.error('Failed to update about data:', error)
      alert('更新失败：服务器错误')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">个人简介管理</h1>

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
          {/* 基本信息 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">基本信息</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.basicInfo.name.zh}
                      onChange={(e) => handleBasicInfoChange('name', 'zh', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="中文姓名"
                    />
                    <input
                      type="text"
                      value={formData.basicInfo.name.en}
                      onChange={(e) => handleBasicInfoChange('name', 'en', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="英文姓名"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">职称</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.basicInfo.title.zh}
                      onChange={(e) => handleBasicInfoChange('title', 'zh', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="中文职称"
                    />
                    <input
                      type="text"
                      value={formData.basicInfo.title.en}
                      onChange={(e) => handleBasicInfoChange('title', 'en', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="英文职称"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">所在学院</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.basicInfo.college.zh}
                      onChange={(e) => handleBasicInfoChange('college', 'zh', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="中文学院名称"
                    />
                    <input
                      type="text"
                      value={formData.basicInfo.college.en}
                      onChange={(e) => handleBasicInfoChange('college', 'en', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="英文学院名称"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">核心研究领域</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.basicInfo.researchField.zh}
                      onChange={(e) => handleBasicInfoChange('researchField', 'zh', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="中文研究领域"
                    />
                    <input
                      type="text"
                      value={formData.basicInfo.researchField.en}
                      onChange={(e) => handleBasicInfoChange('researchField', 'en', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="英文研究领域"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">办公地址</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.basicInfo.office.zh}
                      onChange={(e) => handleBasicInfoChange('office', 'zh', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="中文地址"
                    />
                    <input
                      type="text"
                      value={formData.basicInfo.office.en}
                      onChange={(e) => handleBasicInfoChange('office', 'en', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="英文地址"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">工作邮箱</label>
                  <input
                    type="email"
                    value={formData.basicInfo.email}
                    onChange={(e) => handleBasicInfoChange('email', '', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="邮箱地址"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">个人照片</label>
                {formData.basicInfo.photo ? (
                  <div className="relative mb-4">
                    <img 
                      src={formData.basicInfo.photo} 
                      alt="个人照片" 
                      className="w-32 h-32 object-cover rounded-md"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          basicInfo: {
                            ...prev.basicInfo,
                            photo: ''
                          }
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
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label 
                      htmlFor="photo-upload"
                      className="cursor-pointer"
                    >
                      <p className="text-gray-500">点击或拖拽上传照片</p>
                      <p className="text-xs text-gray-400 mt-1">支持 JPG、PNG，建议尺寸 300x300</p>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 教育经历 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">教育经历</h2>
              <button
                type="button"
                onClick={() => addItem('education')}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                添加教育经历
              </button>
            </div>

            {formData.education.map((item, index) => (
              <div key={item.id} className="border border-gray-200 rounded-md p-4 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-800">教育经历 {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeItem('education', item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    删除
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">时间</label>
                    <input
                      type="text"
                      value={item.period}
                      onChange={(e) => handleEducationChange(index, 'period', '', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="例如：2005-2010"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">院校</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={item.institution.zh}
                        onChange={(e) => handleEducationChange(index, 'institution', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="中文院校名称"
                      />
                      <input
                        type="text"
                        value={item.institution.en}
                        onChange={(e) => handleEducationChange(index, 'institution', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="英文院校名称"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">学位</label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={item.degree.zh}
                          onChange={(e) => handleEducationChange(index, 'degree', 'zh', e.target.value)}
                          className="w-full border border-gray-300 rounded-md p-2"
                          placeholder="中文学位"
                        />
                        <input
                          type="text"
                          value={item.degree.en}
                          onChange={(e) => handleEducationChange(index, 'degree', 'en', e.target.value)}
                          className="w-full border border-gray-300 rounded-md p-2"
                          placeholder="英文学位"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">专业</label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={item.major.zh}
                          onChange={(e) => handleEducationChange(index, 'major', 'zh', e.target.value)}
                          className="w-full border border-gray-300 rounded-md p-2"
                          placeholder="中文专业"
                        />
                        <input
                          type="text"
                          value={item.major.en}
                          onChange={(e) => handleEducationChange(index, 'major', 'en', e.target.value)}
                          className="w-full border border-gray-300 rounded-md p-2"
                          placeholder="英文专业"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 工作经历 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">工作经历</h2>
              <button
                type="button"
                onClick={() => addItem('workExperience')}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                添加工作经历
              </button>
            </div>

            {formData.workExperience.map((item, index) => (
              <div key={item.id} className="border border-gray-200 rounded-md p-4 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-800">工作经历 {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeItem('workExperience', item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    删除
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">时间</label>
                    <input
                      type="text"
                      value={item.period}
                      onChange={(e) => handleWorkExperienceChange(index, 'period', '', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="例如：2015-至今"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">单位</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={item.organization.zh}
                        onChange={(e) => handleWorkExperienceChange(index, 'organization', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="中文单位名称"
                      />
                      <input
                        type="text"
                        value={item.organization.en}
                        onChange={(e) => handleWorkExperienceChange(index, 'organization', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="英文单位名称"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">职位</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={item.position.zh}
                        onChange={(e) => handleWorkExperienceChange(index, 'position', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="中文职位"
                      />
                      <input
                        type="text"
                        value={item.position.en}
                        onChange={(e) => handleWorkExperienceChange(index, 'position', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="英文职位"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 学术兼职 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">学术兼职</h2>
              <button
                type="button"
                onClick={() => addItem('academicPositions')}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                添加学术兼职
              </button>
            </div>

            {formData.academicPositions.map((item, index) => (
              <div key={item.id} className="border border-gray-200 rounded-md p-4 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-800">学术兼职 {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeItem('academicPositions', item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    删除
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">兼职名称</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={item.position.zh}
                      onChange={(e) => handleAcademicPositionChange(index, 'zh', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="中文兼职名称"
                    />
                    <input
                      type="text"
                      value={item.position.en}
                      onChange={(e) => handleAcademicPositionChange(index, 'en', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="英文兼职名称"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 科研荣誉 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">科研荣誉</h2>
              <button
                type="button"
                onClick={() => addItem('honors')}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                添加科研荣誉
              </button>
            </div>

            {formData.honors.map((item, index) => (
              <div key={item.id} className="border border-gray-200 rounded-md p-4 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-800">科研荣誉 {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeItem('honors', item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    删除
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">荣誉名称</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={item.honor.zh}
                      onChange={(e) => handleHonorChange(index, 'zh', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="中文荣誉名称"
                    />
                    <input
                      type="text"
                      value={item.honor.en}
                      onChange={(e) => handleHonorChange(index, 'en', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="英文荣誉名称"
                    />
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

export default AboutManagementPage
