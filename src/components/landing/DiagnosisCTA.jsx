import ShieldIcon from '../ShieldIcon'

export default function DiagnosisCTA({ onStart }) {
  return (
    <section className="bg-shield-500/[0.04] py-16 md:py-24 px-6 border-t border-line">
      <div className="max-w-2xl mx-auto text-center">
        <ShieldIcon className="w-24 mx-auto mb-6" />

        <p className="text-xs font-medium text-shield-600 mb-2 tracking-wide">무료 진단</p>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-4">
          내 리스크, 지금 진단해보세요
        </h2>
        <p className="text-subink text-sm md:text-base leading-relaxed mb-8 max-w-lg mx-auto">
          위 통계는 대한민국 전체의 이야기예요. 이제 그 통계 안에서 내가 어디쯤 있는지
          8개 질문으로 확인해볼 차례예요.
        </p>

        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-10">
          <MiniFeature icon="🚗" label="운전 습관" />
          <MiniFeature icon="🫀" label="건강·활력" />
          <MiniFeature icon="🧘" label="생활 패턴" />
        </div>

        <button
          onClick={onStart}
          className="rounded-xl bg-shield-500 hover:bg-shield-600 transition text-white font-medium px-8 py-4 text-base"
        >
          진단 시작하기 →
        </button>
        <p className="mt-3 text-xs text-subink">약 1분 소요 · 결과는 저장되지 않아요</p>
      </div>
    </section>
  )
}

function MiniFeature({ icon, label }) {
  return (
    <div className="rounded-card bg-surface shadow-card py-4">
      <div className="text-xl mb-1">{icon}</div>
      <p className="text-xs text-subink">{label}</p>
    </div>
  )
}
