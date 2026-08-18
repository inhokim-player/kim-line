export default function InsurerSection() {
  return (
    <section className="border-t border-line py-16 md:py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-medium text-subink mb-2">보험사·설계사이신가요</p>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-4">
          국내에 아직 없는 방식, 리스크 패스포트
        </h2>
        <p className="text-subink text-sm md:text-base leading-relaxed mb-10 max-w-xl">
          국내 UBI는 보험사별로 갇혀 있고 3~6개월 주기로만 재평가돼요. RiskNow는 사용자가
          직접 소유하고, 보험사를 옮겨도 유지되며, 매일 갱신되는 리스크 점수를 지향해요.
        </p>

        <div className="mb-10">
          <Feature title="매일 갱신" desc="3~6개월 주기 재평가가 아니라 하루 단위로 리스크가 갱신돼요" />
          <Feature title="보험사 간 이동" desc="가입 보험사를 바꿔도 리스크 점수는 사용자를 따라가요" />
          <Feature title="공통 적용" desc="자동차·건강·생명보험에 하나의 점수로 공통 적용할 수 있어요" />
        </div>

        <div className="mb-10">
          <p className="text-xs font-medium text-subink mb-3">실제 공유 페이로드 예시 (초안)</p>
          <pre className="text-xs font-mono bg-canvas border border-line p-4 overflow-x-auto text-subink leading-relaxed">
{`{
  "passportVersion": "0.1",
  "issuedAt": "2026-08-16T09:00:00+09:00",
  "riskScore": 42,
  "riskTier": "양호",
  "weakBodyParts": ["spine", "mind"],
  "recommendedCategories": ["상해보험", "정신건강 특약"],
  "consentScope": ["auto", "health"],
  "sourceApp": "risknow.example",
  "userControlled": true
}`}
          </pre>
          <p className="text-xs text-subink mt-3 leading-relaxed">
            지금은 사용자 브라우저에만 저장되는 값을 이 구조로 내보내는 초안이에요.
            실제로 보험사와 연동하려면 사용자 동의(consentScope) 확인, 서명·검증
            (예: JWT), 보험사별 스코어 재해석 정책까지 필요해요.
          </p>
        </div>

        <a
          href="mailto:a123dlsgh@gmail.com?subject=RiskNow%20데이터%20문의"
          className="inline-block border border-ink text-ink px-6 py-3 text-sm font-medium hover:bg-ink hover:text-white transition"
        >
          데이터 연동 문의하기
        </a>
      </div>
    </section>
  )
}

function Feature({ title, desc }) {
  return (
    <div className="border-t border-line py-4 first:border-0 first:pt-0">
      <p className="text-sm font-medium text-ink mb-1">{title}</p>
      <p className="text-sm text-subink leading-relaxed">{desc}</p>
    </div>
  )
}
