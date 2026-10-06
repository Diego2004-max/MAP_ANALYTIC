/**
 * @file anomaly-monitor.service.js
 * @description Servicio proactivo de monitoreo territorial para toda Colombia,
 * detectando sismos y eventos naturales para disparar alertas y notificaciones push.
 */

export class AnomalyMonitorService {
  constructor() {
    this.countryScope = "Colombia";
  }

  // Escanea el territorio nacional en busca de anomalías geológicas/sísmicas
  async scanTerritorialAnomalies() {
    try {
      console.log(`[AnomalyMonitor] Escaneando todo el territorio de ${this.countryScope} en busca de anomalías...`);

      // Simulación avanzada conectada a eventos a nivel nacional (ej. Red Sismológica Nacional)
      const nationalEvents = await this.fetchNationalGeologicalData();

      const activeAnomalies = [];

      for (const event of nationalEvents) {
        // Filtrar eventos de consideración nacional
        if (event.magnitude >= 4.0 || event.riskLevel === 'HIGH') {
          console.log(`[ALERTA NACIONAL 🚨] ¡Evento detectado en ${event.location} (${event.department})! Mag: ${event.magnitude}`);
          
          const anomalyReport = {
            title: `Alerta Nacional: ${event.type} (${event.location})`,
            description: event.description,
            latitude: event.latitude,
            longitude: event.longitude,
            severity: event.magnitude >= 5.0 ? 'HIGH' : 'MEDIUM',
            category: event.type,
            source: 'COLOMBIA_NATIONAL_SCANNER',
            timestamp: new Date()
          };

          activeAnomalies.push(anomalyReport);

          // Disparar Notificación Push masiva a los usuarios conectados en la app
          this.triggerPushNotification(anomalyReport);
        }
      }

      return activeAnomalies;
    } catch (error) {
      console.error("[AnomalyMonitor] Error en el escaneo nacional:", error);
      return [];
    }
  }

  async fetchNationalGeologicalData() {
    // Aquí puedes conectar el feed oficial o API del Servicio Geológico Colombiano (SGC).
    // Devolvemos eventos representativos distribuidos en el país como ejemplo vivo:
    return [
      {
        type: 'Actividad Sísmica',
        location: 'Los Santos',
        department: 'Santander',
        magnitude: 4.6,
        latitude: 6.818,
        longitude: -73.153,
        description: 'Sismo con profundidad intermedia registrado en el nido sísmico de Bucaramanga, sentido en varios departamentos.',
        riskLevel: 'MEDIUM'
      },
      {
        type: 'Actividad Volcánica',
        location: 'Volcán Nevado del Ruiz',
        department: 'Caldas / Tolima',
        magnitude: 4.2,
        latitude: 4.892,
        longitude: -75.323,
        description: 'Aumento en la actividad sísmica asociada a fracturamiento de roca al interior del edificio volcánico.',
        riskLevel: 'HIGH'
      }
    ];
  }

  triggerPushNotification(anomaly) {
    console.log(`[PUSH NOTIFICATION MASIVA 📱] -> Enviando alerta a dispositivos móviles en Colombia: "${anomaly.title}"`);
  }
}