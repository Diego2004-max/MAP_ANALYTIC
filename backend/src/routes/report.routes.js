/**
 * @file report.routes.js
 * @description REST API router configuration for spatial anomaly reports.
 */
import { Router } from 'express';
import { ReportController } from '../controllers/report.controller.js';
import { NlpClassificationService } from '../services/nlp-classification.service.js';

const router = Router();

// Initialize service and controller (Dependency Injection pattern)
const nlpClassificationService = new NlpClassificationService();
const reportController = new ReportController(nlpClassificationService);

// Define endpoints under /api/v1/
router.post('/reports', reportController.createReport);
router.get('/reports', reportController.getReports);

export default router;