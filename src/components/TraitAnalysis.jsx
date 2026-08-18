export default function TraitAnalysis({ analysis }) {
  return (
    <div className="rounded-card bg-surface shadow-card p-5">
      <h3 className="font-display font-semibold text-ink mb-1">성향 분석</h3>
      <p className="text-xs text-subink mb-4">4개 축을 뜯어보면 이런 모습이에요</p>

      <div className="space-y-4 mb-5">
        {analysis.axes.map((a) => (
          <div key={a.key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-ink flex items-center gap-1.5">
                <span>{a.icon}</span>
                {a.label}
              </span>
              <span className="tabular font-mono text-xs text-subink">{a.score}</span>
            </div>
            <div className="h-1.5 rounded-full bg-canvas overflow-hidden mb-1.5">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${a.score}%`,
                  backgroundColor: a.tier === 'strength' ? '#0F9D82' : a.tier === 'growth' ? '#E85D4E' : '#CFEEE3'
                }}
              />
            </div>
            <p className="text-xs text-subink leading-relaxed">{a.comment}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-canvas p-4">
        <p className="text-xs font-medium text-ink mb-1">💡 지금 가장 신경 쓸 부분</p>
        <p className="text-xs text-subink leading-relaxed">{analysis.recommendation}</p>
      </div>
    </div>
  )
}
