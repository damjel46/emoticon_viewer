import { useState, useEffect } from 'react'
import { Routes, Route, Outlet, Navigate } from 'react-router-dom'
import { Sidebar } from './components/shared/Sidebar'
import { useAuthStore } from './store/authStore'
import { PlatformPage } from './pages/PlatformPage'
import { GridPage } from './pages/GridPage'
import { AnimationPage } from './pages/AnimationPage'
import { QRPage } from './pages/QRPage'
import { MobilePreviewPage } from './pages/MobilePreviewPage'

function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const init = useAuthStore((s) => s.init)
  useEffect(() => { init() }, [init])

  return (
    <div className="flex h-screen overflow-hidden font-kakao">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />
      <main className="flex-1 overflow-hidden flex flex-col bg-white">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<Navigate to="/kakao" replace />} />
        <Route path="grid" element={<GridPage />} />
        <Route path="anim" element={<AnimationPage />} />
        <Route path="qr" element={<QRPage />} />
        <Route path=":platformId" element={<PlatformPage />} />
      </Route>
      <Route path="/mobile" element={<MobilePreviewPage />} />
    </Routes>
  )
}
