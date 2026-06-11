import { useState } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { Sidebar } from './components/shared/Sidebar'
import { SimulatorPage } from './pages/SimulatorPage'
import { GridPage } from './pages/GridPage'
import { AnimationPage } from './pages/AnimationPage'
import { QRPage } from './pages/QRPage'
import { MobilePreviewPage } from './pages/MobilePreviewPage'

function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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
        <Route index element={<SimulatorPage />} />
        <Route path="grid" element={<GridPage />} />
        <Route path="anim" element={<AnimationPage />} />
        <Route path="qr" element={<QRPage />} />
      </Route>
      <Route path="/mobile" element={<MobilePreviewPage />} />
    </Routes>
  )
}
