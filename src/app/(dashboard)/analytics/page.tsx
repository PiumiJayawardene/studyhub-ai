import {
  getSubjectDistribution,
  getStudyTimeTrend,
  getQuizPerformance,
  getFlashcardProgress,
  getAnalyticsSummary,
} from "@/lib/actions/analytics";
import { SummaryCards } from "@/components/analytics/summary-cards";
import { SubjectDistributionChart } from "@/components/analytics/subject-distribution-chart";
import { StudyTimeChart } from "@/components/analytics/study-time-chart";
import { QuizPerformanceChart } from "@/components/analytics/quiz-performance-chart";
import { FlashcardProgressChart } from "@/components/analytics/flashcard-progress-chart";

export default async function AnalyticsPage() {
  const [summary, subjectData, studyTimeData, quizData, flashcardData] = await Promise.all([
    getAnalyticsSummary(),
    getSubjectDistribution(),
    getStudyTimeTrend(),
    getQuizPerformance(),
    getFlashcardProgress(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-muted-foreground">Your study insights at a glance.</p>
      </div>

      <SummaryCards data={summary} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StudyTimeChart data={studyTimeData} />
        <SubjectDistributionChart data={subjectData} />
        <QuizPerformanceChart data={quizData} />
        <FlashcardProgressChart data={flashcardData} />
      </div>
    </div>
  );
}