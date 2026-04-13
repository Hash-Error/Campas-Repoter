import { useState, useEffect } from "react";
import { Link } from "react-router";
import { AlertCircle, CheckCircle, Clock, TrendingUp, Zap, Droplet, WifiOff, Loader2, Sparkles, LayoutDashboard, MapPin, Tag } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { MetricCard } from "./MetricCard";
import { statusLabels, categoryLabels, type Issue, type Analytics } from "../data/mockData";
import { fetchIssues, fetchAnalytics } from "../api";
import { motion } from "framer-motion";

export function AdminDashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [issuesData, analyticsData] = await Promise.all([
          fetchIssues(),
          fetchAnalytics()
        ]);
        setIssues(issuesData);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    }
    loadData();
  }, []);

  const weeklyData = [
    { day: 'Mon', reported: 12, resolved: 8 },
    { day: 'Tue', reported: 15, resolved: 10 },
    { day: 'Wed', reported: 18, resolved: 14 },
    { day: 'Thu', reported: 14, resolved: 16 },
    { day: 'Fri', reported: 20, resolved: 12 },
    { day: 'Sat', reported: 8, resolved: 6 },
    { day: 'Sun', reported: 6, resolved: 4 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'in_progress': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'resolved': return 'bg-green-50 text-green-600 border-green-100';
      default: return 'bg-neutral-50 text-neutral-600 border-neutral-100';
    }
  };

  const getPriorityDot = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="flex justify-between items-end">
          <div className="space-y-3">
            <div className="h-10 w-64 bg-neutral-200 rounded-xl"></div>
            <div className="h-4 w-96 bg-neutral-100 rounded-lg"></div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white border border-neutral-100 rounded-3xl"></div>)}
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 h-96 bg-white border border-neutral-100 rounded-3xl"></div>
          <div className="h-96 bg-white border border-neutral-100 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const categoryData = [
    { name: 'Power', value: analytics.byCategory.power || 0, color: '#FFB84D' },
    { name: 'Water', value: analytics.byCategory.water || 0, color: '#4DBFFF' },
    { name: 'Network', value: analytics.byCategory.network || 0, color: '#A78BFA' },
    { name: 'Furniture', value: analytics.byCategory.furniture || 0, color: '#FB7185' },
    { name: 'HVAC', value: analytics.byCategory.hvac || 0, color: '#34D399' },
    { name: 'Other', value: (analytics.byCategory.safety || 0) + (analytics.byCategory.other || 0), color: '#94A3B8' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-7xl mx-auto pb-20"
    >
      <div className="flex justify-between items-end mb-10 text-neutral-900">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight flex items-center gap-3">
             <LayoutDashboard className="w-10 h-10 text-[#2D5016]" />
             Admin Command Center
          </h1>
          <p className="text-neutral-500 font-bold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#6B9B6B]" />
            Live campus monitoring and infrastructure analytics
          </p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-2xl px-6 py-3 flex items-center gap-3 shadow-sm">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-xs font-black text-neutral-600 uppercase tracking-widest">System Link Active</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-10">
        <MetricCard title="Total Volume" value={analytics.total} change="12%" changeType="increase" icon={AlertCircle} iconColor="#2D5016" iconBg="#f0f7ec" />
        <MetricCard title="Immediate Action" value={analytics.reported} change="8%" changeType="decrease" icon={Clock} iconColor="#F59E0B" iconBg="#FEF3C7" />
        <MetricCard title="Work In Progress" value={analytics.inProgress} change="15%" changeType="increase" icon={Zap} iconColor="#3B82F6" iconBg="#DBEAFE" />
        <MetricCard title="Resolved Success" value={analytics.resolved} change="20%" changeType="increase" icon={CheckCircle} iconColor="#10B981" iconBg="#D1FAE5" />
      </div>

      <div className="grid grid-cols-3 gap-8 mb-10">
        <div className="col-span-2 bg-white rounded-[2.5rem] p-8 shadow-xl shadow-neutral-200/50 border border-neutral-100">
          <div className="flex items-center justify-between mb-8 px-2">
            <div>
              <h2 className="text-xl font-black text-neutral-800">Operational Velocity</h2>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">Weekly Trends</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 11, fontWeight: 700 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 11, fontWeight: 700 }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="reported" fill="#2D5016" radius={[10, 10, 10, 10]} barSize={24} />
              <Bar dataKey="resolved" fill="#6B9B6B" radius={[10, 10, 10, 10]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-neutral-200/50 border border-neutral-100">
          <div className="mb-8 px-2 text-center">
            <h2 className="text-xl font-black text-neutral-800">Category Mix</h2>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">Internal Distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value">
                {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {categoryData.filter(item => item.value > 0).map((item) => (
              <div key={item.name} className="flex items-center gap-3 p-2 bg-neutral-50 rounded-xl">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-tight">{item.name}</p>
                  <p className="text-sm font-black text-neutral-800">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 bg-white rounded-[2.5rem] p-8 shadow-xl shadow-neutral-200/50 border border-neutral-100 overflow-hidden">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-xl font-black text-neutral-800">Critical Feedback Stream</h2>
            <Link to="/app/admin" className="text-xs font-black text-[#2D5016] uppercase tracking-[0.2em] border-b-2 border-[#2D5016]/20 pb-1 hover:border-[#2D5016] transition-all">View Full Log</Link>
          </div>
          <div className="space-y-4">
            {issues.slice(0, 5).map((issue, idx) => (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} key={issue.id || issue._id}>
                <Link to={`/app/issue/${issue.id || issue._id}`} className="flex items-center gap-6 p-5 rounded-3xl hover:bg-[#f0f7ec]/50 transition-all border border-transparent hover:border-[#6B9B6B]/20 group">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getPriorityDot(issue.priority)}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-black text-neutral-800 group-hover:text-[#2D5016] transition-colors leading-tight mb-1 truncate">{issue.title}</p>
                    <div className="flex items-center gap-4 text-xs font-bold text-neutral-400">
                      <span className="flex items-center gap-1.5"><MapPin size={12}/> {issue.building}</span>
                      <span className="flex items-center gap-1.5"><Tag size={12}/> {categoryLabels[issue.category as keyof typeof categoryLabels] || issue.category}</span>
                    </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(issue.status)}`}>
                    {statusLabels[issue.status as keyof typeof statusLabels] || issue.status}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-[#2D5016] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-[#2D5016]/30 relative overflow-hidden group">
              <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-white/5 group-hover:scale-110 transition-transform" />
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Team Efficiency</p>
                <p className="text-4xl font-black mb-1">{analytics.avgResolutionTime}</p>
                <p className="text-sm font-bold text-[#f0f7ec]">Resolution Speed</p>
                <div className="mt-8 flex items-center gap-2 text-xs font-black">
                   <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">↑</div>
                   <span>15% PERFORMANCE GAIN</span>
                </div>
              </div>
           </div>

           <div className="bg-white border border-neutral-100 rounded-[2.5rem] p-8 shadow-sm">
             <h3 className="text-lg font-black text-neutral-800 mb-6 px-2">Top Drivers</h3>
             <div className="space-y-6">
               {[
                 { icon: <Zap size={18} />, color: 'bg-orange-50 text-orange-600', label: 'Power Issues', count: analytics.byCategory.power || 0 },
                 { icon: <Droplet size={18} />, color: 'bg-blue-50 text-blue-600', label: 'Water Leakage', count: analytics.byCategory.water || 0 },
                 { icon: <WifiOff size={18} />, color: 'bg-purple-50 text-purple-600', label: 'Network', count: analytics.byCategory.network || 0 }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color} shadow-sm border border-current/10`}>
                     {item.icon}
                   </div>
                   <div className="flex-1">
                     <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">{item.label}</p>
                     <p className="text-lg font-black text-neutral-800">{item.count} Active</p>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

