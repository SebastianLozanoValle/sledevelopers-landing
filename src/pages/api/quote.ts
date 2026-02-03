import { Resend } from 'resend';
import type { APIRoute } from 'astro';

// Solo inicializar Resend si hay API key (evita errores en build)
const resend = import.meta.env.RESEND_API_KEY 
  ? new Resend(import.meta.env.RESEND_API_KEY)
  : null;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, phone, company, message, features, totalPrice, totalTime } = data;

    // Validar campos requeridos
    if (!name || !email || !phone) {
      return new Response(
        JSON.stringify({ error: 'Nombre, email y teléfono son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!features || features.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Debes seleccionar al menos una funcionalidad' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Email para el cliente (confirmación con cotización)
    const clientEmailHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cotización Recibida - SLE Development</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #082347 0%, #3B82F6 100%); border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800;">📋 Cotización Recibida</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Hola <strong>${name}</strong>,
              </p>
              
              <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
                Hemos recibido tu solicitud de cotización para un producto a la medida. Nuestro equipo la revisará y te contactará en las próximas 24 horas.
              </p>
              
              <!-- Resumen de Cotización -->
              <div style="background-color: #f9fafb; border-left: 4px solid #3B82F6; padding: 20px; margin: 30px 0; border-radius: 8px;">
                <h2 style="margin: 0 0 20px; color: #111827; font-size: 20px; font-weight: 700;">
                  Resumen de tu Cotización
                </h2>
                
                <div style="margin-bottom: 20px;">
                  <h3 style="margin: 0 0 10px; color: #111827; font-size: 16px; font-weight: 600;">Funcionalidades Seleccionadas:</h3>
                  <ul style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 14px; line-height: 1.8;">
                    ${features.map((f: any) => `
                      <li style="margin-bottom: 8px;">
                        <strong>${f.name}</strong> - $${f.price.toLocaleString('es-CO')} • ${f.time}
                      </li>
                    `).join('')}
                  </ul>
                </div>
                
                <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; margin-top: 20px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #111827; font-size: 18px; font-weight: 700;">Total Estimado:</span>
                    <span style="color: #3B82F6; font-size: 24px; font-weight: 800;">$${totalPrice.toLocaleString('es-CO')}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #6b7280; font-size: 14px;">Tiempo Estimado:</span>
                    <span style="color: #111827; font-size: 16px; font-weight: 600;">${totalTime}</span>
                  </div>
                </div>
              </div>
              
              ${message ? `
              <div style="background-color: #f9fafb; padding: 20px; margin: 30px 0; border-radius: 8px;">
                <h3 style="margin: 0 0 10px; color: #111827; font-size: 16px; font-weight: 600;">Tu Mensaje:</h3>
                <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
              ` : ''}
              
              <p style="margin: 30px 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Mientras tanto, si tienes alguna pregunta urgente, no dudes en responder a este email.
              </p>
              
              <p style="margin: 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Saludos,<br>
                <strong style="color: #082347;">El equipo de SLE Development</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                Este es un email automático, por favor no respondas directamente a este mensaje.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Email para el equipo (nueva cotización)
    const teamEmailHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nueva Cotización - Producto a la Medida</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #082347 0%, #3B82F6 100%); border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800;">🎯 Nueva Cotización - Producto a la Medida</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <div style="background-color: #f9fafb; border-left: 4px solid #3B82F6; padding: 20px; margin: 0 0 30px; border-radius: 8px;">
                <h2 style="margin: 0 0 20px; color: #111827; font-size: 20px; font-weight: 700;">
                  Información del Cliente
                </h2>
                
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 140px;"><strong>Nombre:</strong></td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Email:</strong></td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px;"><a href="mailto:${email}" style="color: #3B82F6; text-decoration: none;">${email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Teléfono:</strong></td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px;"><a href="tel:${phone}" style="color: #3B82F6; text-decoration: none;">${phone}</a></td>
                  </tr>
                  ${company ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Empresa:</strong></td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px;">${company}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              <!-- Cotización -->
              <div style="background-color: #f9fafb; padding: 20px; margin: 0 0 30px; border-radius: 8px;">
                <h3 style="margin: 0 0 20px; color: #111827; font-size: 18px; font-weight: 600;">Detalle de la Cotización:</h3>
                
                <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                  <thead>
                    <tr style="border-bottom: 2px solid #e5e7eb;">
                      <th style="padding: 10px 0; text-align: left; color: #111827; font-size: 14px; font-weight: 600;">Funcionalidad</th>
                      <th style="padding: 10px 0; text-align: right; color: #111827; font-size: 14px; font-weight: 600;">Precio</th>
                      <th style="padding: 10px 0; text-align: right; color: #111827; font-size: 14px; font-weight: 600;">Tiempo</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${features.map((f: any) => `
                      <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 10px 0; color: #374151; font-size: 14px;">${f.name}</td>
                        <td style="padding: 10px 0; text-align: right; color: #374151; font-size: 14px;">$${f.price.toLocaleString('es-CO')}</td>
                        <td style="padding: 10px 0; text-align: right; color: #374151; font-size: 14px;">${f.time}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                  <tfoot>
                    <tr style="border-top: 2px solid #3B82F6;">
                      <td style="padding: 15px 0; color: #111827; font-size: 16px; font-weight: 700;">TOTAL</td>
                      <td style="padding: 15px 0; text-align: right; color: #3B82F6; font-size: 20px; font-weight: 800;">$${totalPrice.toLocaleString('es-CO')}</td>
                      <td style="padding: 15px 0; text-align: right; color: #111827; font-size: 16px; font-weight: 700;">${totalTime}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              ${message ? `
              <div style="background-color: #f9fafb; padding: 20px; margin: 0 0 30px; border-radius: 8px;">
                <h3 style="margin: 0 0 10px; color: #111827; font-size: 18px; font-weight: 600;">Mensaje del Cliente:</h3>
                <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
              ` : ''}
              
              <div style="text-align: center; margin-top: 40px;">
                <a href="mailto:${email}" style="display: inline-block; background: linear-gradient(135deg, #082347 0%, #3B82F6 100%); color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                  Responder al Cliente
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                Esta cotización fue generada desde el formulario de productos a la medida de SLE Development
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Verificar que Resend esté configurado
    if (!resend) {
      console.warn('Resend API key no configurada. Los emails no se enviarán.');
      // En desarrollo/build, retornar éxito sin enviar email
      if (import.meta.env.MODE === 'production' && import.meta.env.RESEND_API_KEY) {
        throw new Error('Resend no está configurado correctamente');
      }
      return new Response(
        JSON.stringify({ success: true, message: 'Cotización recibida (modo desarrollo)' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Enviar email de confirmación al cliente
    await resend.emails.send({
      from: import.meta.env.RESEND_FROM_EMAIL || 'SLE Development <onboarding@resend.dev>',
      to: email,
      subject: 'Cotización Recibida - SLE Development',
      html: clientEmailHtml,
    });

    // Enviar email al equipo
    await resend.emails.send({
      from: import.meta.env.RESEND_FROM_EMAIL || 'SLE Development <onboarding@resend.dev>',
      to: import.meta.env.RESEND_TO_EMAIL || 'contacto@sledevelopers.com',
      replyTo: email,
      subject: `Nueva Cotización - Producto a la Medida de ${name} ($${totalPrice.toLocaleString('es-CO')})`,
      html: teamEmailHtml,
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Cotización enviada correctamente' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error enviando cotización:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error al enviar la cotización', 
        details: error.message 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};



