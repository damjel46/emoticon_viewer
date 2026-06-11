interface Props {
  url?: string
}

export function PhoneFrame({ url }: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs text-gray-400">모바일 미리보기</p>
      {/* 폰 외형 */}
      <div className="relative bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl" style={{ width: 240, height: 480 }}>
        {/* 상단 노치 */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-gray-800 rounded-full z-10" />
        {/* 화면 */}
        <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden">
          {url ? (
            <iframe
              src={url.replace(window.location.origin, '')}
              className="w-full h-full border-none"
              title="모바일 미리보기"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-gray-400 px-4 text-center">
              QR 코드를 생성하면 여기서 미리보기가 표시됩니다
            </div>
          )}
        </div>
        {/* 하단 홈바 */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-gray-600 rounded-full" />
      </div>
    </div>
  )
}
