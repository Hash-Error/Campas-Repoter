import { useState } from "react";
import { Search, Bell, Calendar as CalendarIcon, Clock, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { title: "High priority issue", desc: "Block A Power Failure", time: "5m ago", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
    { title: "Issue Resolved", desc: "Library Water Leakage", time: "1h ago", icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
    { title: "New Maintenance", desc: "Scheduled for Block B", time: "2h ago", icon: Info, color: "text-blue-500", bg: "bg-blue-50" },
  ];

  const events = [
    { date: "Oct 12", title: "Monthly Safety Audit", type: "Inspection" },
    { date: "Oct 15", title: "New Staff Training", type: "Onboarding" },
    { date: "Oct 20", title: "Equipment Maintenance", type: "Service" },
  ];

  return (
    <header className="h-[64px] bg-white border-b border-[#e0eed8] px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Left Section: User Info */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <div className="w-9 h-9 bg-[#2D5016] rounded-full flex items-center justify-center text-white font-medium shadow-sm">
          JD
        </div>
        <div className="hidden sm:block">
          <div className="text-[14px] font-bold text-neutral-800 leading-tight">John Doe</div>
          <div className="text-[12px] font-medium text-neutral-500">Campus Administrator</div>
        </div>
      </div>

      {/* Center Section: Search Bar */}
      <div className="flex-1 max-w-2xl px-8">
        <div className="relative group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#2D5016] transition-colors" />
          <input
            type="text"
            placeholder="Search issues, locations..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#e0eed8] rounded-[8px] text-sm focus:outline-none focus:ring-4 focus:ring-[#2D5016]/5 focus:border-[#2D5016] transition-all"
          />
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-3 min-w-[180px] justify-end">
        {/* Calendar Dropdown */}
        <div className="relative">
          <button 
            onClick={() => { setShowCalendar(!showCalendar); setShowNotifications(false); }}
            className={`w-9 h-9 flex items-center justify-center rounded-lg border border-[#e0eed8] transition-all ${showCalendar ? 'bg-[#f0f7ec] border-[#2D5016] text-[#2D5016]' : 'text-neutral-500 hover:bg-neutral-50'}`}
          >
            <CalendarIcon className="w-4 h-4" />
          </button>
          
          <AnimatePresence>
            {showCalendar && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-72 bg-white border border-[#e0eed8] rounded-2xl shadow-xl p-4 z-50 overflow-hidden"
              >
                <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-4">Upcoming Schedule</h3>
                <div className="space-y-3">
                  {events.map((ev, i) => (
                    <div key={i} className="flex gap-3 hover:bg-[#f0f7ec] p-2 rounded-xl transition-colors cursor-pointer group">
                      <div className="w-10 h-10 bg-[#f0f7ec] rounded-lg flex flex-col items-center justify-center border border-[#e0eed8] group-hover:border-[#2D5016]/20">
                        <span className="text-[10px] font-black text-[#2D5016] leading-none mb-1">{ev.date.split(' ')[0]}</span>
                        <span className="text-xs font-black text-neutral-800 leading-none">{ev.date.split(' ')[1]}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-[13px] font-bold text-neutral-800 leading-tight mb-0.5">{ev.title}</div>
                        <div className="text-[11px] font-medium text-neutral-400">{ev.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 text-xs font-black text-[#2D5016] hover:bg-[#f0f7ec] rounded-xl transition-colors">
                  VIEW FULL CALENDAR
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowCalendar(false); }}
            className={`w-9 h-9 flex items-center justify-center rounded-lg border border-transparent transition-all ${showNotifications ? 'bg-[#f0f7ec] text-[#2D5016]' : 'text-neutral-500 hover:bg-neutral-50'}`}
          >
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm shadow-red-500/20"></span>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-white border border-[#e0eed8] rounded-2xl shadow-xl p-4 z-50"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">Recent Alerts</h3>
                  <button className="text-[10px] font-black text-[#2D5016] hover:underline">MARK ALL AS READ</button>
                </div>
                <div className="space-y-1">
                  {notifications.map((n, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl hover:bg-[#f0f7ec] transition-colors cursor-pointer group">
                      <div className={`w-10 h-10 ${n.bg} rounded-xl flex items-center justify-center flex-shrink-0 border border-transparent group-hover:border-white`}>
                        <n.icon className={`w-5 h-5 ${n.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <h4 className="text-[13px] font-bold text-neutral-800 leading-tight truncate">{n.title}</h4>
                          <span className="text-[10px] font-medium text-neutral-400 whitespace-nowrap ml-2">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-neutral-500 truncate leading-tight font-medium">{n.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 text-xs font-black text-[#2D5016] hover:underline">
                  VIEW ALL NOTIFICATIONS
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={() => navigate('/app/report')}
          className="bg-[#2D5016] text-white px-5 py-2 rounded-[8px] text-sm font-bold hover:bg-[#1D3A10] transition-all active:scale-95 shadow-lg shadow-[#2D5016]/20 ml-2 whitespace-nowrap"
        >
          New Report
        </button>
      </div>
    </header>
  );
}
