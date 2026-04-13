import { useState, useEffect } from "react";
import { Link } from "react-router";
import { statusLabels, categoryLabels, type IssueStatus, type Issue, type Analytics } from "../data/mockData";
import { fetchIssues, fetchAnalytics } from "../api";
import { AlertCircle, CheckCircle, Loader, TrendingUp, Clock, AlertTriangle } from "lucide-react";

export function AdminDashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<IssueStatus | 'all'>('all');

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
        console.error("Failed to load admin data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredIssues = filterStatus === 'all'
    ? issues
    : issues.filter(issue => issue.status === filterStatus);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reported':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'in_progress':
        return <Loader className="w-4 h-4 text-blue-600" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'in_progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'resolved':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-neutral-50 text-neutral-700 border-neutral-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'text-red-600';
      case 'High':
        return 'text-orange-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-neutral-600';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center">
        <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-neutral-600">Loading administrative data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Admin Dashboard</h1>
        <p className="text-neutral-600">Monitor and manage all campus issues</p>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-neutral-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-600">Total Issues</span>
                <TrendingUp className="w-4 h-4 text-neutral-400" />
              </div>
              <div className="text-3xl font-semibold">{analytics.total}</div>
            </div>

            <div className="bg-white border border-orange-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-orange-600">Reported</span>
                <AlertCircle className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-3xl font-semibold text-orange-600">{analytics.reported}</div>
            </div>

            <div className="bg-white border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-600">In Progress</span>
                <Loader className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-semibold text-blue-600">{analytics.inProgress}</div>
            </div>

            <div className="bg-white border border-green-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-green-600">Resolved</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-3xl font-semibold text-green-600">{analytics.resolved}</div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-8">
            <h2 className="font-medium mb-4">Issues by Category</h2>
            <div className="grid grid-cols-7 gap-4">
              {Object.entries(categoryLabels).map(([category, label]) => (
                <div key={category} className="text-center">
                  <div className="text-2xl font-semibold mb-1">{analytics.byCategory[category] || 0}</div>
                  <div className="text-xs text-neutral-600">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-neutral-600">Filter by status:</span>
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filterStatus === 'all' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          All
        </button>
        {Object.entries(statusLabels).map(([status, label]) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as IssueStatus)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filterStatus === status ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Issues Table */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-neutral-600">Issue</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-neutral-600">Location</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-neutral-600">Category</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-neutral-600">Status</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-neutral-600">Priority</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-neutral-600">Assigned To</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filteredIssues.map((issue) => (
              <tr key={issue.id || issue._id} className="hover:bg-neutral-50">
                <td className="px-6 py-4">
                  <Link to={`/issue/${issue.id || issue._id}`} className="font-medium hover:text-blue-600">
                    {issue.title}
                  </Link>
                  <div className="text-sm text-neutral-500 mt-1">
                    Reported by {issue.reportedBy}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-600">
                  {issue.building}
                  {issue.room && `, ${issue.room}`}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-neutral-600">
                    {categoryLabels[issue.category as keyof typeof categoryLabels] || issue.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border ${getStatusColor(issue.status)}`}>
                    {getStatusIcon(issue.status)}
                    {statusLabels[issue.status as keyof typeof statusLabels] || issue.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-medium ${getPriorityColor(issue.priority)}`}>
                    {issue.priority === 'Urgent' && <AlertTriangle className="w-4 h-4 inline mr-1" />}
                    {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-600">
                  {issue.assignedTo || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredIssues.length === 0 && (
        <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center">
          <AlertCircle className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-600">No issues found with the selected filter</p>
        </div>
      )}
    </div>
  );
}

