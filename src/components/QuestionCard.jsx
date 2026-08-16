import { useState } from 'react'

export default function QuestionCard({ step, total, question, onAnswer, onBack }) {
  const [selected, setSelected] = useState(null)

  function choose(option) {
    setSelected(option.value)
    // 선택 피드백을 살짝 보여준 뒤 다음으로 진행
    setTimeout(() => {
      onAnswer(option.value)
      setSelected(null)
    }, 180)
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <div className="px-6 pt-8">
        <div className="flex items-center gap-2 mb-6">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="이전 문항"
              className="text-subink hover:text-ink transition text-lg mr-1"
            >
              ←
            </button>
          )}
          <div className="flex-1 flex gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className="h-1.5 flex-1 rounded-pill transition-colors"
                style={{ backgroundColor: i < step ? '#0F9D82' : '#E5E8EB' }}
              />
            ))}
          </div>
        </div>
        <p className="text-xs text-subink tabular">{step} / {total}</p>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 -mt-10">
        <h2 className="font-display text-2xl font-bold text-ink leading-snug mb-8">
          {question.text}
        </h2>

        <div className="space-y-3">
          {question.options.map((opt) => {
            const isSelected = selected === opt.value
            return (
              <button
                key={opt.label}
                onClick={() => choose(opt)}
                className="w-full text-left rounded-card border px-5 py-4 transition-all"
                style={{
                  borderColor: isSelected ? '#0F9D82' : '#E5E8EB',
                  backgroundColor: isSelected ? '#EAF7F3' : '#FFFFFF',
                  transform: isSelected ? 'scale(0.98)' : 'scale(1)'
                }}
              >
                <span className="font-medium text-ink">{opt.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
