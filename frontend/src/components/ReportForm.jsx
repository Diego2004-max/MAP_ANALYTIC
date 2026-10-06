import React, { useState } from 'react';

export function ReportForm({ onReportCreated }) {
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('1.204265');
  const [longitude, setLongitude] = useState('-77.295042');
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('La geolocalización no es compatible con este navegador.');
      return;
    }

    setLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setLocating(false);
      },
      (err) => {
        console.error(err);
        setError('No se pudo obtener la ubicación GPS. Verifica los permisos.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          citizenId: 'ANONYMOUS'
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al procesar el reporte con IA.');
      }

      setDescription('');
      if (onReportCreated) onReportCreated(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl mb-8 max-w-xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span></span> Registrar Anomalía
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Gemini clasifica automáticamente la anomalía en tiempo real.
          </p>
        </div>
        <button
          type="button"
          onClick={handleGetLocation}
          disabled={locating}
          className="bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 text-xs font-semibold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-2 shrink-0"
        >
          {locating ? 'Obteniendo GPS...' : ' Usar mi GPS'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-950/50 border border-red-800 text-red-200 rounded-xl text-xs sm:text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
            Descripción de la Anomalía
          </label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Puente afectado por crecida de río..."
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">Latitud</label>
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">Longitud</label>
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 shadow-lg shadow-blue-600/20"
        >
          {loading ? 'Analizando con IA y Guardando...' : 'Analizar con IA y Registrar'}
        </button>
      </form>
    </div>
  );
}