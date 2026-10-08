import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config.js';

let genAI = null;
let model = null;

if (config.ai.geminiApiKey) {
  try {
    genAI = new GoogleGenerativeAI(config.ai.geminiApiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  } catch (err) {
    console.warn('⚠️ No se pudo inicializar Gemini con la API Key provista:', err.message);
  }
}

const SYSTEM_PROMPT = `
Eres el asistente virtual inteligente de "${config.business.name}".
Información de la empresa:
- Descripción: ${config.business.description}
- Horarios de atención: ${config.business.schedule}
- Ubicación: ${config.business.location}
- Correo de contacto: ${config.business.contactEmail}

Instrucciones:
1. Responde de manera concisa, amable y profesional en máximo 2 a 3 oraciones cortas (ideal para WhatsApp).
2. Si el usuario desea contratar un servicio o solicitar una cotización, invítalo a escribir la opción 4 del menú principal.
3. Si la pregunta no se relaciona con la empresa o no estás seguro, sugiérele contactar a un asesor escribiendo "asesor".
`;

/**
 * Responde a consultas abiertas usando IA o respuestas predeterminadas
 */
export async function askAssistant(userQuery) {
  if (model) {
    try {
      const prompt = `${SYSTEM_PROMPT}\n\nPregunta del cliente: "${userQuery}"\nRespuesta concisa:`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (err) {
      console.warn('Error al consultar Gemini API:', err.message);
    }
  }

  // Fallback inteligente sin IA (100% gratuito sin keys)
  const queryLower = userQuery.toLowerCase();

  if (queryLower.includes('precio') || queryLower.includes('cuanto cuesta') || queryLower.includes('costo')) {
    return '💰 Los precios varían según el alcance del proyecto. Escribe *4* para solicitar una cotización personalizada o escribe *1* para conocer nuestros servicios.';
  }

  if (queryLower.includes('hora') || queryLower.includes('abierto') || queryLower.includes('atienden')) {
    return `🕒 Nuestro horario de atención es: ${config.business.schedule}.`;
  }

  if (queryLower.includes('donde') || queryLower.includes('direccion') || queryLower.includes('ubicacion')) {
    return `📍 ${config.business.location}`;
  }

  return '🤖 Disculpa, no comprendí del todo tu consulta.\n\nPuedes escribir *menu* para ver las opciones disponibles o escribir *5* para comunicarte con un asesor.';
}
