import {
  NATIONAL_STATS_META,
  OVERVIEW,
  TOP_CAUSES,
  TOP3_SHARE,
  INJURY_STATS,
  DISEASE_INCIDENCE,
  INTL_COMPARISON
} from '../../lib/nationalStats'

export default function StatsSection() {
  const maxRate = Math.max(...TOP_CAUSES.map((c) => c.ratePer100k || 0), 1)

  return (
    <section className="bg-canvas py-16 md:py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-medium text-pulse-600 mb-2 tracking-wide">국가 리스크 통계</p>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-3">
          숫자로 보는 대한민국의 리스크
        </h2>
        <p className="text-subink text-sm md:text-base mb-10 max-w-xl">
          보험료율은 결국 이 통계에서 시작돼요. 개인의 습관이 통계 어디에 걸쳐 있는지 알면
          리스크를 관리할 수 있는 지점도 보여요.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          <StatCard label="연간 사망자 수" value={`${OVERVIEW.totalDeaths.toLocaleString()}명`} />
          <StatCard label="조사망률 (10만명당)" value={`${OVERVIEW.crudeDeathRate}명`} />
          <StatCard label="연간 교통사고 사망" value={`${INJURY_STATS.trafficDeaths.toLocaleString()}명`} />
          <StatCard label="연간 신규 암 발생" value={`${DISEASE_INCIDENCE.newCancerCases.toLocaleString()}명`} />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="rounded-card bg-surface shadow-card p-6">
            <h3 className="font-display font-semibold text-ink mb-1">국내 10대 사망원인</h3>
            <p className="text-xs text-subink mb-5">
              암·심장질환·폐렴 3대 사인이 전체 사망의 {TOP3_SHARE}%를 차지해요
            </p>
            <div className="space-y-3">
              {TOP_CAUSES.map((c) => (
                <div key={c.rank}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-ink">{c.rank}. {c.name}</span>
                    <span className="tabular text-subink">{c.ratePer100k ? `${c.ratePer100k}명` : ''}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-canvas overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: c.ratePer100k ? `${(c.ratePer100k / maxRate) * 100}%` : `${(11 - c.rank) * 8}%`,
                        backgroundColor: c.ratePer100k ? '#0F9D82' : '#CFEEE3'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-card bg-surface shadow-card p-6">
              <h3 className="font-display font-semibold text-ink mb-3">감염병 발생</h3>
              <p className="tabular font-mono text-3xl font-bold text-ink">
                {DISEASE_INCIDENCE.infectiousDiseaseCases.toLocaleString()}건
              </p>
              <p className="text-xs text-subink mt-1">법정감염병 연간 발생 건수</p>
            </div>

            <div className="rounded-card bg-coral-500/[0.06] border border-coral-500/20 p-6">
              <h3 className="font-display font-semibold text-ink mb-3">자살률, OECD와 비교하면</h3>
              <div className="flex items-end gap-4">
                <div>
                  <p className="tabular font-mono text-3xl font-bold text-coral-600">
                    {INTL_COMPARISON.koreaSuicideRateStandardized}
                  </p>
                  <p className="text-xs text-subink mt-1">한국 (10만명당)</p>
                </div>
                <div>
                  <p className="tabular font-mono text-3xl font-bold text-subink">
                    {INTL_COMPARISON.oecdAvgSuicideRate}
                  </p>
                  <p className="text-xs text-subink mt-1">OECD 평균</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-subink">
          출처: {NATIONAL_STATS_META.source} · {NATIONAL_STATS_META.fetchedNote}
        </p>
      </div>
    </section>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-card bg-surface shadow-card p-4">
      <p className="text-xs text-subink mb-1">{label}</p>
      <p className="tabular font-mono text-lg font-bold text-ink">{value}</p>
    </div>
  )
}
