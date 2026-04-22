'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ProjectsManagementPage = () => {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [formData, setFormData] = useState({
    projects: [
      {
        id: 1,
        status: 'ongoing',
        name: {
          zh: '基于化学生物学探针的肿瘤早期诊断技术研究',
          en: 'Research on Early Tumor Diagnosis Technology Based on Chemical Biology Probes'
        },
        number: '2026CB936000',
        period: '2026-2030',
        role: { zh: '主持', en: 'Principal Investigator' },
        content: {
          zh: '开发新型化学生物学探针，用于肿瘤标志物的早期检测和成像。',
          en: 'Develop novel chemical biology probes for early detection and imaging of tumor markers.'
        },
        achievements: {
          zh: '已开发3种新型荧光探针，在细胞水平验证了其对肿瘤标志物的检测能力。',
          en: 'Three novel fluorescent probes have been developed and verified at the cellular level.'
        }
      },
      {
        id: 2,
        status: 'ongoing',
        name: {
          zh: '天然产物衍生的创新药物设计与合成',
          en: 'Design and Synthesis of Innovative Drugs Derived from Natural Products'
        },
        number: '82573421',
        period: '2025-2028',
        role: { zh: '主持', en: 'Principal Investigator' },
        content: {
          zh: '基于天然产物结构，设计合成具有抗肿瘤活性的小分子化合物。',
          en: 'Design and synthesize small molecule compounds with anti-tumor activity based on natural product structures.'
        },
        achievements: {
          zh: '已合成20个目标化合物，其中3个显示出良好的抗肿瘤活性。',
          en: 'Twenty target compounds have been synthesized, three of which show good anti-tumor activity.'
        }
      },
      {
        id: 3,
        status: 'completed',
        name: {
          zh: '化学生物学方法研究蛋白质-蛋白质相互作用',
          en: 'Chemical Biology Methods for Studying Protein-Protein Interactions'
        },
        number: '2022CB933000',
        period: '2022-2025',
        role: { zh: '主持', en: 'Principal Investigator' },
        content: {
          zh: '发展基于点击化学的蛋白质交联技术，用于研究细胞内蛋白质-蛋白质相互作用网络。',
          en: 'Develop click chemistry-based protein cross-linking technology for studying intracellular protein-protein interaction networks.'
        },
        achievements: {
          zh: '建立了高效的蛋白质交联方法，发表SCI论文8篇，申请专利3项。',
          en: 'An efficient protein cross-linking method was established, 8 SCI papers were published, and 3 patents were applied for.'
        }
      }
    ]
  })

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [])

  const handleProjectChange = (index: number, field: string, lang: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) =>
        i === index
          ? {
              ...project,
              [field]: field === 'status' || field === 'number' || field === 'period'
                ? value
                : field === 'role'
                ? { zh: value, en: value === '主持' ? 'Principal Investigator' : 'Participant' }
                : {
                    zh: (project[field as keyof typeof project] as any)?.zh || '',
                    en: (project[field as keyof typeof project] as any)?.en || '',
                    [lang]: value
                  }
            }
          : project
      )
    }))
  }

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        id: Date.now(),
        status: 'ongoing',
        name: { zh: '', en: '' },
        number: '',
        period: '',
        role: { zh: '主持', en: 'Principal Investigator' },
        content: { zh: '', en: '' },
        achievements: { zh: '', en: '' }
      }]
    }))
  }

  const removeProject = (id: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }))
  }

  useEffect(() => {
    // 从API加载数据
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin?action=getProjects')
        const data = await response.json()
        if (data.success) {
          // 转换数据结构以匹配前端期望的格式
          // 将 ongoing 和 completed 合并成一个 projects 数组
          const projects = [
            ...(data.data.ongoing || []).map((project: any) => ({ ...project, status: 'ongoing' })),
            ...(data.data.completed || []).map((project: any) => ({ ...project, status: 'completed' }))
          ]
          
          const transformedData = {
            projects
          }
          
          setFormData(transformedData)
        }
      } catch (error) {
        console.error('Failed to fetch projects data:', error)
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
      // 将 projects 数组拆分为 ongoing 和 completed 两个数组
      const ongoing = formData.projects.filter((project: any) => project.status === 'ongoing')
      const completed = formData.projects.filter((project: any) => project.status === 'completed')
      
      const transformedData = {
        ongoing,
        completed
      }
      
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'updateProjects',
          data: transformedData
        })
      })
      const result = await response.json()
      if (result.success) {
        alert('科研项目更新成功！')
        router.push('/admin')
      } else {
        alert('更新失败：' + result.message)
      }
    } catch (error) {
      console.error('Failed to update projects data:', error)
      alert('更新失败：服务器错误')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>
  }

  const ongoingProjects = formData.projects.filter(p => p.status === 'ongoing')
  const completedProjects = formData.projects.filter(p => p.status === 'completed')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">科研项目管理</h1>

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
          {/* 在研项目 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">在研项目</h2>
              <button
                type="button"
                onClick={addProject}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                添加在研项目
              </button>
            </div>

            {ongoingProjects.map((project, index) => (
              <div key={project.id} className="border border-gray-200 rounded-md p-4 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-800">在研项目 {index + 1}</h3>
                  <div className="flex items-center gap-2">
                    <select
                      value={project.status}
                      onChange={(e) => handleProjectChange(formData.projects.indexOf(project), 'status', '', e.target.value)}
                      className="border border-gray-300 rounded-md p-1 text-sm"
                    >
                      <option value="ongoing">在研</option>
                      <option value="completed">结题</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeProject(project.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      删除
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">项目名称</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={project.name.zh}
                        onChange={(e) => handleProjectChange(formData.projects.indexOf(project), 'name', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="中文项目名称"
                      />
                      <input
                        type="text"
                        value={project.name.en}
                        onChange={(e) => handleProjectChange(formData.projects.indexOf(project), 'name', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="英文项目名称"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">项目编号</label>
                      <input
                        type="text"
                        value={project.number}
                        onChange={(e) => handleProjectChange(formData.projects.indexOf(project), 'number', '', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="项目编号"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">起止时间</label>
                      <input
                        type="text"
                        value={project.period}
                        onChange={(e) => handleProjectChange(formData.projects.indexOf(project), 'period', '', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="例如：2026-2030"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">承担角色</label>
                      <select
                        value={project.role.zh}
                        onChange={(e) => handleProjectChange(formData.projects.indexOf(project), 'role', '', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                      >
                        <option value="主持">主持</option>
                        <option value="参与">参与</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">项目核心内容</label>
                    <div className="space-y-2">
                      <textarea
                        value={project.content.zh}
                        onChange={(e) => handleProjectChange(formData.projects.indexOf(project), 'content', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows={3}
                        placeholder="中文项目内容"
                      />
                      <textarea
                        value={project.content.en}
                        onChange={(e) => handleProjectChange(formData.projects.indexOf(project), 'content', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows={3}
                        placeholder="英文项目内容"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">研究成果简述</label>
                    <div className="space-y-2">
                      <textarea
                        value={project.achievements.zh}
                        onChange={(e) => handleProjectChange(formData.projects.indexOf(project), 'achievements', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows={3}
                        placeholder="中文研究成果"
                      />
                      <textarea
                        value={project.achievements.en}
                        onChange={(e) => handleProjectChange(formData.projects.indexOf(project), 'achievements', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows={3}
                        placeholder="英文研究成果"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 结题项目 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">结题项目</h2>
              <button
                type="button"
                onClick={addProject}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                添加结题项目
              </button>
            </div>

            {completedProjects.map((project, index) => (
              <div key={project.id} className="border border-gray-200 rounded-md p-4 mb-4 bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-800">结题项目 {index + 1}</h3>
                  <div className="flex items-center gap-2">
                    <select
                      value={project.status}
                      onChange={(e) => handleProjectChange(formData.projects.indexOf(project), 'status', '', e.target.value)}
                      className="border border-gray-300 rounded-md p-1 text-sm"
                    >
                      <option value="ongoing">在研</option>
                      <option value="completed">结题</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeProject(project.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      删除
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">项目名称</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={project.name.zh}
                        onChange={(e) => handleProjectChange(formData.projects.indexOf(project), 'name', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="中文项目名称"
                      />
                      <input
                        type="text"
                        value={project.name.en}
                        onChange={(e) => handleProjectChange(formData.projects.indexOf(project), 'name', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="英文项目名称"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">项目编号</label>
                      <input
                        type="text"
                        value={project.number}
                        onChange={(e) => handleProjectChange(formData.projects.indexOf(project), 'number', '', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="项目编号"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">起止时间</label>
                      <input
                        type="text"
                        value={project.period}
                        onChange={(e) => handleProjectChange(formData.projects.indexOf(project), 'period', '', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="例如：2022-2025"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">承担角色</label>
                      <select
                        value={project.role.zh}
                        onChange={(e) => handleProjectChange(formData.projects.indexOf(project), 'role', '', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                      >
                        <option value="主持">主持</option>
                        <option value="参与">参与</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">项目核心内容</label>
                    <div className="space-y-2">
                      <textarea
                        value={project.content.zh}
                        onChange={(e) => handleProjectChange(formData.projects.indexOf(project), 'content', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows={3}
                        placeholder="中文项目内容"
                      />
                      <textarea
                        value={project.content.en}
                        onChange={(e) => handleProjectChange(formData.projects.indexOf(project), 'content', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows={3}
                        placeholder="英文项目内容"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">研究成果简述</label>
                    <div className="space-y-2">
                      <textarea
                        value={project.achievements.zh}
                        onChange={(e) => handleProjectChange(formData.projects.indexOf(project), 'achievements', 'zh', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows={3}
                        placeholder="中文研究成果"
                      />
                      <textarea
                        value={project.achievements.en}
                        onChange={(e) => handleProjectChange(formData.projects.indexOf(project), 'achievements', 'en', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows={3}
                        placeholder="英文研究成果"
                      />
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

export default ProjectsManagementPage
