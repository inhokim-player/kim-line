import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QuestionCard from '../QuestionCard'

const sampleQuestion = {
  text: '테스트 질문입니다',
  options: [
    { label: '선택지 A', value: 1 },
    { label: '선택지 B', value: 2 }
  ]
}

describe('QuestionCard', () => {
  it('옵션을 클릭하면 onAnswer가 해당 값으로 호출된다', async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()

    render(<QuestionCard step={1} total={3} question={sampleQuestion} onAnswer={onAnswer} />)

    await user.click(screen.getByText('선택지 B'))

    await waitFor(() => {
      expect(onAnswer).toHaveBeenCalledWith(2)
    })
    expect(onAnswer).toHaveBeenCalledTimes(1)
  })

  it('진행 바는 total 개수만큼 렌더링된다', () => {
    render(<QuestionCard step={2} total={5} question={sampleQuestion} onAnswer={() => {}} />)
    // 진행바 dot 컨테이너 내부에 total 개수만큼 div가 있어야 함
    const dots = document.querySelectorAll('.rounded-pill.flex-1')
    expect(dots.length).toBe(5)
  })

  it('onBack이 주어지면 뒤로가기 버튼이 표시되고 클릭 시 호출된다', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    render(
      <QuestionCard step={2} total={3} question={sampleQuestion} onAnswer={() => {}} onBack={onBack} />
    )
    await user.click(screen.getByLabelText('이전 문항'))
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('onBack이 없으면 뒤로가기 버튼이 렌더링되지 않는다', () => {
    render(<QuestionCard step={1} total={3} question={sampleQuestion} onAnswer={() => {}} />)
    expect(screen.queryByLabelText('이전 문항')).not.toBeInTheDocument()
  })
})
