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

// Control de memoria para evitar enviar el menú repetidas veces en ráfagas rápidas
const lastMenuTimestamps = new Map();
const MENU_COOLDOWN_MS = 2 * 60 * 1000; // 2 minutos de enfriamiento

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
]).addAction(async (ctx, { flowDynamic }) => {
  const user = ctx.from;
  const now = Date.now();
  const lastSent = lastMenuTimestamps.get(user) || 0;
  const text = (ctx.body || '').trim().toLowerCase();

  const isExplicitMenu = ['menu', 'menú', 'inicio', 'opciones'].includes(text);

  // Si ya se le envió el menú hace menos de 2 minutos y no lo solicitó explícitamente con "menu"
  if (!isExplicitMenu && (now - lastSent < MENU_COOLDOWN_MS)) {
    await flowDynamic('👆 ¡Hola de nuevo! Ya te compartí las opciones arriba. Escribe el *número* (1 al 5) o dime directamente qué necesitas.');
    return;
  }

  lastMenuTimestamps.set(user, now);
  await flowDynamic(welcomeText);
});

/**
 * Flujo fallback inteligente para cualquier mensaje no contemplado en el menú
 */
export const defaultFallbackFlow = addKeyword(EVENTS.WELCOME)
  .addAction(async (ctx, { flowDynamic }) => {
    const userMessage = ctx.body?.trim() || '';
    const lower = userMessage.toLowerCase();
    const user = ctx.from;
    const now = Date.now();
    const lastSent = lastMenuTimestamps.get(user) || 0;

    // Si es un saludo común que no entró por keyword exacta
    if (lower.length <= 4 || ['que tal', 'hey', 'alo', 'saludos', 'buen día'].some(w => lower.includes(w))) {
      if (now - lastSent < MENU_COOLDOWN_MS) {
        await flowDynamic('👆 ¡Hola! Ya te compartí las opciones arriba. Escribe el *número* (1 al 5) de lo que necesitas.');
        return;
      }

      lastMenuTimestamps.set(user, now);
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
