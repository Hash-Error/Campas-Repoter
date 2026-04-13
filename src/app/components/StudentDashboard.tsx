import { useState, useEffect } from "react";
import { Link } from "react-router";
import { statusLabels, categoryLabels, priorityLabels, type Issue } from "../data/mockData";
import { fetchIssues } from "../api";
import { Clock, MapPin, AlertCircle, CheckCircle, Loader2, Sparkles, Filter } from "lucide-react";
import { motion } from "framer-motion";

export function StudentDashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadIssues() {
      try {
        const data = await fetchIssues();
        setIssues(data);
      } catch (err) {
        setError("Unable to connect to service. Check backend status.");
        console.error(err);
      } finally {
        setTimeout(() => setLoading(false), 900);
      }
    }
    loadIssues();
  }, []);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'reported': return { icon: <AlertCircle className="w-4 h-4" />, color: 'bg-orange-50 text-orange-600 border-orange-100' };
      case 'in_progress': return { icon: <Loader2 className="w-4 h-4 animate-spin" />, color: 'bg-blue-50 text-blue-600 border-blue-100' };
      case 'resolved': return { icon: <CheckCircle className="w-4 h-4" />, color: 'bg-green-50 text-green-600 border-green-100' };
      default: return { icon: null, color: 'bg-neutral-50 text-neutral-600 border-neutral-100' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-500 text-white';
      case 'High': return 'bg-orange-500 text-white';
      case 'Medium': return 'bg-yellow-500 text-white';
      default: return 'bg-neutral-500 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (isNaN(diffMs)) return "Recent";
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-end animate-pulse">
          <div className="space-y-3">
            <div className="h-10 w-64 bg-neutral-200 rounded-xl"></div>
            <div className="h-4 w-96 bg-neutral-100 rounded-lg"></div>
          </div>
          <div className="h-12 w-40 bg-neutral-200 rounded-2xl"></div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-white border border-neutral-100 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center max-w-2xl mx-auto py-32">
        <div className="bg-white border border-red-100 rounded-[2.5rem] p-12 shadow-2xl shadow-red-500/5">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-black text-neutral-800 mb-2 tracking-tight">System Disconnected</h3>
          <p className="text-neutral-500 mb-8 font-medium">We're having trouble reaching the campus reports server. Please ensure the backend service is running.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#2D5016] text-white px-10 py-3.5 rounded-2xl font-black hover:bg-[#1D3A10] transition-all active:scale-95 shadow-lg shadow-[#2D5016]/20"
          >
            RETRY CONNECTION
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-neutral-900 mb-2 tracking-tight">Active Reports</h1>
          <p className="text-neutral-500 font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#6B9B6B]" />
            Tracking issues reported by your current account
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-3.5 bg-white border border-neutral-200 rounded-2xl text-sm font-black text-neutral-600 hover:bg-neutral-50 transition-colors">
            <Filter className="w-4 h-4" />
            FILTER BY STATUS
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {issues.map((issue, idx) => {
          const status = getStatusInfo(issue.status);
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={issue.id || issue._id}
            >
              <Link
                to={`/app/issue/${issue.id || issue._id}`}
                className="group block bg-white border border-neutral-100 rounded-3xl p-6 hover:shadow-2xl hover:shadow-neutral-200/50 hover:border-[#6B9B6B]/30 transition-all shadow-sm relative overflow-hidden"
              >
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${status.color}`}>
                        {status.icon}
                        {(statusLabels[issue.status as keyof typeof statusLabels] || issue.status).toUpperCase()}
                      </span>
                      <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-black text-neutral-800 mb-1 group-hover:text-[#2D5016] transition-colors line-clamp-1">{issue.title}</h3>
                      <p className="text-sm text-neutral-400 font-medium line-clamp-2 max-w-2xl">{issue.description}</p>
                    </div>

                    <div className="flex items-center gap-6 text-sm font-bold text-neutral-400 pt-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-neutral-50 rounded-lg group-hover:bg-[#f0f7ec] transition-colors">
                          <MapPin className="w-4 h-4 text-neutral-400 group-hover:text-[#6B9B6B]" />
                        </div>
                        {issue.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-neutral-50 rounded-lg group-hover:bg-[#f0f7ec] transition-colors">
                          <Clock className="w-4 h-4 text-neutral-400 group-hover:text-[#6B9B6B]" />
                        </div>
                        {formatDate(issue.reportedAt)}
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] font-black text-neutral-400 bg-neutral-50 px-4 py-2 rounded-xl group-hover:bg-[#f0f7ec] group-hover:text-[#2D5016] transition-all uppercase tracking-widest border border-transparent group-hover:border-[#6B9B6B]/20">
                    {categoryLabels[issue.category as keyof typeof categoryLabels] || issue.category}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {issues.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-neutral-100 rounded-[3rem] shadow-xl p-20 text-center"
        >
          <div className="w-24 h-24 bg-[#f0f7ec] text-[#6B9B6B] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Sparkles className="w-10 h-10" />
          </div>
          <h3 className="text-3xl font-black text-neutral-800 mb-3 tracking-tight">All Clean! No active issues.</h3>
          <p className="text-neutral-500 mb-10 font-medium max-w-sm mx-auto">Great job keeping the campus safe! If you spot something wrong, report it immediately.</p>
          <Link
            to="/app/report"
            className="inline-flex items-center gap-3 bg-[#2D5016] text-white px-10 py-4 rounded-2xl hover:bg-[#1D3A10] transition-all font-black text-sm active:scale-95 shadow-xl shadow-[#2D5016]/20"
          >
            REPORT NEW ISSUE
          </Link>
        </motion.div>
      )}
    </div>
  );
}

