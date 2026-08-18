import { useState } from 'react'
import {
  CONDITION_OPTIONS,
  FAMILY_HISTORY_OPTIONS,
  SURGERY_OPTIONS,
  MEDICATION_OPTIONS,
  deriveHealthInsights
} from '../../lib/healthProfile'

const STEPS = ['body', 'conditions', 'family', 'surgeries', 'medications', 'habits', 'checkup', 'result']

export default function HealthSurvey({ onFinish }) {
  const [stepIdx, setStepIdx] = useState(0)
  const [profile, setProfile] = useState({
    heightCm: '',
    weightKg: '',
    conditions: [],
    familyHistory: [],
    surgeries: [],
    medications: '',
    smoking: '',
    drinking: '',
    checkupAbnormal: ''
  })

  const step = STEPS[stepIdx]
  const next = () => setStepIdx((i) => Math.min(i + 1, STEPS.length - 1))
  const back = () => setStepIdx((i) => Math.max(i - 1, 0))

  function toggle(field, key) {
    setProfile((p) => {
      const set = new Set(p[field])
      set.has(key) ? set.delete(key) : set.add(key)
      return { ...p, [field]: [...set] }
    })
  }

  const insights = step === 'result' ? deriveHealthInsights(profile) : null

  return (
    <div className="max-w-md mx-auto">
      {step !== 'result' && (
        <div className="flex gap-1.5 mb-6">
          {STEPS.slice(0, -1).map((_, i) => (
            <div key={i} className="h-1 flex-1" style={{ backgroundColor: i <= stepIdx ? '#2F6FED' : '#E5E8EB' }} />
          ))}
        </div>
      )}

      {step === 'body' && (
        <div>
          <h3 className="font-display text-xl font-bold text-ink mb-1">신체 정보</h3>
          <p className="text-xs text-subink mb-6">BMI 계산에만 쓰이고 저장되지 않아요</p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Field label="키 (cm)" value={profile.heightCm} onChange={(v) => setProfile({ ...profile, heightCm: v })} />
            <Field label="몸무게 (kg)" value={profile.weightKg} onChange={(v) => setProfile({ ...profile, weightKg: v })} />
          </div>
          <NextButton onClick={next} />
        </div>
      )}

      {step === 'conditions' && (
        <div>
          <h3 className="font-display text-xl font-bold text-ink mb-1">기존 질환 이력</h3>
          <p className="text-xs text-subink mb-6">해당하는 항목을 모두 선택하세요 (없으면 그냥 다음으로)</p>
          <CheckList options={CONDITION_OPTIONS} selected={profile.conditions} onToggle={(k) => toggle('conditions', k)} />
          <div className="flex gap-2 mt-8">
            <BackButton onClick={back} />
            <NextButton onClick={next} />
          </div>
        </div>
      )}

      {step === 'family' && (
        <div>
          <h3 className="font-display text-xl font-bold text-ink mb-1">가족력</h3>
          <p className="text-xs text-subink mb-6">부모·형제자매 중 진단 이력이 있으면 선택하세요</p>
          <CheckList
            options={FAMILY_HISTORY_OPTIONS}
            selected={profile.familyHistory}
            onToggle={(k) => toggle('familyHistory', k)}
          />
          <div className="flex gap-2 mt-8">
            <BackButton onClick={back} />
            <NextButton onClick={next} />
          </div>
        </div>
      )}

      {step === 'surgeries' && (
        <div>
          <h3 className="font-display text-xl font-bold text-ink mb-1">수술 이력</h3>
          <p className="text-xs text-subink mb-6">해당하는 항목을 모두 선택하세요 (없으면 그냥 다음으로)</p>
          <CheckList options={SURGERY_OPTIONS} selected={profile.surgeries} onToggle={(k) => toggle('surgeries', k)} />
          <div className="flex gap-2 mt-8">
            <BackButton onClick={back} />
            <NextButton onClick={next} />
          </div>
        </div>
      )}

      {step === 'medications' && (
        <div>
          <h3 className="font-display text-xl font-bold text-ink mb-1">정기 복용 약물</h3>
          <p className="text-xs text-subink mb-6">처방받아 꾸준히 복용 중인 약물이 있나요?</p>
          <SingleChoice
            options={MEDICATION_OPTIONS.map((o) => ({ key: o.key, label: o.label }))}
            value={profile.medications}
            onChange={(v) => setProfile({ ...profile, medications: v })}
          />
          <div className="flex gap-2 mt-8">
            <BackButton onClick={back} />
            <NextButton onClick={next} />
          </div>
        </div>
      )}

      {step === 'habits' && (
        <div>
          <h3 className="font-display text-xl font-bold text-ink mb-1">흡연 · 음주</h3>
          <div className="mb-6">
            <p className="text-sm text-ink mb-2">흡연</p>
            <SingleChoice
              options={[
                { key: 'never', label: '비흡연' },
                { key: 'past', label: '과거 흡연' },
                { key: 'current', label: '흡연 중' }
              ]}
              value={profile.smoking}
              onChange={(v) => setProfile({ ...profile, smoking: v })}
            />
          </div>
          <div className="mb-6">
            <p className="text-sm text-ink mb-2">음주</p>
            <SingleChoice
              options={[
                { key: 'never', label: '안 함' },
                { key: 'sometimes', label: '가끔' },
                { key: 'often', label: '자주' }
              ]}
              value={profile.drinking}
              onChange={(v) => setProfile({ ...profile, drinking: v })}
            />
          </div>
          <div className="flex gap-2 mt-8">
            <BackButton onClick={back} />
            <NextButton onClick={next} />
          </div>
        </div>
      )}

      {step === 'checkup' && (
        <div>
          <h3 className="font-display text-xl font-bold text-ink mb-1">최근 건강검진</h3>
          <p className="text-xs text-subink mb-6">최근 1년 내 검진에서 이상 소견을 들으셨나요?</p>
          <SingleChoice
            options={[
              { key: 'yes', label: '있었다' },
              { key: 'no', label: '없었다' },
              { key: 'unknown', label: '검진을 안 받았다 / 모르겠다' }
            ]}
            value={profile.checkupAbnormal}
            onChange={(v) => setProfile({ ...profile, checkupAbnormal: v })}
          />
          <div className="flex gap-2 mt-8">
            <BackButton onClick={back} />
            <NextButton onClick={next} label="결과 보기" />
          </div>
        </div>
      )}

      {step === 'result' && insights && (
        <div>
          <p className="font-mono text-[11px] font-medium text-shield-600 mb-2 tracking-widest uppercase">건강 기반 맞춤 보험</p>
          <h3 className="font-display text-xl font-bold text-ink mb-4">이런 카테고리를 확인해보세요</h3>

          {insights.bmi && (
            <div className="border-b border-line pb-4 mb-4">
              <p className="text-xs text-subink mb-1">BMI</p>
              <p className="text-ink">
                <span className="tabular font-mono text-lg font-bold">{insights.bmi}</span>
                <span className="text-sm text-subink ml-2">({insights.bmiCategory?.label})</span>
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            {insights.categories.map((c) => (
              <span
                key={c}
                className="text-sm px-3 py-1.5 rounded-full bg-shield-500/10 text-shield-600 border border-shield-500/20"
              >
                {c}
              </span>
            ))}
          </div>

          {insights.notes.length > 0 && (
            <div className="space-y-3 border-t border-line pt-4 mb-6">
              {insights.notes.map((n, i) => (
                <p key={i} className="text-xs text-subink leading-relaxed">
                  <span className="text-ink font-medium">{n.source}</span> — {n.text}
                </p>
              ))}
            </div>
          )}

          <p className="text-xs text-subink border-t border-line pt-4 mb-6 leading-relaxed">
            이 결과는 자가 입력 정보를 바탕으로 한 참고용 안내이며 의학적 진단이나
            보험 가입 확정을 의미하지 않아요. 기존 질환이 있다면 가입 심사(고지의무)에
            영향을 줄 수 있으니 반드시 보험사·설계사와 직접 확인하세요.
          </p>

          <button
            onClick={() => onFinish?.(profile, insights)}
            className="w-full rounded-xl bg-shield-500 text-white py-3.5 font-medium hover:bg-shield-600 transition"
          >
            이 정보 반영해서 계속하기 →
          </button>
        </div>
      )}
    </div>
  )
}

function Field({ label, value, onChange }) {
  const id = `field-${label.replace(/\s+/g, '-')}`
  return (
    <div>
      <label htmlFor={id} className="block text-xs text-subink mb-1">{label}</label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b-2 border-line focus:border-shield-500 outline-none py-2 bg-transparent text-lg tabular"
      />
    </div>
  )
}

function CheckList({ options, selected, onToggle }) {
  return (
    <div className="divide-y divide-line border-t border-b border-line">
      {options.map((o) => (
        <label key={o.key} className="flex items-center gap-3 py-3 cursor-pointer">
          <input
            type="checkbox"
            checked={selected.includes(o.key)}
            onChange={() => onToggle(o.key)}
            className="w-4 h-4 accent-shield-500"
          />
          <span className="text-sm text-ink">{o.label}</span>
        </label>
      ))}
    </div>
  )
}

function SingleChoice({ options, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((o) => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          className={`text-left text-sm px-4 py-2.5 border transition ${
            value === o.key
              ? 'border-shield-500 bg-shield-500/10 text-shield-600'
              : 'border-line text-subink hover:border-shield-500'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function NextButton({ onClick, label = '다음' }) {
  return (
    <button onClick={onClick} className="flex-1 rounded-xl bg-ink text-white py-3 font-medium hover:bg-shield-600 transition">
      {label}
    </button>
  )
}

function BackButton({ onClick }) {
  return (
    <button onClick={onClick} className="px-5 rounded-xl border border-line text-subink hover:text-ink transition">
      이전
    </button>
  )
}
