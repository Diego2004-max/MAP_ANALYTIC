/**
 * @file anomaly-monitor.service.js
 * @description Servicio proactivo que separa la actividad sísmica nacional de Colombia y la global en tiempo real.
 */

export class AnomalyMonitorService {
  constructor() {
    this.countryScope = "Colombia";
    this.sgcApiUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson";
  }

  async scanTerritorialAnomalies() {
    try {
      console.log(`[AnomalyMonitor] Escaneando red sísmica global y nacional...`);
      
      const response = await fetch(this.sgcApiUrl);
      const data = await response.json();

      const nationalAnomalies = [];
      const globalAnomalies = [];

      for (const feature of data.features || []) {
        const coords = feature.geometry.coordinates; // [lng, lat, depth]
        const lng = coords[0];
        const lat = coords[1];
        const props = feature.properties;
        const magnitude = props.mag || 0;

        // Delimitación geográfica de Colombia
        const isInsideColombia = (lat >= -4.5 && lat <= 13.5) && (lng >= -82.0 && lng <= -66.8);

        const eventData = {
          title: props.place,
          description: `Magnitud: ${magnitude} Richter. Profundidad: ${coords[2]} km.`,
          latitude: lat,
          longitude: lng,
          severity: magnitude >= 5.0 ? 'HIGH' : 'MEDIUM',
          category: isInsideColombia ? 'Sismo Nacional (Colombia)' : 'Sismo Internacional',
          source: 'USGS_REAL_FEED',
          timestamp: new Date(props.time)
        };

        if (isInsideColombia) {
          nationalAnomalies.push(eventData);
        } else {
          globalAnomalies.push(eventData);
        }
      }

      const results = [];

      // 1. Manejo del reporte nacional
      if (nationalAnomalies.length > 0) {
        results.push(...nationalAnomalies);
      } else {
        results.push({
          title: "Estado Nacional: Sin sismos recientes en Colombia",
          description: "La red sismológica no registra sismos de consideración en el territorio colombiano en este momento.",
          latitude: 4.5708,
          longitude: -74.2973,
          severity: "LOW",
          category: "Vigilancia Colombia",
          source: "COLOMBIA_RADAR_SECURE",
          timestamp: new Date()
        });
      }

      // 2. Agregar los últimos eventos internacionales detectados por la misma API real
      if (globalAnomalies.length > 0) {
        // Tomamos los 2 sismos internacionales más recientes para mostrar contexto global real
        results.push(...globalAnomalies.slice(0, 2));
      }

      return results;
    } catch (error) {
      console.error("[AnomalyMonitor] Error en radar:", error.message);
      return [];
    }
  }
}