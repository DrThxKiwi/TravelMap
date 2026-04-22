'use client'

import { useState } from 'react'

const SettingsPage = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordMessage, setPasswordMessage] = useState('')
  const [backupMessage, setBackupMessage] = useState('')

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage('新密码与确认密码不一致')
      return
    }
    
    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage('新密码长度至少为6位')
      return
    }
    
    // 模拟提交
    console.log('修改密码:', passwordForm)
    setPasswordMessage('密码修改成功！')
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  const handleBackup = async () => {
    // 模拟备份
    setBackupMessage('正在创建备份...')
    setTimeout(() => {
      setBackupMessage('数据备份成功！备份文件已下载。')
    }, 2000)
  }

  const handleRestore = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setBackupMessage('正在恢复数据...')
        setTimeout(() => {
          setBackupMessage('数据恢复成功！')
        }, 2000)
      }
    }
    input.click()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">系统设置</h1>

        <div className="space-y-8">
          {/* 修改密码 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">修改管理员密码</h2>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">当前密码</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="请输入当前密码"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">新密码</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="请输入新密码"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="请再次输入新密码"
                />
              </div>

              {passwordMessage && (
                <p className={`text-sm ${passwordMessage.includes('成功') ? 'text-green-600' : 'text-red-600'}`}>
                  {passwordMessage}
                </p>
              )}

              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                修改密码
              </button>
            </form>
          </div>

          {/* 数据备份与恢复 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">数据备份与恢复</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">自动备份</h3>
                <p className="text-sm text-gray-500 mb-4">
                  系统每周自动进行一次完整数据备份。备份文件保存在服务器端，可在需要时进行恢复。
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">手动备份</h3>
                <p className="text-sm text-gray-500 mb-4">
                  点击下方按钮可立即创建数据备份。备份文件将自动下载到您的电脑。
                </p>
                <button
                  onClick={handleBackup}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  创建备份
                </button>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">数据恢复</h3>
                <p className="text-sm text-gray-500 mb-4">
                  选择之前备份的数据文件进行恢复。请注意，恢复操作将覆盖当前所有数据，且此操作不可撤销。
                </p>
                <button
                  onClick={handleRestore}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                >
                  选择备份文件恢复
                </button>
              </div>

              {backupMessage && (
                <p className={`text-sm ${backupMessage.includes('成功') ? 'text-green-600' : 'text-blue-600'}`}>
                  {backupMessage}
                </p>
              )}
            </div>
          </div>

          {/* 系统信息 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">系统信息</h2>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p>系统版本：1.0.0</p>
              <p>数据库版本：SQLite 3</p>
              <p>最后备份时间：2026-04-20 10:30:00</p>
              <p>Next.js 版本：14.2.35</p>
              <p>Prisma 版本：6.x</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
