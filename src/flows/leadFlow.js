import { addKeyword } from '@builderbot/bot';
import { saveLead } from '../services/leadStorage.js';
import { config } from '../config.js';

export const leadFlow = addKeyword(['4', 'cotizar', 'cotizacion', 'cotización', 'solicitud', 'registrar'])
  .addAnswer(
    '🎯 *Registro de Solicitud / Cotización*\n\nCon gusto te ayudamos. Para preparar una propuesta adecuada, por favor responde unas breves preguntas:\n\n👤 *1. ¿Cuál es tu nombre completo?*',
    { capture: true, delay: config.antiBan.delayMs },
    async (ctx, { state }) => {
      await state.update({ name: ctx.body.trim() });
    }
  )
  .addAnswer(
    '📧 *2. ¿Cuál es tu correo electrónico de contacto?*',
    { capture: true, delay: config.antiBan.delayMs },
    async (ctx, { state }) => {
      await state.update({ contact: ctx.body.trim() });
    }
  )
  .addAnswer(
    '📝 *3. Cuéntanos brevemente qué necesitas automatizar o qué consulta tienes:*',
    { capture: true, delay: config.antiBan.delayMs },
    async (ctx, { state, flowDynamic }) => {
      await state.update({ requirement: ctx.body.trim() });
      const myState = state.getMyState();

      try {
        await saveLead({
          phone: ctx.from,
          name: myState.name,
          contact: myState.contact,
          requirement: myState.requirement
        });

        await flowDynamic([
          `✅ *¡Solicitud registrada con éxito, ${myState.name}!*`,
          '',
          '📋 *Resumen:*',
          `• *Contacto:* ${myState.contact}`,
          `• *Detalle:* ${myState.requirement}`,
          '',
          'Un asesor evaluará tus requerimientos y te responderá a la brevedad sin ningún compromiso.',
          '',
          '🔙 Escribe *menu* para volver al inicio.'
        ].join('\n'));
      } catch (err) {
        console.error('Error guardando solicitud:', err);
        await flowDynamic('⚠️ Tu solicitud fue recibida internamente. En breve un asesor te responderá directamente.');
      }
    }
  );
