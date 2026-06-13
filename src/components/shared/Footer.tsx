export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50 px-6 py-4 text-[11px] text-gray-400 leading-relaxed">
      <div className="max-w-4xl">
        <p className="font-semibold text-gray-500 mb-1">노잇</p>
        <p>사업자등록번호: 264-10-03099 &nbsp;|&nbsp; 대표자: 박노익</p>
        <p>주소: 광주광역시 동구 지호로 66, 2층 201호(지산동)</p>
        <p>전화: 010-9990-6110 &nbsp;|&nbsp; 이메일: noit0411@gmail.com</p>
        <p className="mt-1">
          <a href="/terms" className="underline hover:text-gray-600">이용약관</a>
          &nbsp;&nbsp;
          <a href="/privacy" className="underline hover:text-gray-600">개인정보처리방침</a>
        </p>
      </div>
    </footer>
  )
}
