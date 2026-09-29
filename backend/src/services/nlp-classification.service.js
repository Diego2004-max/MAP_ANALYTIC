/**
 * @file nlp-classification.service.js
 * @description Encapsulates Gemini AI integration using strict structured JSON schemas.
 */
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export class NlpClassificationService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Enforce strict schema so the LLM responds only with valid JSON matching our domain
    this.responseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        category: {
          type: SchemaType.STRING,
          description: "Category of the anomaly: INFRASTRUCTURE, ENVIRONMENTAL, SECURITY, or PUBLIC_SERVICE",
        },
        severity: {
          type: SchemaType.STRING,
          description: "Severity level: LOW, MEDIUM, HIGH, CRITICAL",
        },
        extractedKeywords: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          description: "3 to 5 key tags extracted from the report",
        },
        isActionable: {
          type: SchemaType.BOOLEAN,
          description: "True if the report contains enough information to dispatch a technical team",
        }
      },
      required: ["category", "severity", "extractedKeywords", "isActionable"],
    };
  }

  /**
   * Receives raw text and returns structured classification metadata.
   * @param {string} rawText 
   * @returns {Promise<Object>}
   */
  async classifyReport(rawText) {
    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: this.responseSchema,
          temperature: 0.1, 
        },
      });

      const systemPrompt = `You are an expert territorial analyst for Map Analytic. Analyze this citizen report and classify it strictly according to the schema: "${rawText}"`;

      const result = await model.generateContent(systemPrompt);
      return JSON.parse(result.response.text());
    } catch (error) {
      console.error("[NlpClassificationService] AI processing error:", error);
      throw new Error("Failed to process natural language classification.");
    }
  }
}