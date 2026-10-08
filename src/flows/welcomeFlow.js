import { addKeyword, EVENTS } from '@builderbot/bot';
import { config } from '../config.js';
import { askAssistant } from '../services/aiService.js';

export const welcomeText = [
  `👋 ¡Hola! Te damos la bienvenida a *${config.business.name}*.`,
  '',
  'Soy tu asistente virtual 🤖 y estoy aquí para resolver tus dudas de inmediato.',
  '',
  '📌 *Elige una opción escribiendo el número correspondiente:*',
  '',
  '1️⃣ *Servicios y Soluciones*',
  '2️⃣ *Horarios y Ubicación*',
  '3️⃣ *Preguntas Frecuentes*',
  '4️⃣ *Registrar Solicitud / Cotizar*',
  '5️⃣ *Hablar con un Asesor Humano*',
  '',
  '👉 Escribe el *número* de tu preferencia o escribe tu consulta directamente.'
].join('\n');

/**
 * Flujo activado por palabras clave explícitas de saludo o navegación
 */
export const welcomeFlow = addKeyword([
  'hola',
  'buenas',
  'buen dia',
  'buenos dias',
  'buenas tardes',
  'buenas noches',
  'menu',
  'menú',
  'inicio',
  'empezar',
  'hi',
  'hello',
  'ayuda',
  'opciones'
]).addAnswer(welcomeText, { delay: config.antiBan.delayMs });

/**
 * Flujo fallback inteligente para cualquier mensaje no contemplado en el menú
 */
export const defaultFallbackFlow = addKeyword(EVENTS.WELCOME)
  .addAction(async (ctx, { flowDynamic }) => {
    const userMessage = ctx.body?.trim() || '';

    // Si es un saludo común que no entró por keyword exacta
    const lower = userMessage.toLowerCase();
    if (lower.length <= 4 || ['que tal', 'hey', 'alo', 'saludos'].some(w => lower.includes(w))) {
      await flowDynamic(welcomeText);
      return;
    }

    // Consulta abierta: procesar con IA o motor de respuestas inteligentes
    const aiResponse = await askAssistant(userMessage);
    await flowDynamic([
      aiResponse,
      '',
      '💡 _Escribe *menu* en cualquier momento para ver las opciones principales._'
    ].join('\n'));
  });
