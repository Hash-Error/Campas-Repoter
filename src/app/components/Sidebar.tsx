import { Link, useLocation } from "react-router";
import { LayoutDashboard, Plus, Shield, Settings, LogOut } from "lucide-react";

export function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/app') return location.pathname === '/app';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/app', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/app/report', icon: Plus, label: 'Report' },
    { path: '/app/admin', icon: Shield, label: 'Admin' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-[240px] bg-[#f0f7ec] h-screen flex-col border-r border-[#e0eed8] fixed left-0 top-0 z-50">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2D5016] rounded-xl flex items-center justify-center shadow-lg shadow-[#2D5016]/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-neutral-800 leading-none mb-1">Campus Reporter</div>
              <div className="text-[10px] font-bold text-[#4a7c2f] uppercase tracking-widest">Issue Tracking</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-8">
          <div>
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-[8px] transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-[#2D5016] text-white shadow-md'
                      : 'text-neutral-500 hover:bg-white/50 hover:text-[#2D5016]'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive(item.path) ? 'text-white' : 'text-neutral-400'}`} />
                  <span className={`text-sm ${isActive(item.path) ? 'font-bold' : 'font-medium'}`}>{item.label} Panel</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] px-4 mb-3">System</div>
            <div className="space-y-1">
              <button className="flex items-center gap-3 px-4 py-2.5 rounded-[8px] text-neutral-500 hover:bg-white/50 hover:text-[#2D5016] transition-all w-full group">
                <Settings className="w-4 h-4 text-neutral-400 group-hover:text-[#2D5016]" />
                <span className="text-sm font-medium">Settings</span>
              </button>
              <Link
                to="/"
                onClick={() => localStorage.removeItem('userRole')}
                className="flex items-center gap-3 px-4 py-2.5 rounded-[8px] text-red-500 hover:bg-red-50 transition-all w-full group"
              >
                <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-500" />
                <span className="text-sm font-medium">Log Out</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="p-4 bg-white/30">
          <div className="flex items-center gap-3 p-2">
            <div className="w-9 h-9 bg-[#2D5016] rounded-full flex items-center justify-center text-white font-black text-xs">JD</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-neutral-800 truncate leading-tight">Admin User</div>
              <div className="text-[11px] font-medium text-neutral-500">Campus Admin</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#e0eed8] flex justify-around items-center px-4 z-50">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all ${
              isActive(item.path) ? 'text-[#2D5016]' : 'text-neutral-400'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        ))}
        <button className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-neutral-400">
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-bold">Settings</span>
        </button>
      </nav>
    </>
  );
}
