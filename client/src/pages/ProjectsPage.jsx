import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Filter, Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../layout/AppLayout";
import EmptyState from "../components/EmptyState";
import ProjectCard from "../components/ProjectCard";

const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [search, setSearch] = useState("");
  const [memberFilter, setMemberFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);

  const loadProjects = async () => {
    const [projectRes, taskRes] = await Promise.all([
      axiosClient.get("/projects"),
      axiosClient.get("/tasks")
    ]);
    setProjects(projectRes.data.projects);
    setTasks(taskRes.data.tasks || []);
  };

  const loadUsers = async () => {
    if (user?.role !== "admin") return;
    const { data } = await axiosClient.get("/auth/users");
    setMembers(data.users || []);
  };

  useEffect(() => {
    loadProjects();
    if (user?.role === "admin") {
      loadUsers();
    }
  }, [user?.role]);

  const createProject = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/projects", form);
      toast.success("Project created.");
      setForm({ name: "", description: "" });
      loadProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create project.");
    }
  };

  const addMember = async () => {
    if (!selectedProject || !selectedMember) return;
    try {
      await axiosClient.post(`/projects/${selectedProject}/members`, { memberId: selectedMember });
      toast.success("Member added.");
      loadProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add member.");
    }
  };

  const updateProjectStatus = async (projectId, status) => {
    try {
      await axiosClient.patch(`/projects/${projectId}/status`, { status });
      toast.success("Project status updated.");
      loadProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update project status.");
    }
  };

  const getProjectProgress = (project, projectTasks) => {
    const completed = projectTasks.filter((task) => task.status === "done").length;
    const fromTasks = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0;

    const statusBase = {
      planning: 20,
      active: 60,
      completed: 100
    };

    return Math.max(fromTasks, statusBase[project.status] ?? 0);
  };

  const filteredProjects = projects
    .filter((project) => project.name.toLowerCase().includes(search.toLowerCase()))
    .filter((project) =>
      memberFilter === "mine" ? project.members?.some((member) => member._id === user?._id) : true
    )
    .filter((project) => (statusFilter === "all" ? true : project.status === statusFilter));

  return (
    <AppLayout pageTitle="Projects">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-3 text-slate-400" size={16} />
          <input
            className="w-full rounded-xl border border-slate-700 bg-slate-900/80 py-2.5 pl-9 pr-3 text-sm"
            placeholder="Search projects"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={memberFilter}
            onChange={(e) => setMemberFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm"
          >
            <option value="all">All projects</option>
            <option value="mine">My projects</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm"
          >
            <option value="all">All status</option>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          {user?.role === "admin" && (
            <button
              type="button"
              onClick={() => setShowCreate((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-medium"
            >
              <Plus size={15} />
              Create Project
            </button>
          )}
        </div>
      </div>

      {user?.role === "admin" && showCreate && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-5"
        >
          <h2 className="mb-3 text-lg font-semibold">Create Project</h2>
          <form className="grid gap-3 lg:grid-cols-3" onSubmit={createProject}>
            <input
              className="rounded-lg border border-slate-700 bg-slate-950/80 p-2"
              placeholder="Project name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
            <input
              className="rounded-lg border border-slate-700 bg-slate-950 p-2"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
            <button className="rounded-lg bg-brand-600 px-4 py-2 font-medium">Create</button>
          </form>

          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            <select
              className="rounded-lg border border-slate-700 bg-slate-950/80 p-2"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
            <select
              className="rounded-lg border border-slate-700 bg-slate-950/80 p-2"
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
            >
              <option value="">Select member</option>
              {members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
            <button onClick={addMember} className="rounded-lg bg-indigo-600 px-4 py-2 font-medium">
              Add Member
            </button>
          </div>
        </motion.div>
      )}

      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs text-slate-400">
        <Filter size={13} />
        Showing filtered results
      </div>

      {filteredProjects.length === 0 ? (
        <EmptyState title="No projects yet" subtitle="Create a new project to get started." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => {
            const projectTasks = tasks.filter((task) => task.project?._id === project._id);
            const progress = getProjectProgress(project, projectTasks);
            const deadlines = projectTasks
              .filter((task) => task.dueDate)
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            const deadline = deadlines[0]
              ? new Date(deadlines[0].dueDate).toLocaleDateString()
              : "N/A";

            return (
              <ProjectCard
                key={project._id}
                project={project}
                taskCount={projectTasks.length}
                progress={progress}
                deadline={deadline}
                canEditStatus
                onStatusChange={updateProjectStatus}
              />
            );
          })}
        </div>
      )}
    </AppLayout>
  );
};

export default ProjectsPage;
