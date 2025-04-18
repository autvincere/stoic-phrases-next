// Simple file to test if TS-Node is working with ESM
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('TS-Node is working properly with ESM!');
console.log('Current directory:', __dirname);

// Exit cleanly
process.exit(0); 