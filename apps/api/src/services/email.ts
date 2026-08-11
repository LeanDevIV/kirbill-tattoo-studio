import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "hola@kirbilltattoo.com";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

interface AppointmentEmailData {
  clientEmail: string;
  date: string;
  time: string;
  status: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getAppointmentCreatedTemplate(data: AppointmentEmailData): {
  subject: string;
  html: string;
} {
  const formattedDate = formatDate(data.date);

  return {
    subject: "Tu turno fue agendado",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8b1a1a;">Kirbill Tattoo Studio</h1>
        <p>Hola,</p>
        <p>Su turno fue agendado para el <strong>${formattedDate}</strong> a las <strong>${data.time}</strong>.</p>
        <p>Esperamos verte pronto!</p>
        <br/>
        <p style="color: #666; font-size: 12px;">Este es un mensaje automático, por favor no responder.</p>
      </div>
    `,
  };
}

function getAppointmentUpdatedTemplate(data: AppointmentEmailData): {
  subject: string;
  html: string;
} {
  const formattedDate = formatDate(data.date);

  return {
    subject: "Tu turno fue modificado",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8b1a1a;">Kirbill Tattoo Studio</h1>
        <p>Hola,</p>
        <p>Su turno fue modificado. Nueva fecha: <strong>${formattedDate}</strong> a las <strong>${data.time}</strong>.</p>
        <p>Estado: <strong>${data.status}</strong></p>
        <br/>
        <p style="color: #666; font-size: 12px;">Este es un mensaje automático, por favor no responder.</p>
      </div>
    `,
  };
}

function getAppointmentCancelledTemplate(data: AppointmentEmailData): {
  subject: string;
  html: string;
} {
  const formattedDate = formatDate(data.date);

  return {
    subject: "Tu turno fue cancelado",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8b1a1a;">Kirbill Tattoo Studio</h1>
        <p>Hola,</p>
        <p>Su turno del <strong>${formattedDate}</strong> a las <strong>${data.time}</strong> ha sido cancelado.</p>
        <p>Por favor contáctanos si tienes alguna pregunta.</p>
        <br/>
        <p style="color: #666; font-size: 12px;">Este es un mensaje automático, por favor no responder.</p>
      </div>
    `,
  };
}

export async function sendAppointmentCreatedEmail(data: AppointmentEmailData): Promise<void> {
  if (!resend) {
    console.warn("Resend not configured, skipping email");
    return;
  }

  const template = getAppointmentCreatedTemplate(data);

  try {
    await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: data.clientEmail,
      subject: template.subject,
      html: template.html,
    });
  } catch (error) {
    console.error("Failed to send appointment created email:", error);
  }
}

export async function sendAppointmentUpdatedEmail(data: AppointmentEmailData): Promise<void> {
  if (!resend) {
    console.warn("Resend not configured, skipping email");
    return;
  }

  const template = getAppointmentUpdatedTemplate(data);

  try {
    await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: data.clientEmail,
      subject: template.subject,
      html: template.html,
    });
  } catch (error) {
    console.error("Failed to send appointment updated email:", error);
  }
}

export async function sendAppointmentCancelledEmail(data: AppointmentEmailData): Promise<void> {
  if (!resend) {
    console.warn("Resend not configured, skipping email");
    return;
  }

  const template = getAppointmentCancelledTemplate(data);

  try {
    await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: data.clientEmail,
      subject: template.subject,
      html: template.html,
    });
  } catch (error) {
    console.error("Failed to send appointment cancelled email:", error);
  }
}
