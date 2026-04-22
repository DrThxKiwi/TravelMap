import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('Received POST request')
    let requestBody
    const contentType = request.headers.get('content-type')

    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData()
      requestBody = {
        action: formData.get('action') as string,
        data: JSON.parse(formData.get('data') as string)
      }
    } else {
      requestBody = await request.json()
    }

    console.log('Request body:', requestBody)
    const { action, data } = requestBody

    switch (action) {
      case 'login':
        const { username, password } = data
        if (username === 'admin' && password === 'admin123') {
          return NextResponse.json({ success: true, message: '登录成功' })
        } else {
          return NextResponse.json({ success: false, message: '用户名或密码错误' })
        }

      case 'updateHomepage':
        try {
          const existingHomepage = await prisma.homepage.findFirst()
          if (existingHomepage) {
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
            await prisma.homepage.create({
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
          return NextResponse.json({ success: true, message: '首页数据更新成功' })
        } catch (error) {
          console.error('Error updating homepage:', error)
          return NextResponse.json({ success: false, message: '更新首页数据失败' })
        }

      case 'updateAbout':
        try {
          const existingAbout = await prisma.about.findFirst()
          if (existingAbout) {
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
        } catch (error) {
          console.error('Error updating about:', error)
          return NextResponse.json({ success: false, message: '更新个人简介数据失败' })
        }

      case 'updateResearch':
        try {
          await prisma.researchDirection.deleteMany()
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
        } catch (error) {
          console.error('Error updating research:', error)
          return NextResponse.json({ success: false, message: '更新研究方向数据失败' })
        }

      case 'updateTeam':
        try {
          await prisma.teamMember.deleteMany()
          const teamMembers = []

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
        } catch (error) {
          console.error('Error updating team:', error)
          return NextResponse.json({ success: false, message: '更新团队成员数据失败' })
        }

      case 'updateProjects':
        try {
          await prisma.project.deleteMany()
          const projects: Array<{ status: string; nameZh: string; nameEn: string; number: string; period: string; roleZh: string; roleEn: string; contentZh: string; contentEn: string; achievementsZh: string; achievementsEn: string }> = []

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
        } catch (error) {
          console.error('Error updating projects:', error)
          return NextResponse.json({ success: false, message: '更新科研项目数据失败' })
        }

      case 'updatePublications':
        try {
          await prisma.publication.deleteMany()
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
        } catch (error) {
          console.error('Error updating publications:', error)
          return NextResponse.json({ success: false, message: '更新学术论文数据失败' })
        }

      case 'updateFacilities':
        try {
          await prisma.facility.deleteMany()
          if (data && data.length > 0) {
            const validFacilities = data.filter((facility: any) => {
              return facility.name && (facility.name.zh || facility.name.en)
            })

            if (validFacilities.length > 0) {
              await prisma.facility.createMany({
                data: validFacilities.map((facility: any) => ({
                  category: facility.category || 'other',
                  nameZh: (facility.name?.zh || facility.name?.en || '').substring(0, 100),
                  nameEn: (facility.name?.en || facility.name?.zh || '').substring(0, 100),
                  shareable: facility.shareable === true || facility.shareable === 'true'
                }))
              })
            }
          }
          return NextResponse.json({ success: true, message: '实验平台数据更新成功' })
        } catch (error) {
          console.error('Error updating facilities:', error)
          return NextResponse.json({ success: false, message: '更新实验平台数据失败' })
        }

      case 'updateContact':
        try {
          const existingContact = await prisma.contact.findFirst()
          if (existingContact) {
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
        } catch (error) {
          console.error('Error updating contact:', error)
          return NextResponse.json({ success: false, message: '更新联系我们数据失败' })
        }

      case 'updateNavigation':
        try {
          const existingNavigation = await prisma.navigation.findFirst()
          if (existingNavigation) {
            await prisma.navigation.update({
              where: { id: existingNavigation.id },
              data: {
                data: JSON.stringify(data)
              }
            })
          } else {
            await prisma.navigation.create({
              data: {
                data: JSON.stringify(data)
              }
            })
          }
          return NextResponse.json({ success: true, message: '导航与页尾数据更新成功' })
        } catch (error) {
          console.error('Error updating navigation:', error)
          return NextResponse.json({ success: false, message: '更新导航数据失败' })
        }

      default:
        return NextResponse.json({ success: false, message: '未知操作' })
    }
  } catch (error) {
    console.error('API error:', error)
    let errorMessage = '服务器错误'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json({ success: false, message: errorMessage })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'getHomepage':
        try {
          const homepage = await prisma.homepage.findFirst({
            include: { news: true }
          })
          if (homepage) {
            return NextResponse.json({
              success: true,
              data: {
                groupName: { zh: homepage.groupNameZh, en: homepage.groupNameEn },
                piName: { zh: homepage.piNameZh, en: homepage.piNameEn },
                college: { zh: homepage.collegeZh, en: homepage.collegeEn },
                address: { zh: homepage.addressZh, en: homepage.addressEn },
                researchOverview: { zh: homepage.researchOverviewZh, en: homepage.researchOverviewEn },
                researchDirections: { zh: homepage.researchDirectionsZh, en: homepage.researchDirectionsEn },
                researchImage: homepage.researchImage,
                news: homepage.news.map((news: any, index: number) => ({
                  id: index + 1,
                  date: news.date,
                  title: { zh: news.titleZh, en: news.titleEn },
                  description: { zh: news.descriptionZh, en: news.descriptionEn }
                }))
              }
            })
          }
        } catch (dbError) {
          console.error('Database error in getHomepage:', dbError)
        }
        return NextResponse.json({
          success: true,
          data: {
            groupName: { zh: '化学生物学与药物化学课题组', en: 'Chemical Biology and Medicinal Chemistry Research Group' },
            piName: { zh: '张三 教授', en: 'Prof. Zhang San' },
            college: { zh: '北京大学化学学院', en: 'College of Chemistry, Peking University' },
            address: { zh: '北京市海淀区颐和园路5号', en: 'No. 5 Yiheyuan Road, Haidian District, Beijing' },
            researchOverview: { zh: '我们致力于化学生物学与药物化学的交叉研究，探索生命过程中的分子机制，开发新型治疗药物。', en: 'We are dedicated to interdisciplinary research in chemical biology and medicinal chemistry.' },
            researchDirections: { zh: '主要研究方向包括：天然产物全合成、化学生物学探针开发、药物靶点发现与验证、创新药物设计与合成。', en: 'Main research directions include: total synthesis of natural products, development of chemical biology probes, drug target discovery and validation, and innovative drug design and synthesis.' },
            researchImage: '',
            news: [
              { id: 1, date: '2026-04-15', title: { zh: '课题组在Nature发表重要研究成果', en: 'Research group publishes important findings in Nature' }, description: { zh: '关于新型催化剂的研究取得重大突破', en: 'Major breakthrough in novel catalyst research' } },
              { id: 2, date: '2026-04-10', title: { zh: 'PI应邀在国际会议上做主旨报告', en: 'PI invited to give keynote speech at international conference' }, description: { zh: '在第25届国际化学会议上分享研究成果', en: 'Sharing research results at the 25th International Chemistry Conference' } }
            ]
          }
        })

      case 'getAbout':
        try {
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
          }
        } catch (dbError) {
          console.error('Database error in getAbout:', dbError)
        }
        return NextResponse.json({
          success: true,
          data: {
            name: { zh: '张三', en: 'Zhang San' },
            title: { zh: '教授', en: 'Professor' },
            college: { zh: '北京大学化学学院', en: 'College of Chemistry, Peking University' },
            researchField: { zh: '化学生物学、药物化学', en: 'Chemical Biology, Medicinal Chemistry' },
            office: { zh: '化学楼A区301室', en: 'Room 301, Building A, Chemistry Building' },
            email: 'zhangsan@pku.edu.cn',
            education: [{ id: 1, period: '2005-2010', institution: { zh: '北京大学', en: 'Peking University' }, degree: { zh: '博士', en: 'PhD' }, major: { zh: '化学', en: 'Chemistry' } }],
            workExperience: [{ id: 1, period: '2015-至今', organization: { zh: '北京大学化学学院', en: 'College of Chemistry, Peking University' }, position: { zh: '教授', en: 'Professor' } }],
            academicPositions: [{ id: 1, position: { zh: '国家杰出青年科学基金获得者', en: 'Recipient of National Science Fund for Distinguished Young Scholars' } }],
            honors: [{ id: 1, honor: { zh: '国家自然科学一等奖', en: 'National Natural Science First Prize' } }]
          }
        })

      case 'getResearch':
        try {
          const researchDirections = await prisma.researchDirection.findMany()
          const researchHomepage = await prisma.homepage.findFirst()

          let overview = { zh: '我们致力于化学生物学与药物化学的交叉研究，探索生命过程中的分子机制，开发新型治疗药物。', en: 'We are dedicated to interdisciplinary research in chemical biology and medicinal chemistry.' }

          if (researchHomepage) {
            overview = { zh: researchHomepage.researchOverviewZh || overview.zh, en: researchHomepage.researchOverviewEn || overview.en }
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
          }
        } catch (dbError) {
          console.error('Database error in getResearch:', dbError)
        }
        return NextResponse.json({
          success: true,
          data: {
            overview: { zh: '我们致力于化学生物学与药物化学的交叉研究，探索生命过程中的分子机制，开发新型治疗药物。', en: 'We are dedicated to interdisciplinary research in chemical biology and medicinal chemistry.' },
            directions: [
              { id: 1, name: { zh: '化学生物学', en: 'Chemical Biology' }, background: { zh: '化学生物学是一门新兴的交叉学科。', en: 'Chemical biology is an emerging interdisciplinary field.' }, content: { zh: '我们的研究重点包括蛋白质化学修饰、酶催化机制等。', en: 'Our research focuses on protein chemical modification, enzyme catalytic mechanisms.' }, methods: { zh: '我们采用合成化学、生物化学、分子生物学等多种方法。', en: 'We use synthetic chemistry, biochemistry, molecular biology.' }, applications: { zh: '研究成果可应用于药物研发、疾病诊断等领域。', en: 'Research results can be applied in drug development and disease diagnosis.' } },
              { id: 2, name: { zh: '药物化学', en: 'Medicinal Chemistry' }, background: { zh: '药物化学是研究药物设计、合成和优化的学科。', en: 'Medicinal chemistry studies drug design, synthesis and optimization.' }, content: { zh: '我们致力于设计和合成新型药物分子。', en: 'We are committed to designing and synthesizing novel drug molecules.' }, methods: { zh: '我们运用计算机辅助药物设计、组合化学等技术。', en: 'We use computer-aided drug design, combinatorial chemistry.' }, applications: { zh: '研究成果有望开发出新型治疗药物。', en: 'Research results may lead to new therapeutic drugs.' } }
            ]
          }
        })

      case 'getTeam':
        try {
          const teamMembers = await prisma.teamMember.findMany()
          if (teamMembers.length > 0) {
            const pi = teamMembers.find((member: any) => member.type === 'pi')
            const phdStudents = teamMembers.filter((member: any) => member.type === 'phd')
            const masterStudents = teamMembers.filter((member: any) => member.type === 'master')
            const alumni = teamMembers.filter((member: any) => member.type === 'alumni')

            return NextResponse.json({
              success: true,
              data: {
                pi: pi ? { name: { zh: pi.nameZh, en: pi.nameEn }, title: { zh: pi.titleZh || '教授', en: pi.titleEn || 'Professor' }, researchField: { zh: pi.researchZh, en: pi.researchEn }, email: pi.email, photo: pi.photo || '' } : { name: { zh: '张三', en: 'Zhang San' }, title: { zh: '教授', en: 'Professor' }, researchField: { zh: '', en: '' }, email: 'zhangsan@pku.edu.cn', photo: '' },
                phdStudents: phdStudents.map((student: any, index: number) => ({ id: index + 1, name: { zh: student.nameZh, en: student.nameEn }, grade: student.grade, research: student.researchZh ? { zh: student.researchZh, en: student.researchEn } : undefined, email: student.email, photo: student.photo || '' })),
                masterStudents: masterStudents.map((student: any, index: number) => ({ id: index + 1, name: { zh: student.nameZh, en: student.nameEn }, grade: student.grade, research: student.researchZh ? { zh: student.researchZh, en: student.researchEn } : undefined, email: student.email, photo: student.photo || '' })),
                alumni: alumni.map((alumnus: any, index: number) => ({ id: index + 1, name: { zh: alumnus.nameZh, en: alumnus.nameEn }, graduationYear: alumnus.graduationYear, degree: alumnus.degreeZh ? { zh: alumnus.degreeZh, en: alumnus.degreeEn } : undefined, destination: alumnus.destinationZh ? { zh: alumnus.destinationZh, en: alumnus.destinationEn } : undefined, email: alumnus.email || '', photo: alumnus.photo || '' }))
              }
            })
          }
        } catch (dbError) {
          console.error('Database error in getTeam:', dbError)
        }
        return NextResponse.json({
          success: true,
          data: {
            pi: { name: { zh: '张三', en: 'Zhang San' }, title: { zh: '教授', en: 'Professor' }, email: 'zhangsan@pku.edu.cn' },
            phdStudents: [{ id: 1, name: { zh: '李四', en: 'Li Si' }, grade: '2024级', research: { zh: '化学生物学', en: 'Chemical Biology' }, email: 'lisi@pku.edu.cn' }],
            masterStudents: [{ id: 3, name: { zh: '赵六', en: 'Zhao Liu' }, grade: '2025级', research: { zh: '化学生物学', en: 'Chemical Biology' }, email: 'zhaoliu@pku.edu.cn' }],
            alumni: [{ id: 4, name: { zh: '钱七', en: 'Qian Qi' }, graduationYear: '2025', degree: { zh: '博士', en: 'PhD' }, destination: { zh: '哈佛大学博士后', en: 'Postdoctoral Fellow at Harvard University' } }]
          }
        })

      case 'getProjects':
        try {
          const projects = await prisma.project.findMany()
          if (projects.length > 0) {
            const ongoing = projects.filter((project: any) => project.status === 'ongoing')
            const completed = projects.filter((project: any) => project.status === 'completed')

            return NextResponse.json({
              success: true,
              data: {
                ongoing: ongoing.map((project: any, index: number) => ({ id: index + 1, name: { zh: project.nameZh, en: project.nameEn }, number: project.number, period: project.period, role: { zh: project.roleZh, en: project.roleEn }, content: { zh: project.contentZh, en: project.contentEn }, achievements: { zh: project.achievementsZh, en: project.achievementsEn } })),
                completed: completed.map((project: any, index: number) => ({ id: index + 1, name: { zh: project.nameZh, en: project.nameEn }, number: project.number, period: project.period, role: { zh: project.roleZh, en: project.roleEn }, content: { zh: project.contentZh, en: project.contentEn }, achievements: { zh: project.achievementsZh, en: project.achievementsEn } }))
              }
            })
          }
        } catch (dbError) {
          console.error('Database error in getProjects:', dbError)
        }
        return NextResponse.json({
          success: true,
          data: {
            ongoing: [{ id: 1, name: { zh: '新型抗肿瘤药物的设计与合成', en: 'Design and Synthesis of Novel Antitumor Drugs' }, number: '2025CB932500', period: '2025-2030', role: { zh: '项目负责人', en: 'Principal Investigator' }, content: { zh: '针对肿瘤细胞特定靶点，设计合成新型小分子抑制剂。', en: 'Design and synthesize novel small molecule inhibitors targeting specific tumor cell targets.' }, achievements: { zh: '已合成100余个化合物。', en: 'Over 100 compounds have been synthesized.' } }],
            completed: [{ id: 2, name: { zh: '酶催化反应机制研究', en: 'Study on Enzyme Catalytic Mechanism' }, number: '2020CB932500', period: '2020-2025', role: { zh: '项目负责人', en: 'Principal Investigator' }, content: { zh: '研究关键酶的催化机制，为药物设计提供理论基础。', en: 'Study the catalytic mechanism of key enzymes.' }, achievements: { zh: '发表SCI论文20余篇。', en: 'Published more than 20 SCI papers.' } }]
          }
        })

      case 'getPublications':
        try {
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
                pdfLink: pub.pdfLink,
                image: pub.image
              }))
            })
          }
        } catch (dbError) {
          console.error('Database error in getPublications:', dbError)
        }
        return NextResponse.json({
          success: true,
          data: [
            { id: 1, authors: { zh: '张三, 李四, 王五', en: 'Zhang San, Li Si, Wang Wu' }, title: { zh: '化学生物学探针在肿瘤早期诊断中的应用', en: 'Application of Chemical Biology Probes in Early Tumor Diagnosis' }, journal: { zh: 'Nature', en: 'Nature' }, year: '2026', volume: '545', pages: '123-130', doi: '10.1038/nature24000', isRepresentative: true, isHighImpact: true, pdfLink: '#' },
            { id: 2, authors: { zh: '李四, 张三, 钱七', en: 'Li Si, Zhang San, Qian Qi' }, title: { zh: '天然产物全合成的新方法', en: 'New Methods for Total Synthesis of Natural Products' }, journal: { zh: 'Journal of the American Chemical Society', en: 'Journal of the American Chemical Society' }, year: '2025', volume: '147', pages: '4567-4574', doi: '10.1021/jacs.5b00000', isRepresentative: true, isHighImpact: true, pdfLink: '#' }
          ]
        })

      case 'getContact':
        try {
          const contact = await prisma.contact.findFirst()
          if (contact) {
            return NextResponse.json({
              success: true,
              data: {
                email: contact.email,
                address: { zh: contact.addressZh, en: contact.addressEn },
                lat: contact.lat,
                lng: contact.lng
              }
            })
          }
        } catch (dbError) {
          console.error('Database error in getContact:', dbError)
        }
        return NextResponse.json({
          success: true,
          data: {
            email: 'zhangsan@pku.edu.cn',
            address: { zh: '北京市海淀区颐和园路5号北京大学化学楼A区301室', en: 'Room 301, Building A, Chemistry Building, Peking University, No. 5 Yiheyuan Road, Haidian District, Beijing' },
            lat: '39.9872',
            lng: '116.3123'
          }
        })

      case 'getFacilities':
        try {
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
          }
        } catch (dbError) {
          console.error('Database error in getFacilities:', dbError)
        }
        return NextResponse.json({
          success: true,
          data: [
            { id: 1, category: 'synthesis', name: { zh: '有机合成实验室', en: 'Organic Synthesis Laboratory' }, shareable: true },
            { id: 2, category: 'characterization', name: { zh: '核磁共振波谱仪', en: 'NMR Spectrometer' }, shareable: true }
          ]
        })

      case 'getNavigation':
        try {
          const navigationData = await prisma.navigation.findFirst()
          if (navigationData && navigationData.data) {
            const parsedData = JSON.parse(navigationData.data)
            return NextResponse.json({ success: true, data: parsedData })
          }
        } catch (dbError) {
          console.error('Database error in getNavigation:', dbError)
        }
        return NextResponse.json({
          success: true,
          data: {
            navigation: [
              { id: 1, label: { zh: '首页', en: 'Home' }, href: '/', isActive: true },
              { id: 2, label: { zh: '个人简介', en: 'About' }, href: '/about', isActive: false },
              { id: 3, label: { zh: '研究方向', en: 'Research' }, href: '/research', isActive: false },
              { id: 4, label: { zh: '研究团队', en: 'Team' }, href: '/team', isActive: false },
              { id: 5, label: { zh: '科研项目', en: 'Projects' }, href: '/projects', isActive: false },
              { id: 6, label: { zh: '学术论文', en: 'Publications' }, href: '/publications', isActive: false },
              { id: 7, label: { zh: '联系我们', en: 'Contact' }, href: '/contact', isActive: false }
            ],
            footer: {
              copyright: { zh: '© 2026 化学生物学与药物化学课题组. 保留所有权利.', en: '© 2026 Chemical Biology and Medicinal Chemistry Research Group. All rights reserved.' },
              socialLinks: [
                { platform: 'github', url: 'https://github.com', icon: 'github' },
                { platform: 'google-scholar', url: 'https://scholar.google.com', icon: 'google-scholar' }
              ]
            }
          }
        })

      default:
        return NextResponse.json({ success: false, message: '未知操作' })
    }
  } catch (error) {
    console.error('API error:', error)
    let errorMessage = '服务器错误'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json({ success: false, message: errorMessage })
  }
}
