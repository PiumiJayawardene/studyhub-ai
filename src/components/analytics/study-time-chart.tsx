"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StudyTimeData = { date: string; minutes: number };

export function StudyTimeChart({ data }: { data: StudyTimeData[] }) {
  const hasData = data.some((d) => d.minutes > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Study Time (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <p className="text-sm text-muted-foreground py-12 text-center">
            No focus sessions logged yet this week.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} unit="m" />
              <Tooltip />
              <Bar dataKey="minutes" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}