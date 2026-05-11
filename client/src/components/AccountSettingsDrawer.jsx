import { motion, AnimatePresence } from "framer-motion";
import { BriefcaseBusiness, Mail, Shield, User, X } from "lucide-react";

const roleBadgeClasses = {
  admin: "bg-purple-500/20 text-purple-200 border-purple-400/30",
  member: "bg-blue-500/20 text-blue-200 border-blue-400/30"
};

const AccountSettingsDrawer = ({
  isOpen,
  onClose,
  user,
  designation,
  onDesignationChange,
  onSave
}) => {
  const role = user?.role || "member";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close settings"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: 420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 420, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 250 }}
            className="fixed right-0 top-0 z-50 h-screen w-full max-w-md border-l border-white/10 bg-slate-950/95 p-5 shadow-2xl shadow-black/60"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Account Settings</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 text-lg font-semibold text-white">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="space-y-2 text-sm">
                  <p className="inline-flex items-center gap-2 text-slate-200">
                    <User size={14} />
                    {user?.name || "Unknown user"}
                  </p>
                  <p className="inline-flex items-center gap-2 text-slate-400">
                    <Mail size={14} />
                    {user?.email || "No email"}
                  </p>
                  <p className="inline-flex items-center gap-2 text-slate-300">
                    <Shield size={14} />
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${
                        roleBadgeClasses[role]
                      }`}
                    >
                      {role}
                    </span>
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                <label className="mb-2 inline-flex items-center gap-2 text-xs text-slate-300">
                  <BriefcaseBusiness size={13} />
                  Designation
                </label>
                <input
                  value={designation}
                  onChange={(e) => onDesignationChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100"
                  placeholder="e.g. Frontend Developer"
                />
                <p className="mt-2 text-xs text-slate-500">
                  This is stored locally for your profile display.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onSave}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white"
            >
              Save Settings
            </button>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default AccountSettingsDrawer;
