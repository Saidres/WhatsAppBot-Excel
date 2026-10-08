import { addKeyword } from '@builderbot/bot';
import { config } from '../config.js';

export const advisorFlow = addKeyword(['5', 'asesor', 'humano', 'agente', 'soporte'])
  .addAnswer(
    [
      '👤 *Contacto con un Asesor*',
      '',
      'Hemos notificado a nuestro equipo. Un especialista humano tomará tu consulta directamente en este chat.',
      '',
      `📞 También puedes escribirnos directamente a: *${config.business.advisorPhone}*`,
      `📧 O vía correo: *${config.business.contactEmail}*`,
      '',
      '⏰ *Horario de atención humana:*',
      `${config.business.schedule}`,
      '',
      '🔙 Escribe *menu* para volver a las opciones automáticas.'
    ].join('\n'),
    { delay: config.antiBan.delayMs }
  );
