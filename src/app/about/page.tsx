// 定义类型
interface LocaleText {
  zh: string
  en: string
}

interface Education {
  id: number
  period: string
  institution: LocaleText
  degree: LocaleText
  major: LocaleText
}

interface WorkExperience {
  id: number
  period: string
  organization: LocaleText
  position: LocaleText
}

interface AcademicPosition {
  id: number
  position: LocaleText
}

interface Honor {
  id: number
  honor: LocaleText
  year: string
}

interface AboutData {
  name: LocaleText
  title: LocaleText
  college: LocaleText
  researchField: LocaleText
  office: LocaleText
  email: string
  photo: string
  education: Education[]
  workExperience: WorkExperience[]
  academicPositions: AcademicPosition[]
  honors: Honor[]
}

// 从API获取个人简介数据
async function fetchAboutData(): Promise<AboutData> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/admin?action=getAbout`, {
      next: { revalidate: 600 } // 10分钟重新生成
    })
    const data = await response.json()
    
    if (data.success) {
      return data.data
    }
  } catch (error) {
    console.error('Failed to fetch about data:', error)
  }
  
  // 默认数据
  return {
    name: { zh: '张三', en: 'Zhang San' },
    title: { zh: '教授、博士生导师', en: 'Professor, PhD Supervisor' },
    college: { zh: '北京大学化学学院', en: 'College of Chemistry, Peking University' },
    researchField: { zh: '化学生物学、药物化学', en: 'Chemical Biology, Medicinal Chemistry' },
    office: { zh: '北京市海淀区颐和园路5号化学楼A区301室', en: 'Room 301, Building A, Chemistry Building, No. 5 Yiheyuan Road, Haidian District, Beijing' },
    email: 'zhangsan@pku.edu.cn',
    photo: '',
    education: [
      {
        id: 1,
        period: '2005-2010',
        institution: { zh: '哈佛大学', en: 'Harvard University' },
        degree: { zh: '博士', en: 'PhD' },
        major: { zh: '化学', en: 'Chemistry' }
      },
      {
        id: 2,
        period: '2001-2005',
        institution: { zh: '北京大学', en: 'Peking University' },
        degree: { zh: '学士', en: 'Bachelor' },
        major: { zh: '化学', en: 'Chemistry' }
      }
    ],
    workExperience: [
      {
        id: 1,
        period: '2015-至今',
        organization: { zh: '北京大学化学学院', en: 'College of Chemistry, Peking University' },
        position: { zh: '教授', en: 'Professor' }
      },
      {
        id: 2,
        period: '2010-2015',
        organization: { zh: '斯坦福大学', en: 'Stanford University' },
        position: { zh: '博士后研究员', en: 'Postdoctoral Researcher' }
      }
    ],
    academicPositions: [
      {
        id: 1,
        position: { zh: '《化学学报》编委', en: 'Editorial Board Member, Acta Chimica Sinica' }
      },
      {
        id: 2,
        position: { zh: '中国化学会化学生物学专业委员会委员', en: 'Member, Chemical Biology Committee, Chinese Chemical Society' }
      },
      {
        id: 3,
        position: { zh: '国家自然科学基金评审专家', en: 'Reviewer, National Natural Science Foundation of China' }
      }
    ],
    honors: [
      {
        id: 1,
        honor: { zh: '国家自然科学二等奖', en: 'National Natural Science Award (Second Class)' },
        year: '2025'
      },
      {
        id: 2,
        honor: { zh: '教育部自然科学一等奖', en: 'Ministry of Education Natural Science Award (First Class)' },
        year: '2023'
      },
      {
        id: 3,
        honor: { zh: '国家杰出青年科学基金', en: 'National Outstanding Youth Science Fund' },
        year: '2020'
      },
      {
        id: 4,
        honor: { zh: '中国化学会青年化学奖', en: 'Chinese Chemical Society Young Chemist Award' },
        year: '2018'
      }
    ]
  }
}

const AboutPage = async () => {
  const locale = 'zh' // 这里应该从router获取，暂时硬编码
  const aboutData: AboutData = await fetchAboutData()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-primary mb-8">
        {locale === 'zh' ? '个人简介' : 'About'}
      </h1>

      {/* 个人信息 */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* 左侧照片 */}
        <div className="w-full md:w-1/4">
          {aboutData.photo ? (
            <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
              <img 
                src={aboutData.photo} 
                alt={aboutData.name[locale]} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
              <p className="text-gray-500 text-center">
                {locale === 'zh' ? '个人照片' : 'Profile Photo'}
              </p>
            </div>
          )}
        </div>

        {/* 右侧信息 */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {locale === 'zh' ? `${aboutData.name.zh} ${aboutData.title.zh}` : `${aboutData.title.en} ${aboutData.name.en}`}
          </h2>
          
          <div className="space-y-3 text-gray-700">
            <p>
              <span className="font-bold">{locale === 'zh' ? '职称：' : 'Title: '}</span>
              {aboutData.title[locale]}
            </p>
            <p>
              <span className="font-bold">{locale === 'zh' ? '所在学院：' : 'College: '}</span>
              {aboutData.college[locale]}
            </p>
            <p>
              <span className="font-bold">{locale === 'zh' ? '核心研究领域：' : 'Core Research Areas: '}</span>
              {aboutData.researchField[locale]}
            </p>
            <p>
              <span className="font-bold">{locale === 'zh' ? '办公地址：' : 'Office Address: '}</span>
              {aboutData.office[locale]}
            </p>
            <p>
              <span className="font-bold">{locale === 'zh' ? '工作邮箱：' : 'Email: '}</span>
              {aboutData.email}
            </p>
          </div>
        </div>
      </div>

      {/* 教育经历 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-primary mb-4">
          {locale === 'zh' ? '教育经历' : 'Education'}
        </h2>
        <ul className="space-y-4 pl-6">
          {aboutData.education.map((edu) => (
            <li key={edu.id}>
              <p className="font-bold text-gray-800">{edu.period}</p>
              <p className="text-gray-700">
                {edu.institution[locale]}
                <span className="mx-2">|</span>
                {edu.degree[locale]}
                <span className="mx-2">|</span>
                {edu.major[locale]}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* 工作经历 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-primary mb-4">
          {locale === 'zh' ? '工作经历' : 'Work Experience'}
        </h2>
        <ul className="space-y-4 pl-6">
          {aboutData.workExperience.map((exp) => (
            <li key={exp.id}>
              <p className="font-bold text-gray-800">{exp.period}</p>
              <p className="text-gray-700">
                {exp.organization[locale]}
                <span className="mx-2">|</span>
                {exp.position[locale]}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* 学术兼职 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-primary mb-4">
          {locale === 'zh' ? '学术兼职' : 'Academic Positions'}
        </h2>
        <ul className="space-y-2 text-gray-700">
          {aboutData.academicPositions.map((pos) => (
            <li key={pos.id}>• {pos.position[locale]}</li>
          ))}
        </ul>
      </div>

      {/* 科研荣誉 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-primary mb-4">
          {locale === 'zh' ? '科研荣誉' : 'Awards & Honors'}
        </h2>
        <ul className="space-y-2 text-gray-700">
          {aboutData.honors.map((honor) => (
            <li key={honor.id}>• {honor.year}年 {honor.honor[locale]}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AboutPage
