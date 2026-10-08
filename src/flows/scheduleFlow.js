import { addKeyword } from '@builderbot/bot';
import { config } from '../config.js';

export const scheduleFlow = addKeyword(['2', 'horarios', 'horario', 'ubicacion', 'ubicación'])
  .addAnswer(
    [
      `🕒 *Horarios y Canales de Atención*:`,
      '',
      `📅 *Días hábiles:* ${config.business.schedule}`,
      `📍 *Ubicación:* ${config.business.location}`,
      `📧 *Email:* ${config.business.contactEmail}`,
      '',
      '🔙 Escribe *menu* para volver al inicio.'
    ].join('\n'),
    { delay: config.antiBan.delayMs }
  );
