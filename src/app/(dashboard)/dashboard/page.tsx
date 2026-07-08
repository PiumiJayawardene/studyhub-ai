import { getDashboardData } from "@/lib/actions/dashboard";
import { getStudyTimeTrend } from "@/lib/actions/analytics";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { StatCards } from "@/components/dashboard/stat-cards";
import { StudyTimeChart } from "@/components/analytics/study-time-chart";
import { UpcomingAssignments } from "@/components/dashboard/upcoming-assignments";
import { RecentNotes } from "@/components/dashboard/recent-notes";

export default async function DashboardPage() {
  const [data, studyTimeData] = await Promise.all([
    getDashboardData(),
    getStudyTimeTrend(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <DashboardHero fullName={data.fullName} streak={data.streak} />

      <StatCards
        weeklyStudyHours={data.weeklyStudyHours}
        activeSubjects={data.activeSubjects}
        dueAssignments={data.upcomingAssignments.length}
        quizzesTakenThisWeek={data.quizzesTakenThisWeek}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <StudyTimeChart data={studyTimeData} />
        </div>
        <UpcomingAssignments assignments={data.upcomingAssignments} />
      </div>

      <RecentNotes notes={data.recentNotes} />
    </div>
  );
}