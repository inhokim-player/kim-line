const FIELDS = [
  { key: 'sleep_hours', label: '수면 시간', icon: '🌙', min: 0, max: 12, step: 0.5, unit: '시간' },
  { key: 'exercise_minutes', label: '운동 시간', icon: '🏃', min: 0, max: 90, step: 5, unit: '분' },
  { key: 'driving_score', label: '운전 습관', icon: '🚗', min: 0, max: 100, step: 5, unit: '점', hint: '높을수록 안전' },
  { key: 'diet_score', label: '식습관', icon: '🥗', min: 0, max: 100, step: 5, unit: '점', hint: '높을수록 건강' },
  { key: 'stress_level', label: '스트레스', icon: '🧘', min: 0, max: 100, step: 5, unit: '점', hint: '낮을수록 좋음' }
]

export default function DailyLogForm({ values, onChange }) {
  return (
    <div className="rounded-card bg-surface p-5">
      <h2 className="font-display font-semibold text-ink mb-4">오늘의 데이터</h2>
      <div className="space-y-5">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-ink flex items-center gap-2">
                <span aria-hidden="true">{f.icon}</span>
                {f.label}
                {f.hint && <span className="text-xs text-subink">({f.hint})</span>}
              </span>
              <span className="tabular font-mono text-sm font-medium text-ink">
                {values[f.key]}{f.unit}
              </span>
            </div>
            <input
              type="range"
              min={f.min}
              max={f.max}
              step={f.step}
              value={values[f.key]}
              onChange={(e) => onChange(f.key, Number(e.target.value))}
              className="w-full accent-pulse-500"
              aria-label={f.label}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
