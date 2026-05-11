import { motion } from "framer-motion";

const DashboardCard = ({ icon: Icon, label, value, colorClass }) => {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      className={`rounded-2xl bg-gradient-to-br p-[1px] ${colorClass}`}
    >
      <div className="rounded-2xl bg-slate-900/95 p-4 shadow-xl shadow-slate-950/40">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">{label}</p>
          <div className="rounded-lg bg-slate-800 p-2 text-slate-200">
            <Icon size={16} />
          </div>
        </div>
        <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
      </div>
    </motion.div>
  );
};

export default DashboardCard;
