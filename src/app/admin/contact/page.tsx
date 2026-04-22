'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ContactManagementPage = () => {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: 'zhangsan@pku.edu.cn',
    address: {
      zh: '北京市海淀区颐和园路5号北京大学化学楼A区301室',
      en: 'Room 301, Building A, Chemistry Building, Peking University, No. 5 Yiheyuan Road, Haidian District, Beijing'
    },
    mapCoordinates: {
      lat: '39.9872',
      lng: '116.3123'
    }
  })

  useEffect(() => {
    // 从API加载数据
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin?action=getContact')
        const data = await response.json()
        if (data.success) {
          // 转换数据结构以匹配前端期望的格式
          const transformedData = {
            email: data.data.email,
            address: data.data.address,
            mapCoordinates: {
              lat: data.data.lat,
              lng: data.data.lng
            }
          }
          setFormData(transformedData)
        }
      } catch (error) {
        console.error('Failed to fetch contact data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // 转换数据结构以匹配API期望的格式
      const transformedData = {
        email: formData.email,
        address: formData.address,
        lat: formData.mapCoordinates.lat,
        lng: formData.mapCoordinates.lng
      }
      
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'updateContact',
          data: transformedData
        })
      })
      const result = await response.json()
      if (result.success) {
        alert('联系信息更新成功！')
        router.push('/admin')
      } else {
        alert('更新失败：' + result.message)
      }
    } catch (error) {
      console.error('Failed to update contact data:', error)
      alert('更新失败：服务器错误')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">联系我们管理</h1>

        <div className="mb-6">
          <button 
            type="button" 
            onClick={() => router.push('/admin')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
          >
            ← 返回管理首页
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 联系信息 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">联系信息</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">工作邮箱</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="邮箱地址"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">单位实验室地址</label>
                <div className="space-y-2">
                  <textarea
                    value={formData.address.zh}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, zh: e.target.value }
                    })}
                    className="w-full border border-gray-300 rounded-md p-2"
                    rows={3}
                    placeholder="中文地址"
                  />
                  <textarea
                    value={formData.address.en}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, en: e.target.value }
                    })}
                    className="w-full border border-gray-300 rounded-md p-2"
                    rows={3}
                    placeholder="英文地址"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 地图设置 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">地图位置</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">纬度</label>
                  <input
                    type="text"
                    value={formData.mapCoordinates.lat}
                    onChange={(e) => setFormData({
                      ...formData,
                      mapCoordinates: { ...formData.mapCoordinates, lat: e.target.value }
                    })}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="纬度"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">经度</label>
                  <input
                    type="text"
                    value={formData.mapCoordinates.lng}
                    onChange={(e) => setFormData({
                      ...formData,
                      mapCoordinates: { ...formData.mapCoordinates, lng: e.target.value }
                    })}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="经度"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">地图预览</label>
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">地图预览区域（百度地图）</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  提示：可以通过地图应用获取精确的经纬度坐标
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              保存更改
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContactManagementPage
