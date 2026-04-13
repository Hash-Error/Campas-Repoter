import React, { useState, useEffect } from "react";
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Shield, 
  Download,
  FileText,
  UserPlus,
  Check,
  ChevronDown,
  Eye,
  Plus,
  AlertTriangle,
  Mail,
  MessageSquare,
  Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TableIssue {
  id: number;
  title: string;
  category: string;
  location: string;
  reporter: string;
  priority: 'High' | 'Med' | 'Low';
  status: 'Pending' | 'In Progress' | 'Resolved';
  assignedTo: string;
  reported: string;
}

interface NotificationItem {
  id: number;
  icon: any;
  bg: string;
  text: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

const initialIssues: TableIssue[] = [
  { id: 1, title: 'Power outage in Lab 3', category: 'Power', location: 'Block B – Labs', reporter: 'Arjun S', priority: 'High', status: 'In Progress', assignedTo: 'Rajan Kumar', reported: '35 min ago' },
  { id: 2, title: 'Water leakage Reading Hall', category: 'Water', location: 'Block C – Library', reporter: 'Meena R', priority: 'High', status: 'Pending', assignedTo: '—', reported: '2 hr ago' },
  { id: 3, title: 'WiFi down 2nd floor', category: 'Network', location: 'Block A – Classrooms', reporter: 'Karthik V', priority: 'Med', status: 'Pending', assignedTo: '—', reported: '4 hr ago' },
  { id: 4, title: 'Broken chair Room 204', category: 'Furniture', location: 'Block A – Classrooms', reporter: 'Divya M', priority: 'Low', status: 'Resolved', assignedTo: 'Muthu Arasan', reported: 'Yesterday' },
  { id: 5, title: 'Washroom tap not closing', category: 'Sanitation', location: 'Block D – Hostel', reporter: 'Hari P', priority: 'Med', status: 'In Progress', assignedTo: 'Priya Selvam', reported: '3 hr ago' },
  { id: 6, title: 'Broken gate lock', category: 'Safety', location: 'Admin Block', reporter: 'Ananya K', priority: 'High', status: 'Pending', assignedTo: '—', reported: '18 hr ago' },
  { id: 7, title: 'Projector not working', category: 'Equipment', location: 'Auditorium', reporter: 'Ravi M', priority: 'Med', status: 'Resolved', assignedTo: 'Deepa Nair', reported: 'Yesterday' },
  { id: 8, title: 'Canteen exhaust fan broken', category: 'Equipment', location: 'Cafeteria', reporter: 'Sneha T', priority: 'Low', status: 'Pending', assignedTo: '—', reported: '6 hr ago' },
];

export function AdminPanel() {
  const [issues, setIssues] = useState<TableIssue[]>(initialIssues);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Resolved' | 'High Priority'>('All');
  const [assigningId, setAssigningId] = useState<number | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string>('Rajan Kumar');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 1, icon: AlertTriangle, bg: 'bg-red-100', text: 'text-red-600', title: 'High priority issue escalated', desc: '"Broken gate lock" unattended 6hr', time: '2 hr ago', unread: true },
    { id: 2, icon: Check, bg: 'bg-green-100', text: 'text-green-600', title: 'Issue resolved by Rajan Kumar', desc: '"Power outage Lab 3" fixed', time: '35 min ago', unread: true },
    { id: 3, icon: Plus, bg: 'bg-blue-100', text: 'text-blue-600', title: 'New issue reported', desc: 'WiFi down Block A by Karthik V', time: '4 hr ago', unread: false },
    { id: 4, icon: UserPlus, bg: 'bg-amber-100', text: 'text-amber-600', title: 'Issue assigned to Priya Selvam', desc: 'Washroom tap – Hostel', time: '3 hr ago', unread: false },
    { id: 5, icon: Check, bg: 'bg-green-100', text: 'text-green-600', title: 'Issue resolved by Muthu Arasan', desc: 'Broken chair Room 204', time: 'Yesterday', unread: false },
  ]);

  const staffOptions = ['Rajan Kumar', 'Priya Selvam', 'Muthu Arasan', 'Deepa Nair'];

  const filteredIssues = issues.filter(issue => {
    if (filter === 'All') return true;
    if (filter === 'High Priority') return issue.priority === 'High';
    return issue.status === filter;
  });

  const handleAssign = (id: number) => {
    setIssues(prev => prev.map(issue => 
      issue.id === id ? { ...issue, assignedTo: selectedStaff, status: 'In Progress' } : issue
    ));
    setAssigningId(null);
  };

  const handleResolve = (id: number) => {
    setIssues(prev => prev.map(issue => 
      issue.id === id ? { ...issue, status: 'Resolved' } : issue
    ));
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 min-h-full bg-[#f0f7ec] transition-all duration-200 ease-in-out">
      {/* Page Heading Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[20px] font-semibold text-[#2D5016] leading-tight">Admin Panel</h1>
          <p className="text-sm text-neutral-500 font-medium">Manage issues, staff, and campus settings</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#e0eed8] rounded-lg text-xs font-bold text-neutral-600 hover:bg-[#f0f7ec] transition-all duration-200">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#2D5016] rounded-lg text-xs font-bold text-[#2D5016] hover:bg-[#f0f7ec] transition-all duration-200">
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Section 1: Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Issues', value: 8, icon: AlertCircle, color: '#2D5016', bg: '#f0f7ec', trend: '+12%', up: true },
          { label: 'Pending', value: 3, icon: Clock, color: '#F59E0B', bg: '#FEF3C7', trend: '-8%', up: false },
          { label: 'In Progress', value: 3, icon: TrendingUp, color: '#3B82F6', bg: '#DBEAFE', trend: '+15%', up: true },
          { label: 'Resolved', value: 2, icon: CheckCircle, color: '#10B981', bg: '#D1FAE5', trend: '+20%', up: true },
        ].map((m, i) => (
          <div key={i} className="bg-white border border-[#e0eed8] rounded-[12px] p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[13px] font-medium text-neutral-400 uppercase tracking-tight">{m.label}</span>
              <div className="p-2 rounded-[10px]" style={{ backgroundColor: m.bg }}>
                <m.icon className="w-4 h-4" style={{ color: m.color }} />
              </div>
            </div>
            <h3 className="text-[32px] font-semibold text-[#2D5016] mb-4">{m.value}</h3>
            <div className={`flex items-center gap-1.5 text-[12px] font-bold ${m.up ? 'text-green-500' : 'text-red-500'}`}>
              {m.up ? '↑' : '↓'} {m.trend.replace('+', '').replace('-', '')}
              <span className="text-neutral-400 font-medium ml-1">vs last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* Section 2: Issue Management Table */}
      <div className="bg-white border border-[#e0eed8] rounded-[12px] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-[16px] font-medium text-neutral-800">All Issues</h2>
          <div className="flex flex-wrap gap-2">
            {(['All', 'Pending', 'In Progress', 'Resolved', 'High Priority'] as const).map(p => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all duration-200 ${
                  filter === p 
                    ? 'bg-[#2D5016] text-white' 
                    : 'bg-[#f0f7ec] text-neutral-500 hover:bg-[#e0eed8]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f0f7ec]">
              <tr>
                {['#', 'Issue', 'Category', 'Location', 'Reporter', 'Priority', 'Status', 'Assigned To', 'Reported', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-4 text-[12px] uppercase font-bold text-neutral-400 tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map((issue) => (
                <React.Fragment key={issue.id}>
                  <tr className="bg-white border-b border-[#f0f7ec] hover:bg-[#f0f7ec] transition-all duration-200">
                    <td className="px-5 py-4 text-[13px] text-neutral-500">{issue.id}</td>
                    <td className="px-5 py-4 text-[13px] font-bold text-neutral-800">{issue.title}</td>
                    <td className="px-5 py-4 text-[13px] text-neutral-500">{issue.category}</td>
                    <td className="px-5 py-4 text-[13px] text-neutral-500">{issue.location}</td>
                    <td className="px-5 py-4 text-[13px] text-neutral-500">{issue.reporter}</td>
                    <td className="px-5 py-4">
                      <span className={`px-[10px] py-[3px] rounded-[20px] text-[12px] font-bold uppercase tracking-tight whitespace-nowrap ${
                        issue.priority === 'High' ? 'bg-[#fee2e2] text-[#991b1b]' :
                        issue.priority === 'Med' ? 'bg-[#fef3c7] text-[#92400e]' :
                        'bg-[#dcfce7] text-[#166534]'
                      }`}>
                        {issue.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-[10px] py-[3px] rounded-[20px] text-[12px] font-bold uppercase tracking-tight whitespace-nowrap ${
                        issue.status === 'Pending' ? 'bg-[#fef3c7] text-[#92400e]' :
                        issue.status === 'In Progress' ? 'bg-[#dbeafe] text-[#1e40af]' :
                        'bg-[#dcfce7] text-[#166534]'
                      }`}>
                        {issue.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-neutral-500 whitespace-nowrap">{issue.assignedTo}</td>
                    <td className="px-5 py-4 text-[13px] text-neutral-400 whitespace-nowrap">{issue.reported}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {issue.status === 'Resolved' ? (
                          <button className="px-3 py-1.5 border border-neutral-200 rounded-[6px] text-[12px] font-bold text-neutral-400 hover:bg-[#f0f7ec] flex items-center gap-1.5 transition-all duration-200">
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                        ) : (
                          <>
                            <button 
                              onClick={() => setAssigningId(assigningId === issue.id ? null : issue.id)}
                              className="px-3 py-1.5 border border-[#2D5016] rounded-[6px] text-[12px] font-bold text-[#2D5016] hover:bg-[#f0f7ec] flex items-center gap-1.5 transition-all duration-200"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              Assign
                            </button>
                            <button 
                              onClick={() => handleResolve(issue.id)}
                              className="px-3 py-1.5 bg-[#2D5016] text-white rounded-[6px] text-[12px] font-bold hover:bg-[#1D3A10] flex items-center gap-1.5 transition-all duration-200"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Resolve
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  
                  {/* Inline Dropdown for Assignment */}
                  <AnimatePresence>
                    {assigningId === issue.id && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <td colSpan={10} className="bg-neutral-50 p-4 border-b border-[#f0f7ec]">
                          <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-[#e0eed8] shadow-sm max-w-lg">
                            <span className="text-xs font-bold text-neutral-500">Assign to:</span>
                            <div className="relative flex-1">
                              <select 
                                value={selectedStaff}
                                onChange={(e) => setSelectedStaff(e.target.value)}
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs font-bold text-neutral-700 outline-none focus:ring-2 focus:ring-[#2D5016]/10"
                              >
                                {staffOptions.map(name => <option key={name} value={name}>{name}</option>)}
                              </select>
                            </div>
                            <button 
                              onClick={() => handleAssign(issue.id)}
                              className="bg-[#2D5016] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#1D3A10] transition-all duration-200"
                            >
                              Confirm
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Two Column Row */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left Card: Staff Performance (60%) */}
        <div className="lg:col-span-6 bg-white border border-[#e0eed8] rounded-[12px] shadow-sm flex flex-col hover:shadow-md transition-all duration-200">
          <div className="p-5 border-b border-neutral-50">
            <h2 className="text-[15px] font-medium text-neutral-800">Staff Performance</h2>
            <p className="text-[12px] text-neutral-400 font-medium">Resolution stats per team member</p>
          </div>
          <div className="p-0 flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-50">
                  <th className="px-5 py-4">Staff Member</th>
                  <th className="px-5 py-4">Assigned</th>
                  <th className="px-5 py-4">Resolved</th>
                  <th className="px-5 py-4">Avg. Time</th>
                  <th className="px-5 py-4">Rating</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Rajan Kumar', initials: 'RK', assigned: 4, resolved: 3, time: '1h 45m', rating: 4.8, status: 'Active', dot: 'bg-green-500' },
                  { name: 'Priya Selvam', initials: 'PS', assigned: 3, resolved: 2, time: '2h 10m', rating: 4.5, status: 'Active', dot: 'bg-green-500' },
                  { name: 'Muthu Arasan', initials: 'MA', assigned: 2, resolved: 2, time: '0h 55m', rating: 4.9, status: 'Active', dot: 'bg-green-500' },
                  { name: 'Deepa Nair', initials: 'DN', assigned: 1, resolved: 1, time: '3h 20m', rating: 4.2, status: 'Away', dot: 'bg-amber-500' },
                ].map((staff, i) => (
                  <tr key={i} className="border-b border-neutral-50 last:border-0 hover:bg-[#f0f7ec] transition-all duration-200">
                    <td className="px-5 py-3.5 flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#2D5016] rounded-full flex items-center justify-center text-white text-[12px] font-bold">
                        {staff.initials}
                      </div>
                      <span className="text-[13px] font-bold text-neutral-700 whitespace-nowrap">{staff.name}</span>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-neutral-500">{staff.assigned}</td>
                    <td className="px-5 py-3.5 text-[13px] text-neutral-500">{staff.resolved}</td>
                    <td className="px-5 py-3.5 text-[13px] text-neutral-500">{staff.time}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 text-[13px] font-bold text-neutral-700">
                        <span className="text-amber-400 text-sm">★</span> {staff.rating}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${staff.dot}`}></span>
                        <span className="text-[13px] text-neutral-500">{staff.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-neutral-50 bg-neutral-50/30">
            <button className="text-[13px] font-bold text-[#2D5016] hover:underline flex items-center gap-2 group transition-all">
              View full staff report 
              <span className="text-lg leading-none group-hover:translate-x-1 transition-transform duration-200">→</span>
            </button>
          </div>
        </div>

        {/* Right Card: Recent Activity Feed (40%) */}
        <div className="lg:col-span-4 bg-white border border-[#e0eed8] rounded-[12px] shadow-sm flex flex-col hover:shadow-md transition-all duration-200">
          <div className="p-5 border-b border-neutral-50">
            <h2 className="text-[15px] font-medium text-neutral-800">Recent Activity</h2>
            <p className="text-[12px] text-neutral-400 font-medium">Live updates across all issues</p>
          </div>
          
          <div className="p-5 flex-1 relative overflow-hidden">
             <div className="h-[280px] overflow-y-auto pr-2 custom-scrollbar space-y-6 relative">
                <div className="absolute left-[7px] top-2 bottom-6 w-[1px] border-l border-dashed border-neutral-200"></div>
                
                {[
                  { user: 'Rajan Kumar', action: 'resolved', target: '"Power outage Lab 3"', time: '2 min ago', dot: 'bg-green-500' },
                  { user: 'Arjun S', action: 'reported', target: '"WiFi down Classrooms"', time: '15 min ago', dot: 'bg-blue-500' },
                  { user: 'Priya Selvam', action: 'assigned to', target: '"Washroom tap"', time: '32 min ago', dot: 'bg-amber-500' },
                  { user: '', action: 'Escalated', target: '"Broken gate lock" to High', time: '1 hr ago', dot: 'bg-red-500' },
                  { user: 'Muthu Arasan', action: 'resolved', target: '"Broken chair 204"', time: '2 hr ago', dot: 'bg-green-500' },
                  { user: 'Meena R', action: 'reported', target: '"Water leakage Library"', time: '2 hr ago', dot: 'bg-blue-500' },
                  { user: 'Deepa Nair', action: 'assigned to', target: '"Projector Aud"', time: 'Yesterday', dot: 'bg-amber-500' },
                  { user: 'Deepa Nair', action: 'resolved', target: '"Projector Aud"', time: 'Yesterday', dot: 'bg-green-500' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 relative z-10 transition-all duration-200">
                    <div className={`w-[15px] h-[15px] rounded-full border-4 border-white ring-1 ring-neutral-100 mt-0.5 flex-shrink-0 ${item.dot}`}></div>
                    <div className="flex-1 flex justify-between items-start gap-2">
                       <p className="text-[13px] leading-snug">
                         <span className="font-bold text-neutral-800">{item.user}</span>{' '}
                         <span className="text-neutral-500">{item.action}</span>{' '}
                         <span className="font-bold text-neutral-800">{item.target}</span>
                       </p>
                       <span className="text-[11px] text-neutral-400 font-medium whitespace-nowrap pt-0.5">{item.time}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Section 4: Three Column Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Quick Actions */}
        <div className="bg-white border border-[#e0eed8] rounded-[12px] shadow-sm p-6 space-y-4 hover:shadow-md transition-all duration-200">
          <h2 className="text-[15px] font-medium text-neutral-800">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: 'Create New Issue', icon: Plus },
              { label: 'Assign Pending Issues', icon: UserPlus },
              { label: 'Generate Report', icon: TrendingUp },
              { label: 'Export Issue Log', icon: Download },
            ].map((action, i) => (
              <button key={i} className="w-full flex items-center justify-between p-3.5 bg-white border border-[#e0eed8] rounded-[8px] hover:bg-[#f0f7ec] transition-all duration-200 group">
                <div className="flex items-center gap-3">
                  <action.icon className="w-4 h-4 text-[#2D5016]" />
                  <span className="text-[13px] font-bold text-neutral-700">{action.label}</span>
                </div>
                <span className="text-neutral-300 group-hover:text-[#2D5016] transition-all duration-200">→</span>
              </button>
            ))}
          </div>
        </div>

        {/* Card 2: Notifications Panel */}
        <div className="bg-white border border-[#e0eed8] rounded-[12px] shadow-sm flex flex-col h-full hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="p-5 border-b border-neutral-50 flex justify-between items-center">
            <h2 className="text-[15px] font-medium text-neutral-800">Notifications</h2>
            <AnimatePresence>
              {notifications.filter(n => n.unread).length > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full"
                >
                  {notifications.filter(n => n.unread).length}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                onClick={() => markAsRead(n.id)}
                className={`p-3 rounded-lg flex gap-3 cursor-pointer transition-all duration-200 relative ${
                  n.unread ? 'bg-[#f0f7ec]/40 border-l-[3px] border-[#3b82f6]' : 'hover:bg-[#f0f7ec]/20'
                }`}
              >
                <div className={`w-8 h-8 rounded-[10px] flex-shrink-0 flex items-center justify-center ${n.bg}`}>
                  <n.icon className={`w-4 h-4 ${n.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-[13px] font-bold text-neutral-800 leading-tight truncate">{n.title}</p>
                    <span className="text-[10px] text-neutral-400 font-medium whitespace-nowrap ml-2">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5 truncate">{n.desc}</p>
                </div>
                {n.unread && <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-1.5 h-1.5 bg-[#3b82f6] rounded-full mr-3"></div>}
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-neutral-50 flex justify-between items-center text-[12px] font-bold bg-neutral-50/10">
            <button onClick={markAllAsRead} className="text-[#2D5016] hover:underline transition-all">Mark all as read</button>
            <button className="text-[#2D5016] hover:underline transition-all">View all →</button>
          </div>
        </div>

        {/* Card 3: Campus Location Summary */}
        <div className="bg-white border border-[#e0eed8] rounded-[12px] shadow-sm p-6 flex flex-col h-full hover:shadow-md transition-all duration-200">
          <h2 className="text-[15px] font-medium text-neutral-800 mb-6">Issues by Location</h2>
          <div className="flex-1 space-y-4">
            {[
              { name: 'Block A – Classrooms', value: 3, total: 6 },
              { name: 'Block B – Labs', value: 2, total: 6 },
              { name: 'Block C – Library', value: 1, total: 6 },
              { name: 'Block D – Hostel', value: 1, total: 6 },
              { name: 'Cafeteria', value: 1, total: 6 },
              { name: 'Admin Block', value: 1, total: 6 },
              { name: 'Auditorium', value: 1, total: 6 },
              { name: 'Sports Ground', value: 0, total: 6 },
            ].map((loc, i) => (
              <div key={i} className="space-y-1.5 transition-all duration-200">
                <div className="flex justify-between text-[13px] leading-none">
                  <span className="text-neutral-600 font-medium">{loc.name}</span>
                  <span className="text-neutral-400 font-bold text-[11px]">{loc.value} issues</span>
                </div>
                <div className="h-[6px] w-full bg-[#f0f7ec] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(loc.value / loc.total) * 100}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full bg-[#2D5016] rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 text-[13px] font-bold text-[#2D5016] hover:underline flex items-center gap-1 group transition-all">
            Generate QR Codes 
            <span className="text-lg leading-none group-hover:translate-x-1 transition-transform duration-200">→</span>
          </button>
        </div>
      </div>

      {/* Section 5: Simulated SMS/Notification Log */}
      <div className="bg-white border border-[#e0eed8] rounded-[12px] shadow-sm p-6 hover:shadow-md transition-all duration-200 pb-12">
        <div className="mb-4">
          <h2 className="text-[15px] font-medium text-neutral-800">Outgoing Notifications Log</h2>
          <p className="text-[12px] text-neutral-400 font-medium">Simulated SMS and app notifications sent to reporters</p>
        </div>
        
        <div className="bg-[#f8f8f8] p-4 rounded-lg font-mono text-[12px] space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar border border-neutral-100">
          {[
            { time: '10:45 AM', type: 'SMS', to: 'Arjun S (+91 98XXX 45XXX)', msg: "Your issue 'Power outage in Lab 3' has been assigned to Rajan Kumar. — PSG Campus Support" },
            { time: '10:12 AM', type: 'APP', to: 'Meena R', msg: "Your issue 'Water leakage – Library' is now In Progress." },
            { time: '09:55 AM', type: 'SMS', to: 'Karthik V (+91 97XXX 12XXX)', msg: "Issue 'WiFi down Block A' received. Our team will respond shortly." },
            { time: 'Yesterday', type: 'APP', to: 'Divya M', msg: "Your issue 'Broken chair Room 204' has been resolved. Rate your experience ⭐" },
            { time: 'Yesterday', type: 'SMS', to: 'Hari P (+91 96XXX 78XXX)', msg: "Issue assigned to Priya Selvam. Expected resolution: 2 hours." },
            { time: 'Yesterday', type: 'APP', to: 'Ananya K', msg: "High priority issue 'Broken gate lock' has been escalated to senior admin." },
          ].map((log, i) => (
            <div key={i} className="flex gap-3 leading-relaxed border-b border-neutral-200/50 pb-2 last:border-0 last:pb-0">
              <span className="text-green-600 font-bold flex-shrink-0">[{log.time}]</span>
              <div className="text-neutral-700">
                <span className="font-black text-neutral-400 mr-2">{log.type} → {log.to}:</span>
                <span className="text-neutral-600">"{log.msg}"</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
