export default function InsurerSection() {
  return (
    <section className="bg-navy-950 text-white py-16 md:py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-3xl mb-4">🤝</div>
        <p className="text-xs font-medium text-pulse-400 mb-2 tracking-wide">보험사·설계사이신가요</p>
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
          국내에 아직 없는 방식, 리스크 패스포트
        </h2>
        <p className="text-white/60 text-sm md:text-base leading-relaxed mb-10 max-w-xl">
          국내 UBI는 보험사별로 갇혀 있고 3~6개월 주기로만 재평가돼요. RiskNow는 사용자가
          직접 소유하고, 보험사를 옮겨도 유지되며, 매일 갱신되는 리스크 점수를 지향해요.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <Feature
            icon="🔄"
            title="매일 갱신"
            desc="3~6개월 주기 재평가가 아니라 하루 단위로 리스크가 갱신돼요"
          />
          <Feature
            icon="🔀"
            title="보험사 간 이동"
            desc="가입 보험사를 바꿔도 리스크 점수는 사용자를 따라가요"
          />
          <Feature
            icon="🧩"
            title="공통 적용"
            desc="자동차·건강·생명보험에 하나의 점수로 공통 적용할 수 있어요"
          />
        </div>

        <a
          href="mailto:a123dlsgh@gmail.com?subject=RiskNow%20데이터%20문의"
          className="inline-block rounded-xl bg-white text-navy-950 px-6 py-3 font-medium hover:bg-white/90 transition"
        >
          데이터 연동 문의하기
        </a>
      </div>
    </section>
  )
}

function Feature({ icon, title, desc }) {
  return (
    <div className="rounded-card border border-navy-border bg-navy-900 p-5">
      <div className="text-2xl mb-3">{icon}</div>
      <p className="font-medium mb-1.5">{title}</p>
      <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
    </div>
  )
}
