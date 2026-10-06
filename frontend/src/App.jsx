import React, { useState, useEffect } from 'react';
import { ReportForm } from './components/ReportForm';

export default function App() {
  const [reports, setReports] = useState([]);
  const [nationalAnomalies, setNationalAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  const fetchReports = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/reports');
      const data = await res.json();
      setReports(data.data || []);
    } catch (err) {
      console.error("Error cargando reportes", err);
    } finally {
      setLoading(false);
    }
  };

  const handleScanNationalRadar = async () => {
    setScanning(true);
    try {
      const res = await fetch('http://localhost:5000/api/monitor/scan');
      const data = await res.json();
      if (data.success) {
        setNationalAnomalies(data.anomalies || []);
      }
    } catch (err) {
      console.error("Error al escanear radar nacional", err);
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span></span> Map Analytic AI
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Plataforma de inteligencia espacial y monitoreo de anomalías en Colombia.
            </p>
          </div>
          <button
            onClick={handleScanNationalRadar}
            disabled={scanning}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-600/20 disabled:opacity-50 shrink-0"
          >
            {scanning ? ' Escaneando Colombia...' : '📡 Escanear Radar Nacional'}
          </button>
        </header>

        {/* Panel de Alertas del Radar Nacional */}
        {nationalAnomalies.length > 0 && (
          <section className="mb-8 bg-emerald-950/30 border border-emerald-800/60 rounded-2xl p-5 shadow-xl">
            <h3 className="text-base font-bold text-emerald-300 mb-3 flex items-center gap-2">
              <span></span> Alertas Automáticas Detectadas en Colombia
            </h3>
            <div className="space-y-3">
              {nationalAnomalies.map((anomaly, idx) => (
                <div key={idx} className="bg-slate-900 border border-emerald-900/50 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-emerald-400">{anomaly.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-medium">
                      {anomaly.severity}
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm mb-2">{anomaly.description}</p>
                  <div className="text-xs text-slate-400 flex gap-4">
                    <span>Lat: {anomaly.latitude}, Lng: {anomaly.longitude}</span>
                    <span>{new Date(anomaly.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Formulario de Reportes */}
        <ReportForm onReportCreated={(newReport) => {
          setReports([newReport, ...reports]);
        }} />

        {/* Listado de Reportes */}
        <section>
          <h3 className="text-xl font-bold text-white mb-4">Reportes Registrados en el Sistema</h3>
          {loading ? (
            <p className="text-slate-400 text-sm">Cargando...</p>
          ) : reports.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-sm">
              No hay reportes territoriales registrados todavía. ¡Crea el primero arriba!
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-blue-950 text-blue-300 text-xs px-2.5 py-1 rounded-full border border-blue-800 font-medium">
                      {report.category}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      report.severity === 'HIGH' ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      Severidad: {report.severity}
                    </span>
                  </div>
                  <p className="text-slate-200 text-sm mb-3">{report.description}</p>
                  <div className="text-xs text-slate-400 flex flex-wrap gap-4">
                    <span> Lat: {report.latitude}, Lng: {report.longitude}</span>
                    <span> Keywords: {report.keywords?.join(', ')}</span>
                    <span> {new Date(report.created_at).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}