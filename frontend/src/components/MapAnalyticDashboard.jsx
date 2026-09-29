/**
 * @file MapAnalyticDashboard.jsx
 * @description Main UI Dashboard showing real-time anomalies with modern design and filters.
 */
import React, { useState } from 'react';
import { useReports } from '../hooks/useReports';
import { AlertTriangle, MapPin, CheckCircle, Clock, Filter, RefreshCw } from 'lucide-react';

export const MapAnalyticDashboard = () => {
  const { reports, isLoading, error, refetch } = useReports();
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filteredReports = severityFilter === 'ALL'
    ? reports
    : reports.filter(r => r.severity === severityFilter);

  const getSeverityBadgeStyles = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      default: return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
              <MapPin className="text-blue-600 dark:text-blue-400" size={32} />
              Map Analytic
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              AI-driven spatial intelligence and territorial anomaly monitoring platform.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 shadow-sm">
              <Filter size={16} className="text-slate-500" />
              <select 
                className="bg-transparent text-slate-700 dark:text-slate-200 text-sm outline-none cursor-pointer"
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
              </select>
            </div>

            <button 
              onClick={refetch}
              className="p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              title="Refresh Data"
            >
              <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </header>

        {/* States Feedback */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-800 flex items-center gap-2">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Grid Reports */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <article 
                key={report.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityBadgeStyles(report.severity)}`}>
                      {report.severity}
                    </span>
                    {report.status === 'RESOLVED' ? (
                      <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                        <CheckCircle size={16} /> Resolved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                        <Clock size={16} /> Pending
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
                    {report.category}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                    {report.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <MapPin size={14} className="text-blue-500" />
                  <span className="truncate">{report.location}</span>
                </div>
              </article>
            ))}

            {filteredReports.length === 0 && (
              <div className="col-span-full text-center py-16 text-slate-500 dark:text-slate-400">
                No territorial anomalies found for the selected filter.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default MapAnalyticDashboard;