'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ResearchPage = () => {
  const router = useRouter()
  const locale = 'zh' // 这里应该从router获取，暂时硬编码
  const [loading, setLoading] = useState(true)
  const [researchData, setResearchData] = useState({
    overview: {
      zh: '本课题组致力于化学生物学与药物化学的交叉研究，围绕生命过程中的分子机制和疾病治疗靶点，开展基础研究和应用研究。通过发展新型化学工具和方法，我们旨在深入理解生物分子的功能与调控机制，为重大疾病的诊断和治疗提供新的策略和方案，推动化学学科与生命科学、医学的交叉融合。',
      en: 'Our research group is dedicated to interdisciplinary research in chemical biology and medicinal chemistry, focusing on molecular mechanisms in life processes and disease therapeutic targets, conducting both basic and applied research. By developing novel chemical tools and methods, we aim to deeply understand the functions and regulatory mechanisms of biomolecules, provide new strategies and solutions for the diagnosis and treatment of major diseases, and promote the integration of chemistry with life sciences and medicine.'
    },
    directions: [
      {
        id: 1,
        name: { zh: '化学生物学探针开发', en: 'Chemical Biology Probe Development' },
        background: {
          zh: '化学生物学探针是研究生物分子功能和调控机制的重要工具。传统探针存在灵敏度低、选择性差等问题，限制了其在复杂生物体系中的应用。',
          en: 'Chemical biology probes are important tools for studying the functions and regulatory mechanisms of biomolecules. Traditional probes have issues such as low sensitivity and poor selectivity, which limit their applications in complex biological systems.'
        },
        content: {
          zh: '我们致力于开发新型化学生物学探针，包括荧光探针、光交联探针、点击化学探针等。重点研究探针的设计原理、合成方法和生物应用。',
          en: 'We are dedicated to developing novel chemical biology probes, including fluorescent probes, photo-crosslinking probes, and click chemistry probes. We focus on the design principles, synthetic methods, and biological applications of these probes.'
        },
        methods: {
          zh: '有机合成、荧光光谱分析、细胞成像、蛋白质组学、化学生物学筛选',
          en: 'Organic synthesis, fluorescence spectroscopy, cell imaging, proteomics, chemical biology screening'
        },
        applications: {
          zh: '用于疾病标志物检测、药物靶点识别、信号通路研究、药物筛选等领域。目标是开发具有高灵敏度、高选择性的新型探针工具。',
          en: 'Used in disease biomarker detection, drug target identification, signal pathway research, drug screening, and other fields. The goal is to develop novel probe tools with high sensitivity and selectivity.'
        },
        image: ''
      },
      {
        id: 2,
        name: { zh: '天然产物全合成与结构修饰', en: 'Total Synthesis and Structural Modification of Natural Products' },
        background: {
          zh: '天然产物是药物发现的重要来源，具有丰富的生物活性和复杂的化学结构。然而，天然产物的获取往往受到资源限制，全合成成为解决这一问题的有效途径。',
          en: 'Natural products are important sources for drug discovery, with rich biological activities and complex chemical structures. However, the acquisition of natural products is often limited by resources, and total synthesis has become an effective approach to solve this problem.'
        },
        content: {
          zh: '我们专注于具有重要生物活性的天然产物的全合成研究，同时进行结构修饰以改善其药理性质。重点研究新型合成策略和方法学。',
          en: 'We focus on the total synthesis of natural products with important biological activities, while conducting structural modifications to improve their pharmacological properties. We emphasize the development of novel synthetic strategies and methodologies.'
        },
        methods: {
          zh: '有机合成、不对称催化、串联反应、天然产物分离鉴定、结构解析',
          en: 'Organic synthesis, asymmetric catalysis, tandem reactions, natural product isolation and identification, structural analysis'
        },
        applications: {
          zh: '为药物研发提供候选化合物，为天然产物生物合成研究提供参考。目标是开发具有临床应用潜力的天然产物衍生物。',
          en: 'Providing lead compounds for drug development and references for natural product biosynthesis research. The goal is to develop natural product derivatives with clinical application potential.'
        },
        image: ''
      },
      {
        id: 3,
        name: { zh: '创新药物设计与合成', en: 'Innovative Drug Design and Synthesis' },
        background: {
          zh: '新药研发是解决重大疾病治疗问题的关键。传统药物研发周期长、成本高，需要新的策略和方法来提高效率。',
          en: 'New drug research and development is crucial for solving major disease treatment problems. Traditional drug development has a long cycle and high cost, requiring new strategies and methods to improve efficiency.'
        },
        content: {
          zh: '我们结合计算机辅助药物设计、化学生物学和合成化学，开展创新药物的设计与合成研究。重点关注癌症、神经退行性疾病等重大疾病的治疗靶点。',
          en: 'We combine computer-aided drug design, chemical biology, and synthetic chemistry to conduct research on the design and synthesis of innovative drugs. We focus on therapeutic targets for major diseases such as cancer and neurodegenerative diseases.'
        },
        methods: {
          zh: '计算机辅助药物设计、高通量筛选、结构生物学、药物化学、药理学评价',
          en: 'Computer-aided drug design, high-throughput screening, structural biology, medicinal chemistry, pharmacological evaluation'
        },
        applications: {
          zh: '开发具有自主知识产权的创新药物，为重大疾病治疗提供新方案。目标是将候选药物推进到临床研究阶段。',
          en: 'Developing innovative drugs with independent intellectual property rights and providing new solutions for major disease treatments. The goal is to advance drug candidates to clinical research stages.'
        },
        image: ''
      }
    ]
  })

  useEffect(() => {
    // 从API获取数据
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin?action=getResearch')
        const data = await response.json()
        if (data.success && data.data) {
          setResearchData(prev => ({
            overview: data.data.overview || prev.overview,
            directions: data.data.directions || prev.directions
          }))
        }
      } catch (error) {
        console.error('Failed to fetch research data:', error)
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

  const safeDirections = Array.isArray(researchData.directions) ? researchData.directions : []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-primary mb-8">
        {locale === 'zh' ? '研究方向' : 'Research'}
      </h1>

      {/* 整体开篇 */}
      <div className="mb-12 bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {locale === 'zh' ? '研究定位与意义' : 'Research Positioning and Significance'}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {safeGetLocale(researchData.overview, '本课题组致力于化学生物学与药物化学的交叉研究。')}
        </p>
      </div>

      {/* 核心研究方向 */}
      <div className="space-y-8 mb-12">
        {safeDirections.map((direction: any, index: number) => (
          <div key={direction?.id || index} className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-primary mb-6">
              {safeGetLocale(direction?.name, '研究方向 ' + (index + 1))}
            </h2>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">
                    {locale === 'zh' ? '研究背景' : 'Research Background'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {safeGetLocale(direction?.background, '研究背景内容')}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">
                    {locale === 'zh' ? '核心研究内容' : 'Core Research Content'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {safeGetLocale(direction?.content, '核心研究内容')}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">
                    {locale === 'zh' ? '关键技术方法' : 'Key Technical Methods'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {safeGetLocale(direction?.methods, '关键技术方法')}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">
                    {locale === 'zh' ? '应用场景与研究目标' : 'Application Scenarios and Research Goals'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {safeGetLocale(direction?.applications, '应用场景与研究目标')}
                  </p>
                </div>
              </div>
              
              <div className="w-full md:w-1/3">
                {direction?.image ? (
                  <div className="aspect-video rounded-lg overflow-hidden border border-gray-200 h-full">
                    <img 
                      src={direction.image} 
                      alt={safeGetLocale(direction?.name, '研究方向')} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center h-full">
                    <p className="text-gray-500 text-center">
                      {locale === 'zh' ? '研究示意图' : 'Research Diagram'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 合作邀请 */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-lg text-gray-700 font-medium">
          {locale === 'zh' 
            ? '欢迎国内外同行开展横纵向科研合作、联合申报科研项目、共建科研平台' 
            : 'We welcome domestic and international colleagues to carry out horizontal and vertical scientific research cooperation, jointly apply for scientific research projects, and build research platforms together'}
        </p>
      </div>
    </div>
  )
}

export default ResearchPage
