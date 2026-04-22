'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ProjectsPage = () => {
  const router = useRouter()
  const locale = 'zh' // 这里应该从router获取，暂时硬编码
  const [activeTab, setActiveTab] = useState('ongoing')
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState({
    ongoing: [
      {
        id: 1,
        name: {
          zh: '基于化学生物学探针的肿瘤早期诊断技术研究',
          en: 'Research on Early Tumor Diagnosis Technology Based on Chemical Biology Probes'
        },
        number: '2026CB936000',
        period: '2026-2030',
        role: {
          zh: '主持',
          en: 'Principal Investigator'
        },
        content: {
          zh: '开发新型化学生物学探针，用于肿瘤标志物的早期检测和成像，提高肿瘤诊断的灵敏度和特异性。',
          en: 'Develop novel chemical biology probes for early detection and imaging of tumor markers, improving the sensitivity and specificity of tumor diagnosis.'
        },
        achievements: {
          zh: '已开发3种新型荧光探针，在细胞水平验证了其对肿瘤标志物的检测能力。',
          en: 'Three novel fluorescent probes have been developed, and their ability to detect tumor markers at the cellular level has been verified.'
        }
      },
      {
        id: 2,
        name: {
          zh: '天然产物衍生的创新药物设计与合成',
          en: 'Design and Synthesis of Innovative Drugs Derived from Natural Products'
        },
        number: '82573421',
        period: '2025-2028',
        role: {
          zh: '主持',
          en: 'Principal Investigator'
        },
        content: {
          zh: '基于天然产物结构，设计合成具有抗肿瘤活性的小分子化合物，进行构效关系研究和药理评价。',
          en: 'Design and synthesize small molecule compounds with anti-tumor activity based on natural product structures, conduct structure-activity relationship studies and pharmacological evaluations.'
        },
        achievements: {
          zh: '已合成20个目标化合物，其中3个显示出良好的抗肿瘤活性。',
          en: 'Twenty target compounds have been synthesized, three of which show good anti-tumor activity.'
        }
      }
    ],
    completed: [
      {
        id: 3,
        name: {
          zh: '化学生物学方法研究蛋白质-蛋白质相互作用',
          en: 'Chemical Biology Methods for Studying Protein-Protein Interactions'
        },
        number: '2022CB933000',
        period: '2022-2025',
        role: {
          zh: '主持',
          en: 'Principal Investigator'
        },
        content: {
          zh: '发展基于点击化学的蛋白质交联技术，用于研究细胞内蛋白质-蛋白质相互作用网络。',
          en: 'Develop click chemistry-based protein cross-linking technology for studying intracellular protein-protein interaction networks.'
        },
        achievements: {
          zh: '建立了高效的蛋白质交联方法，发表SCI论文8篇，申请专利3项。',
          en: 'An efficient protein cross-linking method was established, 8 SCI papers were published, and 3 patents were applied for.'
        }
      },
      {
        id: 4,
        name: {
          zh: '神经退行性疾病的分子机制与治疗策略研究',
          en: 'Molecular Mechanisms and Therapeutic Strategies for Neurodegenerative Diseases'
        },
        number: '82173456',
        period: '2021-2024',
        role: {
          zh: '参与',
          en: 'Participant'
        },
        content: {
          zh: '研究神经退行性疾病的分子机制，开发基于小分子的治疗策略。',
          en: 'Study the molecular mechanisms of neurodegenerative diseases and develop small molecule-based therapeutic strategies.'
        },
        achievements: {
          zh: '发现了2个潜在的药物靶点，参与发表SCI论文5篇。',
          en: 'Two potential drug targets were discovered, and 5 SCI papers were co-authored.'
        }
      }
    ]
  })

  useEffect(() => {
    // 从API加载数据
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin?action=getProjects')
        const data = await response.json()
        if (data.success) {
          // 直接使用API返回的ongoing和completed数组
          const ongoing = data.data.ongoing || []
          const completed = data.data.completed || []
          setProjects({ ongoing, completed })
        }
      } catch (error) {
        console.error('Failed to fetch projects data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-primary mb-8">
        {locale === 'zh' ? '科研项目' : 'Projects'}
      </h1>

      {/* 标签页切换 */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="flex -mb-px space-x-8">
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'ongoing' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {locale === 'zh' ? '在研项目' : 'Ongoing Projects'}
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'completed' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {locale === 'zh' ? '结题项目' : 'Completed Projects'}
          </button>
        </nav>
      </div>

      {/* 项目列表 */}
      <div className="space-y-6">
        {(activeTab === 'ongoing' ? projects.ongoing : projects.completed).map((project) => (
          <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {project.name[locale as keyof typeof project.name]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-700 mb-2">
                  <span className="font-bold">{locale === 'zh' ? '项目编号：' : 'Project Number: '}</span>
                  {project.number}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-bold">{locale === 'zh' ? '起止时间：' : 'Period: '}</span>
                  {project.period}
                </p>
                <p className="text-gray-700">
                  <span className="font-bold">{locale === 'zh' ? '承担角色：' : 'Role: '}</span>
                  {project.role[locale as keyof typeof project.role]}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-bold text-gray-800 mb-2">
                {locale === 'zh' ? '项目核心内容' : 'Core Content'}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {project.content[locale as keyof typeof project.content]}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">
                {locale === 'zh' ? '研究成果简述' : 'Achievements'}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {project.achievements[locale as keyof typeof project.achievements]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectsPage
