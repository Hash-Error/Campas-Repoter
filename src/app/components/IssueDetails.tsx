import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { statusLabels, categoryLabels, priorityLabels, type IssueStatus, type Issue } from "../data/mockData";
import { fetchIssueById, updateIssueStatus } from "../api";
import { ArrowLeft, MapPin, Clock, User, AlertCircle, CheckCircle, Loader2, Calendar, ShieldCheck, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<IssueStatus>('reported');
  const [assignedTo, setAssignedTo] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadIssue() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await fetchIssueById(id);
        setIssue(data);
        setStatus(data.status);
        setAssignedTo(data.assignedTo || '');
      } catch (err) {
        setError("Unable to connect to service. Please check your connection.");
        console.error(err);
      } finally {
        // Adding a slight delay for "smoothness" and to prevent jumpy UI
        setTimeout(() => setLoading(false), 800);
      }
    }
    loadIssue();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-8 animate-pulse">
        <div className="h-8 w-24 bg-neutral-200 rounded-lg"></div>
        <div className="bg-white border border-neutral-100 rounded-3xl p-8 space-y-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="h-6 w-32 bg-neutral-200 rounded-full"></div>
              <div className="h-10 w-96 bg-neutral-200 rounded-xl"></div>
              <div className="h-4 w-48 bg-neutral-200 rounded-lg"></div>
            </div>
            <div className="h-10 w-24 bg-neutral-200 rounded-xl"></div>
          </div>
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-neutral-100">
            <div className="space-y-4">
              <div className="h-4 w-24 bg-neutral-100 rounded"></div>
              <div className="h-20 bg-neutral-50 rounded-2xl"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 w-24 bg-neutral-100 rounded"></div>
              <div className="h-20 bg-neutral-50 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 max-w-xl mx-auto py-32 text-center"
      >
        <div className="bg-white border border-neutral-100 rounded-3xl p-12 shadow-xl">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-800 mb-3">Service Unavailable</h2>
          <p className="text-neutral-500 mb-8 leading-relaxed">
            {error || "We couldn't find the issue you are looking for. It might have been deleted or moved."}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-neutral-100 text-neutral-800 rounded-xl font-bold hover:bg-neutral-200 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => navigate('/app')}
              className="px-6 py-2.5 bg-[#2D5016] text-white rounded-xl font-bold hover:bg-[#1D3A10] transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'reported': return { icon: <AlertCircle size={16} />, classes: 'bg-orange-50 text-orange-700 border-orange-200' };
      case 'in_progress': return { icon: <Loader2 size={16} className="animate-spin" />, classes: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'resolved': return { icon: <CheckCircle size={16} />, classes: 'bg-green-50 text-green-700 border-green-200' };
      default: return { icon: <Tag size={16} />, classes: 'bg-neutral-50 text-neutral-700 border-neutral-200' };
    }
  };

  const getPriorityClasses = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-500 text-white shadow-lg shadow-red-200';
      case 'High': return 'bg-orange-500 text-white shadow-lg shadow-orange-200';
      case 'Medium': return 'bg-yellow-500 text-white shadow-lg shadow-yellow-200';
      default: return 'bg-neutral-500 text-white shadow-lg shadow-neutral-200';
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "Invalid Date";
    return d.toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
    });
  };

  const handleUpdate = async () => {
    if (!id) return;
    setUpdating(true);
    try {
      const updatedIssue = await updateIssueStatus(id, status);
      setIssue(updatedIssue);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setUpdating(false), 500);
    }
  };

  const stat = getStatusInfo(issue.status);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-5xl mx-auto pb-20"
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-neutral-500 hover:text-[#2D5016] font-bold text-sm mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        BACK TO PREVIOUS
      </button>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          {/* Main Card */}
          <div className="bg-white border border-neutral-100 rounded-[2rem] p-8 shadow-xl shadow-neutral-200/50">
            <div className="flex items-start justify-between mb-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border ${stat.classes}`}>
                    {stat.icon}
                    {(statusLabels[issue.status as keyof typeof statusLabels] || issue.status).toUpperCase()}
                  </span>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${getPriorityClasses(issue.priority)}`}>
                    {issue.priority} PRIORITY
                  </span>
                </div>
                <h1 className="text-3xl font-black text-neutral-900 tracking-tight leading-tight">
                  {issue.title}
                </h1>
                <div className="flex items-center gap-6 text-sm font-medium text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {formatDateTime(issue.reportedAt)}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {issue.reportedBy}
                  </div>
                </div>
              </div>
              <div className="bg-[#f0f7ec] text-[#2D5016] px-5 py-3 rounded-2xl flex flex-col items-center justify-center border border-[#6B9B6B]/20">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Building</span>
                <span className="font-black text-lg">{issue.building.split(' ')[0]}</span>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-neutral-50 rounded-2xl p-6">
                <h3 className="text-[11px] font-black text-neutral-400 uppercase tracking-widest mb-3">Problem Description</h3>
                <p className="text-neutral-700 leading-relaxed text-lg font-medium">
                  {issue.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-5 border border-neutral-100 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3 text-[#2D5016]">
                    <MapPin className="w-5 h-5" />
                    <h3 className="font-bold">Location Details</h3>
                  </div>
                  <p className="text-neutral-800 font-bold">{issue.building}</p>
                  <p className="text-neutral-500 text-sm font-medium">{issue.room || "General Area"}</p>
                </div>
                <div className="p-5 border border-neutral-100 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3 text-[#2D5016]">
                    <Tag className="w-5 h-5" />
                    <h3 className="font-bold">Category</h3>
                  </div>
                  <p className="text-neutral-800 font-bold">
                    {categoryLabels[issue.category as keyof typeof categoryLabels] || issue.category}
                  </p>
                  <p className="text-neutral-500 text-sm font-medium">General Maintenance</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-8">
          <div className="bg-[#2D5016] rounded-[2rem] p-8 text-white shadow-2xl shadow-[#2D5016]/30">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-6 h-6 text-[#f0f7ec]" />
              <h3 className="text-xl font-black">Management</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#f0f7ec]/60 mb-2">Update Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value as IssueStatus)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:text-neutral-900 focus:outline-none transition-all cursor-pointer"
                >
                  {Object.entries(statusLabels).map(([val, label]) => (
                    <option key={val} value={val} className="text-neutral-900">{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#f0f7ec]/60 mb-2">Agent Assigned</label>
                <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-black">ST</div>
                  <div className="flex-1">
                    <p className="text-sm font-black">{assignedTo || "Unassigned"}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleUpdate}
                disabled={updating}
                className="w-full bg-white text-[#2D5016] py-4 rounded-2xl font-black text-sm hover:bg-[#f0f7ec] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl"
              >
                {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : "APPLY CHANGES"}
              </button>
            </div>
          </div>

          <div className="bg-white border border-neutral-100 rounded-[2rem] p-6 shadow-sm">
            <h3 className="text-[11px] font-black text-neutral-400 uppercase tracking-widest mb-4 px-2">Timeline Summary</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-1 bg-[#2D5016] rounded-full"></div>
                <div>
                  <p className="text-sm font-bold text-neutral-800">Issue Reported</p>
                  <p className="text-xs text-neutral-400">{formatDateTime(issue.reportedAt)}</p>
                </div>
              </div>
              {issue.status === 'in_progress' && (
                <div className="flex gap-4">
                  <div className="w-1 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-bold text-neutral-800">Processing Started</p>
                    <p className="text-xs text-neutral-400">Marked by Admin</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

