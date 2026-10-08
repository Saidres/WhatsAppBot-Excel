import { createBot, createProvider, createFlow, MemoryDB } from '@builderbot/bot';
import { BaileysProvider } from '@builderbot/provider-baileys';
import { config } from './config.js';

import { welcomeFlow, defaultFallbackFlow } from './flows/welcomeFlow.js';
import { catalogFlow } from './flows/catalogFlow.js';
import { scheduleFlow } from './flows/scheduleFlow.js';
import { faqFlow } from './flows/faqFlow.js';
import { leadFlow } from './flows/leadFlow.js';
import { advisorFlow } from './flows/advisorFlow.js';

// Capturar rechazos y excepciones no controladas para evitar que caídas de red o timeouts cierren el proceso
process.on('unhandledRejection', (reason) => {
  const msg = reason?.message || String(reason);
  if (msg.includes('Queue item timeout')) {
    console.warn('⚠️ [Aviso de Cola]: Un mensaje tardó más de lo esperado en procesarse y fue omitido de la cola.');
  } else {
    console.warn('⚠️ [Advertencia]: Rechazo de promesa no controlado:', msg);
  }
});

process.on('uncaughtException', (err) => {
  const msg = err?.message || String(err);
  if (msg.includes('Queue item timeout')) {
    console.warn('⚠️ [Aviso de Cola]: Timeout en cola prevenido con éxito.');
  } else {
    console.error('❌ [Error no controlado]:', msg);
  }
});

const main = async () => {
  console.log('====================================================');
  console.log('🚀 INICIANDO BOT DE WHATSAPP (SOLUCIÓN CERO COSTO)');
  console.log('====================================================');
  console.log(`🏢 Negocio: ${config.business.name}`);
  console.log(`⏱️ Retardo Anti-Ban: ${config.antiBan.delayMs} ms`);
  console.log(`🤖 Modo IA: ${config.ai.geminiApiKey ? 'Activado (Google Gemini)' : 'Modo Reglas Inteligentes ($0)'}`);

  const adapterDB = new MemoryDB();
  const adapterFlow = createFlow([
    welcomeFlow,
    catalogFlow,
    scheduleFlow,
    faqFlow,
    leadFlow,
    advisorFlow,
    defaultFallbackFlow
  ]);
  const adapterProvider = createProvider(BaileysProvider);

  const { httpServer } = await createBot(
    {
      flow: adapterFlow,
      provider: adapterProvider,
      database: adapterDB,
    },
    {
      queue: {
        timeout: 90000, // 90 segundos para permitir sincronización inicial sin cortes
        concurrencyLimit: 25,
      },
    }
  );

  httpServer(+config.port);
  console.log(`🌐 Servidor HTTP activo en: http://localhost:${config.port}`);
  console.log('📲 Escanea el código QR que aparecerá a continuación para vincular tu WhatsApp:\n');
};

main().catch(err => {
  console.error('❌ Error crítico al iniciar el bot:', err);
});
