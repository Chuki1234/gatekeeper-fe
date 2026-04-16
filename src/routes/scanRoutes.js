const { Router } = require('express');
const ctrl = require('../controllers/scanController');
const upload = require('../middleware/upload');
const { scanLimiter } = require('../middleware/rateLimiter');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

// All scan routes require authentication
router.use(authMiddleware);

router.post('/file', scanLimiter, upload.single('file'), ctrl.scanFile);
router.post('/url', scanLimiter, ctrl.scanUrl);
router.get('/analysis/:id', ctrl.getAnalysis);
router.get('/report/:id', ctrl.getReport);
router.get('/history', ctrl.getHistory);

module.exports = router;
