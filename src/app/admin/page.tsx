'use client'

import Link from 'next/link'

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">
          后台管理系统
        </h1>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">页面数量</h2>
            <p className="text-2xl font-bold text-primary">8</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">研究方向</h2>
            <p className="text-2xl font-bold text-primary">3</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">团队成员</h2>
            <p className="text-2xl font-bold text-primary">6</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">学术论文</h2>
            <p className="text-2xl font-bold text-primary">5</p>
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/homepage" className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">首页管理</h2>
            <p className="text-gray-600">编辑课题组基本信息、科研动态、快速导航</p>
          </Link>
          <Link href="/admin/about" className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">个人简介管理</h2>
            <p className="text-gray-600">编辑个人信息、教育经历、工作经历等</p>
          </Link>
          <Link href="/admin/research" className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">研究方向管理</h2>
            <p className="text-gray-600">添加/编辑/删除研究方向、上传示意图</p>
          </Link>
          <Link href="/admin/team" className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">研究团队管理</h2>
            <p className="text-gray-600">添加/编辑/删除成员信息、上传照片</p>
          </Link>
          <Link href="/admin/projects" className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">科研项目管理</h2>
            <p className="text-gray-600">添加/编辑/删除项目、设置项目状态</p>
          </Link>
          <Link href="/admin/publications" className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">学术论文管理</h2>
            <p className="text-gray-600">添加/编辑/删除论文、上传配图和PDF</p>
          </Link>
          <Link href="/admin/contact" className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">联系我们管理</h2>
            <p className="text-gray-600">编辑联系信息和地图位置</p>
          </Link>
          <Link href="/admin/settings" className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">系统设置</h2>
            <p className="text-gray-600">修改管理员密码、数据备份与恢复</p>
          </Link>
          <Link href="/admin/navigation" className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">导航与页尾管理</h2>
            <p className="text-gray-600">编辑导航栏和页尾的文本内容</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
