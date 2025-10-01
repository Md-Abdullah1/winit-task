import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.jsx";
import {
  RightOutlined,
  AppstoreOutlined,
  UserOutlined,
  SettingOutlined,
  FileTextOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const NAV = [
  {
    key: "dashboard",
    icon: <AppstoreOutlined />,
    title: "Dashboard",
    children: [
      { key: "overview", title: "Overview" },
      { key: "stats", title: "Statistics" },
    ],
  },
  {
    key: "Load Management",
    icon: <UserOutlined />,
    title: "Load Management",
    children: [
      { key: "lsr", title: "LSR" },
      { key: "Logistics Approval Agents", title: "Logistics Approval Agents" },
    ],
  },
  {
    key: "Products & Sales",
    icon: <FileTextOutlined />,
    title: "Products & Sales",
    children: [
      { key: "pending", title: "Pending" },
      { key: "approved", title: "Approved" },
    ],
  },
  {
    key: "Distribution & delivery",
    icon: <TeamOutlined />,
    title: "Distribution & delivery",
    children: [{ key: "members", title: "Members" }],
  },
  { key: "Administration", icon: <SettingOutlined />, title: "Administration" },
  {
    key: "Reports & Analytics",
    icon: <SettingOutlined />,
    title: "Reports & Analytics",
  },
];

export default function Sidebar({ open, onToggle }) {
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark'

  function toggle(key) {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <aside
      className={`${open ? "w-64" : "w-16"} transition-all duration-200 h-screen sticky top-0 border-r ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}
    >
      <div className="h-14 flex items-center justify-between px-3">
        <div className={`font-semibold text-sm ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>WINIT</div>
      </div>
      <nav className="px-2">
        {NAV.map((section) => (
          <div key={section.key} className="mb-1">
            <div
              className={`flex items-center justify-between gap-2 px-2 py-2 rounded cursor-pointer ${isDark ? 'hover:bg-slate-900' : 'hover:bg-slate-100'}`}
              onClick={() => toggle(section.key)}
            >
              <div className="flex items-center gap-2">
                <span className={`${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{section.icon}</span>
                {open && (
                  <span className={`text-sm ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                    {section.title}
                  </span>
                )}
              </div>
              <RightOutlined
                className={`transition-transform ${isDark ? 'text-slate-400' : 'text-slate-500'} ${expanded[section.key] ? 'rotate-90' : ''}`}
              />
            </div>
            {expanded[section.key] && open && (
              <div className="pl-8 py-1 space-y-1">
                {section?.children?.map((child) => (
                  <div
                    key={child.key}
                    onClick={() => {
                      if (child.title === 'Overview') navigate('/dashboard')
                      if (child.title === 'LSR') navigate('/dashboard/lsr')
                      if (child.title === 'Logistics Approval Agents') navigate('/dashboard/agent')
                      if (child.title === 'Pending') navigate('/dashboard/lsr/pending')
                      if (child.title === 'Approved') navigate('/dashboard/lsr/approved')
                    }}
                    className={`text-xs px-2 py-1 rounded cursor-pointer ${isDark ? 'text-slate-300 hover:bg-slate-900' : 'text-slate-700 hover:bg-slate-100'}`}
                  >
                    {child.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
