import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease';
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export function MetricCard({ title, value, change, changeType, icon: Icon, iconColor = '#6B9B6B', iconBg = '#E8F5E8' }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="text-sm text-neutral-600 mb-1">{title}</div>
          <div className="text-3xl font-semibold text-neutral-800">{value}</div>
        </div>
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          <Icon className="w-6 h-6" style={{ color: iconColor }} />
        </div>
      </div>
      {change && (
        <div className="flex items-center gap-1">
          <span className={`text-sm font-medium ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
            {changeType === 'increase' ? '↑' : '↓'} {change}
          </span>
          <span className="text-xs text-neutral-500">vs last week</span>
        </div>
      )}
    </div>
  );
}
