const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gatekeeper — Virus & URL Scanner API',
      version: '1.0.0',
      description: 'Backend API for the Gatekeeper security scanner, part of the CafeToolbox ecosystem. Powered by VirusTotal API v3.',
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 5000}`, description: 'Local dev' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'CafeToolbox Supabase Auth access_token',
        },
      },
      schemas: {
        ScanStats: {
          type: 'object',
          properties: {
            total_engines: { type: 'integer', example: 72 },
            malicious:     { type: 'integer', example: 0 },
            suspicious:    { type: 'integer', example: 0 },
            harmless:      { type: 'integer', example: 68 },
            undetected:    { type: 'integer', example: 4 },
            positive_hits: { type: 'integer', example: 0 },
          },
        },
        FileScanResult: {
          type: 'object',
          properties: {
            scan_id:          { type: 'string' },
            file_name:        { type: 'string', example: 'test.exe' },
            file_hash:        { type: 'string', example: 'a1b2c3...' },
            scan_date:        { type: 'string', format: 'date-time' },
            stats:            { $ref: '#/components/schemas/ScanStats' },
            status:           { type: 'string', enum: ['clean', 'danger'] },
            reputation:       { type: 'integer', nullable: true },
            type_description: { type: 'string', nullable: true, example: 'Win32 EXE' },
            source:           { type: 'string', enum: ['cache', 'new_scan'] },
          },
        },
        UrlScanResult: {
          type: 'object',
          properties: {
            scan_id:    { type: 'string' },
            url:        { type: 'string', example: 'https://example.com' },
            scan_date:  { type: 'string', format: 'date-time' },
            stats:      { $ref: '#/components/schemas/ScanStats' },
            status:     { type: 'string', enum: ['clean', 'danger'] },
            categories: { type: 'object', additionalProperties: { type: 'string' } },
            source:     { type: 'string', enum: ['cache', 'new_scan'] },
          },
        },
        AnalysisResult: {
          type: 'object',
          properties: {
            analysis_id: { type: 'string' },
            status:      { type: 'string', enum: ['queued', 'completed'] },
            stats:       { type: 'object' },
            date:        { type: 'string', format: 'date-time' },
          },
        },
        HistoryRecord: {
          type: 'object',
          properties: {
            id:          { type: 'string', format: 'uuid' },
            user_id:     { type: 'string', format: 'uuid' },
            target_type: { type: 'string', enum: ['file', 'url'] },
            target_name: { type: 'string' },
            target_hash: { type: 'string', nullable: true },
            stats:       { $ref: '#/components/schemas/ScanStats' },
            verdict:     { type: 'string', enum: ['clean', 'suspicious', 'malicious', 'scanning'] },
            analysis_id: { type: 'string', nullable: true },
            created_at:  { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error:  { type: 'string' },
            detail: { type: 'string' },
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
