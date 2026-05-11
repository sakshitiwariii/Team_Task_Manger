import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", rememberMe: true });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axiosClient.post("/auth/login", form);
      login(data);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative grid min-h-screen overflow-hidden bg-slate-950 lg:grid-cols-2">
      <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-10 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

      <section className="hidden px-10 py-12 lg:block">
        <div className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/40 p-8 backdrop-blur-xl">
          <div>
            <h1 className="text-4xl font-bold text-white">Team Task Manager</h1>
            <p className="mt-3 text-slate-300">Manage projects, tasks, and teams efficiently.</p>
          </div>
          <div className="space-y-3 text-sm text-slate-300">
            <p>- Organize projects with role-based collaboration.</p>
            <p>- Track progress with smart dashboard analytics.</p>
            <p>- Keep teams aligned with modern task workflows.</p>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center p-4">
        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={onSubmit}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-purple-500/20 p-2 text-purple-200">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome back</h2>
              <p className="text-sm text-slate-400">Sign in to continue.</p>
            </div>
          </div>

          <label className="mb-1 block text-xs text-slate-300">Email</label>
          <input
            className="mb-3 w-full rounded-xl border border-slate-700 bg-slate-950/70 p-3 text-white outline-none ring-purple-500/30 focus:ring"
            placeholder="you@example.com"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
          />
          <label className="mb-1 block text-xs text-slate-300">Password</label>
          <div className="mb-3 flex items-center rounded-xl border border-slate-700 bg-slate-950/70 p-1.5">
            <input
              className="w-full bg-transparent px-2 py-1.5 text-white outline-none"
              placeholder="Enter password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={onChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="rounded-lg p-1 text-slate-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="mb-4 flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-400">
              <input
                type="checkbox"
                checked={form.rememberMe}
                onChange={(e) => setForm((prev) => ({ ...prev, rememberMe: e.target.checked }))}
              />
              Remember me
            </label>
            <button type="button" className="text-purple-300 hover:text-purple-200">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 font-medium text-white shadow-lg shadow-purple-900/50 transition hover:scale-[1.01]"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </button>
          <p className="mt-4 text-sm text-slate-400">
            No account?{" "}
            <Link className="text-purple-300" to="/signup">
              Create one
            </Link>
          </p>
        </motion.form>
      </section>
    </div>
  );
};

export default LoginPage;
