import { Suspense, lazy } from 'react'
import InsurerSection from './InsurerSection'
import Footer from './Footer'

const BodyDiagram3D = lazy(() => import('./BodyDiagram3D'))

export default function LandingPage() {
  return (
    <div>
      <header className="border-b border-line px-6 py-7 max-w-3xl mx-auto">
        <p className="font-display font-bold text-sm text-ink mb-6">RiskNow</p>
        <h1 className="font-display text-3xl font-bold text-ink leading-snug mb-3">
          아픈 부위를 눌러보세요
        </h1>
        <p className="text-subink text-[15px] leading-relaxed max-w-md">
          신체 부위를 클릭하면 관련 통계, 국내 영양소 섭취기준, 도움이 되는
          식품, 관련 보험 상품군을 확인할 수 있어요.
        </p>
      </header>

      <Suspense
        fallback={
          <div className="h-80 md:h-96 flex items-center justify-center text-subink text-sm border-b border-line">
            3D 모델 불러오는 중…
          </div>
        }
      >
        <BodyDiagram3D />
      </Suspense>

      <InsurerSection />
      <Footer />
    </div>
  )
}
