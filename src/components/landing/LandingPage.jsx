import Hero from './Hero'
import StatsSection from './StatsSection'
import DiagnosisCTA from './DiagnosisCTA'
import QuizSection from './QuizSection'
import InsurerSection from './InsurerSection'
import PolicySection from './PolicySection'
import Footer from './Footer'

export default function LandingPage({ onQuizResult }) {
  function scrollToQuiz() {
    document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div>
      <Hero onStartQuiz={scrollToQuiz} />
      <StatsSection />
      <DiagnosisCTA onStart={scrollToQuiz} />
      <QuizSection onFinish={onQuizResult} />
      <InsurerSection />
      <PolicySection />
      <Footer />
    </div>
  )
}
