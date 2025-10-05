import { MenuFoldOutlined, BellOutlined, ReloadOutlined, BulbOutlined, LogoutOutlined } from '@ant-design/icons'
import { Input, Button } from 'antd'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function Header({ onToggleSidebar }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  const { logout } = useAuth()
  const navigate = useNavigate()
  return (
    <header className={`h-14 border-b flex items-center justify-between px-4 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="text-xl">
          <MenuFoldOutlined />
        </button>
        <div className="hidden md:block w-64">
          <Input.Search placeholder="Search" allowClear />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <BellOutlined className={`text-lg ${isDark ? 'text-slate-300' : ''}`} />
        <button onClick={toggle} title="Toggle theme" className={`text-lg ${isDark ? 'text-slate-300' : ''}`}>
          <BulbOutlined />
        </button>
        <ReloadOutlined className="text-lg" />
        <Button
          size="small"
          icon={<LogoutOutlined />}
          onClick={() => { logout(); navigate('/login/agent', { replace: true }) }}
        >Logout</Button>
        <div className={`h-8 w-8 rounded-full grid place-items-center text-xs ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>Admin</div>
      </div>
    </header>
  )
}


