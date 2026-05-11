import { Bell, Search, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AccountSettingsDrawer from "./AccountSettingsDrawer";

const roleBadgeClasses = {
  admin: "bg-purple-500/20 text-purple-200 border-purple-400/30",
  member: "bg-blue-500/20 text-blue-200 border-blue-400/30"
};

const Header = ({ pageTitle }) => {
  const { user } = useAuth();
  const welcome = user?.name ? `Welcome back, ${user.name.split(" ")[0]}` : "Welcome";
  const role = user?.role || "member";
  const [showSettings, setShowSettings] = useState(false);
  const [designation, setDesignation] = useState("");

  useEffect(() => {
    if (!user?._id) return;
    const saved = localStorage.getItem(`ttm_designation_${user._id}`);
    if (saved) setDesignation(saved);
  }, [user?._id]);

  const saveDesignation = () => {
    if (!user?._id) return;
    localStorage.setItem(`ttm_designation_${user._id}`, designation.trim());
    setShowSettings(false);
  };

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-3 z-40 mb-6 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 inline-flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-purple-500 to-indigo-500 text-xs font-semibold text-white">
              T
            </span>
            <span className="text-xs text-slate-400">Team Task Manager</span>
          </div>
          <p className="text-xs text-slate-400">{welcome}</p>
          <h1 className="truncate text-lg font-semibold text-white md:text-xl">{pageTitle}</h1>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            className="hidden rounded-xl border border-slate-700 bg-slate-950/80 p-2 text-slate-300 transition hover:scale-105 hover:text-white md:block"
          >
            <Search size={16} />
          </button>
          <button
            type="button"
            className="rounded-xl border border-slate-700 bg-slate-950/80 p-2 text-slate-300 transition hover:scale-105 hover:text-white"
          >
            <Bell size={16} />
          </button>
          <div className="hidden text-right md:block">
            <p className="text-sm font-medium text-slate-100">{user?.name}</p>
            <span
              className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${
                roleBadgeClasses[role]
              }`}
            >
              {role}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 text-sm font-bold text-white"
          >
            {user?.name?.[0]?.toUpperCase() || "U"}
          </button>
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="hidden rounded-xl border border-slate-700 bg-slate-950/80 p-2 text-slate-300 transition hover:scale-105 hover:text-white md:block"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      <AccountSettingsDrawer
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        user={user}
        designation={designation}
        onDesignationChange={setDesignation}
        onSave={saveDesignation}
      />
    </motion.header>
  );
};

export default Header;
