import { Resend } from 'resend';
import type { APIRoute } from 'astro';

// Solo inicializar Resend si hay API key (evita errores en build)
const resend = import.meta.env.RESEND_API_KEY 
  ? new Resend(import.meta.env.RESEND_API_KEY)
  : null;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, company, email, phone, project, interests, budget } = data;

    // Validar campos requeridos
    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: 'Nombre y email son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Email para el cliente (confirmación)
    const clientEmailHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gracias por contactarnos</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #082347 0%, #3B82F6 100%); border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800;">¡Gracias por contactarnos!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Hola <strong>${name}</strong>,
              </p>
              
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Hemos recibido tu mensaje y estamos emocionados de trabajar contigo. Nuestro equipo revisará tu solicitud y te contactará en las próximas 24 horas.
              </p>
              
              <div style="background-color: #f9fafb; border-left: 4px solid #3B82F6; padding: 20px; margin: 30px 0; border-radius: 8px;">
                <p style="margin: 0 0 10px; color: #111827; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  Resumen de tu solicitud:
                </p>
                ${company ? `<p style="margin: 5px 0; color: #6b7280; font-size: 14px;"><strong>Empresa:</strong> ${company}</p>` : ''}
                ${phone ? `<p style="margin: 5px 0; color: #6b7280; font-size: 14px;"><strong>Teléfono:</strong> ${phone}</p>` : ''}
                ${interests && interests.length > 0 ? `<p style="margin: 5px 0; color: #6b7280; font-size: 14px;"><strong>Intereses:</strong> ${interests.join(', ')}</p>` : ''}
                ${budget ? `<p style="margin: 5px 0; color: #6b7280; font-size: 14px;"><strong>Presupuesto:</strong> ${budget}</p>` : ''}
              </div>
              
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

    // Email para el equipo (nueva solicitud)
    const teamEmailHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nueva solicitud de contacto</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #082347 0%, #3B82F6 100%); border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800;">🎯 Nueva Solicitud de Contacto</h1>
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
                  ${company ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Empresa:</strong></td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px;">${company}</td>
                  </tr>
                  ` : ''}
                  ${phone ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Teléfono:</strong></td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px;"><a href="tel:${phone}" style="color: #3B82F6; text-decoration: none;">${phone}</a></td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              ${interests && interests.length > 0 ? `
              <div style="background-color: #f9fafb; padding: 20px; margin: 0 0 30px; border-radius: 8px;">
                <h3 style="margin: 0 0 15px; color: #111827; font-size: 18px; font-weight: 600;">Intereses:</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                  ${interests.map((interest: string) => `
                    <span style="display: inline-block; background-color: #082347; color: #ffffff; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">
                      ${interest}
                    </span>
                  `).join('')}
                </div>
              </div>
              ` : ''}
              
              ${budget ? `
              <div style="background-color: #f9fafb; padding: 20px; margin: 0 0 30px; border-radius: 8px;">
                <h3 style="margin: 0 0 10px; color: #111827; font-size: 18px; font-weight: 600;">Presupuesto:</h3>
                <p style="margin: 0; color: #111827; font-size: 16px; font-weight: 600; color: #3B82F6;">
                  ${budget}
                </p>
              </div>
              ` : ''}
              
              ${project ? `
              <div style="background-color: #f9fafb; padding: 20px; margin: 0 0 30px; border-radius: 8px;">
                <h3 style="margin: 0 0 15px; color: #111827; font-size: 18px; font-weight: 600;">Descripción del Proyecto:</h3>
                <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
                  ${project}
                </p>
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
                Esta solicitud fue enviada desde el formulario de contacto de SLE Development
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
        JSON.stringify({ success: true, message: 'Solicitud recibida (modo desarrollo)' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Enviar email de confirmación al cliente
    await resend.emails.send({
      from: import.meta.env.RESEND_FROM_EMAIL || 'SLE Development <onboarding@resend.dev>',
      to: email,
      subject: '¡Gracias por contactarnos! - SLE Development',
      html: clientEmailHtml,
    });

    // Enviar email al equipo
    await resend.emails.send({
      from: import.meta.env.RESEND_FROM_EMAIL || 'SLE Development <onboarding@resend.dev>',
      to: import.meta.env.RESEND_TO_EMAIL || 'contacto@sledevelopers.com',
      replyTo: email,
      subject: `Nueva solicitud de contacto de ${name}`,
      html: teamEmailHtml,
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Email enviado correctamente' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error enviando email:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error al enviar el email', 
        details: error.message 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

