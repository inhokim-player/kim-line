import {
  NATIONAL_STATS_META,
  OVERVIEW,
  TOP_CAUSES,
  TOP3_SHARE,
  INJURY_STATS,
  DISEASE_INCIDENCE,
  pickRelevantStat
} from '../lib/nationalStats'

export default function NationalStats({ values, onBack }) {
  const relevant = pickRelevantStat(values)
  const maxRate = Math.max(...TOP_CAUSES.map((c) => c.ratePer100k || 0), 1)

  return (
    <div className="min-h-screen bg-canvas pb-16">
      <header className="px-6 pt-8 pb-2 flex items-center gap-3">
        <button onClick={onBack} aria-label="뒤로" className="text-subink hover:text-ink transition text-lg">
          ←
        </button>
        <h1 className="font-display text-lg font-bold text-ink">전국 통계와 비교</h1>
      </header>

      <main className="px-6 mt-4 space-y-4 max-w-md mx-auto">
        <div className="rounded-card bg-surface shadow-card p-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{relevant.icon}</span>
            <div>
              <p className="text-xs text-subink">나와 가장 관련 있는 통계</p>
              <p className="font-display font-semibold text-ink mt-0.5">{relevant.title}</p>
              <p className="tabular font-mono text-xl font-bold text-ink mt-1">{relevant.value}</p>
              <p className="text-xs text-subink mt-2 leading-relaxed">{relevant.note}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-card bg-surface shadow-card p-4">
            <p className="text-xs text-subink">연간 사망자 수</p>
            <p className="tabular font-mono text-lg font-bold text-ink mt-1">
              {OVERVIEW.totalDeaths.toLocaleString()}명
            </p>
          </div>
          <div className="rounded-card bg-surface shadow-card p-4">
            <p className="text-xs text-subink">조사망률 (10만 명당)</p>
            <p className="tabular font-mono text-lg font-bold text-ink mt-1">{OVERVIEW.crudeDeathRate}명</p>
          </div>
          <div className="rounded-card bg-surface shadow-card p-4">
            <p className="text-xs text-subink">연간 교통사고 사망</p>
            <p className="tabular font-mono text-lg font-bold text-ink mt-1">
              {INJURY_STATS.trafficDeaths.toLocaleString()}명
            </p>
          </div>
          <div className="rounded-card bg-surface shadow-card p-4">
            <p className="text-xs text-subink">연간 신규 암 발생</p>
            <p className="tabular font-mono text-lg font-bold text-ink mt-1">
              {DISEASE_INCIDENCE.newCancerCases.toLocaleString()}명
            </p>
          </div>
        </div>

        <div className="rounded-card bg-surface shadow-card p-5">
          <h2 className="font-display font-semibold text-ink mb-1">국내 10대 사망원인</h2>
          <p className="text-xs text-subink mb-4">
            암·심장질환·폐렴 3대 사인이 전체 사망의 {TOP3_SHARE}%를 차지해요
          </p>
          <div className="space-y-2.5">
            {TOP_CAUSES.map((c) => (
              <div key={c.rank}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-ink">
                    {c.rank}. {c.name}
                  </span>
                  <span className="tabular text-subink">
                    {c.ratePer100k ? `${c.ratePer100k}명` : ''}
                  </span>
                </div>
                <div className="h-1.5 rounded-pill bg-canvas overflow-hidden">
                  <div
                    className="h-full rounded-pill"
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

        <div className="rounded-card bg-surface shadow-card p-5">
          <h2 className="font-display font-semibold text-ink mb-3">감염병 발생</h2>
          <p className="tabular font-mono text-xl font-bold text-ink">
            {DISEASE_INCIDENCE.infectiousDiseaseCases.toLocaleString()}건
          </p>
          <p className="text-xs text-subink mt-1">법정감염병 연간 발생 건수</p>
        </div>

        <p className="text-center text-xs text-subink pt-2">
          출처: {NATIONAL_STATS_META.source} · {NATIONAL_STATS_META.fetchedNote}
        </p>
      </main>
    </div>
  )
}
