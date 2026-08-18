# RiskNow — 3D 인체 모델 하나에 집중

통계도, 설문도, 로그인도 없습니다. 접속하면 바로 3D 인체 모델이 나오고,
부위를 클릭하면 관련 통계 한 줄, 도움이 될 수 있는 식단, 보험 카테고리와
예시 보험료가 그 자리에서 나옵니다.

## 화면 흐름

```
접속
  → 짧은 인트로 (다크 히어로, 한 문단)
  → 3D 인체 모델: 부위 클릭 → 통계 + 식단 + 보험 카테고리 + 예시 보험료
  → 보험사 대상 섹션 (리스크 패스포트 컨셉)
```

## 3D 모델 클릭 시 보이는 정보

부위(뇌·정신건강·심장·폐·소화기·척추·피부·다리) 8곳 중 하나를 클릭하면:

1. **관련 통계** 한 줄 요약
2. **예시 예상 보험료** — 부위마다 다르게 부여한 참고용 리스크 점수로 계산한
   예시값입니다. 실제 개인 진단이 아닙니다.
3. **영양소 데이터 테이블** — "2020 한국인 영양소 섭취기준(KDRI)"(보건복지부·
   한국영양학회 공동 발표, 성인 기준) 근사치를 영양소명·1일 권장량·단위로
   표 형태로 보여주고, 도움이 되는 식품과 작용 기전 설명이 함께 나와요.
   의학적 처방이 아닌 일반 참고 정보입니다 (`bodyInsuranceMap.js`의
   `nutrition` 필드, `NUTRITION_META`).
4. **관련 보험 상품군** — 특정 보험사 상품이 아니라 국내에 일반적으로
   존재하는 카테고리입니다.

패널은 FIG 번호·코너 브래킷·모노스페이스 라벨로 "과학 리포트" 톤을 유지했고,
3D 캔버스에는 SCAN/LIVE SCAN/REGION 인디케이터를 추가했어요.

## 테스트

```bash
npm test
```

- `bodyInsuranceMap.test.js` — 신체부위 → 보험 카테고리 매핑, nutrition 데이터
  무결성 검증
- `riskCalculator.test.js` — 리스크 점수·보험료 계산 경계값 검증
- `QuestionCard.test.jsx` / `Quiz.test.jsx` / `DailyCheckin.test.jsx` /
  `HealthSurvey.test.jsx` — 코드로 남아있는 진단 플로우의 클릭 흐름 검증
  (아래 참고)

## 코드로만 남아있는 기능 (현재 미노출)

8문항 리스크 진단, 정밀 건강 설문, 일일 체크인, 로컬 저장 기반 개인 대시보드,
국가 통계 그래프는 `Quiz.jsx` / `HealthSurvey.jsx` / `DailyCheckin.jsx` /
`Dashboard.jsx` 등에 코드로 남아있지만 현재 `LandingPage.jsx`에서 import하지
않아 화면에 노출되지 않습니다. 관련 테스트도 통과 상태로 남겨뒀습니다.

## 로컬 실행

```bash
npm install
npm run dev
```

## Cloudflare Pages 배포

```bash
npm run build
```

- Build command: `npm run build`
- Build output directory: `dist`
- 환경변수 불필요
