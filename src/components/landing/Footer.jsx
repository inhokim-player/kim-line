import { kstNow } from '../../lib/kst'

export default function Footer() {
  const year = kstNow().getFullYear()

  return (
    <footer className="bg-canvas px-6 py-10 border-t border-line">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <p className="font-display font-bold text-ink">RiskNow</p>
          <nav className="flex items-center gap-5 text-xs text-subink">
            <a href="#privacy" className="hover:text-ink transition">개인정보처리방침</a>
            <a href="#terms" className="hover:text-ink transition">이용약관</a>
            <a href="mailto:a123dlsgh@gmail.com" className="hover:text-ink transition">문의하기</a>
          </nav>
        </div>

        <p className="text-xs text-subink leading-relaxed max-w-lg mb-6">
          이 사이트의 통계는 통계청(국가데이터처), 경찰청, 보건복지부, 질병관리청의 공식
          발표 자료를 기반으로 합니다. 상단의 실시간 카운터는 실측치가 아닌 연간 통계를
          하루·초 단위로 균등 배분한 추정 페이스이며, 실제 통계와 다를 수 있습니다. 리스크
          유형 테스트 결과는 재미 요소가 포함된 참고용이며 실제 보험 언더라이팅 기준이 아닙니다.
        </p>

        <div className="pt-4 border-t border-line flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-subink/70">© {year} RiskNow. All rights reserved.</p>
          <a href="mailto:a123dlsgh@gmail.com" className="text-xs text-subink/70 hover:text-ink transition">
            a123dlsgh@gmail.com
          </a>
        </div>
      </div>
    </footer>
  )
}
