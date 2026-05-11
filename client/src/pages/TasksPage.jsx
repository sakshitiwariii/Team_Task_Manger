import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { CalendarDays, LayoutGrid, List, Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import axiosClient from "../api/axiosClient";
import AppLayout from "../layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import EmptyState from "../components/EmptyState";
import TaskCard from "../components/TaskCard";

const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "", priority: "", dueDate: "" });
  const [view, setView] = useState("kanban");
  const [dragTask, setDragTask] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const createDateRef = useRef(null);
  const filterDateRef = useRef(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",
    status: "todo",
    priority: "medium",
    dueDate: ""
  });

  const loadTasks = async () => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    if (filters.dueDate) params.dueDate = filters.dueDate;
    const { data } = await axiosClient.get("/tasks", { params });
    const filtered = filters.dueDate
      ? data.tasks.filter(
          (task) =>
            task.dueDate &&
            new Date(task.dueDate).toDateString() === new Date(filters.dueDate).toDateString()
        )
      : data.tasks;
    setTasks(filtered);
  };

  const loadProjects = async () => {
    const { data } = await axiosClient.get("/projects");
    setProjects(data.projects);
  };

  const loadUsers = async () => {
    const { data } = await axiosClient.get("/auth/users");
    setUsers(data.users);
  };

  useEffect(() => {
    loadTasks();
    loadProjects();
    if (user?.role === "admin") loadUsers();
  }, [user?.role]);

  const createTask = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        dueDate: form.dueDate || undefined
      };
      await axiosClient.post("/tasks", payload);
      toast.success("Task created.");
      setForm({
        title: "",
        description: "",
        projectId: "",
        assignedTo: "",
        status: "todo",
        priority: "medium",
        dueDate: ""
      });
      loadTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task.");
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await axiosClient.patch(`/tasks/${taskId}`, { status });
      toast.success("Task status updated.");
      loadTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task.");
    }
  };

  const tasksByStatus = {
    todo: tasks.filter((task) => task.status === "todo"),
    in_progress: tasks.filter((task) => task.status === "in_progress"),
    done: tasks.filter((task) => task.status === "done")
  };

  const selectedProject = projects.find((project) => project._id === form.projectId);
  const projectAssignees = selectedProject?.members?.length
    ? selectedProject.members
        .map((member) => users.find((userItem) => userItem._id === member._id) || member)
        .filter(Boolean)
    : [];

  const onDropColumn = async (status) => {
    if (!dragTask || dragTask.status === status) return;
    await updateStatus(dragTask._id, status);
    setDragTask(null);
  };

  return (
    <AppLayout pageTitle={user?.role === "admin" ? "Tasks & Workflow" : "My Tasks"}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 p-1">
          <button
            className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm ${
              view === "kanban" ? "bg-purple-600 text-white" : "text-slate-300"
            }`}
            onClick={() => setView("kanban")}
            type="button"
          >
            <LayoutGrid size={14} />
            Kanban
          </button>
          <button
            className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm ${
              view === "table" ? "bg-purple-600 text-white" : "text-slate-300"
            }`}
            onClick={() => setView("table")}
            type="button"
          >
            <List size={14} />
            Table
          </button>
        </div>
        {user?.role === "admin" && (
          <button
            type="button"
            onClick={() => setShowCreate((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 text-sm font-medium shadow-lg shadow-purple-900/50"
          >
            <Plus size={14} />
            Create Task
          </button>
        )}
      </div>

      {user?.role === "admin" && showCreate && (
        <motion.form
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={createTask}
          className="mb-6 grid gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-5 lg:grid-cols-3"
        >
          <input
            className="rounded-lg border border-slate-700 bg-slate-950 p-2"
            placeholder="Task title"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
          <input
            className="rounded-lg border border-slate-700 bg-slate-950 p-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
          <div className="flex rounded-lg border border-slate-700 bg-slate-950 p-1">
            <input
              ref={createDateRef}
              className="w-full bg-transparent p-1 text-sm"
              type="date"
              value={form.dueDate}
              onFocus={() => createDateRef.current?.showPicker?.()}
              onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
            />
            <button
              type="button"
              className="rounded-md p-1 text-slate-300 hover:text-white"
              onClick={() => createDateRef.current?.showPicker?.()}
            >
              <CalendarDays size={15} />
            </button>
          </div>

          <select
            className="rounded-lg border border-slate-700 bg-slate-950 p-2"
            value={form.projectId}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, projectId: e.target.value, assignedTo: "" }))
            }
            required
          >
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg border border-slate-700 bg-slate-950 p-2"
            value={form.assignedTo}
            onChange={(e) => setForm((prev) => ({ ...prev, assignedTo: e.target.value }))}
            required
            disabled={!form.projectId}
          >
            <option value="">
              {form.projectId ? "Assign to project member" : "Select project first"}
            </option>
            {projectAssignees.map((assignee) => (
              <option key={assignee._id} value={assignee._id}>
                {assignee.name} {assignee.role ? `(${assignee.role})` : ""}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg border border-slate-700 bg-slate-950 p-2"
            value={form.priority}
            onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button className="rounded-lg bg-brand-600 px-4 py-2 font-medium">Create Task</button>
        </motion.form>
      )}

      <div className="mb-4 grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-3 md:grid-cols-5">
        <div className="relative">
          <Search size={14} className="pointer-events-none absolute left-2 top-3 text-slate-400" />
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 pl-7 text-sm"
            placeholder="Search by title"
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          />
        </div>
        <select
          className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-sm"
          value={filters.status}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
        >
          <option value="">All statuses</option>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select
          className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-sm"
          value={filters.priority}
          onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value }))}
        >
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <div className="flex rounded-lg border border-slate-700 bg-slate-900 p-1">
          <input
            ref={filterDateRef}
            className="w-full bg-transparent p-1 text-sm"
            type="date"
            value={filters.dueDate}
            onFocus={() => filterDateRef.current?.showPicker?.()}
            onChange={(e) => setFilters((prev) => ({ ...prev, dueDate: e.target.value }))}
          />
          <button
            type="button"
            className="rounded-md p-1 text-slate-300 hover:text-white"
            onClick={() => filterDateRef.current?.showPicker?.()}
          >
            <CalendarDays size={15} />
          </button>
        </div>
        <button onClick={loadTasks} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium">
          Apply Filters
        </button>
      </div>

      {tasks.length === 0 ? (
        <EmptyState title="No tasks found" subtitle="Adjust filters or create a new task." />
      ) : view === "kanban" ? (
        <div className="grid gap-3 lg:grid-cols-3">
          {[
            { key: "todo", label: "Todo" },
            { key: "in_progress", label: "In Progress" },
            { key: "done", label: "Done" }
          ].map((column) => (
            <div
              key={column.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDropColumn(column.key)}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3"
            >
              <h3 className="mb-3 text-sm font-semibold text-slate-300">
                {column.label} ({tasksByStatus[column.key].length})
              </h3>
              <div className="space-y-2">
                {tasksByStatus[column.key].map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onStatusChange={updateStatus}
                    draggable
                    onDragStart={(_, dragData) => setDragTask(dragData)}
                    compact
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/70">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-800 text-slate-400">
              <tr>
                <th className="px-4 py-3">Task</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Assignee</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} className="border-b border-slate-800/70">
                  <td className="px-4 py-3 text-slate-200">{task.title}</td>
                  <td className="px-4 py-3 text-slate-300">{task.project?.name}</td>
                  <td className="px-4 py-3 text-slate-300">{task.assignedTo?.name}</td>
                  <td className="px-4 py-3 capitalize text-slate-300">{task.priority}</td>
                  <td className="px-4 py-3 text-slate-300">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs"
                      value={task.status}
                      onChange={(e) => updateStatus(task._id, e.target.value)}
                    >
                      <option value="todo">Todo</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
};

export default TasksPage;
