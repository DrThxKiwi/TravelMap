import Link from 'next/link'

// 定义类型
interface LocaleText {
  zh: string
  en: string
}

interface NewsItem {
  id: number
  date: string
  title: LocaleText
  description: LocaleText
}

interface HomepageData {
  groupName: LocaleText
  piName: LocaleText
  college: LocaleText
  address: LocaleText
  researchOverview: LocaleText
  researchDirections: LocaleText
  researchImage: string
  news: NewsItem[]
}

// 快速导航数据
const quickLinks = [
  { href: '/about', icon: '👤', label: { zh: '个人简介', en: 'About' } },
  { href: '/research', icon: '🔬', label: { zh: '研究方向', en: 'Research' } },
  { href: '/team', icon: '👥', label: { zh: '研究团队', en: 'Team' } },
  { href: '/projects', icon: '📁', label: { zh: '科研项目', en: 'Projects' } },
  { href: '/publications', icon: '📚', label: { zh: '学术论文', en: 'Publications' } },
  { href: '/contact', icon: '📧', label: { zh: '联系我们', en: 'Contact' } },
  { href: '/admin/login', icon: '🔐', label: { zh: '管理员', en: 'Admin' } }
]

// 默认数据
const defaultHomepageData: HomepageData = {
  groupName: { zh: '化学生物学与药物化学课题组', en: 'Chemical Biology and Medicinal Chemistry Research Group' },
  piName: { zh: '张三 教授', en: 'Prof. Zhang San' },
  college: { zh: '北京大学化学学院', en: 'College of Chemistry, Peking University' },
  address: { zh: '北京市海淀区颐和园路5号', en: 'No. 5 Yiheyuan Road, Haidian District, Beijing' },
  researchOverview: { zh: '我们致力于化学生物学与药物化学的交叉研究，探索生命过程中的分子机制，开发新型治疗药物。', en: 'We are dedicated to interdisciplinary research in chemical biology and medicinal chemistry, exploring molecular mechanisms in life processes and developing novel therapeutic drugs.' },
  researchDirections: { zh: '主要研究方向包括：天然产物全合成、化学生物学探针开发、药物靶点发现与验证、创新药物设计与合成。', en: 'Our main research directions include: total synthesis of natural products, development of chemical biology probes, drug target discovery and validation, and innovative drug design and synthesis.' },
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
    },
    {
      id: 3,
      date: '2026-04-05',
      title: { zh: '两名博士生获得国家奖学金', en: 'Two PhD students receive national scholarships' },
      description: { zh: '表彰他们在研究中的突出贡献', en: 'Recognizing their outstanding contributions to research' }
    }
  ]
}

// 从API获取首页数据
async function fetchHomepageData(): Promise<HomepageData> {
  try {
    // 在服务器组件中需要使用完整URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    
    // 如果环境变量不存在，使用默认数据
    if (!baseUrl) {
      console.log('NEXT_PUBLIC_BASE_URL not set, using default data')
      return defaultHomepageData
    }
    
    const response = await fetch(`${baseUrl}/api/admin?action=getHomepage`, {
      next: { revalidate: 600 } // 10分钟重新生成
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.success) {
      return data.data
    }
  } catch (error) {
    console.error('Failed to fetch homepage data:', error)
  }
  
  // 返回默认数据
  return defaultHomepageData
}

const HomePage = async () => {
  const locale = 'zh' // 这里应该从router获取，暂时硬编码
  const homepageData: HomepageData = await fetchHomepageData()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 顶部课题组信息 */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-primary mb-4">
          {locale === 'zh' ? homepageData.groupName.zh : homepageData.groupName.en}
        </h1>
        <p className="text-2xl text-gray-700 mb-2">
          {locale === 'zh' ? homepageData.piName.zh : homepageData.piName.en}
        </p>
        <p className="text-lg text-gray-600 mb-4">
          {locale === 'zh' ? homepageData.college.zh : homepageData.college.en}
        </p>
        <p className="text-sm text-gray-500">
          {locale === 'zh' ? homepageData.address.zh : homepageData.address.en}
        </p>
      </div>

      {/* 核心研究领域 */}
      <div className="mb-16 bg-white border border-gray-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">
          {locale === 'zh' ? '核心研究领域' : 'Core Research Areas'}
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {locale === 'zh' ? homepageData.researchOverview.zh : homepageData.researchOverview.en}
            </p>
            <p className="text-gray-600 leading-relaxed">
              {locale === 'zh' 
                ? (homepageData.researchDirections?.zh || '主要研究方向包括：天然产物全合成、化学生物学探针开发、药物靶点发现与验证、创新药物设计与合成。') 
                : (homepageData.researchDirections?.en || 'Our main research directions include: total synthesis of natural products, development of chemical biology probes, drug target discovery and validation, and innovative drug design and synthesis.')}
            </p>
          </div>
          <div className="w-full md:w-1/3 h-64 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
            {homepageData.researchImage ? (
              <img 
                src={homepageData.researchImage} 
                alt={locale === 'zh' ? '研究方向示意图' : 'Research Direction Diagram'} 
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <p className="text-gray-500 text-center">
                {locale === 'zh' ? '研究方向示意图' : 'Research Direction Diagram'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 科研动态 */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-primary mb-6">
          {locale === 'zh' ? '科研动态' : 'Research News'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {homepageData.news.map((item, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-500 mb-3">{item.date}</p>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {item.title[locale as keyof typeof item.title]}
              </h3>
              <p className="text-gray-600 text-sm">
                {item.description[locale as keyof typeof item.description]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 快速导航 */}
      <div>
        <h2 className="text-2xl font-bold text-primary mb-6">
          {locale === 'zh' ? '快速导航' : 'Quick Links'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {quickLinks.map((link, index) => (
            <Link 
              key={index} 
              href={link.href} 
              className="flex flex-col items-center p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-3xl mb-2">{link.icon}</span>
              <span className="text-sm text-gray-700">
                {link.label[locale as keyof typeof link.label]}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage
