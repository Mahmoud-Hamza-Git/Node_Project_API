const path = require('path');
const fs = require('fs');
const multer = require('multer');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/gi, '');
    const unique = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    cb(null, `${safeBase || 'image'}-${unique}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only image files are allowed'));
};

const maxSizeMb = parseInt(process.env.MAX_IMAGE_MB || '5', 10);
const upload = multer({ storage, fileFilter, limits: { fileSize: maxSizeMb * 1024 * 1024 } });

// Single image field name 'photo'
const uploadSingleImage = upload.single('photo');

module.exports = { upload, uploadSingleImage, uploadDir };
