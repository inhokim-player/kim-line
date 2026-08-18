export default function PolicySection() {
  return (
    <section className="bg-canvas px-6 py-16 border-t border-line">
      <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-10">
        <div id="privacy">
          <h2 className="font-display text-lg font-bold text-ink mb-4">개인정보처리방침</h2>
          <div className="text-xs text-subink leading-relaxed space-y-3">
            <p>
              RiskNow(이하 "사이트")는 리스크 유형 테스트 이용 과정에서 별도의 회원가입 없이
              동작하며, 테스트 응답과 결과는 서버에 저장하지 않고 브라우저 내에서만
              계산됩니다. 결과를 "공유하기"로 복사할 경우에만 사용자의 클립보드에 텍스트가
              기록되며, 사이트 운영자는 이를 수집하지 않습니다.
            </p>
            <p>
              문의 메일(a123dlsgh@gmail.com)로 연락 주시는 경우, 답변을 위해 필요한 최소한의
              정보(이메일 주소, 문의 내용)만 보관하며 목적 달성 후 지체 없이 파기합니다.
            </p>
            <p>
              사이트에서 제공하는 통계는 통계청·경찰청·보건복지부·질병관리청의 공개 자료를
              가공한 것으로, 특정 개인을 식별할 수 있는 정보를 포함하지 않습니다.
            </p>
            <p className="text-subink/70">
              ※ 이 문서는 참고용 템플릿입니다. 실제 서비스 공개 전 개인정보보호법 등 관련
              법령에 맞게 법률 전문가의 검토를 받으시길 권장합니다.
            </p>
          </div>
        </div>

        <div id="terms">
          <h2 className="font-display text-lg font-bold text-ink mb-4">이용약관</h2>
          <div className="text-xs text-subink leading-relaxed space-y-3">
            <p>
              리스크 유형 테스트 결과 및 예상 보험료는 재미 요소가 포함된 참고용 정보이며,
              실제 보험 가입·언더라이팅 심사 기준과 무관합니다. 사이트에 게시된 통계는
              공식 발표 자료를 하루·초 단위로 균등 배분한 추정치로, 실측 데이터가
              아닙니다.
            </p>
            <p>
              사이트 이용으로 발생하는 의사결정(보험 가입, 건강 관리 등)에 대한 책임은
              이용자 본인에게 있으며, 운영자는 통계 오차나 서비스 중단으로 인한 손해에
              대해 법령이 허용하는 범위 내에서 책임을 제한합니다.
            </p>
            <p className="text-subink/70">
              ※ 이 문서 역시 참고용 템플릿입니다. 상업적으로 운영할 경우 전자상거래법,
              정보통신망법 등을 반영해 법률 검토 후 게시하시길 권장합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
