const { Router } = require('express');
const ctrl = require('../controllers/scanController');
const upload = require('../middleware/upload');
const { scanLimiter } = require('../middleware/rateLimiter');

const router = Router();

// TODO: Re-enable auth when integrating with CafeToolbox login
// const { requireAuth } = require('../middleware/authMiddleware');
// router.use(requireAuth);

/**
 * @swagger
 * /api/scan/file:
 *   post:
 *     summary: Scan a file for threats
 *     description: |
 *       Upload a file via multipart/form-data. The backend computes a SHA-256 hash,
 *       checks VirusTotal for an existing report (saves quota), and uploads if needed.
 *     tags: [Scan]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to scan (max 650 MB)
 *     responses:
 *       200:
 *         description: Scan completed — full report returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileScanResult'
 *       202:
 *         description: File submitted but still analyzing
 *       400:
 *         description: No file uploaded
 *       429:
 *         description: Rate limit exceeded (4 req/min)
 */
router.post('/file', scanLimiter, upload.single('file'), ctrl.scanFile);

/**
 * @swagger
 * /api/scan/url:
 *   post:
 *     summary: Scan a URL for threats
 *     description: |
 *       Submit a URL to check against VirusTotal. Checks for an existing report first,
 *       then triggers a new scan if needed.
 *     tags: [Scan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [url]
 *             properties:
 *               url:
 *                 type: string
 *                 example: https://example.com
 *     responses:
 *       200:
 *         description: Scan completed — full report returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UrlScanResult'
 *       202:
 *         description: URL submitted but still analyzing
 *       400:
 *         description: Missing URL in request body
 *       429:
 *         description: Rate limit exceeded (4 req/min)
 */
router.post('/url', scanLimiter, ctrl.scanUrl);

/**
 * @swagger
 * /api/scan/analysis/{id}:
 *   get:
 *     summary: Poll an in-progress analysis
 *     description: Fetch the current status of a VirusTotal analysis by its ID.
 *     tags: [Scan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: VirusTotal analysis ID
 *     responses:
 *       200:
 *         description: Analysis status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalysisResult'
 */
router.get('/analysis/:id', ctrl.getAnalysis);

/**
 * @swagger
 * /api/scan/report/{id}:
 *   get:
 *     summary: Get a completed scan report
 *     description: Fetch a scan record from the database by its UUID.
 *     tags: [Scan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Scan record UUID
 *     responses:
 *       200:
 *         description: Scan record found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HistoryRecord'
 *       404:
 *         description: Scan not found
 */
router.get('/report/:id', ctrl.getReport);

/**
 * @swagger
 * /api/scan/history:
 *   get:
 *     summary: Get recent scan history
 *     description: Returns the 20 most recent scans, ordered by newest first.
 *     tags: [Scan]
 *     responses:
 *       200:
 *         description: List of scan records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HistoryRecord'
 */
router.get('/history', ctrl.getHistory);

module.exports = router;
