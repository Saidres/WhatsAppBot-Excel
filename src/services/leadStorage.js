import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ExcelJS from 'exceljs';
import { config } from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const EXCEL_FILE = path.join(DATA_DIR, 'leads.xlsx');

/**
 * Guarda o añade un nuevo lead en el archivo Excel data/leads.xlsx
 */
async function appendLeadToExcel(newLead) {
  try {
    const workbook = new ExcelJS.Workbook();
    let worksheet;

    if (existsSync(EXCEL_FILE)) {
      await workbook.xlsx.readFile(EXCEL_FILE);
      worksheet = workbook.getWorksheet('Leads WhatsApp') || workbook.worksheets[0];
    } else {
      worksheet = workbook.addWorksheet('Leads WhatsApp');
      worksheet.columns = [
        { header: 'Fecha y Hora', key: 'fecha', width: 22 },
        { header: 'Nombre Completo', key: 'nombre', width: 25 },
        { header: 'Número WhatsApp', key: 'telefono', width: 20 },
        { header: 'Correo / Contacto', key: 'contacto', width: 28 },
        { header: 'Detalle del Requerimiento', key: 'requerimiento', width: 45 },
      ];

      // Estilo elegante del encabezado (Verde corporativo)
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF128C7E' } // Verde WhatsApp Business
      };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
      headerRow.height = 25;
    }

    const dateFormatted = new Date().toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const row = worksheet.addRow({
      fecha: dateFormatted,
      nombre: newLead.name || 'No especificado',
      telefono: newLead.phone ? String(newLead.phone) : '',
      contacto: newLead.contact || '',
      requerimiento: newLead.requirement || ''
    });

    row.alignment = { vertical: 'middle', wrapText: true };
    await workbook.xlsx.writeFile(EXCEL_FILE);
    console.log(`📊 Lead guardado exitosamente en Excel: ${EXCEL_FILE}`);
  } catch (excelErr) {
    console.error('Error al actualizar archivo Excel de leads:', excelErr);
  }
}

/**
 * Envía el lead al Webhook de Google Sheets si está configurado en .env
 */
async function syncToGoogleSheets(leadData) {
  const webhookUrl = config.sheets?.webhookUrl;
  if (!webhookUrl) return;

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: new Date().toLocaleString('es-ES'),
        name: leadData.name || 'No especificado',
        phone: leadData.phone ? String(leadData.phone) : '',
        contact: leadData.contact || '',
        requirement: leadData.requirement || ''
      })
    });

    if (response.ok) {
      console.log('☁️ Lead sincronizado con Google Sheets en la nube exitosamente.');
    } else {
      console.warn('⚠️ Google Sheets Webhook respondió con estado:', response.status);
    }
  } catch (err) {
    console.warn('⚠️ No se pudo sincronizar con Google Sheets (verifica conexión o URL):', err.message);
  }
}

/**
 * Guarda un lead capturado por el bot en archivo JSON, Excel local y Google Sheets en la nube
 */
export async function saveLead(leadData) {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    let leads = [];
    try {
      const content = await fs.readFile(LEADS_FILE, 'utf-8');
      leads = JSON.parse(content);
    } catch (readErr) {
      leads = [];
    }

    const newLead = {
      id: `lead_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...leadData
    };

    leads.push(newLead);
    await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');

    // 1. Guardar en formato Excel (.xlsx) local
    await appendLeadToExcel(newLead);

    // 2. Sincronizar con Google Sheets en la nube (si hay Webhook configurado)
    await syncToGoogleSheets(newLead);

    return newLead;
  } catch (err) {
    console.error('Error al guardar el lead:', err);
    throw err;
  }
}

/**
 * Obtiene todos los leads registrados en formato JSON
 */
export async function getLeads() {
  try {
    const content = await fs.readFile(LEADS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    return [];
  }
}
