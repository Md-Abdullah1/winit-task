import { MenuFoldOutlined, BellOutlined, ReloadOutlined, BulbOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { useTheme } from '../../context/ThemeContext.jsx'

export default function Header({ onToggleSidebar }) {
  const { theme, toggle } = useTheme()
  return (
    <header className="h-14 border-b border-slate-200 flex items-center justify-between px-4 bg-white">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="text-xl">
          <MenuFoldOutlined />
        </button>
        <div className="hidden md:block w-64">
          <Input.Search placeholder="Search" allowClear />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <BellOutlined className="text-lg" />
        <button onClick={toggle} title="Toggle theme" className="text-lg">
          <BulbOutlined />
        </button>
        <ReloadOutlined className="text-lg" />
        <div className="h-8 w-8 rounded-full bg-slate-200 grid place-items-center text-xs text-slate-700">Admin</div>
      </div>
    </header>
  )
}


