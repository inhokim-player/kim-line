// Cloudflare Pages Function: GET /api/stats
//
// KOSIS Open API를 대신 호출해서 결과를 KV에 캐싱하는 프록시입니다.
// 브라우저에서 KOSIS를 직접 호출하면 CORS/키 노출 문제가 있어서
// 이 서버리스 함수를 경유하도록 설계했습니다.
//
// 필요한 설정 (Cloudflare Pages 프로젝트 설정에서):
//   - Secret:  KOSIS_API_KEY   (KOSIS에서 발급받은 인증키)
//   - Variable: KOSIS_ORG_ID   (기관코드, 통계청은 "101")
//   - Variable: KOSIS_TBL_ID   (사망원인통계 통계표 ID — README 참고해서 직접 조회 필요)
//   - KV 바인딩: STATS_KV      (wrangler.toml에서 생성)
//
// 이 함수는 설정이 안 되어 있어도 에러를 던지지 않고 "not_configured" 상태를
// 반환합니다 — 프론트엔드는 이 경우 기존 정적 스냅샷을 그대로 씁니다.

const CACHE_KEY = 'national_stats_v1'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24시간마다 갱신

export async function onRequestGet({ env }) {
  if (!env.KOSIS_API_KEY || !env.KOSIS_TBL_ID) {
    return json({ status: 'not_configured', message: 'KOSIS_API_KEY / KOSIS_TBL_ID 미설정' }, 200)
  }

  try {
    const cached = env.STATS_KV ? await env.STATS_KV.get(CACHE_KEY, 'json') : null
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
      return json({ status: 'ok', cache: 'hit', ...cached })
    }

    const fresh = await fetchFromKosis(env)
    if (env.STATS_KV) {
      await env.STATS_KV.put(CACHE_KEY, JSON.stringify(fresh))
    }
    return json({ status: 'ok', cache: 'miss', ...fresh })
  } catch (err) {
    // 호출 실패 시, 오래된 캐시라도 있으면 그것을 반환 (완전 실패보다 낫다)
    const stale = env.STATS_KV ? await env.STATS_KV.get(CACHE_KEY, 'json') : null
    if (stale) {
      return json({ status: 'stale', cache: 'stale', error: String(err), ...stale })
    }
    return json({ status: 'error', message: String(err?.message || err) }, 502)
  }
}

async function fetchFromKosis(env) {
  const url = new URL('https://kosis.kr/openapi/Param/statisticsParameterData.do')
  url.searchParams.set('method', 'getList')
  url.searchParams.set('apiKey', env.KOSIS_API_KEY)
  url.searchParams.set('orgId', env.KOSIS_ORG_ID || '101')
  url.searchParams.set('tblId', env.KOSIS_TBL_ID)
  url.searchParams.set('itmId', 'ALL')
  url.searchParams.set('objL1', 'ALL')
  url.searchParams.set('prdSe', 'Y')
  url.searchParams.set('startPrdDe', String(new Date().getFullYear() - 2))
  url.searchParams.set('endPrdDe', String(new Date().getFullYear()))
  url.searchParams.set('format', 'json')
  url.searchParams.set('jsonVD', 'Y')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`KOSIS 응답 오류: HTTP ${res.status}`)
  const raw = await res.json()

  if (raw?.err) throw new Error(`KOSIS 오류 코드 ${raw.err}: ${raw.errMsg || '알 수 없는 오류'}`)

  return {
    fetchedAt: Date.now(),
    tblId: env.KOSIS_TBL_ID,
    // 원본 응답을 그대로 보관합니다. 통계표마다 필드 구조(항목명·분류코드)가
    // 달라서, 실제 tblId가 확정된 뒤 아래 normalize() 함수를 채워야
    // src/lib/nationalStats.js와 같은 모양(OVERVIEW, TOP_CAUSES 등)으로 변환됩니다.
    raw: raw.slice ? raw.slice(0, 50) : raw, // 응답이 배열이면 과도한 크기 방지로 앞부분만 캐싱
    normalized: normalize(raw)
  }
}

// TODO: 실제 tblId 확정 후, KOSIS 응답의 필드(PRD_DE, ITM_NM, DT 등)를
// src/lib/nationalStats.js의 OVERVIEW / TOP_CAUSES 형태로 매핑하세요.
// 지금은 자리만 잡아둔 뼈대입니다 — 실제 응답 예시를 붙여주시면 이 함수를 완성해드릴 수 있어요.
function normalize(raw) {
  return null
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, max-age=3600'
    }
  })
}
