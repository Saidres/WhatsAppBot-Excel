import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3008,
  business: {
    name: process.env.BUSINESS_NAME || 'Innovatech Soluciones',
    description: 'Servicios de desarrollo de software, automatización e inteligencia artificial.',
    schedule: 'Lunes a Viernes de 9:00 AM a 6:00 PM (Sábados de 9:00 AM a 1:00 PM)',
    location: 'Atención 100% online y presencial previa cita en nuestras oficinas.',
    contactEmail: 'contacto@innovatech.com',
    advisorPhone: '+54 9 11 1234-5678'
  },
  antiBan: {
    // Retardo humano simulado en milisegundos para evitar bloqueos por respuestas instantáneas
    delayMs: Number(process.env.RESPONSE_DELAY_MS) || 1200
  },
  ai: {
    // Si se proporciona una API key gratuita de Google AI Studio, activará respuestas con IA
    geminiApiKey: process.env.GEMINI_API_KEY || ''
  },
  sheets: {
    // URL del Webhook de Google Apps Script para sincronización en la nube con Google Sheets
    webhookUrl: process.env.GOOGLE_SHEET_WEBHOOK_URL || ''
  }
};
