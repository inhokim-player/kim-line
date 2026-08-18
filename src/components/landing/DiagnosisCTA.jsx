import ShieldIcon from '../ShieldIcon'

export default function DiagnosisCTA({ onStart }) {
  return (
    <section className="py-16 md:py-24 px-6 border-t border-line">
      <div className="max-w-2xl mx-auto text-center">
        <ShieldIcon className="w-20 mx-auto mb-6" />

        <p className="font-mono text-[11px] font-medium text-shield-600 mb-2 tracking-widest uppercase">무료 진단</p>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-4">
          내 리스크, 지금 진단해보세요
        </h2>
        <p className="text-subink text-sm md:text-base leading-relaxed mb-8 max-w-lg mx-auto">
          위 통계는 대한민국 전체의 이야기예요. 이제 그 통계 안에서 내가 어디쯤 있는지
          나이와 습관으로 확인해볼 차례예요.
        </p>

        <div className="flex items-center justify-center gap-6 mb-10 text-sm text-subink">
          <span>🚗 운전 습관</span>
          <span className="text-line">|</span>
          <span>🫀 건강·활력</span>
          <span className="text-line">|</span>
          <span>🧘 생활 패턴</span>
        </div>

        <button
          onClick={onStart}
          className="rounded-xl bg-shield-500 hover:bg-shield-600 transition text-white font-medium px-8 py-4 text-base"
        >
          진단 시작하기 →
        </button>
        <p className="mt-3 text-xs text-subink">약 1분 소요 · 계정·로그인 없이 바로</p>
      </div>
    </section>
  )
}
