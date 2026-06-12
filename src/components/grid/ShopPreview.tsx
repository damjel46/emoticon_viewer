import { useActiveEmoticons } from '../../store/emoticonStore'
import { usePlatformStore } from '../../store/platformStore'
import type { EmoticonFile } from '../../types'

// ── KakaoTalk ──────────────────────────────────────────────
function KakaoShopPreview({ emoticons }: { emoticons: EmoticonFile[] }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 w-full max-w-sm mx-auto">
      <div className="bg-[#fee500] px-4 py-3 flex items-center gap-3">
        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden">
          {emoticons[0]
            ? <img src={emoticons[0].dataUrl} alt="대표" className="w-full h-full object-contain" />
            : <span className="text-3xl">🎨</span>}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">나의 이모티콘 세트</p>
          <p className="text-gray-600 text-xs">크리에이터</p>
          <p className="text-gray-800 font-semibold text-sm mt-1">2,200원</p>
        </div>
      </div>
      <div className="flex border-b border-gray-100 text-xs font-medium">
        {['이모티콘', '작가 정보', '리뷰'].map((tab, i) => (
          <div key={tab} className={`flex-1 text-center py-2.5 ${i === 0 ? 'border-b-2 border-[#3c1e1e] text-[#3c1e1e]' : 'text-gray-400'}`}>
            {tab}
          </div>
        ))}
      </div>
      <div className="p-3">
        <div className="grid grid-cols-4 gap-1.5">
          {emoticons.slice(0, 24).map((e, i) => (
            <div key={e.id} className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
              <img src={e.dataUrl} alt={`${i + 1}`} className="w-full h-full object-contain p-0.5" />
            </div>
          ))}
          {Array.from({ length: Math.max(0, 24 - emoticons.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-300 text-xs">{emoticons.length + i + 1}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-3 pb-4">
        <button className="w-full bg-[#fee500] text-gray-900 font-bold py-3 rounded-xl text-sm hover:bg-yellow-400 transition-colors">
          구매하기
        </button>
      </div>
    </div>
  )
}

// ── SOOP ───────────────────────────────────────────────────
function SOOPChannelPreview({ emoticons }: { emoticons: EmoticonFile[] }) {
  return (
    <div className="rounded-2xl overflow-hidden w-full max-w-sm mx-auto" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
      {/* 채널 헤더 */}
      <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: '#111111' }}>
        <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: '#2a2a2a' }}>
          {emoticons[0]
            ? <img src={emoticons[0].dataUrl} alt="채널" className="w-full h-full object-contain" />
            : <span className="flex items-center justify-center h-full text-2xl">🟠</span>}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-bold text-white text-sm">테스트 채널</p>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: '#ff6600', color: '#fff' }}>LIVE</span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: '#888' }}>12,847명 시청 중</p>
        </div>
        <button className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#ff6600', color: '#fff' }}>
          구독
        </button>
      </div>

      {/* 이모티콘 섹션 */}
      <div className="px-4 py-3">
        <p className="text-xs font-semibold mb-2" style={{ color: '#ff6600' }}>채널 이모티콘</p>
        <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' }}>
          {emoticons.slice(0, 24).map((e, i) => (
            <div key={e.id} className="aspect-square rounded-lg overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#2a2a2a' }}>
              <img src={e.dataUrl} alt={`${i + 1}`} className="w-full h-full object-contain p-0.5" />
            </div>
          ))}
          {Array.from({ length: Math.max(0, 16 - emoticons.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square rounded-lg flex items-center justify-center" style={{ backgroundColor: '#222' }}>
              <span style={{ color: '#444', fontSize: 9 }}>{emoticons.length + i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Naver OGQ ──────────────────────────────────────────────
function OGQMarketPreview({ emoticons }: { emoticons: EmoticonFile[] }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 w-full max-w-sm mx-auto">
      {/* OGQ 헤더 */}
      <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: '#03c75a' }}>
        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden">
          {emoticons[0]
            ? <img src={emoticons[0].dataUrl} alt="대표" className="w-full h-full object-contain" />
            : <span className="text-3xl">🟢</span>}
        </div>
        <div>
          <p className="font-bold text-white text-sm">나의 이모티콘 세트</p>
          <p className="text-white/70 text-xs">OGQ 크리에이터</p>
          <p className="text-white font-semibold text-sm mt-1">1,500원</p>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex border-b text-xs font-medium" style={{ borderColor: '#e5e5e5' }}>
        {['스티커', '작가 정보'].map((tab, i) => (
          <div key={tab} className={`flex-1 text-center py-2.5 ${i === 0 ? 'border-b-2' : 'text-gray-400'}`}
            style={i === 0 ? { borderColor: '#03c75a', color: '#03c75a' } : {}}>
            {tab}
          </div>
        ))}
      </div>

      {/* 그리드 */}
      <div className="p-3">
        <div className="grid grid-cols-4 gap-1.5">
          {emoticons.slice(0, 24).map((e, i) => (
            <div key={e.id} className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
              <img src={e.dataUrl} alt={`${i + 1}`} className="w-full h-full object-contain p-0.5" />
            </div>
          ))}
          {Array.from({ length: Math.max(0, 16 - emoticons.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center">
              <span className="text-gray-300 text-xs">{emoticons.length + i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-3 pb-4">
        <button className="w-full font-bold py-3 rounded-xl text-sm text-white transition-colors" style={{ backgroundColor: '#03c75a' }}>
          구매하기
        </button>
      </div>
    </div>
  )
}

// ── Twitch ─────────────────────────────────────────────────
function TwitchEmotePanel({ emoticons }: { emoticons: EmoticonFile[] }) {
  const tiers = ['Tier 1', 'Tier 2', 'Tier 3']
  const tiersData = tiers.map((tier, ti) => ({
    tier,
    emotes: emoticons.slice(ti * 3, ti * 3 + 3),
  }))

  return (
    <div className="rounded-2xl overflow-hidden w-full max-w-sm mx-auto" style={{ backgroundColor: '#18181b', border: '1px solid #2a2a2d' }}>
      {/* 헤더 */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: '#1f1f23', borderBottom: '1px solid #2a2a2d' }}>
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm" style={{ color: '#efeff1' }}>채널 구독 에모트</span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: '#9146ff', color: '#fff' }}>SUB</span>
        </div>
        <button className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#9146ff', color: '#fff' }}>
          구독하기
        </button>
      </div>

      {/* 티어별 에모트 */}
      <div className="px-4 py-3 flex flex-col gap-4">
        {tiersData.map(({ tier, emotes }) => (
          <div key={tier}>
            <p className="text-[10px] font-semibold mb-1.5" style={{ color: '#9146ff' }}>{tier}</p>
            <div className="flex gap-2">
              {emotes.map((e, i) => (
                <div key={e.id} className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#2a2a2d' }}>
                  <img src={e.dataUrl} alt={`emote-${i}`} className="w-full h-full object-contain p-0.5" />
                </div>
              ))}
              {Array.from({ length: Math.max(0, 3 - emotes.length) }).map((_, i) => (
                <div key={`empty-${tier}-${i}`} className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#222225' }}>
                  <span style={{ color: '#3a3a3d', fontSize: 9 }}>+</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Router ─────────────────────────────────────────────────
export function ShopPreview() {
  const emoticons = useActiveEmoticons()
  const platformId = usePlatformStore((s) => s.activePlatform)

  switch (platformId) {
    case 'soop':
      return <SOOPChannelPreview emoticons={emoticons} />
    case 'ogq':
      return <OGQMarketPreview emoticons={emoticons} />
    case 'twitch':
      return <TwitchEmotePanel emoticons={emoticons} />
    default:
      return <KakaoShopPreview emoticons={emoticons} />
  }
}
