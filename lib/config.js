import path from "path";
import {randomString} from "./common-utils.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const dataDir = process.env.DATA_DIR || path.join(__dirname, '../.data');
export const mediaDir = path.join(dataDir, 'media');
export const uploadsDir = path.join(dataDir, 'uploads');
export const jwtCookieField = 'auth.jwt';
export const jwtSecret = process.env.JWT_SECRET || randomString(10);

