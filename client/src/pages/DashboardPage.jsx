import { useEffect, useState } from "react";
import {
  Pie,
  PieChart,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { CheckCheck, Clock3, ListTodo, TriangleAlert } from "lucide-react";
import axiosClient from "../api/axiosClient";
import AppLayout from "../layout/AppLayout";
import DashboardCard from "../components/DashboardCard";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";

const COLORS = ["#3b82f6", "#f59e0b", "#22c55e"];

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0
  });
  const [progressByStatus, setProgressByStatus] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [dashboardResponse, tasksResponse] = await Promise.all([
          axiosClient.get("/tasks/dashboard"),
          axiosClient.get("/tasks")
        ]);
        setStats(dashboardResponse.data.stats);
        setProgressByStatus(dashboardResponse.data.progressByStatus);
        setTasks(tasksResponse.data.tasks || []);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const weeklyProductivity = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
    day,
    completed: Math.floor(Math.random() * 5) + (day === "Fri" ? 3 : 1)
  }));

  const recentActivity = tasks.slice(0, 5).map((task) => ({
    id: task._id,
    message: `Task "${task.title}" is ${task.status.replace("_", " ")}`
  }));

  const upcomingDeadlines = tasks
    .filter((task) => task.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);

  const completionRate = stats.totalTasks
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  return (
    <AppLayout pageTitle={user?.role === "admin" ? "Admin Dashboard" : "My Dashboard"}>
      {loading ? (
        <p className="text-slate-300">Loading dashboard...</p>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm text-slate-400">Today</p>
              <h2 className="text-xl font-semibold text-white">
                {new Date().toLocaleString(undefined, {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </h2>
            </div>
            <span className="rounded-full border border-purple-400/30 bg-purple-500/20 px-3 py-1 text-xs text-purple-100">
              {user?.role === "admin" ? "Team analytics enabled" : "My tasks focus"}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardCard
              icon={ListTodo}
              label="Total Tasks"
              value={stats.totalTasks}
              colorClass="from-indigo-500/70 to-indigo-700/60"
            />
            <DashboardCard
              icon={CheckCheck}
              label="Completed"
              value={stats.completedTasks}
              colorClass="from-emerald-500/70 to-emerald-700/60"
            />
            <DashboardCard
              icon={Clock3}
              label="Pending"
              value={stats.pendingTasks}
              colorClass="from-amber-500/70 to-amber-700/60"
            />
            <DashboardCard
              icon={TriangleAlert}
              label="Overdue"
              value={stats.overdueTasks}
              colorClass="from-rose-500/70 to-rose-700/60"
            />
          </div>

          {stats.totalTasks === 0 ? (
            <EmptyState
              title="No tasks available yet"
              subtitle="Create tasks to unlock progress charts and analytics."
            />
          ) : (
            <div className="grid gap-4 xl:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 xl:col-span-2">
                <h3 className="mb-3 text-sm font-semibold text-slate-200">Weekly Productivity</h3>
                <div className="h-72">
                  <ResponsiveContainer>
                    <BarChart data={weeklyProductivity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="day" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip />
                      <Bar dataKey="completed" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
                <h3 className="mb-3 text-sm font-semibold text-slate-200">Task Completion</h3>
                <div className="h-56">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={progressByStatus} dataKey="value" nameKey="name" outerRadius={80}>
                        {progressByStatus.map((entry, index) => (
                          <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-center">
                  <p className="text-xs text-slate-400">Progress circle</p>
                  <div
                    className="mx-auto mt-2 grid h-20 w-20 place-items-center rounded-full"
                    style={{
                      background: `conic-gradient(#8b5cf6 ${completionRate * 3.6}deg, #1e293b 0deg)`
                    }}
                  >
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                      {completionRate}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
              <h3 className="mb-3 text-sm font-semibold text-slate-200">Recent Activity</h3>
              {recentActivity.length === 0 ? (
                <p className="text-sm text-slate-400">No activity yet.</p>
              ) : (
                <div className="space-y-2">
                  {recentActivity.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm text-slate-300"
                    >
                      {item.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
              <h3 className="mb-3 text-sm font-semibold text-slate-200">Upcoming Deadlines</h3>
              {upcomingDeadlines.length === 0 ? (
                <p className="text-sm text-slate-400">No upcoming deadlines.</p>
              ) : (
                <div className="space-y-2">
                  {upcomingDeadlines.map((task) => (
                    <div
                      key={task._id}
                      className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2"
                    >
                      <p className="text-sm text-slate-200">{task.title}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default DashboardPage;
