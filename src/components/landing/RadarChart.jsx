const AXES = [
  { key: 'driving', label: '운전 습관', value: 78 },
  { key: 'sleep', label: '수면 리듬', value: 65 },
  { key: 'vitality', label: '활력 지수', value: 82 },
  { key: 'mind', label: '마음 상태', value: 70 }
]

const SIZE = 320
const CENTER = SIZE / 2
const RADIUS = 110
const RINGS = [0.25, 0.5, 0.75, 1]

function pointOnAxis(index, total, fraction) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2
  return {
    x: CENTER + Math.cos(angle) * RADIUS * fraction,
    y: CENTER + Math.sin(angle) * RADIUS * fraction
  }
}

export default function RadarChart() {
  const total = AXES.length
  const polygonPoints = AXES.map((a, i) => pointOnAxis(i, total, a.value / 100))
  const polygonStr = polygonPoints.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <div className="relative">
      {/* 계측기 스타일 코너 브래킷 */}
      <CornerBrackets />

      <div className="px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
            FIG.1 — RISK VECTOR (n=8 items)
          </p>
          <p className="font-mono text-[10px] tracking-widest text-white/40 uppercase">SAMPLE DATA</p>
        </div>

        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-sm mx-auto">
          {/* 동심원 격자 (측정 눈금) */}
          {RINGS.map((r) => (
            <circle
              key={r}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS * r}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          ))}
          {/* 눈금 라벨 */}
          {RINGS.map((r) => (
            <text
              key={`t-${r}`}
              x={CENTER + 4}
              y={CENTER - RADIUS * r}
              fill="rgba(255,255,255,0.3)"
              fontSize="8"
              fontFamily="var(--font-mono, monospace)"
            >
              {r * 100}
            </text>
          ))}

          {/* 축 라인 */}
          {AXES.map((a, i) => {
            const p = pointOnAxis(i, total, 1)
            return (
              <line
                key={a.key}
                x1={CENTER}
                y1={CENTER}
                x2={p.x}
                y2={p.y}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
              />
            )
          })}

          {/* 데이터 폴리곤 */}
          <polygon points={polygonStr} fill="rgba(47,111,237,0.25)" stroke="#5B9CFF" strokeWidth="1.5" />

          {/* 데이터 포인트 */}
          {polygonPoints.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3" fill="#5B9CFF" stroke="#0B1220" strokeWidth="1.5" />
          ))}

          {/* 축 라벨 */}
          {AXES.map((a, i) => {
            const p = pointOnAxis(i, total, 1.22)
            return (
              <text
                key={`label-${a.key}`}
                x={p.x}
                y={p.y}
                fill="rgba(255,255,255,0.7)"
                fontSize="11"
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="var(--font-display, sans-serif)"
              >
                {a.label}
              </text>
            )
          })}
        </svg>

        <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-navy-border">
          {AXES.map((a) => (
            <div key={a.key} className="text-center">
              <p className="font-mono text-sm text-white tabular">{a.value}</p>
              <p className="font-mono text-[9px] text-white/40 uppercase tracking-wide mt-0.5">{a.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CornerBrackets() {
  const style = { borderColor: '#5B9CFF' }
  return (
    <>
      <span className="absolute top-0 left-0 w-4 h-4 border-t border-l" style={style} />
      <span className="absolute top-0 right-0 w-4 h-4 border-t border-r" style={style} />
      <span className="absolute bottom-0 left-0 w-4 h-4 border-b border-l" style={style} />
      <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r" style={style} />
    </>
  )
}
