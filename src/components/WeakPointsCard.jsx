import { weakBodyPartsDetailed } from '../lib/bodyInsuranceMap'

export default function WeakPointsCard({ values }) {
  const weakParts = weakBodyPartsDetailed(values)

  return (
    <div className="rounded-card bg-surface p-5">
      <h3 className="font-display font-semibold text-ink mb-1">주의가 필요한 부위</h3>
      <p className="text-xs text-subink mb-4">오늘 응답 기반으로 매칭한 신체부위와 보험 카테고리예요</p>
      <div className="space-y-3">
        {weakParts.map((p) => (
          <div key={p.key} className="border-t border-line pt-3">
            <p className="text-sm text-ink flex items-center gap-1.5 mb-1.5">
              <span>{p.icon || '⚕️'}</span>
              {p.label}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {p.insuranceCategories.map((c) => (
                <span
                  key={c}
                  className="text-xs px-2.5 py-1 rounded-full bg-shield-500/10 text-shield-600 border border-shield-500/20"
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="text-xs text-subink leading-relaxed">{p.tip}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
