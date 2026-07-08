"use client";

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type QuizData = { title: string; percentage: number; date: string };

export function QuizPerformanceChart({ data }: { data: QuizData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quiz Performance</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground py-12 text-center">
            Take a quiz to see your performance trend.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} unit="%" domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="percentage"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}