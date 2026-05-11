import { CalendarDays, Flag, UserCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const statusColors = {
  todo: "bg-slate-700 text-slate-200",
  in_progress: "bg-amber-500/20 text-amber-200",
  done: "bg-emerald-500/20 text-emerald-200"
};

const priorityColors = {
  low: "text-sky-300",
  medium: "text-amber-300",
  high: "text-rose-300"
};

const TaskCard = ({ task, onStatusChange, draggable, onDragStart, compact = false }) => {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.01 }}
      draggable={draggable}
      onDragStart={(e) => onDragStart?.(e, task)}
      className="rounded-xl border border-white/10 bg-slate-900/90 p-3 shadow-md shadow-slate-950/20"
    >
      <h4 className="line-clamp-1 font-medium text-slate-100">{task.title}</h4>
      <p className="mt-1 line-clamp-2 text-xs text-slate-400">{task.description || "No description"}</p>

      <div className={`mt-3 flex ${compact ? "flex-col gap-2" : "items-center justify-between gap-2"}`}>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusColors[task.status]}`}>
          {task.status.replace("_", " ")}
        </span>
        <span className={`inline-flex items-center gap-1 text-xs ${priorityColors[task.priority]}`}>
          <Flag size={12} />
          {task.priority}
        </span>
      </div>

      <div className="mt-3 grid gap-1 text-xs text-slate-400">
        <p className="inline-flex items-center gap-1">
          <UserCircle2 size={12} />
          {task.assignedTo?.name || "Unassigned"}
        </p>
        <p className="inline-flex items-center gap-1">
          <CalendarDays size={12} />
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
        </p>
      </div>

      <select
        value={task.status}
        onChange={(e) => onStatusChange(task._id, e.target.value)}
        className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs text-slate-200"
      >
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </motion.div>
  );
};

export default TaskCard;
