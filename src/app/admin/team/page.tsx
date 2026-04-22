'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const TeamManagementPage = () => {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [formData, setFormData] = useState({
    pi: {
      name: { zh: '张三', en: 'Zhang San' },
      title: { zh: '教授', en: 'Professor' },
      researchField: { zh: '化学生物学、药物化学', en: 'Chemical Biology, Medicinal Chemistry' },
      email: 'zhangsan@pku.edu.cn',
      photo: ''
    },
    currentStudents: [
      {
        id: 1,
        type: 'phd',
        name: { zh: '李四', en: 'Li Si' },
        grade: '2024级博士',
        research: { zh: '化学生物学探针开发', en: 'Chemical Biology Probe Development' },
        email: '',
        photo: ''
      },
      {
        id: 2,
        type: 'phd',
        name: { zh: '王五', en: 'Wang Wu' },
        grade: '2023级博士',
        research: { zh: '天然产物全合成', en: 'Total Synthesis of Natural Products' },
        email: '',
        photo: ''
      },
      {
        id: 3,
        type: 'master',
        name: { zh: '赵六', en: 'Zhao Liu' },
        grade: '2025级硕士',
        research: { zh: '药物化学', en: 'Medicinal Chemistry' },
        email: '',
        photo: ''
      }
    ],
    alumni: [
      {
        id: 1,
        name: { zh: '钱七', en: 'Qian Qi' },
        graduationYear: '2025',
        degree: { zh: '博士', en: 'Ph.D.' },
        destination: { zh: '哈佛大学博士后', en: 'Postdoctoral Fellow at Harvard University' },
        email: '',
        photo: ''
      },
      {
        id: 2,
        name: { zh: '孙八', en: 'Sun Ba' },
        graduationYear: '2024',
        degree: { zh: '博士', en: 'Ph.D.' },
        destination: { zh: '某制药公司研发部', en: 'R&D Department, Pharmaceutical Company' },
        email: '',
        photo: ''
      }
    ]
  })

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [])

  const handlePiChange = (field: string, lang: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      pi: {
        ...prev.pi,
        [field]: field === 'email' ? value : {
          zh: (prev.pi[field as keyof typeof prev.pi] as any)?.zh || '',
          en: (prev.pi[field as keyof typeof prev.pi] as any)?.en || '',
          [lang]: value
        }
      }
    }))
  }

  const handleStudentChange = (index: number, field: string, lang: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      currentStudents: prev.currentStudents.map((student, i) =>
        i === index
          ? {
              ...student,
              [field]: field === 'type' || field === 'name' || field === 'grade' || field === 'research' || field === 'email'
                ? field === 'name' || field === 'research'
                  ? {
                      zh: (student[field as keyof typeof student] as any)?.zh || '',
                      en: (student[field as keyof typeof student] as any)?.en || '',
                      [lang]: value
                    }
                  : value
                : student[field as keyof typeof student]
            }
          : student
      )
    }))
  }

  const addStudent = (type: 'phd' | 'master') => {
    setFormData(prev => ({
      ...prev,
      currentStudents: [...prev.currentStudents, {
        id: Date.now(),
        type,
        name: { zh: '', en: '' },
        grade: '',
        research: { zh: '', en: '' },
        email: '',
        photo: ''
      }]
    }))
  }

  const removeStudent = (id: number) => {
    setFormData(prev => ({
      ...prev,
      currentStudents: prev.currentStudents.filter(s => s.id !== id)
    }))
  }

  const handleAlumniChange = (index: number, field: string, lang: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      alumni: prev.alumni.map((alumni, i) =>
        i === index
          ? {
              ...alumni,
              [field]: field === 'graduationYear' || field === 'email'
                ? value
                : {
                    zh: (alumni[field as keyof typeof alumni] as any)?.zh || '',
                    en: (alumni[field as keyof typeof alumni] as any)?.en || '',
                    [lang]: value
                  }
            }
          : alumni
      )
    }))
  }

  const addAlumni = () => {
    setFormData(prev => ({
      ...prev,
      alumni: [...prev.alumni, {
        id: Date.now(),
        name: { zh: '', en: '' },
        graduationYear: '',
        degree: { zh: '', en: '' },
        destination: { zh: '', en: '' },
        email: '',
        photo: ''
      }]
    }))
  }

  const removeAlumni = (id: number) => {
    setFormData(prev => ({
      ...prev,
      alumni: prev.alumni.filter(a => a.id !== id)
    }))
  }

  const handlePiPhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
              pi: {
                ...prev.pi,
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

  const handleStudentPhotoUpload = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
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
              currentStudents: prev.currentStudents.map((student, i) =>
                i === index ? { ...student, photo: data.url } : student
              )
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

  const handleAlumniPhotoUpload = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
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
              alumni: prev.alumni.map((alumni, i) =>
                i === index ? { ...alumni, photo: data.url } : alumni
              )
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
        const response = await fetch('/api/admin?action=getTeam')
        const data = await response.json()
        if (data.success) {
          // 转换数据结构以匹配前端期望的格式
          // 将 phdStudents 和 masterStudents 合并成 currentStudents
          const currentStudents = [
            ...(data.data.phdStudents || []).map((student: any) => ({ ...student, type: 'phd' })),
            ...(data.data.masterStudents || []).map((student: any) => ({ ...student, type: 'master' }))
          ]
          
          // 确保 PI 数据包含 researchField 字段
          const piData = {
            ...data.data.pi,
            researchField: data.data.pi.researchField || { zh: '', en: '' }
          }
          
          const transformedData = {
            pi: piData,
            currentStudents,
            alumni: data.data.alumni || []
          }
          
          setFormData(transformedData)
        }
      } catch (error) {
        console.error('Failed to fetch team data:', error)
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
      // 将 currentStudents 拆分为 phdStudents 和 masterStudents
      const phdStudents = formData.currentStudents.filter((student: any) => student.type === 'phd')
      const masterStudents = formData.currentStudents.filter((student: any) => student.type === 'master')
      
      const transformedData = {
        pi: formData.pi,
        phdStudents,
        masterStudents,
        alumni: formData.alumni
      }
      
      // 使用FormData格式发送数据
      const formDataToSend = new FormData()
      formDataToSend.append('action', 'updateTeam')
      formDataToSend.append('data', JSON.stringify(transformedData))

      const response = await fetch('/api/admin', {
        method: 'POST',
        body: formDataToSend
      })
      const result = await response.json()
      if (result.success) {
        alert('研究团队更新成功！')
        router.push('/admin')
      } else {
        alert('更新失败：' + result.message)
      }
    } catch (error) {
      console.error('Failed to update team data:', error)
      alert('更新失败：服务器错误')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>
  }

  const phdStudents = formData.currentStudents.filter(s => s.type === 'phd')
  const masterStudents = formData.currentStudents.filter(s => s.type === 'master')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">研究团队管理</h1>

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
          {/* PI信息 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">PI信息</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.pi.name.zh}
                      onChange={(e) => handlePiChange('name', 'zh', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="中文姓名"
                    />
                    <input
                      type="text"
                      value={formData.pi.name.en}
                      onChange={(e) => handlePiChange('name', 'en', e.target.value)}
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
                      value={formData.pi.title.zh}
                      onChange={(e) => handlePiChange('title', 'zh', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="中文职称"
                    />
                    <input
                      type="text"
                      value={formData.pi.title.en}
                      onChange={(e) => handlePiChange('title', 'en', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="英文职称"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">核心研究方向</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.pi.researchField.zh}
                      onChange={(e) => handlePiChange('researchField', 'zh', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="中文研究方向"
                    />
                    <input
                      type="text"
                      value={formData.pi.researchField.en}
                      onChange={(e) => handlePiChange('researchField', 'en', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="英文研究方向"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">工作邮箱</label>
                  <input
                    type="email"
                    value={formData.pi.email}
                    onChange={(e) => handlePiChange('email', '', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="邮箱地址"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">个人照片上传</label>
                {formData.pi.photo ? (
                  <div className="relative mb-4">
                    <img 
                      src={formData.pi.photo} 
                      alt="PI照片" 
                      className="w-32 h-32 object-cover rounded-md"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          pi: {
                            ...prev.pi,
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
                      onChange={handlePiPhotoUpload}
                      className="hidden"
                      id="pi-photo-upload"
                    />
                    <label 
                      htmlFor="pi-photo-upload"
                      className="cursor-pointer"
                    >
                      <p className="text-gray-500">点击或拖拽上传照片</p>
                      <p className="text-xs text-gray-400 mt-1">支持 JPG、PNG，建议尺寸 200x200px</p>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 博士研究生 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">博士研究生</h2>
              <button
                type="button"
                onClick={() => addStudent('phd')}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                添加博士研究生
              </button>
            </div>

            {phdStudents.map((student, index) => (
              <div key={student.id} className="border border-gray-200 rounded-md p-4 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-800">博士研究生 {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeStudent(student.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    删除
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={student.name.zh}
                        onChange={(e) => handleStudentChange(formData.currentStudents.indexOf(student), 'name', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="中文姓名"
                      />
                      <input
                        type="text"
                        value={student.name.en}
                        onChange={(e) => handleStudentChange(formData.currentStudents.indexOf(student), 'name', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="英文姓名"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">年级</label>
                    <input
                      type="text"
                      value={student.grade}
                      onChange={(e) => handleStudentChange(formData.currentStudents.indexOf(student), 'grade', '', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="例如：2024级博士"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">细分研究方向</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={student.research.zh}
                        onChange={(e) => handleStudentChange(formData.currentStudents.indexOf(student), 'research', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="中文研究方向"
                      />
                      <input
                        type="text"
                        value={student.research.en}
                        onChange={(e) => handleStudentChange(formData.currentStudents.indexOf(student), 'research', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="英文研究方向"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                    <input
                      type="email"
                      value={student.email}
                      onChange={(e) => handleStudentChange(formData.currentStudents.indexOf(student), 'email', '', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="邮箱地址"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">照片上传</label>
                  {student.photo ? (
                    <div className="relative mb-4">
                      <img 
                        src={student.photo} 
                        alt={student.name.zh} 
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            currentStudents: prev.currentStudents.map((s, i) =>
                              i === formData.currentStudents.indexOf(student) ? { ...s, photo: '' } : s
                            )
                          }))
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleStudentPhotoUpload(formData.currentStudents.indexOf(student), e)}
                        className="hidden"
                        id={`student-photo-upload-${student.id}`}
                      />
                      <label 
                        htmlFor={`student-photo-upload-${student.id}`}
                        className="cursor-pointer"
                      >
                        <p className="text-gray-500 text-sm">点击或拖拽上传照片（200x200px）</p>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 硕士研究生 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">硕士研究生</h2>
              <button
                type="button"
                onClick={() => addStudent('master')}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                添加硕士研究生
              </button>
            </div>

            {masterStudents.map((student, index) => (
              <div key={student.id} className="border border-gray-200 rounded-md p-4 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-800">硕士研究生 {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeStudent(student.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    删除
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={student.name.zh}
                        onChange={(e) => handleStudentChange(formData.currentStudents.indexOf(student), 'name', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="中文姓名"
                      />
                      <input
                        type="text"
                        value={student.name.en}
                        onChange={(e) => handleStudentChange(formData.currentStudents.indexOf(student), 'name', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="英文姓名"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">年级</label>
                    <input
                      type="text"
                      value={student.grade}
                      onChange={(e) => handleStudentChange(formData.currentStudents.indexOf(student), 'grade', '', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="例如：2025级硕士"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">细分研究方向</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={student.research.zh}
                        onChange={(e) => handleStudentChange(formData.currentStudents.indexOf(student), 'research', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="中文研究方向"
                      />
                      <input
                        type="text"
                        value={student.research.en}
                        onChange={(e) => handleStudentChange(formData.currentStudents.indexOf(student), 'research', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="英文研究方向"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                    <input
                      type="email"
                      value={student.email}
                      onChange={(e) => handleStudentChange(formData.currentStudents.indexOf(student), 'email', '', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="邮箱地址"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">照片上传</label>
                  {student.photo ? (
                    <div className="relative mb-4">
                      <img 
                        src={student.photo} 
                        alt={student.name.zh} 
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            currentStudents: prev.currentStudents.map((s, i) =>
                              i === formData.currentStudents.indexOf(student) ? { ...s, photo: '' } : s
                            )
                          }))
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleStudentPhotoUpload(formData.currentStudents.indexOf(student), e)}
                        className="hidden"
                        id={`student-photo-upload-${student.id}`}
                      />
                      <label 
                        htmlFor={`student-photo-upload-${student.id}`}
                        className="cursor-pointer"
                      >
                        <p className="text-gray-500 text-sm">点击或拖拽上传照片（200x200px）</p>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 毕业学生 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">毕业学生</h2>
              <button
                type="button"
                onClick={addAlumni}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                添加毕业学生
              </button>
            </div>

            {formData.alumni.map((alumni, index) => (
              <div key={alumni.id} className="border border-gray-200 rounded-md p-4 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-800">毕业学生 {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeAlumni(alumni.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    删除
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={alumni.name.zh}
                        onChange={(e) => handleAlumniChange(index, 'name', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="中文姓名"
                      />
                      <input
                        type="text"
                        value={alumni.name.en}
                        onChange={(e) => handleAlumniChange(index, 'name', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="英文姓名"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">毕业年份</label>
                    <input
                      type="text"
                      value={alumni.graduationYear}
                      onChange={(e) => handleAlumniChange(index, 'graduationYear', '', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="例如：2025"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">学位</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={alumni.degree.zh}
                        onChange={(e) => handleAlumniChange(index, 'degree', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="中文学位"
                      />
                      <input
                        type="text"
                        value={alumni.degree.en}
                        onChange={(e) => handleAlumniChange(index, 'degree', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="英文学位"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">去向</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={alumni.destination.zh}
                        onChange={(e) => handleAlumniChange(index, 'destination', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="中文去向"
                      />
                      <input
                        type="text"
                        value={alumni.destination.en}
                        onChange={(e) => handleAlumniChange(index, 'destination', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="英文去向"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                    <input
                      type="email"
                      value={alumni.email}
                      onChange={(e) => handleAlumniChange(index, 'email', '', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="邮箱地址"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">照片上传</label>
                  {alumni.photo ? (
                    <div className="relative mb-4">
                      <img 
                        src={alumni.photo} 
                        alt={alumni.name.zh} 
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            alumni: prev.alumni.map((a, i) =>
                              i === index ? { ...a, photo: '' } : a
                            )
                          }))
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleAlumniPhotoUpload(index, e)}
                        className="hidden"
                        id={`alumni-photo-upload-${alumni.id}`}
                      />
                      <label 
                        htmlFor={`alumni-photo-upload-${alumni.id}`}
                        className="cursor-pointer"
                      >
                        <p className="text-gray-500 text-sm">点击或拖拽上传照片（200x200px）</p>
                      </label>
                    </div>
                  )}
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

export default TeamManagementPage