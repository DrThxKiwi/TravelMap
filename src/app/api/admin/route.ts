import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// 检查是否在Vercel环境中运行
const isVercel = process.env.VERCEL === '1'

// 仅在非Vercel环境中初始化Prisma客户端
let prisma: any
if (!isVercel) {
  prisma = new PrismaClient()
}

export async function POST(request: NextRequest) {
  try {
    console.log('Received POST request')
    let requestBody
    const contentType = request.headers.get('content-type')
    
    if (contentType?.includes('multipart/form-data')) {
      // 处理FormData格式
      const formData = await request.formData()
      requestBody = {
        action: formData.get('action') as string,
        data: JSON.parse(formData.get('data') as string)
      }
    } else {
      // 处理JSON格式
      requestBody = await request.json()
    }
    
    console.log('Request body:', requestBody)
    const { action, data } = requestBody

    // 在Vercel环境中，直接返回成功消息，不执行数据库操作
    if (isVercel) {
      console.log('Running on Vercel, skipping database operations')
      return NextResponse.json({ success: true, message: '数据更新成功（Vercel环境）' })
    }

    switch (action) {
      case 'login':
        const { username, password } = data
        // 简单的登录验证，实际项目中应该使用密码哈希
        if (username === 'admin' && password === 'admin123') {
          return NextResponse.json({ success: true, message: '登录成功' })
        } else {
          return NextResponse.json({ success: false, message: '用户名或密码错误' })
        }
      
      case 'updateHomepage':
        // 先检查是否存在首页数据
        const existingHomepage = await prisma.homepage.findFirst()
        if (existingHomepage) {
          // 更新现有数据
          await prisma.homepage.update({
            where: { id: existingHomepage.id },
            data: {
              groupNameZh: data.groupName?.zh || '',
              groupNameEn: data.groupName?.en || '',
              piNameZh: data.piName?.zh || '',
              piNameEn: data.piName?.en || '',
              collegeZh: data.college?.zh || '',
              collegeEn: data.college?.en || '',
              addressZh: data.address?.zh || '',
              addressEn: data.address?.en || '',
              researchOverviewZh: data.researchOverview?.zh || '',
              researchOverviewEn: data.researchOverview?.en || '',
              researchDirectionsZh: data.researchDirections?.zh || '',
              researchDirectionsEn: data.researchDirections?.en || '',
              researchImage: data.researchImage
            }
          })
          
          // 更新新闻
          await prisma.news.deleteMany({ where: { homepageId: existingHomepage.id } })
          if (data.news && data.news.length > 0) {
            await prisma.news.createMany({
              data: data.news.map((news: any) => ({
                homepageId: existingHomepage.id,
                date: news.date || new Date().toISOString().split('T')[0],
                titleZh: news.title?.zh || '',
                titleEn: news.title?.en || '',
                descriptionZh: news.description?.zh || '',
                descriptionEn: news.description?.en || ''
              }))
            })
          }
        } else {
          // 创建新数据
          const newHomepage = await prisma.homepage.create({
            data: {
              groupNameZh: data.groupName?.zh || '',
              groupNameEn: data.groupName?.en || '',
              piNameZh: data.piName?.zh || '',
              piNameEn: data.piName?.en || '',
              collegeZh: data.college?.zh || '',
              collegeEn: data.college?.en || '',
              addressZh: data.address?.zh || '',
              addressEn: data.address?.en || '',
              researchOverviewZh: data.researchOverview?.zh || '',
              researchOverviewEn: data.researchOverview?.en || '',
              researchDirectionsZh: data.researchDirections?.zh || '',
              researchDirectionsEn: data.researchDirections?.en || '',
              researchImage: data.researchImage,
              news: {
                create: (data.news || []).map((news: any) => ({
                  date: news?.date || new Date().toISOString().split('T')[0],
                  titleZh: news?.title?.zh || '',
                  titleEn: news?.title?.en || '',
                  descriptionZh: news?.description?.zh || '',
                  descriptionEn: news?.description?.en || ''
                }))
              }
            }
          })
        }
        console.log('Homepage data updated successfully')
        return NextResponse.json({ success: true, message: '首页数据更新成功' })
      
      case 'updateAbout':
        // 先检查是否存在个人简介数据
        const existingAbout = await prisma.about.findFirst()
        if (existingAbout) {
          // 更新现有数据
          await prisma.about.update({
            where: { id: existingAbout.id },
            data: {
              nameZh: data.name.zh,
              nameEn: data.name.en,
              titleZh: data.title.zh,
              titleEn: data.title.en,
              collegeZh: data.college.zh,
              collegeEn: data.college.en,
              researchFieldZh: data.researchField.zh,
              researchFieldEn: data.researchField.en,
              officeZh: data.office.zh,
              officeEn: data.office.en,
              email: data.email,
              photo: data.photo
            }
          })
          
          // 更新教育背景
          await prisma.education.deleteMany({ where: { aboutId: existingAbout.id } })
          if (data.education && data.education.length > 0) {
            await prisma.education.createMany({
              data: data.education.map((edu: any) => ({
                aboutId: existingAbout.id,
                period: edu.period,
                institutionZh: edu.institution.zh,
                institutionEn: edu.institution.en,
                degreeZh: edu.degree.zh,
                degreeEn: edu.degree.en,
                majorZh: edu.major.zh,
                majorEn: edu.major.en
              }))
            })
          }
          
          // 更新工作经历
          await prisma.workExperience.deleteMany({ where: { aboutId: existingAbout.id } })
          if (data.workExperience && data.workExperience.length > 0) {
            await prisma.workExperience.createMany({
              data: data.workExperience.map((exp: any) => ({
                aboutId: existingAbout.id,
                period: exp.period,
                organizationZh: exp.organization.zh,
                organizationEn: exp.organization.en,
                positionZh: exp.position.zh,
                positionEn: exp.position.en
              }))
            })
          }
          
          // 更新学术兼职
          await prisma.academicPosition.deleteMany({ where: { aboutId: existingAbout.id } })
          if (data.academicPositions && data.academicPositions.length > 0) {
            await prisma.academicPosition.createMany({
              data: data.academicPositions.map((pos: any) => ({
                aboutId: existingAbout.id,
                positionZh: pos.position.zh,
                positionEn: pos.position.en
              }))
            })
          }
          
          // 更新荣誉奖项
          await prisma.honor.deleteMany({ where: { aboutId: existingAbout.id } })
          if (data.honors && data.honors.length > 0) {
            await prisma.honor.createMany({
              data: data.honors.map((honor: any) => ({
                aboutId: existingAbout.id,
                honorZh: honor.honor.zh,
                honorEn: honor.honor.en
              }))
            })
          }
        } else {
          // 创建新数据
          await prisma.about.create({
            data: {
              nameZh: data.name.zh,
              nameEn: data.name.en,
              titleZh: data.title.zh,
              titleEn: data.title.en,
              collegeZh: data.college.zh,
              collegeEn: data.college.en,
              researchFieldZh: data.researchField.zh,
              researchFieldEn: data.researchField.en,
              officeZh: data.office.zh,
              officeEn: data.office.en,
              email: data.email,
              photo: data.photo,
              education: {
                create: data.education.map((edu: any) => ({
                  period: edu.period,
                  institutionZh: edu.institution.zh,
                  institutionEn: edu.institution.en,
                  degreeZh: edu.degree.zh,
                  degreeEn: edu.degree.en,
                  majorZh: edu.major.zh,
                  majorEn: edu.major.en
                }))
              },
              workExperience: {
                create: data.workExperience.map((exp: any) => ({
                  period: exp.period,
                  organizationZh: exp.organization.zh,
                  organizationEn: exp.organization.en,
                  positionZh: exp.position.zh,
                  positionEn: exp.position.en
                }))
              },
              academicPosition: {
                create: data.academicPositions.map((pos: any) => ({
                  positionZh: pos.position.zh,
                  positionEn: pos.position.en
                }))
              },
              honor: {
                create: data.honors.map((honor: any) => ({
                  honorZh: honor.honor.zh,
                  honorEn: honor.honor.en
                }))
              }
            }
          })
        }
        return NextResponse.json({ success: true, message: '个人简介数据更新成功' })
      
      case 'updateResearch':
        // 先删除所有研究方向数据
        await prisma.researchDirection.deleteMany()
        // 创建新的研究方向数据
        if (data.directions && data.directions.length > 0) {
          await prisma.researchDirection.createMany({
            data: data.directions.map((direction: any) => ({
              nameZh: direction.name.zh,
              nameEn: direction.name.en,
              backgroundZh: direction.background.zh,
              backgroundEn: direction.background.en,
              contentZh: direction.content.zh,
              contentEn: direction.content.en,
              methodsZh: direction.methods.zh,
              methodsEn: direction.methods.en,
              applicationsZh: direction.applications.zh,
              applicationsEn: direction.applications.en,
              image: direction.image
            }))
          })
        }
        
        // 更新研究方向概述
        if (data.overview) {
          const existingHomepage = await prisma.homepage.findFirst()
          if (existingHomepage) {
            await prisma.homepage.update({
              where: { id: existingHomepage.id },
              data: {
                researchOverviewZh: data.overview.zh || '',
                researchOverviewEn: data.overview.en || ''
              }
            })
          } else {
            await prisma.homepage.create({
              data: {
                groupNameZh: '化学生物学与药物化学课题组',
                groupNameEn: 'Chemical Biology and Medicinal Chemistry Research Group',
                piNameZh: '张三 教授',
                piNameEn: 'Prof. Zhang San',
                collegeZh: '北京大学化学学院',
                collegeEn: 'College of Chemistry, Peking University',
                addressZh: '北京市海淀区颐和园路5号',
                addressEn: 'No. 5 Yiheyuan Road, Haidian District, Beijing',
                researchOverviewZh: data.overview.zh || '',
                researchOverviewEn: data.overview.en || '',
                researchDirectionsZh: '主要研究方向包括：天然产物全合成、化学生物学探针开发、药物靶点发现与验证、创新药物设计与合成。',
                researchDirectionsEn: 'Our main research directions include: total synthesis of natural products, development of chemical biology probes, drug target discovery and validation, and innovative drug design and synthesis.'
              }
            })
          }
        }
        return NextResponse.json({ success: true, message: '研究方向数据更新成功' })
      
      case 'updateTeam':
        // 先删除所有团队成员数据
        await prisma.teamMember.deleteMany()
        // 创建新的团队成员数据
        const teamMembers = []
        
        // 添加PI
        teamMembers.push({
          type: 'pi',
          nameZh: data.pi.name.zh,
          nameEn: data.pi.name.en,
          titleZh: data.pi.title?.zh,
          titleEn: data.pi.title?.en,
          researchZh: data.pi.researchField?.zh,
          researchEn: data.pi.researchField?.en,
          email: data.pi.email,
          photo: data.pi.photo
        })
        
        // 添加博士生
        if (data.phdStudents && data.phdStudents.length > 0) {
          data.phdStudents.forEach((student: any) => {
            teamMembers.push({
              type: 'phd',
              nameZh: student.name.zh,
              nameEn: student.name.en,
              grade: student.grade,
              researchZh: student.research?.zh,
              researchEn: student.research?.en,
              email: student.email,
              photo: student.photo
            })
          })
        }
        
        // 添加硕士生
        if (data.masterStudents && data.masterStudents.length > 0) {
          data.masterStudents.forEach((student: any) => {
            teamMembers.push({
              type: 'master',
              nameZh: student.name.zh,
              nameEn: student.name.en,
              grade: student.grade,
              researchZh: student.research?.zh,
              researchEn: student.research?.en,
              email: student.email,
              photo: student.photo
            })
          })
        }
        
        // 添加 alumni
        if (data.alumni && data.alumni.length > 0) {
          data.alumni.forEach((alumnus: any) => {
            teamMembers.push({
              type: 'alumni',
              nameZh: alumnus.name.zh,
              nameEn: alumnus.name.en,
              graduationYear: alumnus.graduationYear,
              degreeZh: alumnus.degree?.zh,
              degreeEn: alumnus.degree?.en,
              destinationZh: alumnus.destination?.zh,
              destinationEn: alumnus.destination?.en,
              photo: alumnus.photo
            })
          })
        }
        
        if (teamMembers.length > 0) {
          await prisma.teamMember.createMany({ data: teamMembers })
        }
        return NextResponse.json({ success: true, message: '团队成员数据更新成功' })
      
      case 'updateProjects':
        // 先删除所有项目数据
        await prisma.project.deleteMany()
        // 创建新的项目数据
        const projects: Array<{ status: string; nameZh: string; nameEn: string; number: string; period: string; roleZh: string; roleEn: string; contentZh: string; contentEn: string; achievementsZh: string; achievementsEn: string }> = []
        
        // 添加进行中项目
        if (data.ongoing && data.ongoing.length > 0) {
          data.ongoing.forEach((project: any) => {
            projects.push({
              status: 'ongoing',
              nameZh: project.name.zh,
              nameEn: project.name.en,
              number: project.number,
              period: project.period,
              roleZh: project.role.zh,
              roleEn: project.role.en,
              contentZh: project.content.zh,
              contentEn: project.content.en,
              achievementsZh: project.achievements.zh,
              achievementsEn: project.achievements.en
            })
          })
        }
        
        // 添加已完成项目
        if (data.completed && data.completed.length > 0) {
          data.completed.forEach((project: any) => {
            projects.push({
              status: 'completed',
              nameZh: project.name.zh,
              nameEn: project.name.en,
              number: project.number,
              period: project.period,
              roleZh: project.role.zh,
              roleEn: project.role.en,
              contentZh: project.content.zh,
              contentEn: project.content.en,
              achievementsZh: project.achievements.zh,
              achievementsEn: project.achievements.en
            })
          })
        }
        
        if (projects.length > 0) {
          await prisma.project.createMany({ data: projects })
        }
        return NextResponse.json({ success: true, message: '科研项目数据更新成功' })
      
      case 'updatePublications':
        // 先删除所有论文数据
        await prisma.publication.deleteMany()
        // 创建新的论文数据
        if (data && data.length > 0) {
          await prisma.publication.createMany({
            data: data.map((pub: any) => ({
              authorsZh: pub.authors.zh,
              authorsEn: pub.authors.en,
              titleZh: pub.title.zh,
              titleEn: pub.title.en,
              journalZh: pub.journal.zh,
              journalEn: pub.journal.en,
              year: pub.year,
              volume: pub.volume,
              pages: pub.pages,
              doi: pub.doi,
              isRepresentative: pub.isRepresentative,
              isHighImpact: pub.isHighImpact,
              pdfLink: pub.pdfLink
            }))
          })
        }
        return NextResponse.json({ success: true, message: '学术论文数据更新成功' })
      
      case 'updateFacilities':
        // 先删除所有实验平台数据
        await prisma.facility.deleteMany()
        // 创建新的实验平台数据
        console.log('updateFacilities received data:', JSON.stringify(data, null, 2))
        if (data && data.length > 0) {
          // 过滤掉完全无效的设备数据（没有有效的名称）
          const validFacilities = data.filter((facility: any) => {
            console.log('Processing facility:', JSON.stringify(facility))
            console.log('facility.name:', JSON.stringify(facility.name))
            console.log('facility.name?.zh:', facility.name?.zh)
            console.log('facility.name?.en:', facility.name?.en)
            const hasName = facility.name && (facility.name.zh || facility.name.en);
            console.log('hasName:', hasName)
            return hasName;
          });
          console.log('Valid facilities count:', validFacilities.length)
          
          if (validFacilities.length > 0) {
            await prisma.facility.createMany({
              data: validFacilities.map((facility: any) => ({
                category: facility.category || 'other',
                nameZh: (facility.name?.zh || facility.name?.en || '').substring(0, 100),
                nameEn: (facility.name?.en || facility.name?.zh || '').substring(0, 100),
                shareable: facility.shareable === true || facility.shareable === 'true'
              }))
            });
          }
        }
        return NextResponse.json({ success: true, message: '实验平台数据更新成功' })
      
      case 'updateContact':
        // 先检查是否存在联系数据
        const existingContact = await prisma.contact.findFirst()
        if (existingContact) {
          // 更新现有数据
          await prisma.contact.update({
            where: { id: existingContact.id },
            data: {
              email: data.email,
              addressZh: data.address.zh,
              addressEn: data.address.en,
              lat: data.lat,
              lng: data.lng
            }
          })
        } else {
          // 创建新数据
          await prisma.contact.create({
            data: {
              email: data.email,
              addressZh: data.address.zh,
              addressEn: data.address.en,
              lat: data.lat,
              lng: data.lng
            }
          })
        }
        return NextResponse.json({ success: true, message: '联系我们数据更新成功' })
      
      case 'updateNavigation':
        try {
          // 检查是否存在导航数据
          const existingNavigation = await prisma.navigation.findFirst()
          if (existingNavigation) {
            // 更新现有数据
            await prisma.navigation.update({
              where: { id: existingNavigation.id },
              data: {
                data: JSON.stringify(data)
              }
            })
          } else {
            // 创建新数据
            await prisma.navigation.create({
              data: {
                data: JSON.stringify(data)
              }
            })
          }
          return NextResponse.json({ success: true, message: '导航与页尾数据更新成功' })
        } catch (error) {
          console.error('Failed to update navigation data:', error)
          return NextResponse.json({ success: false, message: '更新导航数据失败' })
        }
      
      default:
        return NextResponse.json({ success: false, message: '未知操作' })
    }
  } catch (error) {
    console.error('API error:', error)
    // 尝试获取更详细的错误信息
    let errorMessage = '服务器错误'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.log('Returning error response:', { success: false, message: errorMessage })
    return NextResponse.json({ success: false, message: errorMessage })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    // 在Vercel环境中，直接返回默认数据，不执行数据库操作
    if (isVercel) {
      console.log('Running on Vercel, returning default data')
      
      switch (action) {
        case 'getHomepage':
          return NextResponse.json({
            success: true,
            data: {
              groupName: {
                zh: '化学生物学与药物化学课题组',
                en: 'Chemical Biology and Medicinal Chemistry Research Group'
              },
              piName: {
                zh: '张三 教授',
                en: 'Prof. Zhang San'
              },
              college: {
                zh: '北京大学化学学院',
                en: 'College of Chemistry, Peking University'
              },
              address: {
                zh: '北京市海淀区颐和园路5号',
                en: 'No. 5 Yiheyuan Road, Haidian District, Beijing'
              },
              researchOverview: {
                zh: '我们致力于化学生物学与药物化学的交叉研究，探索生命过程中的分子机制，开发新型治疗药物。',
                en: 'We are dedicated to interdisciplinary research in chemical biology and medicinal chemistry, exploring molecular mechanisms in life processes and developing novel therapeutic drugs.'
              },
              researchDirections: {
                zh: '主要研究方向包括：天然产物全合成、化学生物学探针开发、药物靶点发现与验证、创新药物设计与合成。',
                en: 'Our main research directions include: total synthesis of natural products, development of chemical biology probes, drug target discovery and validation, and innovative drug design and synthesis.'
              },
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
                }
              ]
            }
          })
        
        case 'getAbout':
          return NextResponse.json({
            success: true,
            data: {
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
                zh: '化学楼A201',
                en: 'Chemistry Building A201'
              },
              email: 'zhangsan@pku.edu.cn',
              photo: '',
              education: [
                {
                  id: 1,
                  period: '2000-2004',
                  institution: {
                    zh: '北京大学',
                    en: 'Peking University'
                  },
                  degree: {
                    zh: '博士',
                    en: 'Ph.D.'
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
                  period: '2004-至今',
                  organization: {
                    zh: '北京大学',
                    en: 'Peking University'
                  },
                  position: {
                    zh: '教授',
                    en: 'Professor'
                  }
                }
              ],
              academicPositions: [
                {
                  id: 1,
                  position: {
                    zh: '中国化学会会员',
                    en: 'Member of Chinese Chemical Society'
                  }
                }
              ],
              honors: [
                {
                  id: 1,
                  honor: {
                    zh: '国家自然科学基金优秀青年科学基金',
                    en: 'National Science Fund for Distinguished Young Scholars'
                  }
                }
              ]
            }
          })
        
        case 'getResearch':
          return NextResponse.json({
            success: true,
            data: {
              directions: [
                {
                  id: 1,
                  name: {
                    zh: '天然产物全合成',
                    en: 'Total Synthesis of Natural Products'
                  },
                  background: {
                    zh: '天然产物是药物发现的重要来源，具有复杂的化学结构和多样的生物活性。',
                    en: 'Natural products are important sources for drug discovery, with complex chemical structures and diverse biological activities.'
                  },
                  content: {
                    zh: '我们致力于开发高效、简洁的合成策略，实现具有重要生物活性的天然产物的全合成。',
                    en: 'We are committed to developing efficient and concise synthetic strategies to achieve total synthesis of natural products with important biological activities.'
                  },
                  methods: {
                    zh: '运用现代有机合成方法，如不对称催化、串联反应等，提高合成效率。',
                    en: 'Using modern organic synthesis methods such as asymmetric catalysis and tandem reactions to improve synthesis efficiency.'
                  },
                  applications: {
                    zh: '为药物开发提供结构基础，探索天然产物的生物作用机制。',
                    en: 'Providing structural basis for drug development and exploring the biological mechanisms of natural products.'
                  },
                  image: ''
                },
                {
                  id: 2,
                  name: {
                    zh: '化学生物学探针开发',
                    en: 'Development of Chemical Biology Probes'
                  },
                  background: {
                    zh: '化学生物学探针是研究生物分子功能和相互作用的重要工具。',
                    en: 'Chemical biology probes are important tools for studying the functions and interactions of biomolecules.'
                  },
                  content: {
                    zh: '设计和合成具有高选择性和敏感性的化学探针，用于生物分子的标记和检测。',
                    en: 'Designing and synthesizing chemical probes with high selectivity and sensitivity for labeling and detecting biomolecules.'
                  },
                  methods: {
                    zh: '结合荧光成像、质谱分析等技术，实现对生物分子的实时监测。',
                    en: 'Combining fluorescence imaging, mass spectrometry and other techniques to achieve real-time monitoring of biomolecules.'
                  },
                  applications: {
                    zh: '用于疾病诊断、药物筛选和生物分子功能研究。',
                    en: 'Used for disease diagnosis, drug screening and biomolecular function research.'
                  },
                  image: ''
                }
              ]
            }
          })
        
        case 'getTeam':
          return NextResponse.json({
            success: true,
            data: {
              pi: {
                name: {
                  zh: '张三',
                  en: 'Zhang San'
                },
                title: {
                  zh: '教授',
                  en: 'Professor'
                },
                researchField: {
                  zh: '化学生物学、药物化学',
                  en: 'Chemical Biology, Medicinal Chemistry'
                },
                email: 'zhangsan@pku.edu.cn',
                photo: ''
              },
              phdStudents: [],
              masterStudents: [],
              alumni: []
            }
          })
        
        case 'getProjects':
          return NextResponse.json({
            success: true,
            data: {
              ongoing: [],
              completed: []
            }
          })
        
        case 'getPublications':
          return NextResponse.json({
            success: true,
            data: []
          })
        
        case 'getFacilities':
          return NextResponse.json({
            success: true,
            data: []
          })
        
        case 'getContact':
          return NextResponse.json({
            success: true,
            data: {
              email: 'contact@example.com',
              address: {
                zh: '北京市海淀区颐和园路5号',
                en: 'No. 5 Yiheyuan Road, Haidian District, Beijing'
              },
              lat: 39.9988,
              lng: 116.3288
            }
          })
        
        case 'getNavigation':
          return NextResponse.json({
            success: true,
            data: {
              navigation: [
                {
                  id: 1,
                  label: {
                    zh: '首页',
                    en: 'Home'
                  },
                  href: '/',
                  isActive: true
                },
                {
                  id: 2,
                  label: {
                    zh: '个人简介',
                    en: 'About'
                  },
                  href: '/about',
                  isActive: false
                },
                {
                  id: 3,
                  label: {
                    zh: '研究方向',
                    en: 'Research'
                  },
                  href: '/research',
                  isActive: false
                },
                {
                  id: 4,
                  label: {
                    zh: '研究团队',
                    en: 'Team'
                  },
                  href: '/team',
                  isActive: false
                },
                {
                  id: 5,
                  label: {
                    zh: '科研项目',
                    en: 'Projects'
                  },
                  href: '/projects',
                  isActive: false
                },
                {
                  id: 6,
                  label: {
                    zh: '学术论文',
                    en: 'Publications'
                  },
                  href: '/publications',
                  isActive: false
                },
                {
                  id: 7,
                  label: {
                    zh: '联系我们',
                    en: 'Contact'
                  },
                  href: '/contact',
                  isActive: false
                }
              ],
              footer: {
                copyright: {
                  zh: '© 2026 化学生物学与药物化学课题组. 保留所有权利.',
                  en: '© 2026 Chemical Biology and Medicinal Chemistry Research Group. All rights reserved.'
                },
                socialLinks: [
                  {
                    platform: 'github',
                    url: 'https://github.com',
                    icon: 'github'
                  },
                  {
                    platform: 'google-scholar',
                    url: 'https://scholar.google.com',
                    icon: 'google-scholar'
                  }
                ]
              }
            }
          })
        
        default:
          return NextResponse.json({ success: false, message: '未知操作' })
      }
    }

    switch (action) {
      case 'getHomepage':
        const homepage = await prisma.homepage.findFirst({
          include: { news: true }
        })
        if (homepage) {
          return NextResponse.json({
            success: true,
            data: {
              groupName: {
                zh: homepage.groupNameZh,
                en: homepage.groupNameEn
              },
              piName: {
                zh: homepage.piNameZh,
                en: homepage.piNameEn
              },
              college: {
                zh: homepage.collegeZh,
                en: homepage.collegeEn
              },
              address: {
                zh: homepage.addressZh,
                en: homepage.addressEn
              },
              researchOverview: {
                zh: homepage.researchOverviewZh,
                en: homepage.researchOverviewEn
              },
              researchDirections: {
                zh: homepage.researchDirectionsZh || '主要研究方向包括：天然产物全合成、化学生物学探针开发、药物靶点发现与验证、创新药物设计与合成。',
                en: homepage.researchDirectionsEn || 'Our main research directions include: total synthesis of natural products, development of chemical biology probes, drug target discovery and validation, and innovative drug design and synthesis.'
              },
              researchImage: homepage.researchImage,
              news: homepage.news.map((news: any, index: number) => ({
                id: index + 1,
                date: news.date,
                title: { zh: news.titleZh, en: news.titleEn },
                description: { zh: news.descriptionZh, en: news.descriptionEn }
              }))
            }
          })
        } else {
          // 返回默认数据
          return NextResponse.json({
            success: true,
            data: {
              groupName: {
                zh: '化学生物学与药物化学课题组',
                en: 'Chemical Biology and Medicinal Chemistry Research Group'
              },
              piName: {
                zh: '张三 教授',
                en: 'Prof. Zhang San'
              },
              college: {
                zh: '北京大学化学学院',
                en: 'College of Chemistry, Peking University'
              },
              address: {
                zh: '北京市海淀区颐和园路5号',
                en: 'No. 5 Yiheyuan Road, Haidian District, Beijing'
              },
              researchOverview: {
                zh: '我们致力于化学生物学与药物化学的交叉研究，探索生命过程中的分子机制，开发新型治疗药物。',
                en: 'We are dedicated to interdisciplinary research in chemical biology and medicinal chemistry, exploring molecular mechanisms in life processes and developing novel therapeutic drugs.'
              },
              researchDirections: {
                zh: '主要研究方向包括：天然产物全合成、化学生物学探针开发、药物靶点发现与验证、创新药物设计与合成。',
                en: 'Our main research directions include: total synthesis of natural products, development of chemical biology probes, drug target discovery and validation, and innovative drug design and synthesis.'
              },
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
                }
              ]
            }
          })
        }
      
      case 'getAbout':
        const about = await prisma.about.findFirst({
          include: { education: true, workExperience: true, academicPosition: true, honor: true }
        })
        if (about) {
          return NextResponse.json({
            success: true,
            data: {
              name: { zh: about.nameZh, en: about.nameEn },
              title: { zh: about.titleZh, en: about.titleEn },
              college: { zh: about.collegeZh, en: about.collegeEn },
              researchField: { zh: about.researchFieldZh, en: about.researchFieldEn },
              office: { zh: about.officeZh, en: about.officeEn },
              email: about.email,
              photo: about.photo,
              education: about.education.map((edu: any, index: number) => ({
                id: index + 1,
                period: edu.period,
                institution: { zh: edu.institutionZh, en: edu.institutionEn },
                degree: { zh: edu.degreeZh, en: edu.degreeEn },
                major: { zh: edu.majorZh, en: edu.majorEn }
              })),
              workExperience: about.workExperience.map((exp: any, index: number) => ({
                id: index + 1,
                period: exp.period,
                organization: { zh: exp.organizationZh, en: exp.organizationEn },
                position: { zh: exp.positionZh, en: exp.positionEn }
              })),
              academicPositions: about.academicPosition.map((pos: any, index: number) => ({
                id: index + 1,
                position: { zh: pos.positionZh, en: pos.positionEn }
              })),
              honors: about.honor.map((honor: any, index: number) => ({
                id: index + 1,
                honor: { zh: honor.honorZh, en: honor.honorEn }
              }))
            }
          })
        } else {
          // 返回默认数据
          return NextResponse.json({
            success: true,
            data: {
              name: { zh: '张三', en: 'Zhang San' },
              title: { zh: '教授', en: 'Professor' },
              college: { zh: '北京大学化学学院', en: 'College of Chemistry, Peking University' },
              researchField: { zh: '化学生物学、药物化学', en: 'Chemical Biology, Medicinal Chemistry' },
              office: { zh: '化学楼A区301室', en: 'Room 301, Building A, Chemistry Building' },
              email: 'zhangsan@pku.edu.cn',
              education: [
                {
                  id: 1,
                  period: '2005-2010',
                  institution: { zh: '北京大学', en: 'Peking University' },
                  degree: { zh: '博士', en: 'PhD' },
                  major: { zh: '化学', en: 'Chemistry' }
                },
                {
                  id: 2,
                  period: '2000-2004',
                  institution: { zh: '清华大学', en: 'Tsinghua University' },
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
                  period: '2010-2014',
                  organization: { zh: '哈佛医学院', en: 'Harvard Medical School' },
                  position: { zh: '博士后', en: 'Postdoctoral Fellow' }
                }
              ],
              academicPositions: [
                { id: 1, position: { zh: '国家杰出青年科学基金获得者', en: 'Recipient of National Science Fund for Distinguished Young Scholars' } },
                { id: 2, position: { zh: '教育部长江学者特聘教授', en: 'Changjiang Scholar Distinguished Professor' } }
              ],
              honors: [
                { id: 1, honor: { zh: '国家自然科学一等奖', en: 'National Natural Science First Prize' } },
                { id: 2, honor: { zh: '国际化学会青年科学家奖', en: 'International Chemical Society Young Scientist Award' } }
              ]
            }
          })
        }
      
      case 'getResearch':
        const researchDirections = await prisma.researchDirection.findMany()
        const researchHomepage = await prisma.homepage.findFirst()
        
        let overview = {
          zh: '我们致力于化学生物学与药物化学的交叉研究，探索生命过程中的分子机制，开发新型治疗药物。',
          en: 'We are dedicated to interdisciplinary research in chemical biology and medicinal chemistry, exploring molecular mechanisms in life processes and developing novel therapeutic drugs.'
        }
        
        if (researchHomepage) {
          overview = {
            zh: researchHomepage.researchOverviewZh || overview.zh,
            en: researchHomepage.researchOverviewEn || overview.en
          }
        }
        
        if (researchDirections.length > 0) {
          return NextResponse.json({
            success: true,
            data: {
              overview: overview,
              directions: researchDirections.map((direction: any, index: number) => ({
                id: index + 1,
                name: { zh: direction.nameZh, en: direction.nameEn },
                background: { zh: direction.backgroundZh, en: direction.backgroundEn },
                content: { zh: direction.contentZh, en: direction.contentEn },
                methods: { zh: direction.methodsZh, en: direction.methodsEn },
                applications: { zh: direction.applicationsZh, en: direction.applicationsEn },
                image: direction.image
              }))
            }
          })
        } else {
          // 返回默认数据
          return NextResponse.json({
            success: true,
            data: {
              overview: overview,
              directions: [
                {
                  id: 1,
                  name: { zh: '化学生物学', en: 'Chemical Biology' },
                  background: { zh: '化学生物学是一门新兴的交叉学科，旨在利用化学的原理和方法研究生命现象。', en: 'Chemical biology is an emerging interdisciplinary field that uses chemical principles and methods to study biological phenomena.' },
                  content: { zh: '我们的研究重点包括蛋白质化学修饰、酶催化机制、生物大分子相互作用等。', en: 'Our research focuses on protein chemical modification, enzyme catalytic mechanisms, biomacromolecular interactions, etc.' },
                  methods: { zh: '我们采用合成化学、生物化学、分子生物学等多种方法进行研究。', en: 'We use synthetic chemistry, biochemistry, molecular biology and other methods for research.' },
                  applications: { zh: '研究成果可应用于药物研发、疾病诊断等领域。', en: 'Research results can be applied in drug development, disease diagnosis and other fields.' }
                },
                {
                  id: 2,
                  name: { zh: '药物化学', en: 'Medicinal Chemistry' },
                  background: { zh: '药物化学是研究药物设计、合成和优化的学科。', en: 'Medicinal chemistry is the discipline that studies drug design, synthesis and optimization.' },
                  content: { zh: '我们致力于设计和合成新型药物分子，针对重大疾病靶点进行药物开发。', en: 'We are committed to designing and synthesizing novel drug molecules for major disease targets.' },
                  methods: { zh: '我们运用计算机辅助药物设计、组合化学、高通量筛选等技术。', en: 'We use computer-aided drug design, combinatorial chemistry, high-throughput screening and other technologies.' },
                  applications: { zh: '研究成果有望开发出新型治疗药物，改善人类健康。', en: 'Research results are expected to develop new therapeutic drugs and improve human health.' }
                }
              ]
            }
          })
        }
      
      case 'getTeam':
        const teamMembers = await prisma.teamMember.findMany()
        if (teamMembers.length > 0) {
          const pi = teamMembers.find((member: any) => member.type === 'pi')
          const phdStudents = teamMembers.filter((member: any) => member.type === 'phd')
          const masterStudents = teamMembers.filter((member: any) => member.type === 'master')
          const alumni = teamMembers.filter((member: any) => member.type === 'alumni')
          
          return NextResponse.json({
            success: true,
            data: {
              pi: pi ? {
                name: { zh: pi.nameZh, en: pi.nameEn },
                title: { zh: pi.titleZh || '教授', en: pi.titleEn || 'Professor' },
                researchField: { zh: pi.researchZh, en: pi.researchEn },
                email: pi.email,
                photo: pi.photo || ''
              } : {
                name: { zh: '张三', en: 'Zhang San' },
                title: { zh: '教授', en: 'Professor' },
                researchField: { zh: '', en: '' },
                email: 'zhangsan@pku.edu.cn',
                photo: ''
              },
              phdStudents: phdStudents.map((student: any, index: number) => ({
                id: index + 1,
                name: { zh: student.nameZh, en: student.nameEn },
                grade: student.grade,
                research: student.researchZh ? { zh: student.researchZh, en: student.researchEn } : undefined,
                email: student.email,
                photo: student.photo || ''
              })),
              masterStudents: masterStudents.map((student: any, index: number) => ({
                id: index + 1,
                name: { zh: student.nameZh, en: student.nameEn },
                grade: student.grade,
                research: student.researchZh ? { zh: student.researchZh, en: student.researchEn } : undefined,
                email: student.email,
                photo: student.photo || ''
              })),
              alumni: alumni.map((alumnus: any, index: number) => ({
                id: index + 1,
                name: { zh: alumnus.nameZh, en: alumnus.nameEn },
                graduationYear: alumnus.graduationYear,
                degree: alumnus.degreeZh ? { zh: alumnus.degreeZh, en: alumnus.degreeEn } : undefined,
                destination: alumnus.destinationZh ? { zh: alumnus.destinationZh, en: alumnus.destinationEn } : undefined,
                email: alumnus.email || '',
                photo: alumnus.photo || ''
              }))
            }
          })
        } else {
          // 返回默认数据
          return NextResponse.json({
            success: true,
            data: {
              pi: {
                name: { zh: '张三', en: 'Zhang San' },
                title: { zh: '教授', en: 'Professor' },
                email: 'zhangsan@pku.edu.cn'
              },
              phdStudents: [
                {
                  id: 1,
                  name: { zh: '李四', en: 'Li Si' },
                  grade: '2024级',
                  research: { zh: '化学生物学', en: 'Chemical Biology' },
                  email: 'lisi@pku.edu.cn'
                },
                {
                  id: 2,
                  name: { zh: '王五', en: 'Wang Wu' },
                  grade: '2023级',
                  research: { zh: '药物化学', en: 'Medicinal Chemistry' },
                  email: 'wangwu@pku.edu.cn'
                }
              ],
              masterStudents: [
                {
                  id: 3,
                  name: { zh: '赵六', en: 'Zhao Liu' },
                  grade: '2025级',
                  research: { zh: '化学生物学', en: 'Chemical Biology' },
                  email: 'zhaoliu@pku.edu.cn'
                }
              ],
              alumni: [
                {
                  id: 4,
                  name: { zh: '钱七', en: 'Qian Qi' },
                  graduationYear: '2025',
                  degree: { zh: '博士', en: 'PhD' },
                  destination: { zh: '哈佛大学博士后', en: 'Postdoctoral Fellow at Harvard University' }
                }
              ]
            }
          })
        }
      
      case 'getProjects':
        const projects = await prisma.project.findMany()
        if (projects.length > 0) {
          const ongoing = projects.filter((project: any) => project.status === 'ongoing')
          const completed = projects.filter((project: any) => project.status === 'completed')
          
          return NextResponse.json({
            success: true,
            data: {
              ongoing: ongoing.map((project: any, index: number) => ({
                id: index + 1,
                name: { zh: project.nameZh, en: project.nameEn },
                number: project.number,
                period: project.period,
                role: { zh: project.roleZh, en: project.roleEn },
                content: { zh: project.contentZh, en: project.contentEn },
                achievements: { zh: project.achievementsZh, en: project.achievementsEn }
              })),
              completed: completed.map((project: any, index: number) => ({
                id: index + 1,
                name: { zh: project.nameZh, en: project.nameEn },
                number: project.number,
                period: project.period,
                role: { zh: project.roleZh, en: project.roleEn },
                content: { zh: project.contentZh, en: project.contentEn },
                achievements: { zh: project.achievementsZh, en: project.achievementsEn }
              }))
            }
          })
        } else {
          // 返回默认数据
          return NextResponse.json({
            success: true,
            data: {
              ongoing: [
                {
                  id: 1,
                  name: { zh: '新型抗肿瘤药物的设计与合成', en: 'Design and Synthesis of Novel Antitumor Drugs' },
                  number: '2025CB932500',
                  period: '2025-2030',
                  role: { zh: '项目负责人', en: 'Principal Investigator' },
                  content: { zh: '针对肿瘤细胞特定靶点，设计合成新型小分子抑制剂。', en: 'Design and synthesize novel small molecule inhibitors targeting specific tumor cell targets.' },
                  achievements: { zh: '已合成100余个化合物，其中5个表现出良好的抗肿瘤活性。', en: 'Over 100 compounds have been synthesized, 5 of which show good antitumor activity.' }
                }
              ],
              completed: [
                {
                  id: 2,
                  name: { zh: '酶催化反应机制研究', en: 'Study on Enzyme Catalytic Mechanism' },
                  number: '2020CB932500',
                  period: '2020-2025',
                  role: { zh: '项目负责人', en: 'Principal Investigator' },
                  content: { zh: '研究关键酶的催化机制，为药物设计提供理论基础。', en: 'Study the catalytic mechanism of key enzymes to provide theoretical basis for drug design.' },
                  achievements: { zh: '发表SCI论文20余篇，获得国家自然科学二等奖。', en: 'Published more than 20 SCI papers and won the National Natural Science Second Prize.' }
                }
              ]
            }
          })
        }
      
      case 'getPublications':
        const publications = await prisma.publication.findMany()
        if (publications.length > 0) {
          return NextResponse.json({
            success: true,
            data: publications.map((pub: any, index: number) => ({
              id: index + 1,
              authors: { zh: pub.authorsZh, en: pub.authorsEn },
              title: { zh: pub.titleZh, en: pub.titleEn },
              journal: { zh: pub.journalZh, en: pub.journalEn },
              year: pub.year,
              volume: pub.volume,
              pages: pub.pages,
              doi: pub.doi,
              isRepresentative: pub.isRepresentative,
              isHighImpact: pub.isHighImpact,
              pdfLink: pub.pdfLink
            }))
          })
        } else {
          // 返回默认数据
          return NextResponse.json({
            success: true,
            data: [
              {
                id: 1,
                authors: { zh: '张三, 李四, 王五', en: 'Zhang S., Li S., Wang W.' },
                title: { zh: '新型催化剂的设计与应用', en: 'Design and Application of Novel Catalysts' },
                journal: { zh: 'Nature', en: 'Nature' },
                year: '2026',
                volume: '650',
                pages: '123-128',
                doi: '10.1038/nature.2026.12345',
                isRepresentative: true,
                isHighImpact: true,
                pdfLink: '#'
              },
              {
                id: 2,
                authors: { zh: '李四, 张三, 赵六', en: 'Li S., Zhang S., Zhao L.' },
                title: { zh: '蛋白质修饰的新方法', en: 'Novel Methods for Protein Modification' },
                journal: { zh: 'Science', en: 'Science' },
                year: '2025',
                volume: '370',
                pages: '456-461',
                doi: '10.1126/science.abc1234',
                isRepresentative: false,
                isHighImpact: true,
                pdfLink: '#'
              }
            ]
          })
        }
      
      case 'getFacilities':
        const facilities = await prisma.facility.findMany()
        if (facilities.length > 0) {
          return NextResponse.json({
            success: true,
            data: facilities.map((facility: any, index: number) => ({
              id: index + 1,
              category: facility.category,
              name: { zh: facility.nameZh, en: facility.nameEn },
              shareable: facility.shareable
            }))
          })
        } else {
          // 返回默认数据
          return NextResponse.json({
            success: true,
            data: [
              {
                id: 1,
                category: 'synthesis',
                name: { zh: '有机合成实验室', en: 'Organic Synthesis Laboratory' },
                shareable: true
              },
              {
                id: 2,
                category: 'characterization',
                name: { zh: '光谱分析室', en: 'Spectroscopy Laboratory' },
                shareable: true
              },
              {
                id: 3,
                category: 'testing',
                name: { zh: '细胞培养室', en: 'Cell Culture Laboratory' },
                shareable: false
              }
            ]
          })
        }
      
      case 'getContact':
        const contact = await prisma.contact.findFirst()
        if (contact) {
          return NextResponse.json({
            success: true,
            data: {
              email: contact.email,
              address: {
                zh: contact.addressZh,
                en: contact.addressEn
              },
              lat: contact.lat,
              lng: contact.lng
            }
          })
        } else {
          // 返回默认数据
          return NextResponse.json({
            success: true,
            data: {
              email: 'group@pku.edu.cn',
              address: {
                zh: '北京市海淀区颐和园路5号北京大学化学学院',
                en: 'College of Chemistry, Peking University, No. 5 Yiheyuan Road, Haidian District, Beijing'
              },
              lat: '39.9943',
              lng: '116.3085'
            }
          })
        }
      
      case 'getNavigation':
        try {
          // 从数据库获取导航数据
          const navigationData = await prisma.navigation.findFirst()
          if (navigationData) {
            return NextResponse.json({
              success: true,
              data: JSON.parse(navigationData.data)
            })
          } else {
            // 返回默认数据
            const defaultData = {
              navigation: [
                {
                  id: 1,
                  name: {
                    zh: '首页',
                    en: 'Home'
                  },
                  href: '/'
                },
                {
                  id: 2,
                  name: {
                    zh: '关于我们',
                    en: 'About'
                  },
                  href: '/about'
                },
                {
                  id: 3,
                  name: {
                    zh: '研究方向',
                    en: 'Research'
                  },
                  href: '/research'
                },
                {
                  id: 4,
                  name: {
                    zh: '研究团队',
                    en: 'Team'
                  },
                  href: '/team'
                },
                {
                  id: 5,
                  name: {
                    zh: '科研项目',
                    en: 'Projects'
                  },
                  href: '/projects'
                },
                {
                  id: 6,
                  name: {
                    zh: '学术论文',
                    en: 'Publications'
                  },
                  href: '/publications'
                },
                {
                  id: 7,
                  name: {
                    zh: '实验平台',
                    en: 'Facilities'
                  },
                  href: '/facilities'
                },
                {
                  id: 8,
                  name: {
                    zh: '联系我们',
                    en: 'Contact'
                  },
                  href: '/contact'
                }
              ],
              footer: {
                groupInfo: {
                  name: {
                    zh: '学术课题组',
                    en: 'Academic Research Group'
                  },
                  college: {
                    zh: '北京大学化学学院',
                    en: 'College of Chemistry, Peking University'
                  }
                },
                quickLinks: [
                  {
                    id: 1,
                    name: {
                      zh: '首页',
                      en: 'Home'
                    },
                    href: '/'
                  },
                  {
                    id: 2,
                    name: {
                      zh: '个人简介',
                      en: 'About'
                    },
                    href: '/about'
                  },
                  {
                    id: 3,
                    name: {
                      zh: '研究方向',
                      en: 'Research'
                    },
                    href: '/research'
                  },
                  {
                    id: 4,
                    name: {
                      zh: '联系我们',
                      en: 'Contact'
                    },
                    href: '/contact'
                  }
                ],
                contactInfo: {
                  address: {
                    zh: '北京市海淀区颐和园路5号',
                    en: 'No. 5 Yiheyuan Road, Haidian District, Beijing'
                  },
                  email: 'contact@example.com'
                },
                copyright: {
                  zh: '© 2026 化学生物学与药物化学课题组. 保留所有权利.',
                  en: '© 2026 Chemical Biology and Medicinal Chemistry Research Group. All rights reserved.'
                },
                disclaimer: {
                  zh: '本网站内容仅供参考，如有任何问题，请联系我们。',
                  en: 'The content of this website is for reference only. If you have any questions, please contact us.'
                }
              }
            }
            // 保存默认数据到数据库
            await prisma.navigation.create({
              data: {
                data: JSON.stringify(defaultData)
              }
            })
            return NextResponse.json({
              success: true,
              data: defaultData
            })
          }
        } catch (error) {
          console.error('Failed to get navigation data:', error)
          return NextResponse.json({ success: false, message: '获取导航数据失败' })
        }
      
      default:
        return NextResponse.json({ success: false, message: '未知操作' })
    }
  } catch (error) {
    console.error('API error:', error)
    // 尝试获取更详细的错误信息
    let errorMessage = '服务器错误'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.log('Returning error response:', { success: false, message: errorMessage })
    return NextResponse.json({ success: false, message: errorMessage })
  }
}