import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HealthSurvey from '../HealthSurvey'

describe('HealthSurvey (정밀 건강 설문)', () => {
  it('키/몸무게 입력 → 질환 체크 → 결과까지 전체 흐름이 끝까지 완주된다', async () => {
    const user = userEvent.setup()
    const onFinish = vi.fn()
    render(<HealthSurvey onFinish={onFinish} />)

    // 1. 신체 정보
    expect(screen.getByText('신체 정보')).toBeInTheDocument()
    await user.type(screen.getByLabelText('키 (cm)'), '170')
    await user.type(screen.getByLabelText('몸무게 (kg)'), '90') // 비만 구간 유도
    await user.click(screen.getByText('다음'))

    // 2. 기존 질환 - 고혈압 체크
    await waitFor(() => expect(screen.getByText('기존 질환 이력')).toBeInTheDocument())
    await user.click(screen.getByText('고혈압'))
    await user.click(screen.getByText('다음'))

    // 3. 가족력 - 건너뛰고 다음
    await waitFor(() => expect(screen.getByText('가족력')).toBeInTheDocument())
    await user.click(screen.getByText('다음'))

    // 4. 수술 이력 - 건너뛰고 다음
    await waitFor(() => expect(screen.getByText('수술 이력')).toBeInTheDocument())
    await user.click(screen.getByText('다음'))

    // 5. 정기 복용 약물
    await waitFor(() => expect(screen.getByText('정기 복용 약물')).toBeInTheDocument())
    await user.click(screen.getByText('정기 복용 약물 없음'))
    await user.click(screen.getByText('다음'))

    // 6. 흡연/음주
    await waitFor(() => expect(screen.getByText('흡연 · 음주')).toBeInTheDocument())
    await user.click(screen.getByText('비흡연'))
    await user.click(screen.getByText('안 함'))
    await user.click(screen.getByText('다음'))

    // 7. 최근 건강검진
    await waitFor(() => expect(screen.getByText('최근 건강검진')).toBeInTheDocument())
    await user.click(screen.getByText('없었다'))
    await user.click(screen.getByText('결과 보기'))

    // 8. 결과 화면 - 고혈압 + 비만이 반영되어야 함
    await waitFor(() => expect(screen.getByText('건강 기반 맞춤 보험')).toBeInTheDocument())
    expect(screen.getByText('심장질환보험')).toBeInTheDocument()
    expect(screen.getByText('뇌혈관질환보험')).toBeInTheDocument()

    await user.click(screen.getByText('이 정보 반영해서 계속하기 →'))

    expect(onFinish).toHaveBeenCalledTimes(1)
    const [profile, insights] = onFinish.mock.calls[0]
    expect(profile.conditions).toContain('hypertension')
    expect(insights.bmiCategory.tone).toBe('risk')
  })

  it('뒤로가기 버튼으로 이전 단계로 돌아갈 수 있다', async () => {
    const user = userEvent.setup()
    render(<HealthSurvey onFinish={() => {}} />)

    await user.click(screen.getByText('다음')) // body -> conditions
    await waitFor(() => expect(screen.getByText('기존 질환 이력')).toBeInTheDocument())

    await user.click(screen.getByText('이전')) // conditions -> body
    await waitFor(() => expect(screen.getByText('신체 정보')).toBeInTheDocument())
  })

  it('질환 체크박스를 다시 클릭하면 선택이 해제된다', async () => {
    const user = userEvent.setup()
    render(<HealthSurvey onFinish={() => {}} />)

    await user.click(screen.getByText('다음'))
    await waitFor(() => expect(screen.getByText('기존 질환 이력')).toBeInTheDocument())

    const checkbox = screen.getByRole('checkbox', { name: '당뇨병' })
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('아무 질환도 선택하지 않으면 기본값(실손의료보험)만 나온다', async () => {
    const user = userEvent.setup()
    const onFinish = vi.fn()
    render(<HealthSurvey onFinish={onFinish} />)

    await user.click(screen.getByText('다음')) // body
    await waitFor(() => screen.getByText('기존 질환 이력'))
    await user.click(screen.getByText('다음')) // conditions (건너뜀)
    await waitFor(() => screen.getByText('가족력'))
    await user.click(screen.getByText('다음')) // family
    await waitFor(() => screen.getByText('수술 이력'))
    await user.click(screen.getByText('다음')) // surgeries
    await waitFor(() => screen.getByText('정기 복용 약물'))
    await user.click(screen.getByText('정기 복용 약물 없음'))
    await user.click(screen.getByText('다음')) // medications
    await waitFor(() => screen.getByText('흡연 · 음주'))
    await user.click(screen.getByText('비흡연'))
    await user.click(screen.getByText('안 함'))
    await user.click(screen.getByText('다음')) // habits
    await waitFor(() => screen.getByText('최근 건강검진'))
    await user.click(screen.getByText('없었다'))
    await user.click(screen.getByText('결과 보기'))

    await waitFor(() => expect(screen.getByText('건강 기반 맞춤 보험')).toBeInTheDocument())
    expect(screen.getByText('실손의료보험')).toBeInTheDocument()
    expect(onFinish).not.toHaveBeenCalled() // "이 정보 반영해서 계속하기" 클릭 전이므로 아직 호출 안 됨
  })
})
