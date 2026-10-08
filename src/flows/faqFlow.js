import { addKeyword } from '@builderbot/bot';
import { config } from '../config.js';

export const faqFlow = addKeyword(['3', 'faq', 'preguntas', 'dudas'])
  .addAnswer(
    [
      '❓ *Preguntas Frecuentes (FAQ)*:',
      '',
      '🔹 *¿Tienen costo inicial las consultas?*',
      'No, realizamos una evaluación inicial 100% gratuita de tus necesidades.',
      '',
      '🔹 *¿Cuánto tiempo toma implementar un bot?*',
      'Generalmente entre 24 y 72 horas para flujos estándar.',
      '',
      '🔹 *¿Puedo integrar el bot con mis sistemas actuales?*',
      'Sí, se puede conectar con Google Sheets, bases de datos (SQL/NoSQL) o CRMs.',
      '',
      '🔹 *¿Cómo evito que bloqueen mi número?*',
      'Nuestras soluciones aplican tiempos de espera humanos y responden a demanda.',
      '',
      '✍️ Escribe *4* para solicitar una propuesta a tu medida.',
      '🔙 Escribe *menu* para ver el menú principal.'
    ].join('\n'),
    { delay: config.antiBan.delayMs }
  );
