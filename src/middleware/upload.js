const multer = require('multer');
const path = require('path');

const MAX_FILE_SIZE = 650 * 1024 * 1024; // 650 MB (VirusTotal hard limit)

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter(_req, file, cb) {
    const blocked = ['.exe.lnk']; // extend as needed
    const ext = path.extname(file.originalname).toLowerCase();
    if (blocked.includes(ext)) {
      return cb(new Error(`File type ${ext} is not allowed`));
    }
    cb(null, true);
  },
});

module.exports = upload;
