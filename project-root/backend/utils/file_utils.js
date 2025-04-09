import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_FOLDER = path.join(__dirname, '..', 'files', 'uploads');

if (!fs.existsSync(UPLOAD_FOLDER)) {
    fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });
}

const ALLOWED_EXTENSIONS = new Set([
    'docx', 'pptx', 'pdf', 'txt', 'py', 'js', 'html', 'css'
]);

function isAllowedFile(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    return ALLOWED_EXTENSIONS.has(extension);
}

export {
    UPLOAD_FOLDER,
    ALLOWED_EXTENSIONS,
    isAllowedFile
};
