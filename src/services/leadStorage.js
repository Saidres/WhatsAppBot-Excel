import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

/**
 * Guarda un lead capturado por el bot en archivo JSON local sin costo de base de datos
 */
export async function saveLead(leadData) {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    let leads = [];
    try {
      const content = await fs.readFile(LEADS_FILE, 'utf-8');
      leads = JSON.parse(content);
    } catch (readErr) {
      // Si el archivo no existe o está vacío, iniciamos array vacío
      leads = [];
    }

    const newLead = {
      id: `lead_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...leadData
    };

    leads.push(newLead);
    await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
    return newLead;
  } catch (err) {
    console.error('Error al guardar el lead:', err);
    throw err;
  }
}

/**
 * Obtiene todos los leads registrados
 */
export async function getLeads() {
  try {
    const content = await fs.readFile(LEADS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    return [];
  }
}
