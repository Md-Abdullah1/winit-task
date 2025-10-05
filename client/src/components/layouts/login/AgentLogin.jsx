import { useEffect, useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import api from '../../../lib/api.js'
import { useAuth } from '../../../context/AuthContext.jsx'
import { useNavigate, Link } from 'react-router-dom'

export default function AgentLogin() {
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated, role } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(role === 'lsr' ? '/dashboard/lsr' : '/dashboard/agent', { replace: true })
    }
  }, [isAuthenticated, role, navigate])

  async function onFinish(values) {
    try {
      setLoading(true)
      const res = await api.post('/agent/auth/login', values)
      const { token, user } = res.data || {}
      if (!token || !user) throw new Error('Invalid response')
      login({ token, role: user.role })
      message.success('Logged in')
      navigate('/dashboard/agent')
    } catch (e) {
      const msg = e?.response?.data?.message || 'Login failed'
      message.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm bg-white p-6 rounded shadow">
        <div className="text-xl font-semibold mb-4">Agent Login</div>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="agent@example.com" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password placeholder="••••••••" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>Login</Button>
        </Form>
        <div className="text-sm text-slate-600 mt-3">Are you an LSR? <Link className="text-blue-600" to="/login/lsr">Go to LSR Login</Link></div>
      </div>
    </div>
  )
}


