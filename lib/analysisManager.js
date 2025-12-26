import fs from 'fs';
import path from 'path';

const ANALYSES_DIR = path.join(process.cwd(), 'data', 'analyses');

// Ensure directory exists
function ensureDir() {
  if (!fs.existsSync(ANALYSES_DIR)) {
    fs.mkdirSync(ANALYSES_DIR, { recursive: true });
  }
}

export function getAllAnalyses() {
  ensureDir();
  
  const files = fs.readdirSync(ANALYSES_DIR)
    .filter(f => f.endsWith('.json'))
    .sort((a, b) => b.localeCompare(a)); // Newest first
  
  return files.map(file => {
    const content = fs.readFileSync(path.join(ANALYSES_DIR, file), 'utf-8');
    return JSON.parse(content);
  });
}

export function getAnalysisByDate(date) {
  ensureDir();
  
  const filePath = path.join(ANALYSES_DIR, `${date}.json`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

export function saveAnalysis(analysis) {
  ensureDir();
  
  const filePath = path.join(ANALYSES_DIR, `${analysis.date}.json`);
  fs.writeFileSync(filePath, JSON.stringify(analysis, null, 2), 'utf-8');
  
  return analysis;
}

export function getLatestAnalysis() {
  const analyses = getAllAnalyses();
  return analyses.length > 0 ? analyses[0] : null;
}

export function analysisExistsForDate(date) {
  ensureDir();
  const filePath = path.join(ANALYSES_DIR, `${date}.json`);
  return fs.existsSync(filePath);
}
