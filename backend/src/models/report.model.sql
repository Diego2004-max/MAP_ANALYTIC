/**
 * @file report.model.sql
 * @description PostGIS spatial database schema for territorial anomaly reports.
 */

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create the main spatial table for anomalies
CREATE TABLE IF NOT EXISTS anomaly_reports (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    location GEOMETRY(Point, 4326) NOT NULL, -- PostGIS geospatial point using WGS 84 coordinate system
    citizen_id VARCHAR(100) DEFAULT 'ANONYMOUS',
    category VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    keywords TEXT[],
    is_actionable BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a spatial index (GIST) to optimize geographical queries and map performance
CREATE INDEX IF NOT EXISTS idx_anomaly_reports_location ON anomaly_reports USING GIST (location);