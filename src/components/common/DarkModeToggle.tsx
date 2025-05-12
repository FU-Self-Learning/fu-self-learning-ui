'use client'

import '@ant-design/v5-patch-for-react-19';
import { Switch } from 'antd'
import { useTheme } from '@/hooks/useTheme'

export default function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <Switch
      checked={isDark}
      onChange={toggleTheme}
      checkedChildren="☀️"
      unCheckedChildren="🌙"
    />
  )
}
