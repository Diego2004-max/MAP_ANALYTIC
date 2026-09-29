/**
 * @file 
 * @description 
 */
import { dbPool } from '../config/database.js';

export class ReportController {
  constructor(nlpClassificationService) {
    this.nlpService = nlpClassificationService;
  }

  createReport = async (req, res) => {
    try {
      const { description, latitude, longitude, citizenId } = req.body;

      if (!description || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ error: "Missing required fields: description, latitude, longitude." });
      }

      
      const nlpMetadata = await this.nlpService.classifyReport(description);

      
      const query = `
        INSERT INTO anomaly_reports 
        (description, location, citizen_id, category, severity, keywords, is_actionable, status, created_at)
        VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4, $5, $6, $7, $8, 'PENDING', NOW())
        RETURNING id, description, category, severity, status, created_at;
      `;

      const values = [
        description,
        longitude,
        latitude,
        citizenId || 'ANONYMOUS',
        nlpMetadata.category,
        nlpMetadata.severity,
        nlpMetadata.extractedKeywords,
        nlpMetadata.isActionable
      ];

      const { rows } = await dbPool.query(query, values);

      return res.status(201).json({
        message: "Anomaly successfully reported and analyzed.",
        data: rows[0]
      });

    } catch (error) {
      console.error("[ReportController] Error creating report:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }

  getReports = async (req, res) => {
    try {
      const query = `
        SELECT id, description, category, severity, status, created_at,
               ST_X(location::geometry) AS longitude, 
               ST_Y(location::geometry) AS latitude
        FROM anomaly_reports
        ORDER BY created_at DESC;
      `;
      const { rows } = await dbPool.query(query);
      return res.status(200).json({ data: rows });
    } catch (error) {
      return res.status(500).json({ error: "Failed to retrieve reports." });
    }
  }
}