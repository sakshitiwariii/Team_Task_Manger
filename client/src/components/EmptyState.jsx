import { motion } from "framer-motion";

const EmptyState = ({ title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 p-8 text-center"
    >
      <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20" />
      <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
    </motion.div>
  );
};

export default EmptyState;
