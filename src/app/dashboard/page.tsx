"use client";

import { useEffect, useState } from "react";

interface DashboardData {
  totalTasks: number;
  tasksByStatus: {
    TODO: number;
    IN_PROGRESS: number;
    DONE: number;
  };
  overdueTasks: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4">
        <Card title="Total Tasks" value={data.totalTasks} />
        <Card title="To Do" value={data.tasksByStatus.TODO} />
        <Card title="In Progress" value={data.tasksByStatus.IN_PROGRESS} />
        <Card title="Done" value={data.tasksByStatus.DONE} />
      </div>

      <div className="bg-red-50 p-4 rounded-xl">
        <p className="font-medium text-red-600">
          Overdue Tasks: {data.overdueTasks}
        </p>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="p-4 bg-white shadow rounded-xl">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}