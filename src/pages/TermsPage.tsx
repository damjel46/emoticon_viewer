import { useNavigate } from 'react-router-dom'

export function TermsPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-8">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-gray-600 mb-6 block">
          ← 뒤로가기
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">이용약관</h1>
        <p className="text-xs text-gray-400 mb-8">시행일: 2026년 03월 19일</p>

        <section className="mb-6">
          <h2 className="font-bold text-gray-700 mb-2">제1조 (목적)</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            본 약관은 노잇(이하 "회사")이 운영하는 이모티콘 뷰어 서비스(www.emoticonviewer.site, 이하 "서비스")의 이용 조건 및 절차, 회사와 이용자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-gray-700 mb-2">제2조 (사업자 정보)</h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-1">
            <p>상호명: 노잇</p>
            <p>대표자: 박노익</p>
            <p>사업자등록번호: 264-10-03099</p>
            <p>사업장 주소: 광주광역시 동구 지호로 66, 2층 201호(지산동)</p>
            <p>전화: 010-9990-6110</p>
            <p>이메일: damjel46@gmail.com</p>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-gray-700 mb-2">제3조 (서비스 내용)</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            서비스는 이모티콘 이미지를 업로드하여 다양한 채팅 플랫폼 환경에서 미리볼 수 있는 시뮬레이터 도구를 제공합니다. 프리미엄 회원에게는 이모티콘 세트 저장 및 클라우드 동기화 기능이 제공됩니다.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-gray-700 mb-2">제4조 (유료 서비스 및 결제)</h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-2">
            <p>① 프리미엄 서비스 이용료는 <strong>4,900원 (일회성 결제)</strong>입니다.</p>
            <p>② 결제는 카카오페이를 통해 이루어집니다.</p>
            <p>③ 결제 완료 시 즉시 프리미엄 기능이 활성화됩니다.</p>
            <p>④ 서비스 제공 기간: 결제일로부터 서비스 종료일까지 영구 제공.</p>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-gray-700 mb-2">제5조 (취소 및 환불 정책)</h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-2">
            <p>① 결제 완료 후 7일 이내, 서비스를 이용하지 않은 경우 전액 환불이 가능합니다.</p>
            <p>② 프리미엄 기능(저장 기능)을 1회 이상 사용한 경우 환불이 제한될 수 있습니다.</p>
            <p>③ 환불 요청은 이메일(damjel46@gmail.com)로 접수 후 3영업일 이내 처리됩니다.</p>
            <p>④ 환불 시 결제 수단과 동일한 방법으로 환불되며, 카드사 정책에 따라 영업일 기준 3~5일 소요될 수 있습니다.</p>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-gray-700 mb-2">제6조 (개인정보 보호)</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            회사는 이용자의 개인정보를 보호하기 위해 관련 법령을 준수하며, 수집된 개인정보는 서비스 제공 목적 외 사용하지 않습니다. 자세한 내용은 개인정보처리방침을 참고하세요.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-gray-700 mb-2">제7조 (면책사항)</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            회사는 천재지변, 서버 장애 등 불가항력적 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다. 이용자가 업로드한 이미지에 대한 저작권 책임은 이용자에게 있습니다.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-700 mb-2">제8조 (분쟁 해결)</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            서비스 이용과 관련한 분쟁은 회사 소재지를 관할하는 법원을 전속 관할 법원으로 합니다.
          </p>
        </section>
      </div>
    </div>
  )
}
