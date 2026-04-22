// 定义类型
interface LocaleText {
  zh: string
  en: string
}

interface PI {
  name: LocaleText
  title: LocaleText
  research: LocaleText
  email: string
  photo: string
}

interface Student {
  name: LocaleText
  year: string
  grade?: string
  direction: LocaleText
  research?: LocaleText
  photo: string
  email?: string
}

interface AlumniMember {
  name: LocaleText
  degree: LocaleText
  goal: LocaleText
  destination?: LocaleText
  photo: string
  email?: string
}

interface AlumniYear {
  year: string
  graduationYear?: string
  members: AlumniMember[]
}

interface TeamData {
  pi: PI
  phdStudents: Student[]
  masterStudents: Student[]
  alumni: AlumniYear[]
}

// 默认数据
const defaultTeamData: TeamData = {
  pi: {
    name: { zh: '张三', en: 'Zhang San' },
    title: { zh: '教授、博士生导师', en: 'Professor, PhD Supervisor' },
    research: { zh: '化学生物学、药物化学', en: 'Chemical Biology, Medicinal Chemistry' },
    email: 'zhangsan@pku.edu.cn',
    photo: ''
  },
  phdStudents: [
    {
      name: { zh: '李四', en: 'Li Si' },
      year: '2023',
      direction: { zh: '化学生物学探针', en: 'Chemical Biology Probes' },
      photo: ''
    },
    {
      name: { zh: '王五', en: 'Wang Wu' },
      year: '2022',
      direction: { zh: '天然产物全合成', en: 'Total Synthesis of Natural Products' },
      photo: ''
    },
    {
      name: { zh: '赵六', en: 'Zhao Liu' },
      year: '2021',
      direction: { zh: '创新药物设计', en: 'Innovative Drug Design' },
      photo: ''
    }
  ],
  masterStudents: [
    {
      name: { zh: '钱七', en: 'Qian Qi' },
      year: '2024',
      direction: { zh: '化学生物学', en: 'Chemical Biology' },
      photo: ''
    },
    {
      name: { zh: '孙八', en: 'Sun Ba' },
      year: '2023',
      direction: { zh: '药物化学', en: 'Medicinal Chemistry' },
      photo: ''
    }
  ],
  alumni: [
    {
      year: '2025',
      members: [
        {
          name: { zh: '周九', en: 'Zhou Jiu' },
          degree: { zh: '博士', en: 'PhD' },
          goal: { zh: '清华大学助理教授', en: 'Assistant Professor at Tsinghua University' },
          photo: ''
        }
      ]
    },
    {
      year: '2024',
      members: [
        {
          name: { zh: '吴十', en: 'Wu Shi' },
          degree: { zh: '博士', en: 'PhD' },
          goal: { zh: '上海药物研究所研究员', en: 'Researcher at Shanghai Institute of Materia Medica' },
          photo: ''
        },
        {
          name: { zh: '郑十一', en: 'Zheng Shiyi' },
          degree: { zh: '硕士', en: 'Master' },
          goal: { zh: '美国斯坦福大学博士', en: 'PhD Candidate at Stanford University' },
          photo: ''
        }
      ]
    }
  ]
}

// 从API获取团队数据
async function fetchTeamData(): Promise<TeamData> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    
    if (!baseUrl) {
      console.log('NEXT_PUBLIC_BASE_URL not set, using default data')
      return defaultTeamData
    }
    
    const response = await fetch(`${baseUrl}/api/admin?action=getTeam`, {
      next: { revalidate: 600 } // 10分钟重新生成
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.success) {return data.data}
  } catch (error) {
    console.error('Failed to fetch team data:', error)
  }
  
  return defaultTeamData
}

const TeamPage = async () => {
  const locale = 'zh' // 这里应该从router获取，暂时硬编码
  const teamData: TeamData = await fetchTeamData()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-primary mb-8">
        {locale === 'zh' ? '研究团队' : 'Team'}
      </h1>

      {/* PI信息区 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-primary mb-4">
          {locale === 'zh' ? '课题组长' : 'Principal Investigator'}
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-8 bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          {teamData.pi.photo ? (
            <div className="w-48 h-48 rounded-lg overflow-hidden">
              <img 
                src={teamData.pi.photo} 
                alt={teamData.pi.name[locale as keyof typeof teamData.pi.name]} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-48 h-48 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
              <p className="text-gray-500 text-center">{locale === 'zh' ? 'PI照片' : 'PI Photo'}</p>
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {teamData.pi.name[locale as keyof typeof teamData.pi.name]}
            </h3>
            <p className="text-gray-700 mb-2">
              {teamData.pi.title[locale as keyof typeof teamData.pi.title]}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-bold">{locale === 'zh' ? '研究方向：' : 'Research Direction: '}</span>
              {teamData.pi.research?.[locale as keyof typeof teamData.pi.research] || '化学生物学、药物化学'}
            </p>
            <p className="text-gray-700">
              <span className="font-bold">{locale === 'zh' ? '邮箱：' : 'Email: '}</span>
              {teamData.pi.email}
            </p>
          </div>
        </div>
      </div>

      {/* 在读学生区 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-primary mb-4">
          {locale === 'zh' ? '在读学生' : 'Current Students'}
        </h2>
        
        {/* 博士研究生 */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {locale === 'zh' ? '博士研究生' : 'PhD Students'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamData.phdStudents?.map((student, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                {student.photo ? (
                  <div className="w-40 h-40 rounded-lg overflow-hidden mb-4">
                    <img 
                      src={student.photo} 
                      alt={student.name[locale as keyof typeof student.name]} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-40 h-40 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center mb-4">
                    <p className="text-gray-500 text-center">{locale === 'zh' ? '照片' : 'Photo'}</p>
                  </div>
                )}
                <h4 className="font-bold text-gray-800 mb-2">
                  {student.name[locale as keyof typeof student.name]}
                </h4>
                <p className="text-gray-700 mb-2">
                  <span className="font-bold">{locale === 'zh' ? '入学年份：' : 'Year: '}</span>
                  {student.year || student.grade}
                </p>
                <p className="text-gray-700">
                  <span className="font-bold">{locale === 'zh' ? '研究方向：' : 'Research Direction: '}</span>
                  {student.direction?.[locale as keyof typeof student.direction] || student.research?.[locale as keyof typeof student.research] || '化学生物学'}
                </p>
                {student.email && (
                  <p className="text-gray-700">
                    <span className="font-bold">{locale === 'zh' ? '邮箱：' : 'Email: '}</span>
                    {student.email}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* 硕士研究生 */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {locale === 'zh' ? '硕士研究生' : 'Master Students'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamData.masterStudents?.map((student, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                {student.photo ? (
                  <div className="w-40 h-40 rounded-lg overflow-hidden mb-4">
                    <img 
                      src={student.photo} 
                      alt={student.name[locale as keyof typeof student.name]} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-40 h-40 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center mb-4">
                    <p className="text-gray-500 text-center">{locale === 'zh' ? '照片' : 'Photo'}</p>
                  </div>
                )}
                <h4 className="font-bold text-gray-800 mb-2">
                  {student.name[locale as keyof typeof student.name]}
                </h4>
                <p className="text-gray-700 mb-2">
                  <span className="font-bold">{locale === 'zh' ? '入学年份：' : 'Year: '}</span>
                  {student.year || student.grade}
                </p>
                <p className="text-gray-700">
                  <span className="font-bold">{locale === 'zh' ? '研究方向：' : 'Research Direction: '}</span>
                  {student.direction?.[locale as keyof typeof student.direction] || student.research?.[locale as keyof typeof student.research] || '化学生物学'}
                </p>
                {student.email && (
                  <p className="text-gray-700">
                    <span className="font-bold">{locale === 'zh' ? '邮箱：' : 'Email: '}</span>
                    {student.email}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 毕业学生区 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-primary mb-4">
          {locale === 'zh' ? '毕业学生' : 'Alumni'}
        </h2>
        {Array.isArray(teamData.alumni) && teamData.alumni.length > 0 ? (
          teamData.alumni.map((alumni, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {locale === 'zh' ? `毕业年份：${alumni.year || alumni.graduationYear}` : `Graduation Year: ${alumni.year || alumni.graduationYear}`}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {alumni.members ? (
                  alumni.members.map((member, memberIndex) => (
                    <div key={memberIndex} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      {member.photo ? (
                        <div className="w-40 h-40 rounded-lg overflow-hidden mb-4">
                          <img 
                            src={member.photo} 
                            alt={member.name[locale as keyof typeof member.name]} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-40 h-40 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center mb-4">
                          <p className="text-gray-500 text-center">{locale === 'zh' ? '照片' : 'Photo'}</p>
                        </div>
                      )}
                      <h4 className="font-bold text-gray-800 mb-2">
                        {member.name[locale as keyof typeof member.name]}
                      </h4>
                      <p className="text-gray-700 mb-2">
                        <span className="font-bold">{locale === 'zh' ? '学位：' : 'Degree: '}</span>
                        {member.degree?.[locale as keyof typeof member.degree]}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-bold">{locale === 'zh' ? '去向：' : 'Current Position: '}</span>
                        {member.goal?.[locale as keyof typeof member.goal] || member.destination?.[locale as keyof typeof member.destination]}
                      </p>
                      {member.email && (
                        <p className="text-gray-700">
                          <span className="font-bold">{locale === 'zh' ? '邮箱：' : 'Email: '}</span>
                          {member.email}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-white border border-gray-200 rounded-lg p-6 shadow-sm text-center">
                    <p className="text-gray-500">{locale === 'zh' ? '暂无毕业学生信息' : 'No alumni information available'}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">{locale === 'zh' ? '暂无毕业学生数据' : 'No alumni data available'}</div>
        )}
      </div>
    </div>
  )
}

export default TeamPage