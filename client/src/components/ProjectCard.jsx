import { Calendar, CheckCircle2, Users } from "lucide-react";
import { motion } from "framer-motion";

const ProjectCard = ({ project, taskCount, progress, deadline, onStatusChange, canEditStatus }) => {
  const members = project.members || [];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/30"
    >
      <h3 className="text-lg font-semibold text-white">{project.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-slate-400">
        {project.description || "No description added yet."}
      </p>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <Users size={13} />
          {members.length} members
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle2 size={13} />
          {taskCount} tasks
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={13} />
          {deadline}
        </div>
      </div>

      <div className="mt-3">
        <p className="mb-1 text-xs text-slate-400">Project Status</p>
        <select
          value={project.status || "planning"}
          onChange={(e) => onStatusChange?.(project._id, e.target.value)}
          disabled={!canEditStatus}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs capitalize text-slate-200 disabled:opacity-60"
        >
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-slate-400">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-800">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex -space-x-2">
        {members.slice(0, 5).map((member) => (
          <div
            key={member._id}
            title={member.name}
            className="grid h-8 w-8 place-items-center rounded-full border border-slate-800 bg-slate-700 text-xs text-white"
          >
            {member.name?.[0]?.toUpperCase() || "U"}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectCard;
