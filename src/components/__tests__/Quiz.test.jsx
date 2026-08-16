import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Quiz from '../Quiz'
import { QUIZ_QUESTIONS } from '../../lib/riskTypes'

describe('Quiz (온보딩 8문항)', () => {
  it('인트로 화면에서 시작 버튼을 누르기 전에는 질문이 보이지 않는다', () => {
    render(<Quiz onComplete={() => {}} />)
    expect(screen.getByText('테스트 시작하기')).toBeInTheDocument()
    expect(screen.queryByText(QUIZ_QUESTIONS[0].text)).not.toBeInTheDocument()
  })

  it('8문항을 모두 클릭하면 onComplete가 올바른 형태로 호출된다', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<Quiz onComplete={onComplete} />)

    await user.click(screen.getByText('테스트 시작하기'))

    for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {
      const q = QUIZ_QUESTIONS[i]
      await waitFor(() => {
        expect(screen.getByText(q.text)).toBeInTheDocument()
      })
      const firstOption = q.options[0].label
      await user.click(screen.getByText(firstOption))
    }

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledTimes(1)
    })

    const arg = onComplete.mock.calls[0][0]
    expect(arg).toHaveProperty('metrics')
    expect(arg).toHaveProperty('archetype')
    expect(arg.archetype.code).toHaveLength(4)
    expect(arg.metrics.sleep_hours).toBeGreaterThan(0)
  })

  it('뒤로가기를 누르면 이전 문항으로 돌아간다', async () => {
    const user = userEvent.setup()
    render(<Quiz onComplete={() => {}} />)

    await user.click(screen.getByText('테스트 시작하기'))
    await waitFor(() => screen.getByText(QUIZ_QUESTIONS[0].text))

    // 1번째 문항 답변 -> 2번째 문항으로 이동
    await user.click(screen.getByText(QUIZ_QUESTIONS[0].options[0].label))
    await waitFor(() => screen.getByText(QUIZ_QUESTIONS[1].text))

    // 뒤로가기 -> 1번째 문항으로 복귀
    await user.click(screen.getByLabelText('이전 문항'))
    await waitFor(() => {
      expect(screen.getByText(QUIZ_QUESTIONS[0].text)).toBeInTheDocument()
    })
  })
})
