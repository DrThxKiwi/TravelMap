'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const PublicationsPage = () => {
  const router = useRouter()
  const locale = 'zh' // 这里应该从router获取，暂时硬编码
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [publications, setPublications] = useState([
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
      pdfLink: '#',
      image: true
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
      pdfLink: '#',
      image: true
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
      pdfLink: '#',
      image: true
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
      pdfLink: '#',
      image: false
    },
    {
      id: 5,
      authors: {
        zh: '钱七, 孙八, 张三*',
        en: 'Qian Qi, Sun Ba, Zhang San*'
      },
      title: {
        zh: '荧光探针的设计与合成',
        en: 'Design and Synthesis of Fluorescent Probes'
      },
      journal: {
        zh: 'Organic Letters',
        en: 'Organic Letters'
      },
      year: '2023',
      volume: '25',
      pages: '1234-1237',
      doi: '10.1021/acs.orglett.3c00000',
      isRepresentative: false,
      isHighImpact: false,
      pdfLink: '#',
      image: false
    }
  ])

  useEffect(() => {
    // 从API加载数据
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin?action=getPublications')
        const data = await response.json()
        if (data.success && data.data) {
          setPublications(Array.isArray(data.data) ? data.data : publications)
        }
      } catch (error) {
        console.error('Failed to fetch publications data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // 安全获取数据
  const safeGetLocale = (obj: any, defaultValue: string = '') => {
    if (!obj) return defaultValue
    if (obj[locale]) return obj[locale]
    return defaultValue
  }

  const safeArray = (arr: any) => {
    return Array.isArray(arr) ? arr : []
  }

  const safePublications = safeArray(publications)

  // 提取所有年份
  const years = safePublications
    .map((pub: any) => pub?.year)
    .filter((year: any): year is string => year != null)
    .reduce((acc: string[], year: string) => acc.includes(year) ? acc : [...acc, year], [] as string[])
    .sort((a, b) => parseInt(b) - parseInt(a))

  // 筛选论文
  const filteredPublications = selectedYear === 'all' 
    ? safePublications 
    : safePublications.filter((pub: any) => pub?.year === selectedYear)

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-primary mb-8">
        {locale === 'zh' ? '学术论文' : 'Publications'}
      </h1>

      {/* 年份筛选 */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedYear('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${selectedYear === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {locale === 'zh' ? '全部年份' : 'All Years'}
          </button>
          {years.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${selectedYear === year ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* 论文列表 */}
      <div className="space-y-8">
        {filteredPublications.map((pub: any, index: number) => (
          <div 
            key={pub?.id || index} 
            className={`rounded-lg p-6 shadow-sm ${pub?.isHighImpact ? 'bg-blue-50 border border-blue-100' : 'bg-white border border-gray-200'}`}
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* 论文图片 */}
              {pub?.image && (
                <div className="w-full md:w-1/4">
                  <div className="aspect-video bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                    <p className="text-gray-500 text-center">{locale === 'zh' ? '论文TOC图' : 'Paper TOC Figure'}</p>
                  </div>
                </div>
              )}
              
              {/* 论文信息 */}
              <div className={`flex-1 ${pub?.image ? '' : 'md:ml-0'}`}>
                <div className="flex items-center mb-2">
                  <h2 className="text-lg font-bold text-gray-800">
                    {pub?.isRepresentative && <span className="text-yellow-500 mr-2">★</span>}
                    {safeGetLocale(pub?.title, '论文标题')}
                  </h2>
                </div>
                <p className="text-gray-700 mb-2">
                  {safeGetLocale(pub?.authors, '作者')}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="italic">{safeGetLocale(pub?.journal, '期刊')}</span>, 
                  {pub?.year || '年份'}, {pub?.volume || '卷'}, {pub?.pages || '页码'}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {pub?.doi && (
                    <a 
                      href={`https://doi.org/${pub.doi}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
                    >
                      DOI: {pub.doi}
                    </a>
                  )}
                  {pub?.pdfLink && (
                    <a 
                      href={pub.pdfLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
                    >
                      {locale === 'zh' ? 'PDF下载' : 'PDF Download'}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PublicationsPage
