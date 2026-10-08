import { addKeyword } from '@builderbot/bot';
import { config } from '../config.js';

export const catalogFlow = addKeyword(['1', 'servicios', 'catalogo', 'catálogo', 'informacion', 'información', 'info', 'informes'])
  .addAnswer(
    [
      `🚀 *Nuestros Servicios en ${config.business.name}*:`,
      '',
      '1️⃣ *Automatización de WhatsApp:* Bots interactivos, atención 24/7 y captura de clientes.',
      '2️⃣ *Desarrollo Web & Apps:* Sitios corporativos, tiendas online y aplicaciones a medida.',
      '3️⃣ *Integración de IA:* Asistentes inteligentes con modelos de lenguaje para atención y ventas.',
      '4️⃣ *Consultoría Tecnológica:* Optimización de procesos para pymes y emprendimientos.',
      '',
      '💡 Escribe *4* para solicitar una cotización sin costo.',
      '🔙 Escribe *menu* para volver al menú principal.'
    ].join('\n'),
    { delay: config.antiBan.delayMs }
  );
