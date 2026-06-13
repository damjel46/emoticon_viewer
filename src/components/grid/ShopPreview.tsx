import { useState } from 'react'
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

// ── Kakao Store Preview ────────────────────────────────────
export function KakaoStorePreview({ emoticons, thumbnailId, setName, creatorName }: {
  emoticons: EmoticonFile[]
  thumbnailId?: string
  setName?: string
  creatorName?: string
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [hoverKey, setHoverKey] = useState(0)

  const handleHover = (id: string) => {
    setHoveredId(id)
    setHoverKey((k) => k + 1)
  }

  const representative = (thumbnailId ? emoticons.find(e => e.id === thumbnailId) : null) ?? emoticons[0] ?? null
  const total = Math.max(emoticons.length, 24)
  const empties = Math.max(0, total - emoticons.length)

  return (
    <div className="w-full bg-white">
      {/* 헤더 */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex gap-4 items-start mb-3">
          {/* 대표 이모티콘 */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1">
            <div className="w-24 h-24 flex items-center justify-center">
              {representative
                ? <img src={representative.dataUrl} alt="대표" className="w-full h-full object-contain" />
                : <span className="text-4xl">🎨</span>}
            </div>
            <span className="text-[10px] text-gray-400">대표</span>
          </div>
          {/* 정보 */}
          <div className="flex-1 min-w-0 pt-1">
            <p className="text-xs text-gray-400 mb-0.5">{creatorName ?? '나의 크리에이터'}</p>
            <p className="text-base font-bold text-gray-900 leading-snug">{setName ?? '나의 이모티콘 세트'}</p>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-sm font-bold text-[#fc5000]">3,000원</span>
              <span className="text-xs text-gray-400 line-through">3,750원</span>
            </div>
          </div>
        </div>

        {/* 구독 배너 */}
        <div className="bg-[#fffbd0] rounded-2xl px-4 py-2.5 flex items-center gap-2 mb-3">
          <span className="text-base">😊</span>
          <span className="text-xs font-semibold text-gray-800">월 3,900원에 이모티콘 무제한 즐기기!</span>
        </div>

        {/* 버튼 */}
        <div className="flex gap-2">
          <button className="flex-[2] bg-[#fee500] text-gray-900 font-bold py-2.5 rounded-xl text-xs hover:bg-yellow-300 transition-colors">
            이모티콘 플러스 구독
          </button>
          <button className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-xs hover:bg-gray-50 transition-colors">
            구매
          </button>
          <button className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-xs hover:bg-gray-50 transition-colors">
            선물
          </button>
        </div>
      </div>

      {/* 이모티콘 그리드 (3열) */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2">
          {emoticons.map((e) => {
            const isHovered = hoveredId === e.id
            const isDimmed = hoveredId !== null && !isHovered
            return (
              <div
                key={e.id}
                className="aspect-square flex items-center justify-center cursor-pointer rounded-2xl transition-all duration-150"
                style={{
                  opacity: isDimmed ? 0.25 : 1,
                  transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                  zIndex: isHovered ? 10 : 'auto',
                  position: 'relative',
                }}
                onMouseEnter={() => handleHover(e.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <img
                  key={isHovered ? `${e.id}-${hoverKey}` : e.id}
                  src={e.dataUrl}
                  alt=""
                  className="w-full h-full object-contain p-2"
                  draggable={false}
                />
              </div>
            )
          })}
          {Array.from({ length: empties }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square bg-gray-50 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── SOOP ───────────────────────────────────────────────────
const SOOP_NICK_POOL = [
  '감자튀김좋아', '밤새는중', '오늘도야근', '치킨러버123', '잠못자는사람',
  '냉동만두먹방', '삼겹살세트', '라면한그릇', '편의점알바생', '졸린눈',
  '고양이집사', '강아지아빠', '새벽감성러', '퇴근하고싶다', '월급루팡',
  '커피없인못살아', '야식폭격기', '인스타없는삶', '게임하는직장인', '수면부족',
]
const SOOP_TEXT_POOL = [
  'ㅋㅋㅋㅋ진짜ㅋㅋ', '오늘도 수고하셨습니다', '와 대박이다', '저도 그생각 했어요',
  '진짜요???', 'ㅠㅠㅠ공감', '맞아요 맞아', '헐 진짜?', '저 지금 밥먹으면서 봐요',
  '방송 언제 끝나요', 'ㅋㅋ동감', '오늘 재밌었어요', '다음에 또 봐요',
  '잘자요~', '저만 이런가요?', '완전 웃겨ㅋㅋ', '대단하다 진짜',
  '그거 맞는 말이긴 한데', '어 진짜?', '저도요ㅋㅋ',
]
const SOOP_AVATARS = ['🧑','👩','🧢','🎮','🐱','🦊','🐸','🐧','🎃','🧸']
const SOOP_BADGES = [
  { label: '열', color: '#e84040' },
  { label: '열', color: '#e84040' },
  { label: '열', color: '#e84040' },
  { label: 'F',  color: '#4a90d9' },
  { label: 'G',  color: '#27ae60' },
]

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

function genMessages(count: number) {
  return Array.from({ length: count }, () => {
    const badge = pick(SOOP_BADGES)
    return { avatar: pick(SOOP_AVATARS), badge: badge.label, badgeColor: badge.color, name: pick(SOOP_NICK_POOL), text: pick(SOOP_TEXT_POOL) }
  })
}

function SOOPChannelPreview({ emoticons }: { emoticons: EmoticonFile[] }) {
  const show = emoticons.length > 0 ? emoticons : Array(16).fill(null)
  const [messages] = useState(() => genMessages(5))

  return (
    <div
      className="rounded-2xl overflow-hidden w-full max-w-xs mx-auto flex flex-col"
      style={{ backgroundColor: '#fff', border: '1px solid #ddd', fontSize: 13 }}
    >
      {/* 채팅 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <span className="font-bold text-gray-900 text-sm">채팅</span>
        <div className="flex items-center gap-3 text-gray-400">
          <span className="text-base">👤</span>
          <span className="text-base">⚙️</span>
          <span className="text-base">✕</span>
        </div>
      </div>

      {/* 채팅 메시지 영역 */}
      <div className="flex flex-col gap-2 px-3 py-3 bg-white" style={{ minHeight: 160 }}>
        <p className="text-xs text-gray-500 mb-1">방송에 입장하였습니다.</p>
        {messages.map((m, i) => (
          <div key={i} className="flex items-start gap-1.5">
            <div className="flex flex-wrap items-center gap-1 leading-snug">
              <span
                className="text-[9px] font-bold px-1 py-0.5 rounded text-white flex-shrink-0"
                style={{ backgroundColor: m.badgeColor }}
              >
                {m.badge}
              </span>
              <span className="text-xs font-bold text-gray-800">{m.name}</span>
              <span className="text-xs text-gray-700">{m.text}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 이모티콘 패널 */}
      <div className="border-t border-gray-200 bg-white">
        {/* 패널 헤더 */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
          <span className="text-sm font-bold text-gray-800">이모티콘</span>
          <span className="text-gray-400 text-sm">✕</span>
        </div>

        {/* 탭 */}
        <div className="flex items-center px-2 py-1.5 border-b border-gray-100 gap-1">
          <button className="text-gray-400 text-xs px-1">◀</button>
          <div className="flex items-center gap-1 flex-1">
            <div className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 text-sm">🕐</div>
            <div className="w-7 h-7 flex items-center justify-center rounded-full text-sm">⭐</div>
            <div
              className="w-7 h-7 flex items-center justify-center rounded-full text-sm relative"
              style={{ borderBottom: '2px solid #ff6600' }}
            >
              {emoticons[0]
                ? <img src={emoticons[0].dataUrl} className="w-5 h-5 object-contain" alt="" />
                : <span>😊</span>}
            </div>
          </div>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <div className="w-7 h-7 flex items-center justify-center text-gray-400 text-sm">🛍️</div>
          <button className="text-gray-400 text-xs px-1">▶</button>
        </div>

        {/* 카테고리 라벨 */}
        <div className="mx-3 my-1.5 bg-gray-100 rounded-md px-2 py-1">
          <span className="text-xs text-gray-500">기본</span>
        </div>

        {/* 이모티콘 그리드 */}
        <div
          className="grid gap-0.5 px-2 pb-2"
          style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}
        >
          {show.slice(0, 28).map((e, i) =>
            e ? (
              <div key={e.id} className="aspect-square flex items-center justify-center rounded overflow-hidden hover:bg-gray-100 cursor-pointer">
                <img src={e.dataUrl} alt={`${i + 1}`} className="w-full h-full object-contain p-0.5" />
              </div>
            ) : (
              <div key={`empty-${i}`} className="aspect-square rounded bg-gray-50" />
            )
          )}
        </div>
      </div>

      {/* 하단 바 */}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-gray-200">
        <span className="text-base text-gray-400">⭐</span>
        <span className="text-xs font-bold text-gray-400">AD</span>
        <span className="text-base text-gray-400">🛒</span>
      </div>

      {/* 채팅 입력 */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-200">
        <span className="text-xs text-gray-400">채팅 입력(c)</span>
        <span className="text-lg text-gray-400">🙂</span>
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

// ── OGQ Store (SOOP 시뮬레이터 우측 패널용) ──────────────
export function OGQStorePreview({ emoticons, thumbnailId, setName, creatorName }: {
  emoticons: EmoticonFile[]
  thumbnailId?: string
  setName?: string
  creatorName?: string
}) {
  const [selectedId, setSelectedId] = useState<string | null>(thumbnailId ?? emoticons[0]?.id ?? null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [hoverKey, setHoverKey] = useState(0)

  const selected = emoticons.find((e) => e.id === selectedId) ?? (thumbnailId ? emoticons.find(e => e.id === thumbnailId) : null) ?? emoticons[0] ?? null
  const total = Math.max(emoticons.length, 16)
  const empties = Math.max(0, total - emoticons.length)

  const handleHover = (id: string) => {
    setHoveredId(id)
    setHoverKey((k) => k + 1)
  }

  return (
    <div className="w-full bg-white rounded-xl overflow-hidden border border-gray-200">
      {/* 상단 헤더 */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex gap-3 mb-3">
          {/* 썸네일 */}
          <div className="relative w-20 h-20 flex-shrink-0 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
            {selected
              ? <img src={selected.dataUrl} alt="대표" className="w-full h-full object-contain p-1" />
              : <span className="text-2xl">🖼️</span>}
            <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white/80 border border-gray-300 flex items-center justify-center">
              <span className="text-[7px] text-gray-500">▶</span>
            </div>
          </div>
          {/* 정보 */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm leading-tight mb-0.5">{setName ?? '나의 이모티콘 세트'}</p>
            <p className="text-xs text-gray-400 mb-0.5">{creatorName ?? '나의 크리에이터'}</p>
            <p className="text-xs text-gray-300 mb-1">움직이는 이모티콘</p>
            <p className="font-bold text-gray-900 text-sm">3,000원</p>
          </div>
        </div>
        {/* 구매 버튼 가로 배치 */}
        <div className="flex gap-2">
          <button className="flex-1 text-xs font-semibold py-2 rounded-lg text-white" style={{ backgroundColor: '#1a73e8' }}>
            선물용 구매
          </button>
          <button className="flex-1 text-xs font-semibold py-2 rounded-lg border" style={{ color: '#1a73e8', borderColor: '#1a73e8' }}>
            소장용 구매
          </button>
        </div>
      </div>

      {/* 안내 바 */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100">
        <span className="text-[10px] text-gray-500">이모티콘을 클릭하면 미리보기를 확인할 수 있어요</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-gray-400">어두운모드로 보기</span>
          <div className="w-7 h-4 rounded-full bg-gray-300 relative flex-shrink-0">
            <div className="absolute left-0.5 top-0.5 w-3 h-3 rounded-full bg-white shadow-sm" />
          </div>
        </div>
      </div>

      {/* 이모티콘 그리드 */}
      <div className="p-3">
        <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' }}>
          {emoticons.map((e) => {
            const isHovered = hoveredId === e.id
            const isDimmed = hoveredId !== null && !isHovered
            const isSelected = selectedId === e.id
            return (
              <div
                key={e.id}
                className="aspect-square flex items-center justify-center cursor-pointer rounded-lg transition-all duration-150"
                style={{
                  opacity: isDimmed ? 0.25 : 1,
                  outline: isSelected && hoveredId === null ? '2px solid #1a73e8' : 'none',
                  outlineOffset: '-2px',
                  transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                  zIndex: isHovered ? 10 : 'auto',
                  position: 'relative',
                }}
                onMouseEnter={() => handleHover(e.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedId(e.id)}
              >
                <img
                  key={isHovered ? `${e.id}-${hoverKey}` : e.id}
                  src={e.dataUrl}
                  alt=""
                  className="w-full h-full object-contain p-0.5"
                  draggable={false}
                />
              </div>
            )
          })}
          {Array.from({ length: empties }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square rounded-lg bg-gray-50" />
          ))}
        </div>
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
    case 'kakao':
      return <KakaoShopPreview emoticons={emoticons} />
    default:
      return <KakaoShopPreview emoticons={emoticons} />
  }
}
