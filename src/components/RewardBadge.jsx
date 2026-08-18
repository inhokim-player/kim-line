export default function RewardBadge({ yesterdayScore, todayScore }) {
  if (yesterdayScore == null) return null

  const improved = todayScore < yesterdayScore
  const diff = Math.abs(todayScore - yesterdayScore)

  if (diff === 0) {
    return (
      <div className="rounded-card bg-surface shadow-card p-4 flex items-center gap-3">
        <span className="text-xl" aria-hidden="true">〰️</span>
        <p className="text-sm text-subink">어제와 리스크 점수가 동일해요</p>
      </div>
    )
  }

  return (
    <div
      className="rounded-card p-4 flex items-center gap-3"
      style={{ backgroundColor: improved ? '#EAF7F3' : '#FBE4DF' }}
    >
      <span className="text-xl" aria-hidden="true">{improved ? '✨' : '⚠️'}</span>
      <div>
        <p className={`text-sm font-medium ${improved ? 'text-pulse-600' : 'text-alert-600'}`}>
          {improved
            ? `어제보다 리스크 ${diff}점 낮아졌어요`
            : `어제보다 리스크 ${diff}점 높아졌어요`}
        </p>
        <p className="text-xs text-subink mt-0.5">
          {improved ? '보험료 할인 폭이 늘어났어요' : '내일은 습관을 조금 더 신경 써볼까요'}
        </p>
      </div>
    </div>
  )
}
