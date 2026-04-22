import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// 检查是否在Vercel环境中运行
const isVercel = process.env.VERCEL === '1'

// 确保上传目录存在
const uploadDir = path.join(process.cwd(), 'public', 'uploads')

async function ensureUploadDir() {
  try {
    await fs.access(uploadDir)
  } catch {
    await fs.mkdir(uploadDir, { recursive: true })
  }
}

export async function POST(request: NextRequest) {
  try {
    // 解析FormData
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ success: false, message: '没有选择文件' })
    }
    
    // 在Vercel环境中，直接返回成功响应，不执行文件写入
    if (isVercel) {
      console.log('Running on Vercel, skipping file upload')
      // 生成一个模拟的文件URL
      const filename = `${Date.now()}-${file.name}`
      const fileUrl = `/uploads/${filename}`
      return NextResponse.json({ success: true, url: fileUrl })
    }
    
    // 在本地环境中，执行实际的文件上传
    // 确保上传目录存在
    await ensureUploadDir()
    
    // 生成唯一的文件名
    const filename = `${Date.now()}-${file.name}`
    const filePath = path.join(uploadDir, filename)
    
    // 读取文件内容
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // 写入文件
    await fs.writeFile(filePath, buffer)
    
    // 生成文件URL
    const fileUrl = `/uploads/${filename}`
    
    return NextResponse.json({ success: true, url: fileUrl })
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json({ success: false, message: '文件上传失败' })
  }
}
