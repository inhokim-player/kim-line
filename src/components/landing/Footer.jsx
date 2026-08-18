import { kstNow } from '../../lib/kst'

export default function Footer() {
  const year = kstNow().getFullYear()

  return (
    <footer className="bg-canvas px-6 py-10 border-t border-line">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <p className="font-display font-bold text-ink">RiskNow</p>
          <a href="mailto:a123dlsgh@gmail.com" className="text-xs text-subink hover:text-ink transition">
            문의하기
          </a>
        </div>

        <details className="text-xs text-subink mb-6">
          <summary className="cursor-pointer hover:text-ink transition">개인정보처리방침 · 이용약관</summary>
          <div className="mt-3 space-y-3 leading-relaxed">
            <p>
              RiskNow는 회원가입 없이 동작하며, 진단 응답과 결과는 브라우저(localStorage)에만
              저장됩니다. 서버로 전송되거나 운영자가 수집하지 않습니다.
            </p>
            <p>
              리스크 진단 결과와 예상 보험료, "맞춤 보험 카테고리"는 재미·참고 요소가
              포함된 안내이며 실제 보험 가입·언더라이팅 기준과 무관합니다. 통계는 통계청·
              경찰청·보건복지부·질병관리청 공식 발표를 가공한 것입니다.
            </p>
            <p className="text-subink/70">
              ※ 참고용 템플릿입니다. 상업적으로 운영하신다면 법률 전문가 검토를 권장합니다.
            </p>
          </div>
        </details>

        <p className="text-xs text-subink leading-relaxed max-w-lg mb-6">
          보험 카테고리 안내는 특정 보험사 상품이 아니라 국내에 일반적으로 존재하는
          상품군입니다. 예상 보험료와 영양소 수치는 성인 평균 기준 참고 정보입니다.
        </p>

        <p className="text-xs text-subink/70 pt-4 border-t border-line">© {year} RiskNow</p>
      </div>
    </footer>
  )
}
