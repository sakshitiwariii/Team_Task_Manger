import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member"
  });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axiosClient.post("/auth/signup", form);
      login(data);
      toast.success("Account created successfully.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4">
      <div className="pointer-events-none absolute -left-10 top-10 h-56 w-56 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl"
      >
        <h1 className="mb-1 text-2xl font-bold text-white">Sign Up</h1>
        <p className="mb-5 text-sm text-slate-400">Create your team account.</p>

        <input
          className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
          placeholder="Full name"
          name="name"
          value={form.name}
          onChange={onChange}
          required
        />
        <input
          className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
          placeholder="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          required
        />
        <input
          className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
          placeholder="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          required
        />
        <select
          className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
          name="role"
          value={form.role}
          onChange={onChange}
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 font-medium text-white hover:opacity-95"
        >
          {submitting ? "Creating..." : "Create Account"}
        </button>
        <p className="mt-4 text-sm text-slate-400">
          Already have an account?{" "}
          <Link className="text-brand-500" to="/login">
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default SignupPage;
