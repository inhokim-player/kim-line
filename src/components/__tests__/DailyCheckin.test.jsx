import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DailyCheckin from '../DailyCheckin'
import { DAILY_QUESTIONS } from '../../lib/riskTypes'

describe('DailyCheckin (5문항)', () => {
  it('5문항을 모두 클릭하면 onComplete가 5개 지표를 모두 담아 호출된다', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<DailyCheckin onComplete={onComplete} />)

    for (let i = 0; i < DAILY_QUESTIONS.length; i++) {
      const q = DAILY_QUESTIONS[i]
      await waitFor(() => {
        expect(screen.getByText(q.text)).toBeInTheDocument()
      })
      await user.click(screen.getByText(q.options[1].label))
    }

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledTimes(1)
    })

    const metrics = onComplete.mock.calls[0][0]
    expect(metrics).toEqual(
      expect.objectContaining({
        sleep_hours: expect.any(Number),
        exercise_minutes: expect.any(Number),
        driving_score: expect.any(Number),
        diet_score: expect.any(Number),
        stress_level: expect.any(Number)
      })
    )
  })
})
