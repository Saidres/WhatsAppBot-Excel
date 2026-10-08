# ☁️ Guía de Integración con Google Sheets ($0 Cost)

Esta guía explica cómo sincronizar automáticamente en la nube los clientes potenciales (*leads*) capturados por el bot en una hoja de cálculo de **Google Sheets** en tiempo real.

---

## 📋 Paso 1: Crear la Hoja en Google Drive

1. Ve a [Google Sheets](https://sheets.new) con tu cuenta de Google / Gmail y crea una hoja de cálculo nueva.
2. Nómbrala como gustes (por ejemplo: `Prospectos WhatsApp Bot`).
3. En la primera fila (Fila 1), coloca los siguientes encabezados:
   * Columna A: `Fecha y Hora`
   * Columna B: `Nombre Completo`
   * Columna C: `WhatsApp`
   * Columna D: `Correo / Contacto`
   * Columna E: `Requerimiento / Solicitud`

---

## ⚡ Paso 2: Crear el Webhook en Apps Script (100% Gratis)

1. En la misma hoja de cálculo, haz clic en el menú superior: **Extensiones > Apps Script**.
2. Borra todo el código que aparece en el editor y pega este código:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.date || new Date().toLocaleString(),
      data.name || "No especificado",
      data.phone || "",
      data.contact || "",
      data.requirement || ""
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Haz clic en el ícono de **Guardar** (el disquete 💾).

---

## 🌐 Paso 3: Obtener la URL Webhook

1. Haz clic en el botón azul superior **Implementar > Nueva implementación**.
2. En el engranaje ⚙️ (Seleccionar tipo), elige **Aplicación web**.
3. Configura los siguientes campos:
   * **Descripción:** `Webhook WhatsApp Bot`
   * **Ejecutar como:** `Yo (tu correo electrónico)`
   * **Quién tiene acceso:** `Cualquier usuario` *(Importante para que el bot pueda enviar los datos sin pedir login).*
4. Haz clic en **Implementar**.
5. Autoriza los permisos con tu cuenta de Google.
6. Copia la **URL de la aplicación web** generada (empieza por `https://script.google.com/macros/s/.../exec`).

---

## 🔑 Paso 4: Configurar el Bot

1. Abre tu archivo `.env` en la raíz del proyecto.
2. Pega la URL en la variable `GOOGLE_SHEET_WEBHOOK_URL`:

```env
GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/TU_CODIGO_AQUI/exec"
```

3. Guarda los cambios e inicia el bot (`npm.cmd start`).

¡Listo! Cada vez que un cliente complete la **Opción 4** en WhatsApp, verás aparecer la fila en tu Google Sheets en vivo en tiempo real, accesible desde tu computadora o desde la app móvil en tu celular.
