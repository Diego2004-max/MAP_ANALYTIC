/**
 * @file anomaly-monitor.service.js
 * @description Servicio proactivo filtrado estrictamente para el territorio de Colombia.
 */

export class AnomalyMonitorService {
  constructor() {
    this.countryScope = "Colombia";
    this.sgcApiUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson";
  }

  async scanTerritorialAnomalies() {
    try {
      console.log(`[AnomalyMonitor] Escaneando sismos en vivo para ${this.countryScope}...`);
      
      const response = await fetch(this.sgcApiUrl);
      const data = await response.json();

      const activeAnomalies = [];

      for (const feature of data.features || []) {
        const coords = feature.geometry.coordinates; // [longitude, latitude, depth]
        const lng = coords[0];
        const lat = coords[1];
        const props = feature.properties;
        const magnitude = props.mag || 0;

        // Delimitación geográfica aproximada del territorio colombiano (Bounding Box)
        // Lat: -4.5 a 13.5, Lng: -82.0 a -66.8
        const isInsideColombia = (lat >= -4.5 && lat <= 13.5) && (lng >= -82.0 && lng <= -66.8);

        if (isInsideColombia && magnitude >= 3.0) {
          const anomalyReport = {
            title: `Sismo en Colombia: ${props.place}`,
            description: `Magnitud: ${magnitude} Richter. Detectado en tiempo real en la región.`,
            latitude: lat,
            longitude: lng,
            severity: magnitude >= 4.5 ? 'HIGH' : 'MEDIUM',
            category: 'Actividad Sísmica Nacional',
            source: 'USGS_COLOMBIA_FILTER',
            timestamp: new Date(props.time)
          };

          activeAnomalies.push(anomalyReport);
        }
      }

      // Si en este preciso instante no hay sismos recientes dentro de Colombia, 
      // mostramos el estado de vigilancia activa del nodo nacional con datos estables.
      if (activeAnomalies.length === 0) {
        activeAnomalies.push({
          title: "Vigilancia Sísmica Nacional: Sin Sismos Mayores Recientes",
          description: "El radar está conectado en vivo. No se registran sismos de magnitud relevante (>3.0) en el territorio colombiano en las últimas horas.",
          latitude: 4.5708,
          longitude: -74.2973,
          severity: "LOW",
          category: "Monitoreo Normal",
          source: "COLOMBIA_RADAR_ACTIVE",
          timestamp: new Date()
        });
      }

      return activeAnomalies;
    } catch (error) {
      console.error("[AnomalyMonitor] Error en radar:", error.message);
      return [];
    }
  }
}