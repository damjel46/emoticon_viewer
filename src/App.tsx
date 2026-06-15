import { useState, useEffect } from 'react'
import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom'
import { Sidebar } from './components/shared/Sidebar'
import { MobileLanding } from './components/shared/MobileLanding'
import { useAuthStore } from './store/authStore'
import { PlatformPage } from './pages/PlatformPage'
import { GridPage } from './pages/GridPage'
import { AnimationPage } from './pages/AnimationPage'
import { QRPage } from './pages/QRPage'
import { MobilePreviewPage } from './pages/MobilePreviewPage'
import { MobileKakaoPage } from './pages/MobileKakaoPage'
import { MobileSoopPage } from './pages/MobileSoopPage'
import { MobileChzzkPage } from './pages/MobileChzzkPage'
import { PaymentSuccessPage } from './pages/PaymentSuccessPage'
import { PaymentFailPage } from './pages/PaymentFailPage'
import { PaymentCancelPage } from './pages/PaymentCancelPage'
import { TermsPage } from './pages/TermsPage'
import { Footer } from './components/shared/Footer'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 600)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 600)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

function AppShell() {
  const init = useAuthStore((s) => s.init)
  const isMobile = useIsMobile()
  const location = useLocation()
  useEffect(() => { init() }, [init])

  if (isMobile) {
    const path = location.pathname
    if (path === '/kakao' || path === '/') return <MobileKakaoPage />
    if (path === '/soop') return <MobileSoopPage />
    if (path === '/ogq') return <MobileChzzkPage />
    return <MobileLanding />
  }

  return (
    <div className="bg-gray-100 h-dvh flex flex-col p-3 gap-2 overflow-hidden">
      <div className="flex flex-1 max-w-[1440px] w-full mx-auto overflow-hidden font-kakao rounded-2xl shadow-lg border border-gray-200 min-h-0">
        <Sidebar />
        <main className="flex-1 overflow-hidden flex flex-col bg-white">
          <Outlet />
        </main>
      </div>
      <div className="max-w-[1440px] w-full mx-auto flex-shrink-0">
        <Footer />
      </div>
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
      <Route path="/payment/success" element={<PaymentSuccessPage />} />
      <Route path="/payment/fail" element={<PaymentFailPage />} />
      <Route path="/payment/cancel" element={<PaymentCancelPage />} />
      <Route path="/terms" element={<TermsPage />} />
    </Routes>
  )
}
