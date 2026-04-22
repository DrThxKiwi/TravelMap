'use client'

import { useState, useEffect } from 'react'

const TestPage = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<string>('')

  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      setData('测试页面数据')
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-primary mb-8">测试页面</h1>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <p>{data}</p>
      </div>
    </div>
  )
}

export default TestPage